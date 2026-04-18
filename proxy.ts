import { NextRequest, NextResponse } from "next/server";

type MePayload = {
  data?: {
    role?: string;
  };
};

async function getCurrentRoleFromApi(request: NextRequest): Promise<{ status: number; role: string | null }> {
  const response = await fetch(new URL("/api/auth/me", request.url), {
    method: "GET",
    headers: {
      cookie: request.headers.get("cookie") ?? "",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return { status: response.status, role: null };
  }

  let payload: MePayload | null = null;
  try {
    payload = (await response.json()) as MePayload;
  } catch {
    payload = null;
  }

  const role = typeof payload?.data?.role === "string" ? payload.data.role : null;
  return { status: response.status, role };
}

function buildLoginRedirect(request: NextRequest) {
  const url = new URL("/login", request.url);
  url.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(url);
}

export async function proxy(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const { status, role } = await getCurrentRoleFromApi(request);

  if (status === 401 || status === 403) {
    return buildLoginRedirect(request);
  }

  if (status >= 400) {
    return buildLoginRedirect(request);
  }

  if (role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
