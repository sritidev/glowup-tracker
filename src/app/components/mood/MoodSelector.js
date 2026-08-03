"use client";

const moods = [
  { emoji: "🥰", label: "Loved",   color: "text-rose-400",   desc: "Feeling full of love" },
  { emoji: "😊", label: "Calm",    color: "text-purple-400", desc: "Peaceful and grounded" },
  { emoji: "😐", label: "Neutral", color: "text-gray-400",   desc: "Just getting through" },
  { emoji: "😔", label: "Low",     color: "text-blue-400",   desc: "A little down today" },
  { emoji: "😤", label: "Tense",   color: "text-orange-400", desc: "Stressed or overwhelmed" },
];

export default function MoodSelector({ selectMood, setSelectMood, darkMode }) {
  return (
    <div className={`rounded-3xl p-6 ${darkMode ? "glass-card-dark" : "glass-card"}`}>
      <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${darkMode ? "text-rose-400" : "text-rose-400"}`}>
        Emotional Check-In
      </p>
      <h2 className={`text-base font-bold leading-snug ${darkMode ? "text-white" : "text-gray-800"}`}>
        How is your heart feeling{" "}
        <span className="gradient-text-love">right now?</span>
      </h2>
      <p className={`text-xs mt-1 mb-5 ${darkMode ? "text-gray-400" : "text-gray-400"}`}>
        No judgment — all feelings are welcome here 💗
      </p>

      {/* Mood buttons */}
      <div className="flex justify-between gap-2">
        {moods.map((mood) => {
          const isSelected = selectMood?.label === mood.label;
          return (
            <button
              key={mood.label}
              onClick={() => setSelectMood(mood)}
              title={mood.label}
              className={`
                flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl
                transition-all duration-200 border
                ${isSelected
                  ? darkMode
                    ? "bg-rose-500/25 border-rose-400/40 scale-105 shadow-md"
                    : "bg-rose-50 border-rose-300/60 scale-105 shadow-md"
                  : darkMode
                    ? "bg-white/5 border-white/8 hover:bg-white/10"
                    : "bg-white/50 border-white/60 hover:bg-white/80"
                }
              `}
            >
              <span className={`text-2xl transition-transform duration-200 ${isSelected ? "scale-125" : ""}`}>
                {mood.emoji}
              </span>
              <span className={`text-[10px] font-semibold ${isSelected ? mood.color : darkMode ? "text-gray-500" : "text-gray-400"}`}>
                {mood.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected display */}
      <div className={`
        mt-4 px-4 py-3.5 rounded-2xl flex items-center gap-3
        transition-all duration-300
        ${darkMode ? "bg-white/6 border border-white/8" : "bg-white/60 border border-rose-100/60"}
      `}>
        {selectMood ? (
          <>
            <span className="text-2xl">{selectMood.emoji}</span>
            <div>
              <p className={`text-sm font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                {selectMood.label}
              </p>
              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                {selectMood.desc} — your feelings are valid 🌸
              </p>
            </div>
          </>
        ) : (
          <p className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
            Tap a feeling above to begin 🌸
          </p>
        )}
      </div>
    </div>
  );
}
