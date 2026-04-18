import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import {
  applyRefreshedSessionCookies,
  getAuthenticatedProfile,
} from "@/lib/serverAuth";

export const runtime = "nodejs";

type JoinedUser = { name?: string | null } | null;
type JoinedCourse = { title?: string | null } | null;
type RevenueRow = { created_at?: string | null; price_paid: unknown };

const REVENUE_SERIES_DAYS = 30;

function formatRelativeTime(isoString: string | null | undefined): string {
  if (!isoString) return "baru saja";

  const timestamp = new Date(isoString).getTime();
  if (!Number.isFinite(timestamp)) return "baru saja";

  const diffMs = Date.now() - timestamp;
  if (diffMs < 60_000) return "baru saja";

  const diffMinutes = Math.floor(diffMs / 60_000);
  if (diffMinutes < 60) return `${diffMinutes}m lalu`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}j lalu`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} hari lalu`;
}

function normalizeRevenue(rows: Array<{ price_paid: unknown }> | null): number {
  return (rows ?? []).reduce((acc, row) => {
    const value = Number(row?.price_paid);
    return acc + (Number.isFinite(value) ? value : 0);
  }, 0);
}

function toUtcDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function getRevenueSeriesStartIso(days: number): string {
  const today = new Date();
  const end = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const start = new Date(end);
  start.setUTCDate(end.getUTCDate() - (days - 1));
  return start.toISOString();
}

function buildRevenueSeries(rows: RevenueRow[] | null, days: number) {
  const today = new Date();
  const end = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

  const base = Array.from({ length: days }, (_, index) => {
    const day = new Date(end);
    day.setUTCDate(end.getUTCDate() - (days - 1 - index));

    return {
      date: toUtcDateKey(day),
      label: new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        timeZone: "UTC",
      }).format(day),
      totalRevenue: 0,
      totalTransactions: 0,
    };
  });

  const pointByDate = new Map(base.map((point) => [point.date, point]));

  for (const row of rows ?? []) {
    const createdAt = typeof row?.created_at === "string" ? row.created_at : "";
    if (!createdAt) continue;

    const dateKey = createdAt.slice(0, 10);
    const point = pointByDate.get(dateKey);
    if (!point) continue;

    const revenueValue = Number(row?.price_paid);
    if (!Number.isFinite(revenueValue)) continue;

    point.totalRevenue += revenueValue;
    point.totalTransactions += 1;
  }

  return base;
}

function extractName(user: JoinedUser): string {
  const value = user?.name;
  return typeof value === "string" && value.trim() ? value.trim() : "Pengguna";
}

function extractTitle(course: JoinedCourse): string {
  const value = course?.title;
  return typeof value === "string" && value.trim() ? value.trim() : "kursus";
}

export async function GET(request: NextRequest) {
  const session = await getAuthenticatedProfile(request);
  if ("error" in session) {
    return NextResponse.json({ error: session.error }, { status: session.status });
  }

  if (session.profile.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Missing Supabase credentials." }, { status: 500 });
  }

  const nowIso = new Date().toISOString();
  const revenueSeriesStartIso = getRevenueSeriesStartIso(REVENUE_SERIES_DAYS);

  const [
    usersCountResult,
    enrollmentsCountResult,
    subscriptionWithoutExpiryCountResult,
    subscriptionWithExpiryCountResult,
    revenueRowsResult,
    revenueSeriesRowsResult,
    recentActivityResult,
  ] = await Promise.all([
    supabaseAdmin.from("users").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("user_courses").select("id", { count: "exact", head: true }),
    supabaseAdmin
      .from("user_courses")
      .select("id", { count: "exact", head: true })
      .eq("access_type", "subscription")
      .is("expires_at", null),
    supabaseAdmin
      .from("user_courses")
      .select("id", { count: "exact", head: true })
      .eq("access_type", "subscription")
      .gt("expires_at", nowIso),
    supabaseAdmin
      .from("user_courses")
      .select("price_paid")
      .not("price_paid", "is", null),
    supabaseAdmin
      .from("user_courses")
      .select("created_at, price_paid")
      .not("price_paid", "is", null)
      .gte("created_at", revenueSeriesStartIso),
    supabaseAdmin
      .from("user_courses")
      .select(
        "id, created_at, access_type, users:users!user_courses_user_id_fkey(name), courses:courses!user_courses_course_id_fkey(title)"
      )
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const activeUsers = usersCountResult.error ? 0 : usersCountResult.count ?? 0;
  const totalEnrollments = enrollmentsCountResult.error
    ? 0
    : enrollmentsCountResult.count ?? 0;
  const subscriptionWithoutExpiry = subscriptionWithoutExpiryCountResult.error
    ? 0
    : subscriptionWithoutExpiryCountResult.count ?? 0;
  const subscriptionWithExpiry = subscriptionWithExpiryCountResult.error
    ? 0
    : subscriptionWithExpiryCountResult.count ?? 0;

  const recentActivityRows = recentActivityResult.error
    ? []
    : (recentActivityResult.data ?? []);

  const recentActivity = recentActivityRows.map((row: any) => {
    const user = row?.users as JoinedUser;
    const course = row?.courses as JoinedCourse;
    const name = extractName(user);
    const courseTitle = extractTitle(course);

    return {
      id: typeof row?.id === "string" ? row.id : crypto.randomUUID(),
      name,
      action:
        row?.access_type === "subscription"
          ? `berlangganan kursus \"${courseTitle}\"`
          : `membeli kursus \"${courseTitle}\"`,
      time: formatRelativeTime(typeof row?.created_at === "string" ? row.created_at : null),
      avatar: name.charAt(0).toUpperCase() || "U",
    };
  });

  const response = NextResponse.json({
    data: {
      totalRevenue: normalizeRevenue(revenueRowsResult.error ? null : revenueRowsResult.data),
      activeUsers,
      activeSubscriptions: subscriptionWithoutExpiry + subscriptionWithExpiry,
      totalEnrollments,
      recentActivity,
      revenueSeries: buildRevenueSeries(
        revenueSeriesRowsResult.error ? null : revenueSeriesRowsResult.data,
        REVENUE_SERIES_DAYS
      ),
    },
  });

  applyRefreshedSessionCookies(response, session, request);
  return response;
}
