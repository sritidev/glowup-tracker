'use client'

export default function DailySummary({selectMood,hydration,movement,energy}){
    if (!selectMood && !hydration && !movement && !energy) return null;

    return (
        <div className="max-w-md mx-auto mt-6 bg-white p-5 rounded-3xl shadow-md space-y-2">
      <h3 className="text-lg font-semibold text-center">✨ Today’s Summary</h3>

      {selectMood && (
        <p>💖 Mood: <span className="font-medium">{selectMood.label} {selectMood.emoji}</span></p>
      )}
      {hydration && <p>💧 Hydration: <span className="font-medium">{hydration}</span></p>}
      {movement && <p>🏃 Movement: <span className="font-medium">{movement}</span></p>}
      {energy && <p>⚡ Energy: <span className="font-medium">{energy}</span></p>}

      <p className="text-xs text-center text-gray-400 pt-2">You showed up for yourself today 🌷</p>
    </div>
    )
}
