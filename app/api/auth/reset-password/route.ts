import { NextResponse } from "next/server";

export const runtime = "nodejs";

function deprecatedResponse() {
  return NextResponse.json(
    {
      error: "Endpoint deprecated.",
      message:
        "Gunakan POST /api/auth/forgot-password lalu selesaikan reset melalui halaman /forgot-password/reset.",
    },
    { status: 410 }
  );
}

export async function GET() {
  return deprecatedResponse();
}

export async function POST() {
  return deprecatedResponse();
}
