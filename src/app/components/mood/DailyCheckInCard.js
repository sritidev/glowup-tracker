"use client";

const QUESTIONS = [
  {
    key: "boundaries",
    icon: "🛡️",
    label: "Did you honor your boundaries today?",
    options: ["Yes, I did 🛡️", "Mostly 🙂", "Not today 💭"],
  },
  {
    key: "kindness",
    icon: "💬",
    label: "Were you kind to yourself in your self-talk?",
    options: ["Very kind 💗", "Mostly kind 🌸", "Struggled 😔"],
  },
  {
    key: "rest",
    icon: "🌙",
    label: "Did you allow yourself to rest without guilt?",
    options: ["Totally 🌙", "A little 😌", "Not really 😬"],
  },
];

export default function DailyCheckInCard({ checkin, setCheckin, darkMode }) {
  const handleSelect = (key, value) => {
    setCheckin((prev) => ({ ...prev, [key]: value }));
  };

  const btnBase = "px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 border";
  const active  = darkMode
    ? "bg-rose-500/30 border-rose-400/40 text-white shadow-sm scale-[1.03]"
    : "bg-rose-400/25 border-rose-300/50 text-rose-700 shadow-sm scale-[1.03]";
  const inactive = darkMode
    ? "bg-white/6 border-white/10 text-gray-300 hover:bg-white/12"
    : "bg-white/55 border-white/65 text-gray-500 hover:bg-white/85";

  return (
    <div className={`rounded-3xl p-6 space-y-5 ${darkMode ? "glass-card-dark" : "glass-card"}`}>
      <div>
        <p className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? "text-rose-400" : "text-rose-400"}`}>
          Self-Love Check-In
        </p>
        <h2 className={`text-base font-bold mt-0.5 ${darkMode ? "text-white" : "text-gray-800"}`}>
          💗 Checking in with yourself
        </h2>
        <p className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-400"}`}>
          Three gentle questions — answer honestly, with compassion
        </p>
      </div>

      {QUESTIONS.map((q) => (
        <div key={q.key}>
          <p className={`text-sm font-semibold mb-2.5 flex items-center gap-2 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
            <span>{q.icon}</span> {q.label}
          </p>
          <div className="flex gap-2 flex-wrap">
            {q.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleSelect(q.key, opt)}
                className={`${btnBase} ${checkin[q.key] === opt ? active : inactive}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}

      <p className={`text-center text-xs pt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
        You deserve your own compassion first 🌷
      </p>
    </div>
  );
}
