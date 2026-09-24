"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { streakLevel } from "../../lib/streak";

const MILESTONES = [
  { days: 1,  icon: "🌱", text: "First check-in" },
  { days: 3,  icon: "🌸", text: "3-day bloomer" },
  { days: 7,  icon: "💖", text: "One week strong" },
  { days: 14, icon: "🔥", text: "Two weeks unstoppable" },
  { days: 30, icon: "👑", text: "30-day legend" },
];

// Next milestone ring target for the progress arc
function nextTarget(streak) {
  const t = MILESTONES.map((m) => m.days).find((d) => d > streak);
  return t ?? 30;
}

export default function GlowStreak({ streak, animate, darkMode }) {
  const current = streak?.current ?? 0;
  const longest = streak?.longest ?? 0;
  const level   = streakLevel(current);

  const target  = nextTarget(current);
  const pct     = Math.min(current / target, 1);

  // Celebrate when hitting a milestone exactly
  const prevRef = useRef(current);
  useEffect(() => {
    const hitMilestone = MILESTONES.some((m) => m.days === current) && current > prevRef.current;
    if (hitMilestone) {
      confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.55 },
        colors: ["#fb7bb2", "#f43f8a", "#c026d3", "#e879f9", "#fda4af"],
      });
    }
    prevRef.current = current;
  }, [current]);

  return (
    <div className={`rounded-3xl p-6 flex flex-col ${darkMode ? "glass-card-dark" : "glass-card"}`}>
      <p className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? "text-rose-400" : "text-rose-400"}`}>
        Self-Love Streak
      </p>
      <h3 className={`text-base font-bold mt-0.5 ${darkMode ? "text-white" : "text-gray-800"}`}>
        🔥 Consecutive days
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
              strokeDasharray={`${pct * 264} 264`}
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
              {current}
            </span>
            <span className={`text-[11px] mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              day{current === 1 ? "" : "s"}
            </span>
          </div>
        </div>
      </div>

      {/* Level label */}
      <p className={`text-center text-sm font-bold mt-2 ${level.color}`}>
        {level.label}
      </p>
      <p className={`text-center text-[10px] mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
        {current < target
          ? `${target - current} day${target - current === 1 ? "" : "s"} to next milestone`
          : "Max milestone reached 👑"}
      </p>

      {/* Current vs longest */}
      <div className="grid grid-cols-2 gap-3 mt-5">
        <div className={`rounded-2xl py-3 text-center ${darkMode ? "bg-white/6 border border-white/8" : "bg-white/55 border border-white/65"}`}>
          <p className="text-2xl font-black gradient-text-love leading-none">{current}</p>
          <p className={`text-[10px] mt-1 font-semibold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Current 🔥</p>
        </div>
        <div className={`rounded-2xl py-3 text-center ${darkMode ? "bg-white/6 border border-white/8" : "bg-white/55 border border-white/65"}`}>
          <p className="text-2xl font-black gradient-text-love leading-none">{longest}</p>
          <p className={`text-[10px] mt-1 font-semibold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Longest 🏆</p>
        </div>
      </div>

      {/* Milestones */}
      <div className={`mt-5 pt-4 border-t ${darkMode ? "border-white/8" : "border-rose-100"}`}>
        <p className={`text-xs font-semibold mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          Milestones
        </p>
        {MILESTONES.map((m) => {
          const reached = current >= m.days;
          return (
            <div key={m.days} className={`flex items-center gap-2 mb-1.5 ${reached ? "opacity-100" : "opacity-30"}`}>
              <span className="text-sm">{m.icon}</span>
              <span className={`text-xs ${reached ? (darkMode ? "text-white" : "text-gray-700") : (darkMode ? "text-gray-600" : "text-gray-400")}`}>
                {m.text}
              </span>
              {reached && <span className="text-[10px] text-rose-400 ml-auto">✓</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
