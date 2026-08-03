"use client";

export default function WeeklyPreview({ week, darkMode }) {
  const filled = week.filter((d) => d.mood !== null).length;
  const pct = Math.round((filled / 7) * 100);

  const moodColors = {
    "🥰": "bg-rose-400/60",
    "😊": "bg-purple-400/60",
    "😐": "bg-gray-400/60",
    "😔": "bg-blue-400/60",
    "😤": "bg-orange-400/60",
  };

  return (
    <div className={`rounded-3xl p-6 h-full ${darkMode ? "glass-card-dark" : "glass-card"}`}>
      <p className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? "text-rose-400" : "text-rose-400"}`}>
        Love Journey
      </p>
      <h3 className={`text-base font-bold mt-0.5 ${darkMode ? "text-white" : "text-gray-800"}`}>
        💕 Your week at a glance
      </h3>

      {/* Progress bar */}
      <div className={`mt-4 h-2 rounded-full overflow-hidden ${darkMode ? "bg-white/10" : "bg-rose-100"}`}>
        <div
          className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-400 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className={`text-xs mt-1 text-right ${darkMode ? "text-gray-400" : "text-gray-400"}`}>
        {filled}/7 days logged
      </p>

      {/* Day bubbles */}
      <div className="grid grid-cols-7 gap-1.5 mt-5">
        {week.map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className={`text-[10px] font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              {item.day}
            </span>
            <div className={`
              w-9 h-9 rounded-xl flex items-center justify-center text-base
              transition-all duration-300
              ${item.mood
                ? (moodColors[item.mood] || (darkMode ? "bg-rose-500/30" : "bg-rose-400/20")) +
                  " border border-rose-300/30 scale-110"
                : darkMode ? "bg-white/6 border border-white/8" : "bg-white/40 border border-white/60"
              }
            `}>
              {item.mood ?? <span className={`text-xs ${darkMode ? "text-gray-600" : "text-gray-300"}`}>·</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Motivational line */}
      <p className={`mt-5 text-xs text-center font-medium ${darkMode ? "text-rose-300" : "text-rose-500"}`}>
        {filled === 0 && "Start your self-love journey today 🌸"}
        {filled > 0 && filled < 7 && `${filled} day${filled > 1 ? "s" : ""} of self-love — keep going 💕`}
        {filled === 7 && "🎉 A full week of showing up for yourself!"}
      </p>

      {/* Legend */}
      <div className={`mt-4 pt-4 border-t ${darkMode ? "border-white/8" : "border-rose-100"}`}>
        <p className={`text-[10px] font-semibold mb-2 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Mood key</p>
        <div className="grid grid-cols-2 gap-x-2 gap-y-1">
          {[["🥰","Loved"],["😊","Calm"],["😐","Neutral"],["😔","Low"],["😤","Tense"]].map(([e, l]) => (
            <div key={l} className="flex items-center gap-1.5">
              <span className="text-sm">{e}</span>
              <span className={`text-[10px] ${darkMode ? "text-gray-400" : "text-gray-400"}`}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
