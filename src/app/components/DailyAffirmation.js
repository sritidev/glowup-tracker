"use client";

import { useState, useEffect } from "react";

const AFFIRMATIONS = [
  "I am worthy of love exactly as I am 🌸",
  "I choose myself, today and every day 💕",
  "My feelings are valid and I honor them ✨",
  "I am enough — always have been, always will be 🌟",
  "I treat myself with the kindness I deserve 💗",
  "Every small step I take is progress 🌱",
  "I release what no longer serves me with love 🦋",
  "I am proud of how far I have come 🌈",
  "My body deserves rest, nourishment, and care 🌿",
  "I am the author of my own story 💫",
  "Loving myself is an act of courage 🔥",
  "I am allowed to take up space 🌺",
  "Peace begins within me 🕊️",
  "I forgive myself and choose to grow 🌼",
  "Today I choose joy, gently 💛",
];

export default function DailyAffirmation({ darkMode }) {
  const [affirmation, setAffirmation] = useState("");
  const [animating, setAnimating] = useState(false);

  // Pick a consistent daily affirmation (changes each day)
  useEffect(() => {
    const dayIndex = new Date().getDay() + new Date().getDate();
    setAffirmation(AFFIRMATIONS[dayIndex % AFFIRMATIONS.length]);
  }, []);

  const shuffle = () => {
    setAnimating(true);
    setTimeout(() => {
      const next = AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)];
      setAffirmation(next);
      setAnimating(false);
    }, 280);
  };

  return (
    <div className={`rounded-3xl p-6 ${darkMode ? "glass-card-dark" : "glass-card"}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? "text-rose-400" : "text-rose-400"}`}>
            Daily Affirmation
          </p>
          <h3 className={`text-base font-bold mt-0.5 ${darkMode ? "text-white" : "text-gray-800"}`}>
            A message for you 💌
          </h3>
        </div>
        <button
          onClick={shuffle}
          title="New affirmation"
          className={`
            w-9 h-9 rounded-xl flex items-center justify-center text-base
            transition-all duration-200 hover:scale-110 active:scale-95
            ${darkMode ? "bg-white/8 border border-white/10 hover:bg-white/15" : "bg-white/60 border border-white/70 hover:bg-white/90"}
          `}
        >
          🔀
        </button>
      </div>

      {/* Affirmation quote */}
      <div className={`
        relative px-5 py-5 rounded-2xl text-center
        transition-opacity duration-300
        ${animating ? "opacity-0" : "opacity-100"}
        ${darkMode ? "bg-white/6 border border-white/8" : "bg-white/55 border border-rose-100/60"}
      `}>
        {/* Decorative quotes */}
        <span className={`absolute top-2 left-3 text-3xl leading-none select-none ${darkMode ? "text-rose-700" : "text-rose-200"}`}>"</span>
        <p className={`text-sm font-semibold leading-relaxed px-3 ${darkMode ? "text-gray-100" : "text-gray-700"}`}>
          {affirmation}
        </p>
        <span className={`absolute bottom-1 right-3 text-3xl leading-none select-none ${darkMode ? "text-rose-700" : "text-rose-200"}`}>"</span>
      </div>

      <p className={`text-center text-[10px] mt-3 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
        Tap 🔀 for a new reminder anytime
      </p>
    </div>
  );
}
