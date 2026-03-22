"use client";

export default function WeeklyPreview({ week, darkMode }) {

  return (
    <div
      className={`max-w-md mx-auto mt-6 p-4 rounded-2xl shadow-md 
      transition-colors duration-300 ${
        darkMode
          ? "bg-gray-800 text-white"
          : "bg-white text-black"
      }`}
    >
      <h3 className="text-lg font-semibold mb-4 text-center">
        Weekly Mood
      </h3>

      <div className="flex justify-between">
        {week.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-1">

            <span
              className={`text-xs ${
                darkMode
                  ? "text-gray-300"
                  : "text-gray-500"
              }`}
            >
              {item.day}
            </span>

            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                darkMode
                  ? "bg-gray-700"
                  : "bg-[#f7efe7]"
              }`}
            >
              {item.mood ? item.mood : "—"}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}