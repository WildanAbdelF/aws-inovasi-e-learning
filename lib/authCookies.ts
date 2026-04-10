import type { Session } from "@supabase/supabase-js";
import type { NextResponse } from "next/server";

export const AUTH_COOKIE_KEYS = {
  accessToken: "lms_access_token",
  refreshToken: "lms_refresh_token",
};

export function setAuthCookies(response: NextResponse, session: Session) {
  const maxAge = Math.max(60, session.expires_in ?? 3600);

  response.cookies.set(AUTH_COOKIE_KEYS.accessToken, session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });

  response.cookies.set(AUTH_COOKIE_KEYS.refreshToken, session.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set(AUTH_COOKIE_KEYS.accessToken, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  response.cookies.set(AUTH_COOKIE_KEYS.refreshToken, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
