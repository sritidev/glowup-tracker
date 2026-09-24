// ── YouTube Data API v3 config (SERVER-SIDE ONLY) ──
// Only import this from API route handlers (src/app/api/**). It reads
// YOUTUBE_API_KEY, a non-NEXT_PUBLIC env var that Next.js never includes in
// the client bundle. Do NOT import this into a "use client" file.
//
// MyAura Sounds only discovers PUBLIC YouTube playlists, so this uses simple
// API-key authentication. It does NOT:
//   - log users into YouTube / Google
//   - access any user's private YouTube account or data
//   - create, edit, or delete playlists
// Therefore there is NO OAuth here — an API key is the correct auth for
// reading public data.
//
// Quota note: search.list costs 100 quota units per call and has its own
// limit. We only call it when the user actively selects a mood, run a small
// fixed number of keyword searches, and never poll.

export const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

function apiKey() {
  return process.env.YOUTUBE_API_KEY;
}

/** True only when the server-side YouTube API key is present. */
export function youtubeConfigured() {
  return Boolean(apiKey());
}

// ── Mood → YouTube search keywords (server-side only) ──
// Each MyAura mood maps to several search phrases so results stay varied.
// Ids MUST match the mood ids used by the client (src/app/sounds/page.js).
export const MOODS = [
  { id: "calm",       label: "Calm & Soothing",  emoji: "🌙", keywords: ["calming music playlist", "peaceful music playlist", "relaxing music playlist"] },
  { id: "self-love",  label: "Self-Love",         emoji: "💗", keywords: ["self love playlist", "confidence playlist", "positive self love music"] },
  { id: "comfort",    label: "Comfort & Healing", emoji: "🫧", keywords: ["healing music playlist", "comfort music playlist", "emotional healing playlist"] },
  { id: "feel-good",  label: "Feel-Good",         emoji: "🌈", keywords: ["feel good playlist", "uplifting music playlist", "good vibes playlist"] },
  { id: "motivation", label: "Motivation",        emoji: "🔥", keywords: ["motivation music playlist", "motivational songs playlist", "workout motivation playlist"] },
  { id: "relaxation", label: "Relaxation",        emoji: "🌿", keywords: ["relaxation music playlist", "chill music playlist", "unwind music playlist"] },
  { id: "sleep",      label: "Sleep",             emoji: "😴", keywords: ["sleep music playlist", "deep sleep playlist", "relaxing sleep music"] },
  { id: "happy",      label: "Happy & Positive",  emoji: "☀️", keywords: ["happy music playlist", "happy songs playlist", "positive vibes playlist"] },
  { id: "energy",     label: "Energy",            emoji: "⚡", keywords: ["energy music playlist", "upbeat music playlist", "dance music playlist"] },
];

export function moodById(id) {
  return MOODS.find((m) => m.id === id) ?? null;
}

/** Pick the best available thumbnail URL from a snippet, or null. */
function pickThumbnail(thumbnails) {
  if (!thumbnails) return null;
  return (
    thumbnails.high?.url ||
    thumbnails.medium?.url ||
    thumbnails.standard?.url ||
    thumbnails.default?.url ||
    null
  );
}

/**
 * Search public YouTube playlists for a MyAura mood.
 *
 * - Runs each keyword search in parallel (search.list, type=playlist).
 * - Merges the results and removes duplicate playlist ids.
 * - Normalises to the shape the client expects.
 *
 * NOTE ON videoCount: search.list only returns snippet data, not the number
 * of videos in a playlist. Fetching that would require an extra playlists.list
 * call per result (more quota). Per the feature spec we do NOT make that call,
 * so videoCount is intentionally always null here rather than invented.
 *
 * Returns a plain array of playlist objects. Throws on hard failures so the
 * route can surface a single friendly error.
 */
export async function searchPlaylistsForMood(mood, { limit = 12 } = {}) {
  const key = apiKey();
  if (!key) throw new Error("YouTube API key is not configured.");

  // Ask for a few per keyword; merged + de-duped down to `limit` afterwards.
  const perKeyword = Math.max(3, Math.ceil((limit * 1.5) / mood.keywords.length));

  const responses = await Promise.all(
    mood.keywords.map((kw) => {
      const params = new URLSearchParams({
        key,
        part: "snippet",
        type: "playlist",
        q: kw,
        maxResults: String(perKeyword),
        regionCode: "IN",
      });
      return fetch(`${YOUTUBE_API_BASE}/search?${params.toString()}`, {
        cache: "no-store",
      });
    })
  );

  const seen = new Set();
  const playlists = [];

  for (const res of responses) {
    // Skip a single failed keyword rather than failing the whole search,
    // unless every keyword failed (handled by the caller returning [] → empty).
    if (!res.ok) continue;

    const data = await res.json();
    const items = data?.items ?? [];

    for (const item of items) {
      // search.list returns the playlist id under id.playlistId.
      const playlistId = item?.id?.playlistId;
      const snippet = item?.snippet;
      if (!playlistId || !snippet || seen.has(playlistId)) continue;
      seen.add(playlistId);

      playlists.push({
        id: playlistId,
        name: snippet.title || "Untitled playlist",
        description: snippet.description || null,
        image: pickThumbnail(snippet.thumbnails),
        owner: snippet.channelTitle || null,
        // Not available from search.list — do not invent it.
        videoCount: null,
        url: `https://www.youtube.com/playlist?list=${playlistId}`,
      });
    }
  }

  return playlists.slice(0, limit);
}
