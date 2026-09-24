"use client";

import { useState } from "react";
import {
  Sun,
  Moon,
  ExternalLink,
  Music2,
  RefreshCw,
} from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";
import BottomNav from "../components/BottomNav";

// ─────────────────────────────────────────────
// Mood list
// ─────────────────────────────────────────────

const MOODS = [
  {
    id: "calm",
    label: "Calm & Soothing",
    emoji: "🌙",
  },
  {
    id: "self-love",
    label: "Self-Love",
    emoji: "💗",
  },
  {
    id: "comfort",
    label: "Comfort & Healing",
    emoji: "🫧",
  },
  {
    id: "feel-good",
    label: "Feel-Good",
    emoji: "🌈",
  },
  {
    id: "motivation",
    label: "Motivation",
    emoji: "🔥",
  },
  {
    id: "relaxation",
    label: "Relaxation",
    emoji: "🌿",
  },
  {
    id: "sleep",
    label: "Sleep",
    emoji: "😴",
  },
  {
    id: "happy",
    label: "Happy & Positive",
    emoji: "☀️",
  },
  {
    id: "energy",
    label: "Energy",
    emoji: "⚡",
  },
];

// ─────────────────────────────────────────────
// Friendly error messages
// ─────────────────────────────────────────────

const ERR = {
  not_configured:
    "MyAura Sounds isn't set up yet. Please try again later.",

  youtube_unreachable:
    "YouTube is having a quiet moment. Please try again.",

  default:
    "Something went off-key. Please try again.",
};

// ─────────────────────────────────────────────
// YouTube icon
// ─────────────────────────────────────────────

function YouTubeIcon({ size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.8V8.2l6.4 3.8-6.4 3.8Z" />
    </svg>
  );
}

// ─────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────

export default function SoundsPage() {
  const { darkMode, toggle } = useDarkMode();

  const [selected, setSelected] = useState(null);
  const [playlists, setPlaylists] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const card = darkMode ? "glass-card-dark" : "glass-card";

  // ───────────────────────────────────────────
  // Fetch playlists for selected mood
  // ───────────────────────────────────────────

  const pickMood = async (mood) => {
    setSelected(mood.id);
    setLoading(true);
    setError("");
    setPlaylists(null);

    try {
      const res = await fetch(
        `/api/youtube/search?mood=${encodeURIComponent(mood.id)}`
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Handles both:
        // youtube_unreachable
        // YouTube_unreachable
        const rawError = String(data?.error || "");
        const normalizedError = rawError.toLowerCase();

        setError(
          ERR[normalizedError] ||
            ERR[rawError] ||
            ERR.default
        );

        setPlaylists([]);
        return;
      }

      setPlaylists(
        Array.isArray(data?.playlists)
          ? data.playlists
          : []
      );
    } catch (err) {
      console.error("MyAura Sounds request failed:", err);

      setError(ERR.default);
      setPlaylists([]);
    } finally {
      setLoading(false);
    }
  };

  const selectedMood =
    MOODS.find((mood) => mood.id === selected) ?? null;

  const retry = () => {
    if (selectedMood) {
      pickMood(selectedMood);
    }
  };

  // ───────────────────────────────────────────
  // Mood button classes
  // ───────────────────────────────────────────

  const moodBtn = (active) =>
    `flex flex-col items-center justify-center gap-1.5 py-4 px-2 rounded-2xl border text-center transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] ${
      active
        ? "bg-gradient-to-br from-rose-500 to-pink-500 text-white border-transparent shadow-lg shadow-rose-400/25"
        : darkMode
        ? "bg-white/6 text-gray-200 border-white/10 hover:bg-white/12"
        : "bg-white/60 text-gray-600 border-white/70 hover:bg-white/85"
    }`;

  // ───────────────────────────────────────────
  // Page
  // ───────────────────────────────────────────

  return (
    <main
      className={`relative min-h-screen pb-28 overflow-hidden transition-colors duration-500 ${
        darkMode
          ? "bg-[radial-gradient(ellipse_at_top,_#2d0a2e_0%,_#140a1e_55%,_#0a0810_100%)]"
          : "bg-[radial-gradient(ellipse_at_top,_#ffe4f0_0%,_#f3e8ff_50%,_#fff5f7_100%)]"
      }`}
    >
      {/* Decorative background */}
      <div
        className={`absolute top-[-80px] left-[-80px] w-[380px] h-[380px] rounded-full blur-[110px] opacity-30 animate-float-slow pointer-events-none ${
          darkMode ? "bg-rose-950" : "bg-rose-200"
        }`}
      />

      <div
        className={`absolute bottom-0 right-[-60px] w-[300px] h-[300px] rounded-full blur-[90px] opacity-20 animate-float pointer-events-none ${
          darkMode ? "bg-purple-950" : "bg-purple-200"
        }`}
      />

      {/* ───────────────────────────────────────
          Header
      ─────────────────────────────────────── */}

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-6">
        <div
          className={`flex items-center justify-between px-5 py-3.5 rounded-2xl ${card}`}
        >
          <div>
            <p
              className={`text-xs font-semibold uppercase tracking-widest ${
                darkMode
                  ? "text-rose-400"
                  : "text-rose-400"
              }`}
            >
              Music for your mood
            </p>

            <h1 className="text-xl font-bold gradient-text-love">
              MyAura Sounds 🎧
            </h1>
          </div>

          <button
            onClick={toggle}
            aria-label="Toggle dark mode"
            className={`p-2.5 rounded-xl border transition-all hover:scale-105 ${
              darkMode
                ? "bg-white/8 text-yellow-300 border-white/10"
                : "bg-black/5 text-gray-500 border-black/8"
            }`}
          >
            {darkMode ? (
              <Sun size={17} />
            ) : (
              <Moon size={17} />
            )}
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────
          Main content
      ─────────────────────────────────────── */}

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 mt-5 space-y-5">
        {/* Mood chooser */}

        <div className={`rounded-3xl p-6 ${card}`}>
          <h2
            className={`text-lg font-bold ${
              darkMode
                ? "text-white"
                : "text-gray-800"
            }`}
          >
            What do you need right now?
          </h2>

          <p
            className={`text-sm mt-1 mb-5 ${
              darkMode
                ? "text-gray-400"
                : "text-gray-500"
            }`}
          >
            Pick a feeling and MyAura will find
            playlists to match your moment.
          </p>

          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            {MOODS.map((mood) => (
              <button
                key={mood.id}
                onClick={() => pickMood(mood)}
                className={moodBtn(
                  selected === mood.id
                )}
                title={mood.label}
                type="button"
              >
                <span className="text-2xl leading-none">
                  {mood.emoji}
                </span>

                <span className="text-[11px] sm:text-xs font-semibold leading-tight">
                  {mood.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Results */}

        {selectedMood && (
          <div className="space-y-4">
            {/* Result header */}

            <div className="flex items-center justify-between px-1 gap-3">
              <h2
                className={`text-base font-bold ${
                  darkMode
                    ? "text-white"
                    : "text-gray-800"
                }`}
              >
                A little music for your moment ✨
              </h2>

              <span
                className={`text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap ${
                  darkMode
                    ? "bg-white/8 text-rose-300"
                    : "bg-rose-50 text-rose-500"
                }`}
              >
                {selectedMood.emoji}{" "}
                {selectedMood.label}
              </span>
            </div>

            {/* Loading */}

            {loading && (
              <div
                className={`rounded-3xl p-10 text-center ${card}`}
              >
                <Music2
                  size={34}
                  className={`mx-auto mb-3 animate-pulse ${
                    darkMode
                      ? "text-rose-700"
                      : "text-rose-300"
                  }`}
                />

                <p
                  className={`text-sm ${
                    darkMode
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  Finding playlists for you…
                </p>
              </div>
            )}

            {/* Error */}

            {!loading && error && (
              <div
                className={`rounded-3xl p-10 text-center ${card}`}
              >
                <div className="text-4xl mb-3">
                  🎐
                </div>

                <p
                  className={`text-sm mb-5 ${
                    darkMode
                      ? "text-gray-300"
                      : "text-gray-600"
                  }`}
                >
                  {error}
                </p>

                <button
                  onClick={retry}
                  type="button"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-white text-sm bg-gradient-to-r from-rose-500 to-pink-500 transition-all hover:scale-[1.02]"
                >
                  <RefreshCw size={15} />
                  Try again
                </button>
              </div>
            )}

            {/* Empty */}

            {!loading &&
              !error &&
              playlists &&
              playlists.length === 0 && (
                <div
                  className={`rounded-3xl p-10 text-center ${card}`}
                >
                  <div className="text-4xl mb-3">
                    🌸
                  </div>

                  <p
                    className={`text-sm ${
                      darkMode
                        ? "text-gray-400"
                        : "text-gray-500"
                    }`}
                  >
                    No playlists found for this
                    mood right now. Try another
                    feeling above.
                  </p>
                </div>
              )}

            {/* Playlist cards */}

            {!loading &&
              !error &&
              playlists &&
              playlists.length > 0 && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {playlists.map((playlist) => {
                      const playlistUrl =
                        playlist.url || "#";

                      const owner =
                        playlist.owner ||
                        playlist.channelTitle ||
                        playlist.channel ||
                        null;

                      const videoCount =
                        playlist.videoCount ??
                        playlist.itemsCount ??
                        playlist.tracks ??
                        null;

                      return (
                        <div
                          key={playlist.id}
                          className={`rounded-3xl overflow-hidden flex flex-col ${card}`}
                        >
                          {/* Thumbnail */}

                          <div className="relative aspect-square bg-gradient-to-br from-rose-400/25 to-purple-400/25 overflow-hidden">
                            {playlist.image ? (
                              <img
                                src={playlist.image}
                                alt={
                                  playlist.name ||
                                  "YouTube playlist"
                                }
                                className="w-full h-full object-cover"
                                loading="lazy"
                                onError={(event) => {
                                  event.currentTarget.style.display =
                                    "none";

                                  const fallback =
                                    event.currentTarget
                                      .nextElementSibling;

                                  if (fallback) {
                                    fallback.classList.remove(
                                      "hidden"
                                    );
                                  }
                                }}
                              />
                            ) : null}

                            <div
                              className={`w-full h-full flex items-center justify-center text-4xl ${
                                playlist.image
                                  ? "hidden"
                                  : ""
                              }`}
                            >
                              🎵
                            </div>
                          </div>

                          {/* Information */}

                          <div className="p-4 flex flex-col flex-1">
                            <p
                              className={`text-sm font-bold line-clamp-2 ${
                                darkMode
                                  ? "text-white"
                                  : "text-gray-800"
                              }`}
                            >
                              {playlist.name ||
                                "Untitled playlist"}
                            </p>

                            {playlist.description && (
                              <p
                                className={`text-xs mt-1 line-clamp-2 ${
                                  darkMode
                                    ? "text-gray-400"
                                    : "text-gray-500"
                                }`}
                              >
                                {playlist.description}
                              </p>
                            )}

                            {(owner ||
                              videoCount != null) && (
                              <p
                                className={`text-[11px] mt-1.5 ${
                                  darkMode
                                    ? "text-gray-500"
                                    : "text-gray-400"
                                }`}
                              >
                                {owner
                                  ? `By ${owner}`
                                  : ""}

                                {owner &&
                                videoCount != null
                                  ? " · "
                                  : ""}

                                {videoCount != null
                                  ? `${videoCount} videos`
                                  : ""}
                              </p>
                            )}

                            {/* Actions */}

                            <div className="mt-auto pt-3 flex items-center justify-between gap-2">
                              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-red-500">
                                <YouTubeIcon
                                  size={15}
                                />
                                YouTube
                              </span>

                              {playlistUrl !==
                              "#" ? (
                                <a
                                  href={
                                    playlistUrl
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-red-600 transition-all hover:bg-red-700 hover:scale-[1.03] active:scale-[0.98]"
                                >
                                  Watch on YouTube
                                  <ExternalLink
                                    size={13}
                                  />
                                </a>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-gray-400 bg-gray-200 cursor-not-allowed dark:bg-white/10 dark:text-gray-500">
                                  Link unavailable
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Attribution */}

                  <p
                    className={`text-center text-[11px] pt-1 ${
                      darkMode
                        ? "text-gray-600"
                        : "text-gray-400"
                    }`}
                  >
                    Playlist information and
                    artwork are provided by
                    YouTube. MyAura links you to
                    the original playlist.
                  </p>
                </>
              )}
          </div>
        )}

        {/* First visit */}

        {!selectedMood && (
          <div
            className={`rounded-3xl p-8 text-center ${card}`}
          >
            <Music2
              size={34}
              className={`mx-auto mb-3 ${
                darkMode
                  ? "text-rose-800"
                  : "text-rose-200"
              }`}
            />

            <p
              className={`text-sm ${
                darkMode
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              Choose a mood above and we&apos;ll
              gather a little music for your
              moment. ✨
            </p>
          </div>
        )}
      </div>

      <BottomNav darkMode={darkMode} />
    </main>
  );
}