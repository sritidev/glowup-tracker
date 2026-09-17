// ── Pinterest API config (SERVER-SIDE ONLY) ──
// Only import this from API route handlers (src/app/api/**). It reads
// PINTEREST_CLIENT_SECRET, a non-NEXT_PUBLIC env var that Next.js never
// includes in the client bundle. Do NOT import this into a "use client" file.

export const PINTEREST_AUTH_URL  = "https://www.pinterest.com/oauth/";
export const PINTEREST_TOKEN_URL = "https://api.pinterest.com/v5/oauth/token";
export const PINTEREST_API_BASE  = "https://api.pinterest.com/v5";

// Minimum read-only scopes: user info + boards + pins (read only).
export const PINTEREST_SCOPES = ["user_accounts:read", "boards:read", "pins:read"].join(",");

export function pinterestConfig() {
  const clientId     = process.env.PINTEREST_CLIENT_ID;
  const clientSecret = process.env.PINTEREST_CLIENT_SECRET;
  const appUrl       = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const redirectUri  = `${appUrl}/api/pinterest/callback`;
  return { clientId, clientSecret, appUrl, redirectUri };
}

export function pinterestConfigured() {
  const { clientId, clientSecret } = pinterestConfig();
  return Boolean(clientId && clientSecret);
}

/** Build the Pinterest authorize URL. */
export function buildAuthUrl(state) {
  const { clientId, redirectUri } = pinterestConfig();
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: PINTEREST_SCOPES,
    state,
  });
  return `${PINTEREST_AUTH_URL}?${params.toString()}`;
}

function basicAuthHeader() {
  const { clientId, clientSecret } = pinterestConfig();
  return "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
}

/** Exchange an auth code for tokens. */
export async function exchangeCodeForToken(code) {
  const { redirectUri } = pinterestConfig();
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
  });
  const res = await fetch(PINTEREST_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: basicAuthHeader() },
    body,
  });
  if (!res.ok) throw new Error(`Pinterest token exchange failed (${res.status})`);
  return res.json(); // { access_token, refresh_token, expires_in, scope, ... }
}

/** Refresh an expired access token. */
export async function refreshAccessToken(refreshToken) {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });
  const res = await fetch(PINTEREST_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: basicAuthHeader() },
    body,
  });
  if (!res.ok) throw new Error(`Pinterest token refresh failed (${res.status})`);
  return res.json();
}

/** Call a Pinterest API endpoint with a bearer token. */
export async function pinterestFetch(path, accessToken, init = {}) {
  const res = await fetch(`${PINTEREST_API_BASE}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json", ...(init.headers || {}) },
    cache: "no-store",
  });
  return res;
}

/**
 * Given a Supabase server client + user id, return a valid access token,
 * refreshing + persisting it if expired. Returns null if not connected.
 */
export async function getValidToken(supabase, userId) {
  const { data: conn } = await supabase
    .from("pinterest_connections")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (!conn) return null;

  const expired = conn.expires_at && new Date(conn.expires_at).getTime() < Date.now() + 60_000;
  if (!expired) return conn.access_token;

  // Try to refresh
  if (!conn.refresh_token) return conn.access_token; // best effort
  try {
    const refreshed = await refreshAccessToken(conn.refresh_token);
    const expiresAt = refreshed.expires_in ? new Date(Date.now() + refreshed.expires_in * 1000).toISOString() : null;
    await supabase.from("pinterest_connections").update({
      access_token: refreshed.access_token,
      refresh_token: refreshed.refresh_token ?? conn.refresh_token,
      expires_at: expiresAt,
      updated_at: new Date().toISOString(),
    }).eq("user_id", userId);
    return refreshed.access_token;
  } catch {
    return conn.access_token; // fall back; caller handles 401
  }
}
