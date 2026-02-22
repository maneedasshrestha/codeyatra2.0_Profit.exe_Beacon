import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";

export function createClient(context) {
  // Extract Authorization header if present (for Bearer tokens from Postman/API clients)
  const authHeader = context.req.headers.authorization || "";

  return createServerClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(context.req.headers.cookie ?? "");
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            context.res.appendHeader(
              "Set-Cookie",
              serializeCookieHeader(name, value),
            ),
          );
        },
      },
      global: {
        headers: authHeader
          ? {
              Authorization: authHeader, // Forward Authorization header for Bearer tokens
            }
          : {},
      },
    },
  );
}
