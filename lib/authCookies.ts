import type { Session } from "@supabase/supabase-js";
import type { NextResponse } from "next/server";

export const AUTH_COOKIE_KEYS = {
  accessToken: "lms_access_token",
  refreshToken: "lms_refresh_token",
};

function resolveSecureCookieFlag(request?: Request): boolean {
  const override = process.env.AUTH_COOKIE_SECURE?.trim().toLowerCase();
  if (override === "true") return true;
  if (override === "false") return false;

  const forwardedProto = request?.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim()
    .toLowerCase();

  if (forwardedProto === "https") return true;
  if (forwardedProto === "http") return false;

  if (request?.url) {
    try {
      return new URL(request.url).protocol === "https:";
    } catch {
      // Fall through to default.
    }
  }

  return process.env.NODE_ENV === "production";
}

export function setAuthCookies(
  response: NextResponse,
  session: Session,
  request?: Request
) {
  const maxAge = Math.max(60, session.expires_in ?? 3600);
  const secure = resolveSecureCookieFlag(request);

  response.cookies.set(AUTH_COOKIE_KEYS.accessToken, session.access_token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge,
  });

  response.cookies.set(AUTH_COOKIE_KEYS.refreshToken, session.refresh_token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearAuthCookies(response: NextResponse, request?: Request) {
  const secure = resolveSecureCookieFlag(request);

  response.cookies.set(AUTH_COOKIE_KEYS.accessToken, "", {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  response.cookies.set(AUTH_COOKIE_KEYS.refreshToken, "", {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
