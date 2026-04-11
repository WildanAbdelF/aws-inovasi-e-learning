import type {
  ApiUserProfile,
  UserRole,
  UserCourseAccess,
  UserCertificate,
} from "@/types/user";

export type AdminUserUpdatePayload = {
  name?: string;
  role?: UserRole;
};

export type MyProfileUpdatePayload = {
  name?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

export type PasswordResetSession = {
  valid: boolean;
  maskedEmail?: string;
};

export type CourseAccessPayload = {
  courseId: string;
  accessType: "lifetime" | "subscription";
};

export type UserProgressPayload = {
  courseId: string;
  moduleId: string;
  itemId: string;
  completed?: boolean;
};

export type UserProgressResponse = {
  courseId: string;
  completedItemIds: string[];
};

type ApiResponse<T> = {
  data: T;
};

async function readError(response: Response, fallback: string) {
  try {
    const payload = await response.json();
    return typeof payload?.error === "string" && payload.error
      ? payload.error
      : fallback;
  } catch {
    return fallback;
  }
}

export async function getMyProfile(): Promise<ApiUserProfile> {
  const response = await fetch("/api/users/me", {
    method: "GET",
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Failed to get user profile."));
  }

  const payload = (await response.json()) as ApiResponse<ApiUserProfile>;
  return payload.data;
}

export async function updateMyProfile(
  payload: MyProfileUpdatePayload
): Promise<ApiUserProfile> {
  const response = await fetch("/api/users/me", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Failed to update profile."));
  }

  const body = (await response.json()) as ApiResponse<ApiUserProfile>;
  return body.data;
}

export async function listUsersForAdmin(): Promise<ApiUserProfile[]> {
  const response = await fetch("/api/users", {
    method: "GET",
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Failed to fetch users."));
  }

  const payload = (await response.json()) as ApiResponse<ApiUserProfile[]>;
  return payload.data;
}

export async function updateUserAsAdmin(
  id: string,
  payload: AdminUserUpdatePayload
): Promise<ApiUserProfile> {
  const response = await fetch(`/api/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Failed to update user."));
  }

  const body = (await response.json()) as ApiResponse<ApiUserProfile>;
  return body.data;
}

export async function requestPasswordReset(email: string): Promise<void> {
  const response = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Failed to process forgot password."));
  }
}

export async function listMyCourseAccesses(): Promise<UserCourseAccess[]> {
  const response = await fetch("/api/users/me/courses", {
    method: "GET",
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Failed to fetch course accesses."));
  }

  const payload = (await response.json()) as ApiResponse<UserCourseAccess[]>;
  return payload.data;
}

export async function createMyCourseAccess(
  payload: CourseAccessPayload
): Promise<UserCourseAccess> {
  const response = await fetch("/api/users/me/courses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Failed to create course access."));
  }

  const body = (await response.json()) as ApiResponse<UserCourseAccess>;
  return body.data;
}

export async function listMyCertificates(): Promise<UserCertificate[]> {
  const response = await fetch("/api/users/me/certificates", {
    method: "GET",
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Failed to fetch certificates."));
  }

  const payload = (await response.json()) as ApiResponse<UserCertificate[]>;
  return payload.data;
}

export async function issueMyCertificate(courseId: string): Promise<UserCertificate> {
  const response = await fetch("/api/users/me/certificates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courseId }),
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Failed to issue certificate."));
  }

  const payload = (await response.json()) as ApiResponse<UserCertificate>;
  return payload.data;
}

export async function getMyProgress(courseId: string): Promise<UserProgressResponse> {
  const response = await fetch(`/api/users/me/progress?courseId=${encodeURIComponent(courseId)}`, {
    method: "GET",
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Failed to fetch learning progress."));
  }

  const payload = (await response.json()) as ApiResponse<UserProgressResponse>;
  return payload.data;
}

export async function markMyProgress(payload: UserProgressPayload): Promise<void> {
  const response = await fetch("/api/users/me/progress", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Failed to save learning progress."));
  }
}
