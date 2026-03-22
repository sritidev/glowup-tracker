'use client'

export default function DailySummary({
  selectMood,
  hydration,
  movement,
  energy,
  darkMode,
}) {

  if (!selectMood && !hydration && !movement && !energy) return null;

  return (
    <div
      className={`max-w-md mx-auto mt-6 p-5 rounded-3xl shadow-md space-y-2 transition-colors duration-300
        ${darkMode
          ? "bg-gray-800 text-white"
          : "bg-white text-black"
        }
      `}
    >

      <h3 className="text-lg font-semibold text-center">
        ✨ Today’s Summary
      </h3>


      {selectMood && (
        <p>
          💖 Mood:
          <span className="font-medium">
            {" "}
            {selectMood.label} {selectMood.emoji}
          </span>
        </p>
      )}

      {hydration && (
        <p>
          💧 Hydration:
          <span className="font-medium"> {hydration}</span>
        </p>
      )}

      {movement && (
        <p>
          🏃 Movement:
          <span className="font-medium"> {movement}</span>
        </p>
      )}

      {energy && (
        <p>
          ⚡ Energy:
          <span className="font-medium"> {energy}</span>
        </p>
      )}


      <p
        className={`text-xs text-center pt-2 ${
          darkMode ? "text-gray-300" : "text-gray-400"
        }`}
      >
        You showed up for yourself today 🌷
      </p>

    </div>
  );
}