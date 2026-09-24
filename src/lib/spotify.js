// ── Spotify Web API config (SERVER-SIDE ONLY) ──
// Only import this from API route handlers (src/app/api/**). It reads
// SPOTIFY_CLIENT_SECRET, a non-NEXT_PUBLIC env var that Next.js never
// includes in the client bundle. Do NOT import this into a "use client" file.
//
// This feature (MyAura Sounds) only browses PUBLIC playlists, so it uses the
// Client Credentials flow — an app-level token that does NOT access any
// user's Spotify account. There is no user login, no scopes, and no
// create/edit/save-to-account behaviour.
//
// Auth flow (Client Credentials):
//   1. POST client_id + client_secret (Basic auth) to the token endpoint.
//   2. Spotify returns a short-lived access_token (usually ~1 hour).
//   3. We cache that token in module memory until shortly before it expires,
//      then transparently fetch a new one. Nothing is persisted to a DB.

export const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
export const SPOTIFY_API_BASE  = "https://api.spotify.com/v1";

export function spotifyConfig() {
  const clientId     = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  return { clientId, clientSecret };
}

/** True only when both server-side Spotify credentials are present. */
export function spotifyConfigured() {
  const { clientId, clientSecret } = spotifyConfig();
  return Boolean(clientId && clientSecret);
}

function basicAuthHeader() {
  const { clientId, clientSecret } = spotifyConfig();
  return "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
}

// ── In-memory app-token cache ──
// Client-credentials tokens are app-wide (not per user), so caching one in
// module scope avoids requesting a fresh token on every search. This lives on
// the server process only. On Vercel a cold start simply re-fetches a token.
let cachedToken = null;      // { accessToken, expiresAt }

/** Get a valid app access token, fetching/refreshing it as needed. */
export async function getAppToken() {
  // Reuse the cached token until ~1 minute before it expires.
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.accessToken;
  }

  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: basicAuthHeader(),
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Spotify token request failed (${res.status})`);

  const data = await res.json(); // { access_token, token_type, expires_in }
  cachedToken = {
    accessToken: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
  };
  return cachedToken.accessToken;
}

/** Call a Spotify API endpoint with the app bearer token. */
export async function spotifyFetch(path, accessToken, init = {}) {
  return fetch(`${SPOTIFY_API_BASE}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${accessToken}`, ...(init.headers || {}) },
    cache: "no-store",
  });
}

// ── Mood → search keywords ──
// Each mood maps to a few gentle search phrases. We query Spotify with these
// and merge the results, so a mood surfaces a varied but on-theme set of
// public playlists.
export const MOODS = [
  { id: "calm",       label: "Calm & Soothing",  emoji: "🌙", keywords: ["calming music", "peaceful music", "relaxing playlist"] },
  { id: "self-love",  label: "Self-Love",         emoji: "💗", keywords: ["self love playlist", "confidence", "positive vibes"] },
  { id: "comfort",    label: "Comfort & Healing", emoji: "🫧", keywords: ["healing music", "comfort songs", "emotional healing"] },
  { id: "feel-good",  label: "Feel-Good",         emoji: "🌈", keywords: ["feel good", "good vibes", "uplifting songs"] },
  { id: "motivation", label: "Motivation",        emoji: "🔥", keywords: ["motivation", "workout motivation", "powerful songs"] },
  { id: "relaxation", label: "Relaxation",        emoji: "🌿", keywords: ["relaxation", "chill", "unwind"] },
  { id: "sleep",      label: "Sleep",             emoji: "😴", keywords: ["sleep music", "deep sleep", "relaxation"] },
  { id: "happy",      label: "Happy & Positive",  emoji: "☀️", keywords: ["happy songs", "feel good", "positive vibes"] },
  { id: "energy",     label: "Energy",            emoji: "⚡", keywords: ["energy playlist", "upbeat songs", "dance music"] },
];

export function moodById(id) {
  return MOODS.find((m) => m.id === id) ?? null;
}

/**
 * Search public playlists for a given mood.
 * Runs each keyword query, merges the results, de-duplicates by playlist id,
 * and normalises the shape the client needs. Returns a plain array.
 */
export async function searchPlaylistsForMood(mood, { limit = 12 } = {}) {
  const token = await getAppToken();

  // Query each keyword in parallel. Spotify caps market-less searches fine.
  const perKeyword = Math.max(4, Math.ceil((limit * 2) / mood.keywords.length));
  const responses = await Promise.all(
    mood.keywords.map((kw) =>
      spotifyFetch(
        `/search?type=playlist&limit=${perKeyword}&q=${encodeURIComponent(kw)}`,
        token
      )
    )
  );

  const seen = new Set();
  const playlists = [];

  for (const res of responses) {
    if (!res.ok) continue; // skip a failed keyword rather than failing the whole search
    const data = await res.json();
    const items = data?.playlists?.items ?? [];
    for (const p of items) {
      // Spotify occasionally returns null items in playlist search results.
      if (!p || !p.id || seen.has(p.id)) continue;
      seen.add(p.id);
      playlists.push({
        id: p.id,
        name: p.name || "Untitled playlist",
        description: p.description || null,
        image: p.images?.[0]?.url ?? null,
        owner: p.owner?.display_name || null,
        tracks: p.tracks?.total ?? null,
        url: p.external_urls?.spotify || `https://open.spotify.com/playlist/${p.id}`,
      });
    }
  }

  return playlists.slice(0, limit);
}
