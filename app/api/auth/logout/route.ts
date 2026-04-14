import { NextResponse } from "next/server";
import { clearAuthCookies } from "@/lib/authCookies";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const response = NextResponse.json({ success: true });
  clearAuthCookies(response, request);
  return response;
}
