import type { ApiUserProfile, UserRole } from "@/lib/serverAuth";

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

export async function getPasswordResetSession(): Promise<PasswordResetSession> {
  const response = await fetch("/api/auth/reset-password", {
    method: "GET",
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Failed to validate reset session."));
  }

  const payload = (await response.json()) as ApiResponse<PasswordResetSession>;
  return payload.data;
}

export async function resetPasswordWithSession(
  password: string,
  confirmPassword: string
): Promise<void> {
  const response = await fetch("/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password, confirmPassword }),
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Failed to reset password."));
  }
}
