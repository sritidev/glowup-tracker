"use client";

import { NOURISH_HABITS } from "../../../lib/wellness";

export default function NourishTracker({ nourishment, setNourishment, darkMode }) {
  const toggle = (id) => {
    setNourishment((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
  };

  const count = nourishment.length;

  return (
    <div className={`rounded-3xl p-6 ${darkMode ? "glass-card-dark" : "glass-card"}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? "text-emerald-400" : "text-emerald-500"}`}>
            Nourish Yourself
          </p>
          <h3 className={`text-base font-bold mt-0.5 ${darkMode ? "text-white" : "text-gray-800"}`}>
            🥗 Kind fuel today
          </h3>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${count > 0 ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-white" : darkMode ? "bg-white/10 text-gray-400" : "bg-gray-100 text-gray-400"}`}>
          {count}/{NOURISH_HABITS.length}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {NOURISH_HABITS.map((h) => {
          const checked = nourishment.includes(h.id);
          return (
            <button key={h.id} onClick={() => toggle(h.id)}
              className={`flex items-center gap-2.5 px-3.5 py-3 rounded-2xl text-left border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                ${checked
                  ? darkMode ? "bg-emerald-500/25 border-emerald-400/30 text-white" : "bg-emerald-400/20 border-emerald-300/40 text-emerald-700"
                  : darkMode ? "bg-white/5 border-white/8 text-gray-300 hover:bg-white/10" : "bg-white/50 border-white/60 text-gray-500 hover:bg-white/80"}`}>
              <span className="text-lg flex-shrink-0">{h.icon}</span>
              <span className="text-xs font-medium leading-snug flex-1">{h.label}</span>
              {checked && <span className="text-emerald-400 text-sm flex-shrink-0">✓</span>}
            </button>
          );
        })}
      </div>

      <p className={`text-[10px] mt-3 text-center ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
        Nourishment is self-love — no rules, just kindness 💚
      </p>
    </div>
  );
}
