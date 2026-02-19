"use client";

export default function WeeklyPreview() {

  const week = [
    { day: "Mon", mood: "😁" },
    { day: "Tue", mood: "😊" },
    { day: "Wed", mood: "😐" },
    { day: "Thu", mood: "🙁" },
    { day: "Fri", mood: "😁" },
    { day: "Sat", mood: null },
    { day: "Sun", mood: null },
  ];

  return (
    <div className="max-w-md mx-auto mt-6 bg-white p-4 rounded-2xl shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-center">
        Weekly Mood
      </h3>

      <div className="flex justify-between">
        {week.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-1">
            <span className="text-xs text-gray-500">{item.day}</span>
            <div className="w-10 h-10 rounded-full bg-[#f7efe7] flex items-center justify-center">
              {item.mood ? item.mood : "—"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
