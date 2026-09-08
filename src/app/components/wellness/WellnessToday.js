"use client";

import { formatLitres, formatDuration } from "../../../lib/wellness";

export default function WellnessToday({ hydrationMl, hydrationGoal, movementMin, sleepMinutes, steps, stepsGoal, journalDone, breathingDone, darkMode }) {
  const tiles = [
    {
      icon: "💧", label: "Water",
      value: formatLitres(hydrationMl ?? 0),
      sub: `/ ${formatLitres(hydrationGoal ?? 2000)}`,
      done: (hydrationMl ?? 0) >= (hydrationGoal ?? 2000),
    },
    {
      icon: "🚶‍♀️", label: "Steps",
      value: (steps ?? 0) >= 1000 ? `${((steps ?? 0) / 1000).toFixed(1)}k` : `${steps ?? 0}`,
      sub: "",
      done: (steps ?? 0) >= (stepsGoal ?? 8000),
    },
    {
      icon: "🏃", label: "Movement",
      value: movementMin ? `${movementMin}` : "0",
      sub: "min",
      done: (movementMin ?? 0) > 0,
    },
    {
      icon: "😴", label: "Sleep",
      value: sleepMinutes != null ? formatDuration(sleepMinutes) : "—",
      sub: "",
      done: sleepMinutes != null,
    },
    {
      icon: "📖", label: "Journal",
      value: journalDone ? "Done" : "—",
      sub: "",
      done: journalDone,
    },
    {
      icon: "🧘", label: "Breathing",
      value: breathingDone ? "Done" : "—",
      sub: "",
      done: breathingDone,
    },
  ];

  return (
    <div className={`rounded-3xl p-6 ${darkMode ? "glass-card-dark" : "glass-card"}`}>
      <p className={`text-xs font-semibold uppercase tracking-widest mb-4 ${darkMode ? "text-rose-400" : "text-rose-400"}`}>
        Today&apos;s Wellness
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {tiles.map((t) => (
          <div key={t.label}
            className={`rounded-2xl p-3.5 text-center border transition-all
              ${t.done
                ? darkMode ? "bg-rose-500/15 border-rose-400/25" : "bg-rose-400/12 border-rose-300/30"
                : darkMode ? "bg-white/5 border-white/8" : "bg-white/50 border-white/60"}`}>
            <div className="text-xl mb-1">{t.icon}</div>
            <p className={`text-sm font-black leading-none ${darkMode ? "text-white" : "text-gray-800"}`}>
              {t.value}
              {t.sub && <span className={`text-[10px] font-medium ml-0.5 ${darkMode ? "text-gray-400" : "text-gray-400"}`}>{t.sub}</span>}
            </p>
            <p className={`text-[10px] mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{t.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
