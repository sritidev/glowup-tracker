"use client";

function computeScore({ mood, checkin, rituals, gratitude }) {
  let score = 0;
  if (mood) score += 20;
  const checkinFilled = Object.values(checkin).filter(Boolean).length;
  score += checkinFilled * 10; // up to 30
  score += Math.min(rituals.length * 5, 30); // up to 30
  const gratFilled = gratitude.filter((g) => g.trim() !== "").length;
  score += gratFilled * (20 / 3); // up to 20
  return Math.min(Math.round(score), 100);
}

const scoreLabel = (s) => {
  if (s >= 90) return { text: "Radiating love 💖",    color: "text-rose-400" };
  if (s >= 70) return { text: "Glowing beautifully 🌸", color: "text-pink-400" };
  if (s >= 50) return { text: "Blooming 🌼",           color: "text-purple-400" };
  if (s >= 25) return { text: "Taking gentle steps 🌱", color: "text-fuchsia-400" };
  return             { text: "Just showing up 💗",     color: "text-gray-400" };
};

export default function DailySummary({ mood, checkin, rituals, gratitude, darkMode }) {
  const hasData =
    mood ||
    Object.values(checkin).some(Boolean) ||
    rituals.length > 0 ||
    gratitude.some((g) => g.trim() !== "");

  if (!hasData) return null;

  const score = computeScore({ mood, checkin, rituals, gratitude });
  const label = scoreLabel(score);

  const rows = [
    mood && { icon: "💗", label: "Mood",          value: `${mood.label} ${mood.emoji}` },
    checkin.boundaries && { icon: "🛡️", label: "Boundaries", value: checkin.boundaries },
    checkin.kindness   && { icon: "💬", label: "Self-Talk",  value: checkin.kindness },
    checkin.rest       && { icon: "🌙", label: "Rest",       value: checkin.rest },
    rituals.length > 0 && { icon: "💆", label: "Rituals",    value: `${rituals.length} completed` },
    gratitude.filter((g) => g.trim()).length > 0 && {
      icon: "🙏", label: "Gratitude",
      value: `${gratitude.filter((g) => g.trim()).length}/3 entries`,
    },
  ].filter(Boolean);

  return (
    <div className={`rounded-3xl p-6 ${darkMode ? "glass-card-dark" : "glass-card"}`}>
      <p className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? "text-rose-400" : "text-rose-400"}`}>
        Today&apos;s Summary
      </p>
      <h3 className={`text-base font-bold mt-0.5 mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
        ✨ Your Self-Love Score
      </h3>

      {/* Score ring */}
      <div className="flex items-center gap-5 mb-5">
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="32" fill="none"
              stroke={darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}
              strokeWidth="8" />
            <circle cx="40" cy="40" r="32" fill="none"
              stroke="url(#loveGrad)" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${(score / 100) * 201} 201`}
              className="transition-all duration-700" />
            <defs>
              <linearGradient id="loveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fb7bb2" />
                <stop offset="100%" stopColor="#c026d3" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-black gradient-text-love">{score}</span>
            <span className={`text-[9px] ${darkMode ? "text-gray-400" : "text-gray-400"}`}>/ 100</span>
          </div>
        </div>
        <div>
          <p className={`text-sm font-bold ${label.color}`}>{label.text}</p>
          <p className={`text-xs mt-1 leading-snug ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Every point you scored is a small act of love for yourself 🌸
          </p>
        </div>
      </div>

      {/* Detail rows */}
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.label} className={`
            flex items-center justify-between px-4 py-2.5 rounded-xl
            ${darkMode ? "bg-white/6 border border-white/8" : "bg-white/55 border border-white/65"}
          `}>
            <span className={`text-xs flex items-center gap-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              <span>{row.icon}</span>{row.label}
            </span>
            <span className={`text-xs font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <p className={`text-xs text-center mt-4 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
        You showed up for yourself today — that&apos;s everything 🌷
      </p>
    </div>
  );
}
