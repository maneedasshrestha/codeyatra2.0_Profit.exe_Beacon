"use client";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function getAuthToken(): string | null {
    if (typeof window === "undefined") return null;

    // Try the primary key
    let token = localStorage.getItem("auth_token");
    if (token && token !== "undefined") return token;

    // Try the alternate key used in marketplace
    token = localStorage.getItem("beacon_token");
    if (token && token !== "undefined") return token;

    // Supabase fallback (from marketplaceApi logic)
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith("sb-") && key.endsWith("-auth-token")) {
                const raw = localStorage.getItem(key);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    const access_token = parsed?.access_token;
                    if (access_token) return access_token;
                }
            }
        }
    } catch {
        // ignore
    }

    return null;
}

export const api = {
    get: async (endpoint: string) => {
        const token = getAuthToken();
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Something went wrong");
        }
        return response.json();
    },

    post: async (endpoint: string, body: any, isFormData = false) => {
        const token = getAuthToken();
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: "POST",
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...(isFormData ? {} : { "Content-Type": "application/json" }),
            },
            body: isFormData ? body : JSON.stringify(body),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Something went wrong");
        }
        return response.json();
    },

    delete: async (endpoint: string) => {
        const token = getAuthToken();
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: "DELETE",
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Something went wrong");
        }
        return response.json();
    },
};
