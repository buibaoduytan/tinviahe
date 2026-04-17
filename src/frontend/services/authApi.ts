const AUTH_EVENT = "tinviahe-auth";

export interface AuthPayload {
  token: string;
  username: string;
}

export function getStoredAuth(): AuthPayload | null {
  try {
    const raw = localStorage.getItem("auth");
    if (!raw) return null;
    const data = JSON.parse(raw) as unknown;
    if (
      data &&
      typeof data === "object" &&
      "token" in data &&
      "username" in data &&
      typeof (data as AuthPayload).token === "string" &&
      typeof (data as AuthPayload).username === "string"
    ) {
      return data as AuthPayload;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveAuth(payload: AuthPayload): void {
  localStorage.setItem("auth", JSON.stringify(payload));
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function clearAuth(): void {
  localStorage.removeItem("auth");
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function subscribeAuth(callback: () => void): () => void {
  window.addEventListener(AUTH_EVENT, callback);
  return () => window.removeEventListener(AUTH_EVENT, callback);
}

function parseBody(text: string): {
  token?: string;
  user?: { username?: string };
  error?: string;
  detail?: string;
} {
  try {
    return JSON.parse(text) as {
      token?: string;
      user?: { username?: string };
      error?: string;
      detail?: string;
    };
  } catch {
    return { error: text };
  }
}

export async function registerUser(username: string, password: string): Promise<AuthPayload> {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = parseBody(await response.text());
  if (!response.ok) {
    throw new Error(data.error ?? data.detail ?? "Đăng ký thất bại");
  }
  if (!data.token || !data.user?.username) {
    throw new Error("Phản hồi đăng ký không hợp lệ");
  }
  return { token: data.token, username: data.user.username };
}

export async function loginUser(username: string, password: string): Promise<AuthPayload> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = parseBody(await response.text());
  if (!response.ok) {
    throw new Error(data.error ?? data.detail ?? "Đăng nhập thất bại");
  }
  if (!data.token || !data.user?.username) {
    throw new Error("Phản hồi đăng nhập không hợp lệ");
  }
  return { token: data.token, username: data.user.username };
}
