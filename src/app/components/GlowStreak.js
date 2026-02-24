export default function GlowStreak({ week, setWeek }) {
    const totalDays = 7;
    const streak = week.filter(day => day.mood !== null).length;
  
    return (
      <div className="max-w-md mx-auto mt-6 px-4">
        <div className="relative rounded-3xl p-6 bg-gradient-to-br from-pink-200 via-purple-200 to-pink-100 shadow-xl overflow-hidden">
          
          {/* Soft Glow Effect */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/30 rounded-full blur-3xl"></div>
  
          <div className="relative z-10 text-center space-y-3">
            
            <p className="text-sm font-medium text-gray-700 tracking-wide">
              🔥 Glow Streak
            </p>
  
            <h2 className="text-5xl font-bold text-gray-900">
              {streak} Days
            </h2>
  
            <p className="text-sm text-gray-600">
              Small habits. Big glow-up.
            </p>
  
            {/* Weekly Progress */}
            <div className="flex justify-center gap-2 pt-3">
              {Array.from({ length: totalDays }).map((_, index) => (
                <div
                  key={index}
                  className={`w-2.5 h-2.5 gap-3 rounded-full transition-all duration-300 ${
                    index < streak
                      ? "bg-pink-500 shadow-md"
                      : "bg-white/60"
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  