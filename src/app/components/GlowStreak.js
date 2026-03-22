"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function GlowStreak({
  week,
  animate,
  darkMode,
}) {

  const streak =
    week.filter(day => day.mood !== null).length;


  // 🎉 confetti when full week
  useEffect(() => {

    if (streak === 7) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

  }, [streak]);


  return (
    <div
      className={`p-6 rounded-2xl shadow-md text-center transition-colors duration-300
        ${
          darkMode
            ? "bg-gray-800 text-white"
            : "bg-white text-black"
        }
      `}
    >

      <p className="text-sm mb-2">
        🔥 Glow Streak
      </p>


      <h2
        className={`text-4xl font-bold transition-transform duration-300
          ${
            animate
              ? "scale-125 text-pink-500"
              : ""
          }
        `}
      >
        {streak} Days
      </h2>


      {/* dots */}
      <div className="flex justify-center gap-2 mt-4">

        {Array.from({ length: 7 }).map((_, index) => (

          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300
              ${
                index < streak
                  ? "bg-pink-500"
                  : darkMode
                  ? "bg-gray-600"
                  : "bg-gray-300"
              }
            `}
          />

        ))}

      </div>

    </div>
  );
}