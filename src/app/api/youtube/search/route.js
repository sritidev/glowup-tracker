import { NextResponse } from "next/server";
import {
  youtubeConfigured,
  moodById,
  searchPlaylistsForMood,
} from "../../../../lib/youtube";

// GET /api/youtube/search?mood=<moodId>
//
// Searches public YouTube playlists for the given mood and returns normalised
// playlist cards. All YouTube communication stays on the server:
//   - the API key (YOUTUBE_API_KEY) never leaves this server route
//   - the browser only ever receives public playlist metadata + links
//   - the key is never logged and never returned in responses
//
// This endpoint reads no user-specific data and requires no YouTube/Google
// login. It only runs when the user actively selects a mood (no polling).
export async function GET(request) {
  // 1. Fail gracefully if the deployment hasn't set up a YouTube API key yet.
  if (!youtubeConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  // 2. Validate the mood query parameter.
  const { searchParams } = new URL(request.url);
  const moodId = searchParams.get("mood");
  if (!moodId) {
    return NextResponse.json({ error: "mood_required" }, { status: 400 });
  }

  // 3. Resolve the mood (and its server-side keywords).
  const mood = moodById(moodId);
  if (!mood) {
    return NextResponse.json({ error: "unknown_mood" }, { status: 400 });
  }

  // 4-7. Search YouTube, merge + de-dupe, return normalised playlists.
  try {
    const playlists = await searchPlaylistsForMood(mood, { limit: 12 });
    return NextResponse.json({
      mood: { id: mood.id, label: mood.label, emoji: mood.emoji },
      playlists,
    });
  } catch (err) {
    // 8. Any token/network/unexpected failure → one friendly error code.
    // Details stay in server logs; the API key is never logged or exposed.
    console.error("YouTube search failed:", err?.message || err);
    return NextResponse.json({ error: "youtube_unreachable" }, { status: 502 });
  }
}
