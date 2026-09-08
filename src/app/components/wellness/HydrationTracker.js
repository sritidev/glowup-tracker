"use client";

import { Droplet, Minus } from "lucide-react";
import { formatLitres } from "../../../lib/wellness";

export default function HydrationTracker({ ml, goal, onChange, darkMode }) {
  const pct = Math.min(Math.round((ml / goal) * 100), 100);
  const reached = ml >= goal;

  const add = (amt) => onChange(Math.max(0, ml + amt));

  // 8 water-drop cups representing the goal
  const cups = 8;
  const filledCups = Math.round((ml / goal) * cups);

  return (
    <div className={`rounded-3xl p-6 ${darkMode ? "glass-card-dark" : "glass-card"}`}>
      <div className="flex items-center justify-between mb-1">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? "text-sky-400" : "text-sky-500"}`}>
            Hydration
          </p>
          <h3 className={`text-base font-bold mt-0.5 ${darkMode ? "text-white" : "text-gray-800"}`}>
            💧 {formatLitres(ml)} <span className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-400"}`}>/ {formatLitres(goal)}</span>
          </h3>
        </div>
        <div className={`text-2xl font-black ${reached ? "text-sky-400" : darkMode ? "text-gray-500" : "text-gray-300"}`}>
          {pct}%
        </div>
      </div>

      {/* Water drop cups */}
      <div className="flex justify-between gap-1.5 my-4">
        {Array.from({ length: cups }).map((_, i) => (
          <div key={i}
            className={`flex-1 aspect-[3/4] rounded-b-2xl rounded-t-lg flex items-end justify-center transition-all duration-500 border
              ${i < filledCups
                ? "bg-gradient-to-t from-sky-500 to-cyan-300 border-sky-300/40"
                : darkMode ? "bg-white/5 border-white/8" : "bg-white/50 border-white/60"}`}>
            <Droplet size={12} className={i < filledCups ? "text-white mb-1" : darkMode ? "text-gray-600 mb-1" : "text-gray-300 mb-1"} />
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className={`h-2 rounded-full overflow-hidden ${darkMode ? "bg-white/10" : "bg-sky-100"}`}>
        <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>

      {/* Add buttons */}
      <div className="flex gap-2 mt-4">
        <button onClick={() => add(250)}
          className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-sky-500 to-cyan-400 shadow-md hover:scale-[1.03] active:scale-[0.97] transition-all">
          +250 ml
        </button>
        <button onClick={() => add(500)}
          className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-sky-500 to-cyan-400 shadow-md hover:scale-[1.03] active:scale-[0.97] transition-all">
          +500 ml
        </button>
        <button onClick={() => add(-250)}
          className={`px-3 py-2.5 rounded-xl border transition-all hover:scale-105 ${darkMode ? "bg-white/8 text-gray-300 border-white/10" : "bg-white/60 text-gray-500 border-white/70"}`}>
          <Minus size={14} />
        </button>
      </div>

      {reached && (
        <p className="text-center text-xs mt-3 font-medium text-sky-400">Goal reached — beautifully hydrated 💧</p>
      )}
    </div>
  );
}
