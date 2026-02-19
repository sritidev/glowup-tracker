export default function StreakCard () {
    const streak = 3; 
    return (
        <div className="max-w-md mx-auto mt-6 px-4">
          <div className="bg-gradient-to-r from-pink-200 to-purple-200 rounded-3xl p-6 text-center shadow-md">
            <p className="text-sm text-gray-600">🔥 Glow Streak</p>
            <h2 className="text-4xl font-bold mt-2">{streak} Days</h2>
            <p className="text-xs mt-2 text-gray-500">
              Small habits. Big glow-up.
            </p>
          </div>
        </div>
      );
}