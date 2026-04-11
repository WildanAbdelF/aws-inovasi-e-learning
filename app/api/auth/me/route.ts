import { NextRequest, NextResponse } from "next/server";
import {
  applyRefreshedSessionCookies,
  getAuthenticatedProfile,
} from "@/lib/serverAuth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = await getAuthenticatedProfile(request);
  if ("error" in session) {
    return NextResponse.json({ error: session.error }, { status: session.status });
  }

  const response = NextResponse.json({ data: session.profile });
  applyRefreshedSessionCookies(response, session);
  return response;
}
