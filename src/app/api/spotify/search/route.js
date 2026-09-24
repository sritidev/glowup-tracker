import { NextResponse } from "next/server";
import {
  spotifyConfigured,
  moodById,
  searchPlaylistsForMood,
} from "../../../../lib/spotify";

// GET /api/spotify/search?mood=<moodId>
//
// Searches public Spotify playlists for the given mood and returns normalised
// playlist cards. All Spotify communication stays on the server:
//   - credentials (SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET) never leave here
//   - the app access token is fetched + cached server-side
//   - the browser only ever receives public playlist metadata + links
//
// This endpoint reads no user-specific Spotify data and requires no login.
export async function GET(request) {
  // Fail gracefully if the deployment hasn't set up Spotify credentials yet.
  if (!spotifyConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const moodId = searchParams.get("mood");
  if (!moodId) {
    return NextResponse.json({ error: "mood_required" }, { status: 400 });
  }

  const mood = moodById(moodId);
  if (!mood) {
    return NextResponse.json({ error: "unknown_mood" }, { status: 400 });
  }

  try {
    const playlists = await searchPlaylistsForMood(mood, { limit: 12 });
    return NextResponse.json({
      mood: { id: mood.id, label: mood.label, emoji: mood.emoji },
      playlists,
    });
  } catch (err) {
    // Token failure, network error, or an unexpected Spotify response.
    // Surface a single friendly error code; details stay in server logs.
    console.error("Spotify search failed:", err);
    return NextResponse.json({ error: "spotify_unreachable" }, { status: 502 });
  }
}
