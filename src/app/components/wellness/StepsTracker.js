"use client";

import { useState } from "react";
import { Footprints, Minus, Pencil, Check } from "lucide-react";

const RING = 2 * Math.PI * 44;

export default function StepsTracker({ steps, goal, onChange, onGoalChange, darkMode }) {
  const [editing, setEditing] = useState(false);
  const [goalDraft, setGoalDraft] = useState(goal);
  const [manual, setManual] = useState("");

  const pct = Math.min(steps / goal, 1);
  const reached = steps >= goal;

  const add = (n) => onChange(Math.max(0, steps + n));

  const saveManual = () => {
    const n = parseInt(manual, 10);
    if (!isNaN(n)) onChange(Math.max(0, n));
    setManual("");
  };

  const saveGoal = () => {
    const g = parseInt(goalDraft, 10);
    if (!isNaN(g) && g > 0) onGoalChange(g);
    setEditing(false);
  };

  const card = darkMode ? "glass-card-dark" : "glass-card";
  const inp = `px-3 py-2 rounded-xl text-sm border outline-none ${darkMode ? "bg-white/6 border-white/10 text-white placeholder:text-gray-500" : "bg-white/60 border-white/70 text-gray-700 placeholder:text-gray-400"}`;

  return (
    <div className={`rounded-3xl p-6 ${card}`}>
      <div className="flex items-center justify-between mb-1">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? "text-teal-400" : "text-teal-500"}`}>Steps</p>
          <h3 className={`text-base font-bold mt-0.5 flex items-center gap-1.5 ${darkMode ? "text-white" : "text-gray-800"}`}>
            <Footprints size={16} className={darkMode ? "text-teal-400" : "text-teal-500"} /> Daily steps
          </h3>
        </div>
        <button onClick={() => { setGoalDraft(goal); setEditing(!editing); }}
          className={`p-2 rounded-xl border transition-all hover:scale-105 ${darkMode ? "bg-white/8 text-gray-300 border-white/10" : "bg-white/60 text-gray-500 border-white/70"}`}>
          <Pencil size={13} />
        </button>
      </div>

      {/* Ring */}
      <div className="flex justify-center my-4">
        <div className="relative w-36 h-36">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="none" stroke={darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)"} strokeWidth="8" />
            <circle cx="50" cy="50" r="44" fill="none" stroke="url(#stepsGrad)" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={RING} strokeDashoffset={RING * (1 - pct)} className="transition-all duration-700" />
            <defs>
              <linearGradient id="stepsGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2dd4bf" /><stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-black ${darkMode ? "text-white" : "text-gray-800"}`}>{steps.toLocaleString()}</span>
            <span className={`text-[11px] ${darkMode ? "text-gray-400" : "text-gray-500"}`}>/ {goal.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Goal editor */}
      {editing ? (
        <div className="flex items-center gap-2 mb-3">
          <label className={`text-xs font-semibold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Goal</label>
          <input type="number" min={1000} step={500} value={goalDraft} onChange={(e) => setGoalDraft(e.target.value)} className={`${inp} flex-1`} />
          <button onClick={saveGoal} className="p-2.5 rounded-xl text-white bg-gradient-to-r from-teal-500 to-sky-500"><Check size={14} /></button>
        </div>
      ) : (
        <>
          {/* Quick add */}
          <div className="flex gap-2 mb-2">
            {[1000, 2500, 5000].map((n) => (
              <button key={n} onClick={() => add(n)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-teal-500 to-sky-500 shadow-md hover:scale-[1.03] active:scale-[0.97] transition-all">
                +{n >= 1000 ? `${n / 1000}k` : n}
              </button>
            ))}
            <button onClick={() => add(-1000)}
              className={`px-3 py-2.5 rounded-xl border transition-all hover:scale-105 ${darkMode ? "bg-white/8 text-gray-300 border-white/10" : "bg-white/60 text-gray-500 border-white/70"}`}>
              <Minus size={14} />
            </button>
          </div>

          {/* Manual set */}
          <div className="flex gap-2">
            <input type="number" min={0} placeholder="Set exact count…" value={manual}
              onChange={(e) => setManual(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveManual()}
              className={`${inp} flex-1`} />
            <button onClick={saveManual} disabled={manual === ""}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border disabled:opacity-40 ${darkMode ? "bg-white/8 text-gray-200 border-white/10" : "bg-white/60 text-gray-600 border-white/70"}`}>
              Set
            </button>
          </div>
        </>
      )}

      {reached && <p className="text-center text-xs mt-3 font-medium text-teal-400">Goal reached — look at you go 🚶‍♀️✨</p>}

      <p className={`text-[10px] mt-3 text-center ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
        Log steps from your phone or watch — movement is a gift 💗
      </p>
    </div>
  );
}
