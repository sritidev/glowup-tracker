"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Dumbbell, Play } from "lucide-react";
import { useDarkMode } from "../../hooks/useDarkMode";
import { getWorkout, workoutSeconds, exerciseCount, categoryMeta } from "../../../lib/workouts";
import WorkoutSession from "../../components/move/WorkoutSession";
import BottomNav from "../../components/BottomNav";

export default function WorkoutDetail() {
  const { darkMode } = useDarkMode();
  const params = useParams();
  const workout = getWorkout(params.id);
  const [started, setStarted] = useState(false);

  if (!workout) {
    return (
      <main className={`relative min-h-screen flex items-center justify-center px-4 ${darkMode ? "bg-[radial-gradient(ellipse_at_top,_#2d0a2e,_#0a0810)]" : "bg-[radial-gradient(ellipse_at_top,_#ffe4f0,_#fff5f7)]"}`}>
        <div className={`rounded-3xl p-10 text-center ${darkMode ? "glass-card-dark" : "glass-card"}`}>
          <p className="text-4xl mb-3">🤷‍♀️</p>
          <p className={`text-sm mb-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Workout not found</p>
          <Link href="/move" className="px-6 py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-fuchsia-500 to-purple-500">Back to Move</Link>
        </div>
      </main>
    );
  }

  if (started) {
    return <WorkoutSession workout={workout} darkMode={darkMode} onExit={() => setStarted(false)} />;
  }

  const cat = categoryMeta(workout.category);
  const totalMin = Math.round(workoutSeconds(workout) / 60);
  const card = darkMode ? "glass-card-dark" : "glass-card";

  return (
    <main className={`relative min-h-screen pb-28 overflow-hidden transition-colors duration-500
      ${darkMode ? "bg-[radial-gradient(ellipse_at_top,_#2d0a2e_0%,_#140a1e_55%,_#0a0810_100%)]" : "bg-[radial-gradient(ellipse_at_top,_#ffe4f0_0%,_#f3e8ff_50%,_#fff5f7_100%)]"}`}>
      <div className={`absolute top-[-80px] right-[-80px] w-[380px] h-[380px] rounded-full blur-[110px] opacity-30 animate-float-slow pointer-events-none ${darkMode ? "bg-fuchsia-950" : "bg-fuchsia-200"}`} />

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 pt-6">
        <Link href="/move" className={`inline-flex items-center gap-1.5 text-sm font-semibold mb-4 ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
          <ArrowLeft size={16} /> Back to Move
        </Link>

        {/* Hero */}
        <div className={`rounded-3xl overflow-hidden ${card}`}>
          <div className={`h-32 bg-gradient-to-r ${workout.color} flex items-center justify-center`}>
            <span className="text-6xl">{cat.icon}</span>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${darkMode ? "bg-white/10 text-gray-300" : "bg-gray-100 text-gray-500"}`}>{workout.difficulty}</span>
              <span className={`text-[11px] flex items-center gap-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}><Clock size={11} /> {workout.duration} min</span>
              <span className={`text-[11px] font-semibold ${darkMode ? "text-fuchsia-300" : "text-fuchsia-500"}`}>{workout.goal}</span>
            </div>
            <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{workout.name}</h1>
            <p className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{workout.desc}</p>
          </div>
        </div>

        {/* Exercises list */}
        <div className={`rounded-3xl p-6 mt-4 ${card}`}>
          <div className="flex items-center gap-2 mb-4">
            <Dumbbell size={16} className={darkMode ? "text-fuchsia-300" : "text-fuchsia-500"} />
            <h2 className={`text-base font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
              {exerciseCount(workout)} exercises · ~{totalMin} min
            </h2>
          </div>
          <div className="space-y-2">
            {workout.exercises.map((ex, i) => (
              <div key={i} className={`flex items-center justify-between px-4 py-3 rounded-2xl
                ${ex.type === "rest"
                  ? darkMode ? "bg-white/4 border border-white/6" : "bg-white/40 border border-white/50"
                  : darkMode ? "bg-white/6 border border-white/8" : "bg-white/55 border border-white/65"}`}>
                <span className={`text-sm flex items-center gap-2.5 ${ex.type === "rest" ? (darkMode ? "text-gray-500" : "text-gray-400") : (darkMode ? "text-gray-200" : "text-gray-700")}`}>
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold ${ex.type === "rest" ? (darkMode ? "bg-white/8 text-gray-500" : "bg-gray-100 text-gray-400") : "bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white"}`}>{i + 1}</span>
                  {ex.name}
                </span>
                <span className={`text-xs font-semibold ${ex.type === "rest" ? (darkMode ? "text-gray-500" : "text-gray-400") : (darkMode ? "text-fuchsia-300" : "text-fuchsia-500")}`}>{ex.seconds}s</span>
              </div>
            ))}
          </div>
        </div>

        {/* Start */}
        <button onClick={() => setStarted(true)}
          className="w-full mt-4 py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2 bg-gradient-to-r from-fuchsia-500 to-purple-500 shadow-lg shadow-fuchsia-400/30 transition-all hover:scale-[1.02] active:scale-[0.98]">
          <Play size={18} /> Start Workout
        </button>
      </div>

      <BottomNav darkMode={darkMode} />
    </main>
  );
}
