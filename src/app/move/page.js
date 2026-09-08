"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Sun, Moon, Clock, Filter, History } from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";
import BottomNav from "../components/BottomNav";
import {
  WORKOUTS, CATEGORIES, DURATIONS, DIFFICULTIES, GOALS,
  exerciseCount, categoryMeta,
} from "../../lib/workouts";

export default function MovePage() {
  const { darkMode, toggle } = useDarkMode();

  const [category,   setCategory]   = useState("all");
  const [duration,   setDuration]   = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [goal,       setGoal]       = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return WORKOUTS.filter((w) => {
      if (category !== "all" && w.category !== category) return false;
      if (duration && (duration === 30 ? w.duration < 30 : w.duration !== duration)) return false;
      if (difficulty && w.difficulty !== difficulty) return false;
      if (goal && w.goal !== goal) return false;
      return true;
    });
  }, [category, duration, difficulty, goal]);

  const card = darkMode ? "glass-card-dark" : "glass-card";
  const pill = (active) =>
    `flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold border transition-all
    ${active ? "bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white border-transparent" : darkMode ? "bg-white/8 text-gray-300 border-white/10 hover:bg-white/14" : "bg-white/60 text-gray-500 border-white/70 hover:bg-white/85"}`;

  const clearFilters = () => { setDuration(null); setDifficulty(null); setGoal(null); };
  const activeFilters = [duration, difficulty, goal].filter(Boolean).length;

  return (
    <main className={`relative min-h-screen pb-28 overflow-hidden transition-colors duration-500
      ${darkMode ? "bg-[radial-gradient(ellipse_at_top,_#2d0a2e_0%,_#140a1e_55%,_#0a0810_100%)]" : "bg-[radial-gradient(ellipse_at_top,_#ffe4f0_0%,_#f3e8ff_50%,_#fff5f7_100%)]"}`}>
      <div className={`absolute top-[-80px] right-[-80px] w-[380px] h-[380px] rounded-full blur-[110px] opacity-30 animate-float-slow pointer-events-none ${darkMode ? "bg-fuchsia-950" : "bg-fuchsia-200"}`} />
      <div className={`absolute bottom-0 left-[-60px] w-[300px] h-[300px] rounded-full blur-[90px] opacity-20 animate-float pointer-events-none ${darkMode ? "bg-purple-950" : "bg-purple-200"}`} />

      {/* Header */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-6">
        <div className={`flex items-center justify-between px-5 py-3.5 rounded-2xl ${card}`}>
          <div>
            <p className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? "text-fuchsia-400" : "text-fuchsia-500"}`}>Move Your Body</p>
            <h1 className="text-xl font-bold gradient-text-love">Move 🏃‍♀️</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/move/history" className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all hover:scale-105 ${darkMode ? "bg-white/8 text-gray-300 border-white/10" : "bg-white/60 text-gray-500 border-white/70"}`}>
              <History size={13} /> History
            </Link>
            <button onClick={toggle} className={`p-2.5 rounded-xl border transition-all hover:scale-105 ${darkMode ? "bg-white/8 text-yellow-300 border-white/10" : "bg-black/5 text-gray-500 border-black/8"}`}>
              {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 mt-5 space-y-4">

        <p className={`text-sm text-center ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          Movement is a gift to your body — not a punishment 💗
        </p>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button onClick={() => setCategory("all")} className={pill(category === "all")}>✨ All</button>
          {CATEGORIES.map((c) => (
            <button key={c.id} onClick={() => setCategory(c.id)} className={pill(category === c.id)}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        {/* Filter toggle */}
        <div className="flex items-center justify-between">
          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${darkMode ? "bg-white/8 text-gray-300 border-white/10" : "bg-white/60 text-gray-500 border-white/70"}`}>
            <Filter size={13} /> Filters {activeFilters > 0 && <span className="ml-1 px-1.5 rounded-full bg-fuchsia-500 text-white text-[9px]">{activeFilters}</span>}
          </button>
          {activeFilters > 0 && <button onClick={clearFilters} className="text-xs text-fuchsia-400 font-semibold hover:underline">Clear</button>}
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className={`rounded-3xl p-5 space-y-4 animate-fade-in-up ${card}`}>
            <div>
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Duration</p>
              <div className="flex gap-2 flex-wrap">
                {DURATIONS.map((d) => (
                  <button key={d} onClick={() => setDuration(duration === d ? null : d)} className={pill(duration === d)}>
                    {d === 30 ? "30 min+" : `${d} min`}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Difficulty</p>
              <div className="flex gap-2 flex-wrap">
                {DIFFICULTIES.map((d) => (
                  <button key={d} onClick={() => setDifficulty(difficulty === d ? null : d)} className={pill(difficulty === d)}>{d}</button>
                ))}
              </div>
            </div>
            <div>
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Goal</p>
              <div className="flex gap-2 flex-wrap">
                {GOALS.map((g) => (
                  <button key={g} onClick={() => setGoal(goal === g ? null : g)} className={pill(goal === g)}>{g}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Workout cards */}
        {filtered.length === 0 ? (
          <div className={`rounded-3xl p-10 text-center ${card}`}>
            <p className="text-3xl mb-2">🔍</p>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No workouts match — try clearing filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((w, i) => {
              const cat = categoryMeta(w.category);
              return (
                <Link key={w.id} href={`/move/${w.id}`}
                  className={`rounded-3xl p-5 flex flex-col animate-fade-in-up hover:scale-[1.02] transition-all ${card}`}
                  style={{ animationDelay: `${i * 40}ms` }}>
                  <div className={`h-20 -mx-5 -mt-5 mb-4 rounded-t-3xl bg-gradient-to-r ${w.color} flex items-center justify-center`}>
                    <span className="text-4xl">{cat.icon}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${darkMode ? "bg-white/10 text-gray-300" : "bg-gray-100 text-gray-500"}`}>{w.difficulty}</span>
                    <span className={`text-[10px] flex items-center gap-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}><Clock size={10} /> {w.duration} min</span>
                  </div>
                  <h3 className={`text-base font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{w.name}</h3>
                  <p className={`text-xs mt-1 leading-snug flex-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{w.desc}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className={`text-[10px] font-semibold ${darkMode ? "text-fuchsia-300" : "text-fuchsia-500"}`}>{w.goal}</span>
                    <span className={`text-[10px] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{exerciseCount(w)} moves</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav darkMode={darkMode} />
    </main>
  );
}
