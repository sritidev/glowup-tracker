'use client'
import { useState } from "react";

export default function MoodSelector() {
  const [selectMood, setSelectMood] = useState(null);
  const [note, setNote] = useState("");

  const moods = [
    { emoji: "😁", label: "Happy" },
    { emoji: "😊", label: "Calm" },
    { emoji: "😐", label: "Okay" },
    { emoji: "🙁", label: "Low" },
    { emoji: "😠", label: "Stressed" },
  ];

  return (
    <div className="max-w-md mx-auto bg-[#f7efe7] min-h-screen p-5 font-sans">
      
      {/* Header */}
      <p className="text-lg text-pink-500 font-semi-bold">Hello, Jenny</p>
      <h1 className="text-3xl leading-snug font-semibold mt-1">
        How do you feel about your <span className="font-bold">current emotions?</span>
      </h1>

      

      {/* Mood Section */}
      <h2 className="mt-8 mb-3 font-semibold text-gray-700">Daily Mood Log</h2>
      <div className="flex justify-between">
        {moods.map((mood, index) => (
          <button
            key={index}
            onClick={() => setSelectMood(mood)}
            className={`w-12 h-12 rounded-full text-2xl flex items-center justify-center transition 
            ${selectMood?.label === mood.label 
              ? "bg-white shadow-md scale-110" 
              : "bg-[#e8ded6]"}`}
          >
            {mood.emoji}
          </button>
        ))}
      </div>

      {/* Selected Mood Display */}
      <div className="mt-8 bg-white rounded-2xl p-5 shadow-sm">
        {selectMood ? (
          <p className="text-lg">
            Today you're feeling <span className="font-semibold">{selectMood.label}</span> {selectMood.emoji}
          </p>
        ) : (
          <p className="text-gray-400">No mood selected yet</p>
        )}
      </div>

    </div>
  );
}
