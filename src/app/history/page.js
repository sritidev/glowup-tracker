"use client";

import { useEffect, useState } from "react";

export default function HistoryPage() {

  const [week, setWeek] = useState([]);

  useEffect(() => {
    const saved =
      localStorage.getItem("week");

    if (saved) {
      setWeek(JSON.parse(saved));
    }
  }, []);

  return (
    <main
      className="
        min-h-screen p-6
        bg-[#f7efe7]
        text-black

        dark:bg-black
        dark:text-white
      "
    >

      <h1 className="text-2xl text-center text-pink-500">
        History
      </h1>

      <div className="flex gap-3 justify-center mt-6">

        {week.map((d, i) => (
          <div key={i} className="text-center">

            <p>{d.day}</p>

            <div
              className="
                w-10 h-10 rounded-full
                flex items-center justify-center
                bg-white
                dark:bg-gray-700
              "
            >
              {d.mood || "-"}
            </div>

          </div>
        ))}

      </div>

    </main>
  );
}