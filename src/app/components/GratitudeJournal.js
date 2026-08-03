"use client";

const PLACEHOLDERS = [
  "Something that made me smile today…",
  "A person I feel grateful for…",
  "Something about myself I appreciate…",
];

export default function GratitudeJournal({ gratitude, setGratitude, darkMode }) {
  const handleChange = (index, value) => {
    const updated = [...gratitude];
    updated[index] = value;
    setGratitude(updated);
  };

  const filled = gratitude.filter((g) => g.trim() !== "").length;

  return (
    <div className={`rounded-3xl p-6 ${darkMode ? "glass-card-dark" : "glass-card"}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? "text-rose-400" : "text-rose-400"}`}>
            Gratitude Journal
          </p>
          <h3 className={`text-base font-bold mt-0.5 ${darkMode ? "text-white" : "text-gray-800"}`}>
            🙏 Three good things
          </h3>
        </div>
        {/* Progress dots */}
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i < filled
                  ? "bg-gradient-to-br from-rose-500 to-pink-400 scale-110"
                  : darkMode ? "bg-white/15" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      <p className={`text-xs mb-4 ${darkMode ? "text-gray-400" : "text-gray-400"}`}>
        Gratitude rewires your brain for happiness 💛
      </p>

      {/* Inputs */}
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="relative">
            <span className={`
              absolute left-3.5 top-3 text-sm font-bold select-none
              ${darkMode ? "text-rose-400" : "text-rose-400"}
            `}>
              {i + 1}.
            </span>
            <textarea
              rows={2}
              value={gratitude[i]}
              onChange={(e) => handleChange(i, e.target.value)}
              placeholder={PLACEHOLDERS[i]}
              className={`
                w-full pl-8 pr-4 py-3 rounded-2xl text-sm resize-none
                transition-all duration-200
                placeholder:text-gray-300
                ${darkMode
                  ? "bg-white/6 border border-white/10 text-gray-100 placeholder:text-gray-600 focus:border-rose-400/40"
                  : "bg-white/60 border border-white/70 text-gray-700 focus:border-rose-300"
                }
              `}
            />
          </div>
        ))}
      </div>

      {filled === 3 && (
        <p className={`text-center text-xs mt-4 font-medium ${darkMode ? "text-rose-300" : "text-rose-500"}`}>
          Beautiful — gratitude unlocked 🌟
        </p>
      )}
    </div>
  );
}
