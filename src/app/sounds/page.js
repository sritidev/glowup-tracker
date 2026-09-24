"use client";

import { useState } from "react";
import { Sun, Moon, ExternalLink, Music2, RefreshCw } from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";
import BottomNav from "../components/BottomNav";

// Mood list for the selector. Only presentation data lives here (id/label/emoji).
// The actual Spotify search keywords stay server-side in src/lib/spotify.js so
// the client never needs them. Ids MUST match the MOODS ids in that lib.
const MOODS = [
  { id: "calm",       label: "Calm & Soothing",  emoji: "🌙" },
  { id: "self-love",  label: "Self-Love",         emoji: "💗" },
  { id: "comfort",    label: "Comfort & Healing", emoji: "🫧" },
  { id: "feel-good",  label: "Feel-Good",         emoji: "🌈" },
  { id: "motivation", label: "Motivation",        emoji: "🔥" },
  { id: "relaxation", label: "Relaxation",        emoji: "🌿" },
  { id: "sleep",      label: "Sleep",             emoji: "😴" },
  { id: "happy",      label: "Happy & Positive",  emoji: "☀️" },
  { id: "energy",     label: "Energy",            emoji: "⚡" },
];

// Friendly, on-brand messages for each server error code.
const ERR = {
  not_configured:     "MyAura Sounds isn't set up yet. Please try again later.",
  spotify_unreachable:"Spotify is having a quiet moment. Please try again.",
  default:            "Something went off-key. Please try again.",
};

// Official Spotify wordmark glyph (lucide-react ships no brand icons).
function SpotifyIcon({ size = 16, className = "" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0m5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02m1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2m.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3"/>
    </svg>
  );
}

export default function SoundsPage() {
  const { darkMode, toggle } = useDarkMode();

  const [selected, setSelected] = useState(null);   // mood id
  const [playlists, setPlaylists] = useState(null);  // null = not searched yet
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const card = darkMode ? "glass-card-dark" : "glass-card";

  const pickMood = async (mood) => {
    setSelected(mood.id);
    setLoading(true);
    setError("");
    setPlaylists(null);
    try {
      const res = await fetch(`/api/spotify/search?mood=${encodeURIComponent(mood.id)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(ERR[data.error] ?? ERR.default);
        setPlaylists([]);
        return;
      }
      setPlaylists(data.playlists ?? []);
    } catch {
      setError(ERR.default);
      setPlaylists([]);
    } finally {
      setLoading(false);
    }
  };

  const selectedMood = MOODS.find((m) => m.id === selected) ?? null;
  const retry = () => { if (selectedMood) pickMood(selectedMood); };

  const moodBtn = (active) =>
    `flex flex-col items-center justify-center gap-1.5 py-4 px-2 rounded-2xl border text-center transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] ${
      active
        ? "bg-gradient-to-br from-rose-500 to-pink-500 text-white border-transparent shadow-lg shadow-rose-400/25"
        : darkMode
        ? "bg-white/6 text-gray-200 border-white/10 hover:bg-white/12"
        : "bg-white/60 text-gray-600 border-white/70 hover:bg-white/85"
    }`;

  return (
    <main className={`relative min-h-screen pb-28 overflow-hidden transition-colors duration-500 ${darkMode ? "bg-[radial-gradient(ellipse_at_top,_#2d0a2e_0%,_#140a1e_55%,_#0a0810_100%)]" : "bg-[radial-gradient(ellipse_at_top,_#ffe4f0_0%,_#f3e8ff_50%,_#fff5f7_100%)]"}`}>
      <div className={`absolute top-[-80px] left-[-80px] w-[380px] h-[380px] rounded-full blur-[110px] opacity-30 animate-float-slow pointer-events-none ${darkMode ? "bg-rose-950" : "bg-rose-200"}`} />
      <div className={`absolute bottom-0 right-[-60px] w-[300px] h-[300px] rounded-full blur-[90px] opacity-20 animate-float pointer-events-none ${darkMode ? "bg-purple-950" : "bg-purple-200"}`} />

      {/* Header */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-6">
        <div className={`flex items-center justify-between px-5 py-3.5 rounded-2xl ${card}`}>
          <div>
            <p className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? "text-rose-400" : "text-rose-400"}`}>Music for your mood</p>
            <h1 className="text-xl font-bold gradient-text-love">MyAura Sounds 🎧</h1>
          </div>
          <button onClick={toggle} className={`p-2.5 rounded-xl border transition-all hover:scale-105 ${darkMode ? "bg-white/8 text-yellow-300 border-white/10" : "bg-black/5 text-gray-500 border-black/8"}`}>
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 mt-5 space-y-5">

        {/* Mood chooser */}
        <div className={`rounded-3xl p-6 ${card}`}>
          <h2 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>What do you need right now?</h2>
          <p className={`text-sm mt-1 mb-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Pick a feeling and MyAura will find playlists to match your moment.
          </p>
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            {MOODS.map((m) => (
              <button key={m.id} onClick={() => pickMood(m)} className={moodBtn(selected === m.id)} title={m.label}>
                <span className="text-2xl leading-none">{m.emoji}</span>
                <span className="text-[11px] sm:text-xs font-semibold leading-tight">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results area — only after a mood is chosen */}
        {selectedMood && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className={`text-base font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                A little music for your moment ✨
              </h2>
              <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${darkMode ? "bg-white/8 text-rose-300" : "bg-rose-50 text-rose-500"}`}>
                {selectedMood.emoji} {selectedMood.label}
              </span>
            </div>

            {/* Loading state */}
            {loading && (
              <div className={`rounded-3xl p-10 text-center ${card}`}>
                <Music2 size={34} className={`mx-auto mb-3 animate-pulse ${darkMode ? "text-rose-700" : "text-rose-300"}`} />
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Finding playlists for you…</p>
              </div>
            )}

            {/* Error state */}
            {!loading && error && (
              <div className={`rounded-3xl p-10 text-center ${card}`}>
                <div className="text-4xl mb-3">🎐</div>
                <p className={`text-sm mb-5 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{error}</p>
                <button onClick={retry} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-white text-sm bg-gradient-to-r from-rose-500 to-pink-500 transition-all hover:scale-[1.02]">
                  <RefreshCw size={15} /> Try again
                </button>
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && playlists && playlists.length === 0 && (
              <div className={`rounded-3xl p-10 text-center ${card}`}>
                <div className="text-4xl mb-3">🌸</div>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  No playlists found for this mood right now. Try another feeling above.
                </p>
              </div>
            )}

            {/* Playlist cards */}
            {!loading && !error && playlists && playlists.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {playlists.map((p) => (
                    <div key={p.id} className={`rounded-3xl overflow-hidden flex flex-col ${card}`}>
                      <div className="relative aspect-square bg-gradient-to-br from-rose-400/25 to-purple-400/25 overflow-hidden">
                        {p.image ? (
                          // Spotify artwork is displayed live from Spotify's CDN, never stored.
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">🎵</div>
                        )}
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <p className={`text-sm font-bold line-clamp-2 ${darkMode ? "text-white" : "text-gray-800"}`}>{p.name}</p>
                        {p.description && (
                          <p
                            className={`text-xs mt-1 line-clamp-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                            // Spotify descriptions may contain HTML entities/links; render as text.
                            dangerouslySetInnerHTML={{ __html: p.description }}
                          />
                        )}
                        {(p.owner || p.tracks != null) && (
                          <p className={`text-[11px] mt-1.5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                            {p.owner ? `By ${p.owner}` : ""}{p.owner && p.tracks != null ? " · " : ""}{p.tracks != null ? `${p.tracks} tracks` : ""}
                          </p>
                        )}

                        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
                          {/* Spotify attribution */}
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#1DB954]">
                            <SpotifyIcon size={14} /> Spotify
                          </span>
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#1DB954] transition-all hover:scale-[1.03] active:scale-[0.98]"
                          >
                            Open in Spotify <ExternalLink size={13} />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <p className={`text-center text-[11px] pt-1 ${darkMode ? "text-gray-600" : "text-gray-400"}`}>
                  Playlists and artwork are provided by Spotify. MyAura links you to the original playlist.
                </p>
              </>
            )}
          </div>
        )}

        {/* First-visit hint (before any mood is picked) */}
        {!selectedMood && (
          <div className={`rounded-3xl p-8 text-center ${card}`}>
            <Music2 size={34} className={`mx-auto mb-3 ${darkMode ? "text-rose-800" : "text-rose-200"}`} />
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Choose a mood above and we&apos;ll gather a little music for your moment. ✨
            </p>
          </div>
        )}
      </div>

      <BottomNav darkMode={darkMode} />
    </main>
  );
}
