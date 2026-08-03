"use client";

const RITUALS = [
  { id: "sleep",     icon: "😴", label: "Got enough sleep" },
  { id: "hydrate",   icon: "💧", label: "Drank enough water" },
  { id: "move",      icon: "🧘", label: "Moved my body" },
  { id: "nourish",   icon: "🥗", label: "Nourished myself well" },
  { id: "screen",    icon: "📵", label: "Took a screen break" },
  { id: "outside",   icon: "🌤️", label: "Spent time outside" },
  { id: "creative",  icon: "🎨", label: "Did something creative" },
  { id: "connect",   icon: "🤝", label: "Connected with someone I love" },
  { id: "journal",   icon: "📓", label: "Journaled or reflected" },
  { id: "breathe",   icon: "🫁", label: "Practiced deep breathing" },
];

export default function SelfCareRituals({ rituals, setRituals, darkMode }) {
  const toggle = (id) => {
    setRituals((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const count = rituals.length;

  return (
    <div className={`rounded-3xl p-6 ${darkMode ? "glass-card-dark" : "glass-card"}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? "text-rose-400" : "text-rose-400"}`}>
            Self-Care Rituals
          </p>
          <h3 className={`text-base font-bold mt-0.5 ${darkMode ? "text-white" : "text-gray-800"}`}>
            💆 Acts of love today
          </h3>
        </div>
        <div className={`
          px-3 py-1 rounded-full text-xs font-bold
          ${count > 0
            ? "bg-gradient-to-r from-rose-500 to-pink-400 text-white shadow-sm"
            : darkMode ? "bg-white/10 text-gray-400" : "bg-gray-100 text-gray-400"
          }
        `}>
          {count}/{RITUALS.length}
        </div>
      </div>

      {/* Ritual grid */}
      <div className="grid grid-cols-2 gap-2">
        {RITUALS.map((ritual) => {
          const checked = rituals.includes(ritual.id);
          return (
            <button
              key={ritual.id}
              onClick={() => toggle(ritual.id)}
              className={`
                flex items-center gap-2.5 px-3.5 py-3 rounded-2xl text-left
                transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                border
                ${checked
                  ? darkMode
                    ? "bg-rose-500/25 border-rose-400/30 text-white"
                    : "bg-rose-400/20 border-rose-300/40 text-rose-700"
                  : darkMode
                    ? "bg-white/5 border-white/8 text-gray-300 hover:bg-white/10"
                    : "bg-white/50 border-white/60 text-gray-500 hover:bg-white/80"
                }
              `}
            >
              <span className="text-lg flex-shrink-0">{ritual.icon}</span>
              <span className="text-xs font-medium leading-snug flex-1">{ritual.label}</span>
              {checked && (
                <span className="text-rose-400 text-sm flex-shrink-0">✓</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className={`mt-4 h-1.5 rounded-full overflow-hidden ${darkMode ? "bg-white/10" : "bg-rose-100"}`}>
        <div
          className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-400 transition-all duration-700"
          style={{ width: `${(count / RITUALS.length) * 100}%` }}
        />
      </div>
      <p className={`text-[10px] mt-1.5 text-center ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
        {count === 0 && "Check off each act of love you gave yourself 💗"}
        {count > 0 && count < 5 && `${count} act${count > 1 ? "s" : ""} of self-love — you're doing great 🌸`}
        {count >= 5 && count < 10 && "You're really showing up for yourself today! 🌟"}
        {count === 10 && "Perfect self-care day — you absolutely glowed 💖"}
      </p>
    </div>
  );
}
