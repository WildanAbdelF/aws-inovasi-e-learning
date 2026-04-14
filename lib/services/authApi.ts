export type ApiAuthUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
};

type AuthResponse = {
  data: ApiAuthUser;
  message?: string;
  sessionEstablished?: boolean;
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

export async function loginWithApi(email: string, password: string): Promise<ApiAuthUser> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Failed to login."));
  }

  const payload = (await response.json()) as AuthResponse;
  return payload.data;
}

export async function registerWithApi(
  name: string,
  email: string,
  password: string
): Promise<{ user: ApiAuthUser; message?: string; sessionEstablished: boolean }> {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Failed to register account."));
  }

  const payload = (await response.json()) as AuthResponse;
  return {
    user: payload.data,
    message: payload.message,
    sessionEstablished: Boolean(payload.sessionEstablished),
  };
}

export async function fetchCurrentUser(): Promise<ApiAuthUser | null> {
  const response = await fetch("/api/auth/me", {
    method: "GET",
    cache: "no-store",
    credentials: "include",
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(await readError(response, "Failed to get current user."));
  }

  const payload = (await response.json()) as AuthResponse;
  return payload.data;
}

export async function logoutWithApi(): Promise<void> {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Failed to logout."));
  }
}
