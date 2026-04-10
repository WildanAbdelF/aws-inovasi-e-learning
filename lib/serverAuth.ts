import { NextRequest } from "next/server";
import { AUTH_COOKIE_KEYS } from "@/lib/authCookies";
import { getSupabaseAdmin, getSupabaseAuthClient } from "@/lib/supabase";
import type { ApiUserProfile, UserRole } from "@/types/user";

export type AuthenticatedProfileResult =
  | {
      profile: ApiUserProfile;
      authUser: { id: string; email: string };
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
  if (!accessToken) {
    return { error: "Unauthorized", status: 401 };
  }

  const { data: authData, error: authError } = await supabaseAuth.auth.getUser(accessToken);

  if (authError || !authData.user) {
    return { error: "Unauthorized", status: 401 };
  }

  const authUser = {
    id: authData.user.id,
    email: authData.user.email ?? "",
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
      name: authData.user.user_metadata?.name ?? authUser.email.split("@")[0] ?? "User",
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
    };
  }

  return {
    profile: mapUserProfile(profile),
    authUser,
  };
}
