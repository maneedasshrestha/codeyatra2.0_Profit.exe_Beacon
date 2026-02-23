const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:5000";

// ─── Auth token ──────────────────────────────────────────────────────────────

/** Returns the JWT stored during login. */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token") ?? null;
}

/** Builds an Authorization header object, or empty if no token. */
function authHeader(): HeadersInit {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  initials: string;
  role?: string;
  college?: string;
  avatar_url?: string;
}

export interface SearchedUser {
  id: string;
  name: string;
  initials: string;
  online: boolean;
  role?: string;
}

// ─── API calls ────────────────────────────────────────────────────────────────

/**
 * Fetches the current logged-in user's profile from GET /auth/me.
 * Returns null if not authenticated or on error.
 */
export async function fetchCurrentUser(): Promise<CurrentUser | null> {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { "Content-Type": "application/json", ...authHeader() },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const user = data.user;
    const profile = data.profile;
    if (!user) return null;
    const name: string = profile?.name || user.email?.split("@")[0] || "User";
    return {
      id: user.id,
      name,
      email: user.email,
      initials: name
        .split(" ")
        .map((w: string) => w[0]?.toUpperCase() ?? "")
        .slice(0, 2)
        .join(""),
      role: profile?.role,
      college: profile?.college,
      avatar_url: profile?.avatar_url,
    };
  } catch {
    return null;
  }
}

/**
 * Searches for platform users by name fragment.
 * Calls GET /auth/users/search?q=<query>
 */
export async function searchUsers(query: string): Promise<SearchedUser[]> {
  if (!query.trim()) return [];
  try {
    const url = `${API_BASE}/auth/users/search?q=${encodeURIComponent(query.trim())}`;
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json", ...authHeader() },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.users ?? [];
  } catch {
    return [];
  }
}
