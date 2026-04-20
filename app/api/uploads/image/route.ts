import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import {
  applyRefreshedSessionCookies,
  getAuthenticatedProfile,
} from "@/lib/serverAuth";

export const runtime = "nodejs";

const DEFAULT_COURSE_MEDIA_BUCKET = "course-media";
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

type UploadTarget = "course-thumbnail" | "course-material";

function isSafeObjectPath(path: string): boolean {
  if (!path) return false;
  if (path.includes("..")) return false;
  if (path.startsWith("/") || path.startsWith("http://") || path.startsWith("https://")) {
    return false;
  }

  return true;
}

function extractObjectPathFromPublicUrl(publicUrl: string, bucket: string): string | null {
  try {
    const parsed = new URL(publicUrl);
    const markerCandidates = [
      `/storage/v1/object/public/${bucket}/`,
      `/object/public/${bucket}/`,
    ];

    for (const marker of markerCandidates) {
      const markerIndex = parsed.pathname.indexOf(marker);
      if (markerIndex === -1) continue;

      const rawPath = parsed.pathname.slice(markerIndex + marker.length);
      const decodedPath = decodeURIComponent(rawPath).trim();
      return isSafeObjectPath(decodedPath) ? decodedPath : null;
    }
  } catch {
    return null;
  }

  return null;
}

function resolveOldObjectPath(formData: FormData, bucket: string): string | null {
  const oldPathEntry = formData.get("oldPath");
  if (typeof oldPathEntry === "string") {
    const oldPath = oldPathEntry.trim();
    if (isSafeObjectPath(oldPath)) {
      return oldPath;
    }
  }

  const oldUrlEntry = formData.get("oldUrl");
  if (typeof oldUrlEntry === "string") {
    const oldUrl = oldUrlEntry.trim();
    if (!oldUrl) return null;
    return extractObjectPathFromPublicUrl(oldUrl, bucket);
  }

  return null;
}

function sanitizePathSegment(value: string, fallback: string): string {
  const sanitized = value
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  return sanitized || fallback;
}

function resolveUploadTarget(value: FormDataEntryValue | null): UploadTarget {
  if (value === "course-thumbnail") return "course-thumbnail";
  return "course-material";
}

function inferExtension(file: File): string {
  const nameParts = file.name.split(".");
  const fromName = nameParts.length > 1 ? nameParts.pop()?.toLowerCase() : "";

  if (fromName && /^[a-z0-9]+$/i.test(fromName)) {
    return fromName;
  }

  switch (file.type) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "jpg";
  }
}

function buildObjectPath(formData: FormData, target: UploadTarget, extension: string): string {
  const courseId = sanitizePathSegment(
    typeof formData.get("courseId") === "string" ? String(formData.get("courseId")) : "",
    "uncategorized"
  );

  const moduleId = sanitizePathSegment(
    typeof formData.get("moduleId") === "string" ? String(formData.get("moduleId")) : "",
    "general"
  );

  const itemId = sanitizePathSegment(
    typeof formData.get("itemId") === "string" ? String(formData.get("itemId")) : "",
    "general"
  );

  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const fileName = `${Date.now()}-${randomUUID()}.${extension}`;

  if (target === "course-thumbnail") {
    return `${target}/${courseId}/${yyyy}/${mm}/${fileName}`;
  }

  return `${target}/${courseId}/${moduleId}/${itemId}/${yyyy}/${mm}/${fileName}`;
}

function getCourseMediaBucket(): string {
  return (
    process.env.SUPABASE_COURSE_MEDIA_BUCKET ||
    process.env.NEXT_PUBLIC_SUPABASE_COURSE_MEDIA_BUCKET ||
    DEFAULT_COURSE_MEDIA_BUCKET
  );
}

export async function POST(request: NextRequest) {
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

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File image wajib diisi." }, { status: 400 });
  }

  if (!ALLOWED_IMAGE_MIME_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Tipe file tidak didukung. Gunakan JPG, PNG, WEBP, atau GIF." },
      { status: 400 }
    );
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return NextResponse.json(
      { error: "Ukuran gambar maksimal 5MB." },
      { status: 400 }
    );
  }

  const target = resolveUploadTarget(formData.get("target"));
  const extension = inferExtension(file);
  const objectPath = buildObjectPath(formData, target, extension);
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const bucket = getCourseMediaBucket();
  const oldObjectPath = resolveOldObjectPath(formData, bucket);

  const { error: uploadError } = await supabaseAdmin.storage
    .from(bucket)
    .upload(objectPath, fileBuffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  if (oldObjectPath && oldObjectPath !== objectPath) {
    const { error: removeError } = await supabaseAdmin.storage
      .from(bucket)
      .remove([oldObjectPath]);

    if (removeError) {
      console.warn("Failed to remove previous image:", removeError.message);
    }
  }

  const { data: publicData } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(objectPath);

  const response = NextResponse.json(
    {
      data: {
        url: publicData.publicUrl,
        path: objectPath,
        bucket,
      },
    },
    { status: 201 }
  );

  applyRefreshedSessionCookies(response, session, request);
  return response;
}
