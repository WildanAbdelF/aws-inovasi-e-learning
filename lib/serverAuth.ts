import type { Session } from "@supabase/supabase-js";
import { NextRequest, type NextResponse } from "next/server";
import { AUTH_COOKIE_KEYS, setAuthCookies } from "@/lib/authCookies";
import { getSupabaseAdmin, getSupabaseAuthClient } from "@/lib/supabase";
import type { ApiUserProfile, UserRole } from "@/types/user";

export type AuthenticatedProfileResult =
  | {
      profile: ApiUserProfile;
      authUser: { id: string; email: string };
      refreshedSession?: Session;
    }
  | {
      error: string;
      status: number;
    };

function normalizeRole(value: unknown): UserRole {
  return value === "admin" ? "admin" : "user";
}

export function mapUserProfile(row: any): ApiUserProfile {
  return {
    id: typeof row?.id === "string" ? row.id : "",
    name: typeof row?.name === "string" ? row.name : "",
    email: typeof row?.email === "string" ? row.email : "",
    role: normalizeRole(row?.role),
    createdAt:
      typeof row?.created_at === "string" && row.created_at.trim()
        ? row.created_at
        : undefined,
  };
}

export async function getAuthenticatedProfile(
  request: NextRequest
): Promise<AuthenticatedProfileResult> {
  const supabaseAuth = getSupabaseAuthClient();
  const supabaseAdmin = getSupabaseAdmin();

  if (!supabaseAuth || !supabaseAdmin) {
    return { error: "Supabase auth is not configured.", status: 500 };
  }

  const accessToken = request.cookies.get(AUTH_COOKIE_KEYS.accessToken)?.value;
  const refreshToken = request.cookies.get(AUTH_COOKIE_KEYS.refreshToken)?.value;

  if (!accessToken && !refreshToken) {
    return { error: "Unauthorized", status: 401 };
  }

  let authUserId = "";
  let authUserEmail = "";
  let refreshedSession: Session | undefined;

  if (accessToken) {
    const { data: authData, error: authError } = await supabaseAuth.auth.getUser(accessToken);
    if (!authError && authData.user) {
      authUserId = authData.user.id;
      authUserEmail = authData.user.email ?? "";
    }
  }

  if (!authUserId && refreshToken) {
    const { data: refreshedData, error: refreshError } = await supabaseAuth.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (!refreshError && refreshedData.user && refreshedData.session) {
      authUserId = refreshedData.user.id;
      authUserEmail = refreshedData.user.email ?? "";
      refreshedSession = refreshedData.session;
    }
  }

  if (!authUserId) {
    return { error: "Unauthorized", status: 401 };
  }

  const authUser = {
    id: authUserId,
    email: authUserEmail,
  };

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("users")
    .select("id, name, email, role, created_at")
    .eq("id", authUser.id)
    .maybeSingle();

  if (profileError) {
    return { error: profileError.message, status: 500 };
  }

  if (!profile) {
    const fallbackProfile = {
      id: authUser.id,
      name: authUser.email.split("@")[0] ?? "User",
      email: authUser.email,
      role: normalizeRole(authUser.email === "admin@example.com" ? "admin" : "user"),
    };

    const { error: upsertError } = await supabaseAdmin
      .from("users")
      .upsert(fallbackProfile, { onConflict: "id" });

    if (upsertError) {
      return { error: upsertError.message, status: 500 };
    }

    return {
      profile: {
        ...fallbackProfile,
      },
      authUser,
      refreshedSession,
    };
  }

  return {
    profile: mapUserProfile(profile),
    authUser,
    refreshedSession,
  };
}

export function applyRefreshedSessionCookies(
  response: NextResponse,
  session: { refreshedSession?: Session }
) {
  if (session.refreshedSession) {
    setAuthCookies(response, session.refreshedSession);
  }
}
