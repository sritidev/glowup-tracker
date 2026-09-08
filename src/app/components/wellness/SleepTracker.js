"use client";

import { useState } from "react";
import { Moon } from "lucide-react";
import { formatDuration } from "../../../lib/wellness";

// minutes between two "HH:MM" times, handling overnight
function diffMinutes(bed, wake) {
  const [bh, bm] = bed.split(":").map(Number);
  const [wh, wm] = wake.split(":").map(Number);
  let mins = (wh * 60 + wm) - (bh * 60 + bm);
  if (mins <= 0) mins += 24 * 60; // crossed midnight
  return mins;
}

export default function SleepTracker({ sleepMinutes, goal, onSave, darkMode }) {
  const [editing, setEditing] = useState(false);
  const [bed,  setBed]  = useState("23:00");
  const [wake, setWake] = useState("07:00");

  const goalReached = sleepMinutes != null && sleepMinutes >= goal;
  const preview = diffMinutes(bed, wake);

  const save = () => {
    onSave(diffMinutes(bed, wake));
    setEditing(false);
  };

  const timeInput = `px-3 py-2 rounded-xl text-sm border outline-none text-center ${
    darkMode ? "bg-white/6 border-white/10 text-white" : "bg-white/60 border-white/70 text-gray-700"
  }`;

  return (
    <div className={`rounded-3xl p-6 ${darkMode ? "glass-card-dark" : "glass-card"}`}>
      <div className="flex items-center justify-between mb-1">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? "text-indigo-400" : "text-indigo-500"}`}>
            Sleep
          </p>
          <h3 className={`text-base font-bold mt-0.5 ${darkMode ? "text-white" : "text-gray-800"}`}>
            🌙 Last night
          </h3>
        </div>
        <Moon size={22} className={darkMode ? "text-indigo-400" : "text-indigo-300"} />
      </div>

      {!editing ? (
        <>
          <div className="text-center py-3">
            <p className="text-4xl font-black gradient-text-love leading-none">
              {sleepMinutes != null ? formatDuration(sleepMinutes) : "—"}
            </p>
            <p className={`text-xs mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Goal: {formatDuration(goal)}
              {goalReached && <span className="text-emerald-400 font-semibold"> · reached 🌙</span>}
            </p>
          </div>

          {sleepMinutes != null && (
            <div className={`h-2 rounded-full overflow-hidden mb-4 ${darkMode ? "bg-white/10" : "bg-indigo-100"}`}>
              <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-400 transition-all duration-700"
                style={{ width: `${Math.min((sleepMinutes / goal) * 100, 100)}%` }} />
            </div>
          )}

          <button onClick={() => setEditing(true)}
            className="w-full py-3 rounded-2xl font-semibold text-white text-sm bg-gradient-to-r from-indigo-500 to-purple-500 shadow-md hover:scale-[1.02] transition-all">
            Log Sleep 🌙
          </button>
        </>
      ) : (
        <div className="space-y-4 mt-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <label className={`text-xs font-semibold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Bedtime</label>
              <input type="time" value={bed} onChange={(e) => setBed(e.target.value)} className={`${timeInput} w-full mt-1`} />
            </div>
            <div className="flex-1">
              <label className={`text-xs font-semibold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Wake up</label>
              <input type="time" value={wake} onChange={(e) => setWake(e.target.value)} className={`${timeInput} w-full mt-1`} />
            </div>
          </div>

          <p className={`text-center text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            That&apos;s <span className="font-bold gradient-text-love">{formatDuration(preview)}</span> of rest
          </p>

          <div className="flex gap-2">
            <button onClick={save}
              className="flex-1 py-3 rounded-2xl font-semibold text-white text-sm bg-gradient-to-r from-indigo-500 to-purple-500 shadow-md hover:scale-[1.02] transition-all">
              Save
            </button>
            <button onClick={() => setEditing(false)}
              className={`flex-1 py-3 rounded-2xl font-semibold text-sm border ${darkMode ? "bg-white/8 text-gray-200 border-white/10" : "bg-white/50 text-gray-500 border-white/60"}`}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
