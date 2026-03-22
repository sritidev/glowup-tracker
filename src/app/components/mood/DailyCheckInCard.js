"use client";


export default function DailyCheckInCard({hydration, 
  setHydration,
  movement, 
  setMovement,
  energy, 
  setEnergy,
  darkMode,
}) {

  const buttonBase =
    "px-4 py-2 rounded-full text-sm font-medium transition border";

    const active = darkMode
    ? "bg-purple-600 border-purple-500 text-white"
    : "bg-pink-200 border-pink-300";
  
  const inactive = darkMode
    ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
    : "bg-white border-gray-200 hover:bg-gray-50";

  return (
    <div
  className={`max-w-md mx-auto p-6 rounded-t-4xl mt-5 shadow-md space-y-6 transition-colors duration-300 ${
    darkMode
      ? "bg-gray-800 text-white"
      : "bg-[#dab2ff7d] text-black"
  }`}
>
      <h2 className="text-xl font-semibold text-center">🌸 Daily Check-In</h2>

      {/* Hydration */}
      <div>
        <p className={`text-sm mb-3 ${darkMode ? "text-gray-200" : ""}`}>Did you drink enough water today?</p>
        <div className="flex gap-2 flex-wrap">
          {["Yes 💧", "Almost 🙂", "Not really 😅"].map((option) => (
            <button
              key={option}
              onClick={() => setHydration(option)}
              className={`${buttonBase} ${
                hydration === option ? active : inactive
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Movement */}
      <div>
        <p className={`text-sm mb-3 ${darkMode ? "text-gray-200" : ""}`}>Did you move your body today?</p>
        <div className="flex gap-2 flex-wrap">
          {["Yes 🏃", "A little 🧘", "Rest day 🛋"].map((option) => (
            <button
              key={option}
              onClick={() => setMovement(option)}
              className={`${buttonBase} ${
                movement === option ? active : inactive
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Energy */}
      <div>
        <p className={`text-sm mb-3 ${darkMode ? "text-gray-200" : ""}`}>How is your energy right now?</p>
        <div className="flex gap-3">
          {["⚡", "🙂", "🥱"].map((emoji) => (
            <button
              key={emoji}
              onClick={() => setEnergy(emoji)}
              className={`w-12 h-12 flex items-center justify-center text-xl rounded-full border transition ${
                energy === emoji
                ? darkMode
                ? "bg-purple-600 border-purple-500 text-white"
                : "bg-purple-200 border-purple-300"
              : darkMode
                ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <p
  className={`text-center text-xs ${
    darkMode ? "text-gray-300" : "text-gray-500"
  }`}
>
        Every small step counts 💖
      </p>
    </div>
  );
}
