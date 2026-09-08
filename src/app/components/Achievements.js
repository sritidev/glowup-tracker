"use client";

import { evaluateAchievements } from "../../lib/wellness";

const GROUP_ORDER = ["Self-Love", "Movement", "Wellness"];
const GROUP_ACCENT = {
  "Self-Love": "text-rose-400",
  "Movement":  "text-fuchsia-400",
  "Wellness":  "text-sky-400",
};

export default function Achievements({ stats, darkMode }) {
  const all = evaluateAchievements(stats);
  const unlockedCount = all.filter((a) => a.unlocked).length;
  const card = darkMode ? "glass-card-dark" : "glass-card";

  return (
    <div className={`rounded-3xl p-6 ${card}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? "text-rose-400" : "text-rose-400"}`}>
            Achievements
          </p>
          <h3 className={`text-base font-bold mt-0.5 ${darkMode ? "text-white" : "text-gray-800"}`}>
            🏅 Your milestones
          </h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-rose-500 to-pink-400 text-white`}>
          {unlockedCount}/{all.length}
        </span>
      </div>

      {GROUP_ORDER.map((group) => {
        const items = all.filter((a) => a.group === group);
        if (!items.length) return null;
        return (
          <div key={group} className="mb-4 last:mb-0">
            <p className={`text-[11px] font-bold uppercase tracking-widest mb-2 ${GROUP_ACCENT[group] ?? "text-gray-400"}`}>{group}</p>
            <div className="grid grid-cols-2 gap-2">
              {items.map((a) => (
                <div key={a.id}
                  className={`flex items-center gap-2.5 px-3.5 py-3 rounded-2xl border transition-all
                    ${a.unlocked
                      ? (darkMode ? "bg-white/8 border-white/12 animate-achievement" : "bg-white/60 border-white/70 animate-achievement")
                      : (darkMode ? "bg-white/3 border-white/6 opacity-45" : "bg-white/30 border-white/40 opacity-55")}`}>
                  <span className={`text-xl flex-shrink-0 ${a.unlocked ? "" : "grayscale"}`}>{a.icon}</span>
                  <span className={`text-xs font-medium leading-snug flex-1 ${a.unlocked ? (darkMode ? "text-white" : "text-gray-800") : (darkMode ? "text-gray-500" : "text-gray-400")}`}>
                    {a.title}
                  </span>
                  {a.unlocked
                    ? <span className="text-[10px] text-rose-400 flex-shrink-0">✓</span>
                    : <span className={`text-[10px] flex-shrink-0 ${darkMode ? "text-gray-600" : "text-gray-300"}`}>🔒</span>}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
