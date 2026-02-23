/**
 * Marketplace API — thin wrapper around the Express backend
 * Base URL is read from NEXT_PUBLIC_API_URL (defaults to localhost:5000)
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:5000";

// ─── Types matching the backend response ────────────────────────────────────

export interface ApiListing {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  category: string | null;
  condition: string;
  image_url: string | null;
  college: string | null;
  created_at: string;
  seller_name?: string | null;
}

export interface GetListingsParams {
  college?: string;
  category?: string;
  condition?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
}

// ─── Auth helper ─────────────────────────────────────────────────────────────

/**
 * Tries to retrieve the Supabase JWT from localStorage.
 * Supabase JS v2 stores the session under a key that looks like
 * `sb-<project-ref>-auth-token`, so we scan all keys.
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("sb-") && key.endsWith("-auth-token")) {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          return parsed?.access_token ?? null;
        }
      }
    }
  } catch {
    // ignore
  }
  // Also check the key used by this app's login flow
  return localStorage.getItem("auth_token");
}

// ─── API calls ────────────────────────────────────────────────────────────────

/** GET /api/marketplace — fetch all listings with optional filters */
export async function getListings(
  params: GetListingsParams = {}
): Promise<ApiListing[]> {
  const qs = new URLSearchParams();
  if (params.college) qs.set("college", params.college);
  if (params.category) qs.set("category", params.category);
  if (params.condition) qs.set("condition", params.condition);
  if (params.min_price !== undefined) qs.set("min_price", String(params.min_price));
  if (params.max_price !== undefined) qs.set("max_price", String(params.max_price));
  if (params.search) qs.set("search", params.search);

  const url = `${API_BASE}/api/marketplace${qs.toString() ? `?${qs}` : ""}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch listings: ${res.status}`);
  const json = await res.json();
  return json.listings as ApiListing[];
}

/** GET /api/marketplace/:id */
export async function getListingById(id: string): Promise<ApiListing> {
  const res = await fetch(`${API_BASE}/api/marketplace/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Listing not found: ${res.status}`);
  const json = await res.json();
  return json.listing as ApiListing;
}

export interface CreateListingPayload {
  title: string;
  description?: string;
  price: number;
  category?: string;
  condition?: string;
  college?: string;
  image?: File | null;
}

/** DELETE /api/marketplace/:id — remove a listing (only the owner can do this) */
export async function deleteListing(
  id: string,
  token: string
): Promise<void> {
  const res = await fetch(`${API_BASE}/api/marketplace/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error ?? `Delete listing failed: ${res.status}`);
  }
}

/** POST /api/marketplace — create a new listing (requires auth) */
export async function createListing(
  payload: CreateListingPayload,
  token: string
): Promise<ApiListing> {
  const formData = new FormData();
  formData.append("title", payload.title);
  if (payload.description) formData.append("description", payload.description);
  formData.append("price", String(payload.price));
  if (payload.category) formData.append("category", payload.category);
  if (payload.condition) formData.append("condition", payload.condition);
  if (payload.college) formData.append("college", payload.college);
  if (payload.image) formData.append("image", payload.image);

  const res = await fetch(`${API_BASE}/api/marketplace`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // Do NOT set Content-Type — browser will set multipart boundary automatically
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error ?? `Create listing failed: ${res.status}`);
  }
  const json = await res.json();
  return json.listing as ApiListing;
}
