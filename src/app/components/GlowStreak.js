"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

const LEVELS = [
  { min: 7,  label: "Self-Love Master 👑",  color: "text-yellow-400" },
  { min: 5,  label: "Radiating Love 💖",    color: "text-rose-400" },
  { min: 3,  label: "Blooming 🌸",          color: "text-pink-400" },
  { min: 1,  label: "Gently Growing 🌱",    color: "text-fuchsia-400" },
  { min: 0,  label: "Just starting 💗",     color: "text-gray-400" },
];

export default function GlowStreak({ week, animate, darkMode }) {
  const streak = week.filter((d) => d.mood !== null).length;
  const level  = LEVELS.find((l) => streak >= l.min) ?? LEVELS[LEVELS.length - 1];

  useEffect(() => {
    if (streak === 7) {
      confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.55 },
        colors: ["#fb7bb2", "#f43f8a", "#c026d3", "#e879f9", "#fda4af"],
      });
    }
  }, [streak]);

  const pct = Math.round((streak / 7) * 100);

  return (
    <div className={`rounded-3xl p-6 h-full flex flex-col ${darkMode ? "glass-card-dark" : "glass-card"}`}>
      <p className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? "text-rose-400" : "text-rose-400"}`}>
        Self-Love Streak
      </p>
      <h3 className={`text-base font-bold mt-0.5 ${darkMode ? "text-white" : "text-gray-800"}`}>
        💝 Days you showed up
      </h3>

      {/* SVG ring */}
      <div className="flex justify-center mt-5">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none"
              stroke={darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)"}
              strokeWidth="9" />
            <circle cx="50" cy="50" r="42" fill="none"
              stroke="url(#streakLoveGrad)" strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={`${(streak / 7) * 264} 264`}
              className="transition-all duration-700" />
            <defs>
              <linearGradient id="streakLoveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fb7bb2" />
                <stop offset="100%" stopColor="#c026d3" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`font-black leading-none gradient-text-love transition-transform duration-300 text-5xl ${animate ? "scale-125" : "scale-100"}`}>
              {streak}
            </span>
            <span className={`text-[11px] mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              / 7 days
            </span>
          </div>
        </div>
      </div>

      {/* Level label */}
      <p className={`text-center text-sm font-bold mt-2 ${level.color}`}>
        {level.label}
      </p>
      <p className={`text-center text-[10px] mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
        {pct}% of week logged
      </p>

      {/* Dot track */}
      <div className="flex justify-center gap-2 mt-5">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className={`
            w-3 h-3 rounded-full transition-all duration-500
            ${i < streak
              ? "bg-gradient-to-br from-rose-500 to-pink-400 shadow-sm shadow-rose-400/40 scale-110"
              : darkMode ? "bg-white/12" : "bg-rose-100"
            }
          `} />
        ))}
      </div>

      {/* Milestone messages */}
      <div className={`mt-5 pt-4 border-t flex-1 ${darkMode ? "border-white/8" : "border-rose-100"}`}>
        <p className={`text-xs font-semibold mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          Milestones
        </p>
        {[
          { days: 1, icon: "🌱", text: "First check-in" },
          { days: 3, icon: "🌸", text: "3-day bloomer" },
          { days: 5, icon: "💖", text: "5-day glower" },
          { days: 7, icon: "👑", text: "Perfect love week" },
        ].map((m) => (
          <div key={m.days} className={`flex items-center gap-2 mb-1.5 ${streak >= m.days ? "opacity-100" : "opacity-30"}`}>
            <span className="text-sm">{m.icon}</span>
            <span className={`text-xs ${streak >= m.days ? (darkMode ? "text-white" : "text-gray-700") : (darkMode ? "text-gray-600" : "text-gray-400")}`}>
              {m.text}
            </span>
            {streak >= m.days && <span className="text-[10px] text-rose-400 ml-auto">✓</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
