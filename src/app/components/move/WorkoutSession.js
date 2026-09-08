"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { Pause, Play, SkipForward, SkipBack, RotateCcw, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { workoutSeconds, exerciseCount } from "../../../lib/workouts";
import { FEELINGS } from "../../../lib/workouts";
import { todayISO } from "../../../lib/wellness";

const RING = 2 * Math.PI * 52;

export default function WorkoutSession({ workout, darkMode, onExit }) {
  const { user, supabase } = useAuth();
  const phases = workout.exercises;

  const [idx,      setIdx]      = useState(0);
  const [seconds,  setSeconds]  = useState(phases[0].seconds);
  const [running,  setRunning]  = useState(true);
  const [done,     setDone]     = useState(false);
  const [feeling,  setFeeling]  = useState(null);
  const [saved,    setSaved]    = useState(false);
  const intervalRef = useRef(null);

  const phase = phases[idx];
  const isRest = phase?.type === "rest";
  const progress = phase ? 1 - seconds / phase.seconds : 0;

  const finish = useCallback(() => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setDone(true);
    confetti({ particleCount: 220, spread: 100, origin: { y: 0.5 }, colors: ["#fb7bb2", "#c026d3", "#a855f7", "#e879f9"] });
  }, []);

  // Tick
  useEffect(() => {
    if (!running || done) return;
    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          // advance
          setIdx((prevIdx) => {
            if (prevIdx + 1 >= phases.length) { finish(); return prevIdx; }
            const next = prevIdx + 1;
            setSeconds(phases[next].seconds);
            return next;
          });
          return phases[Math.min(idx + 1, phases.length - 1)].seconds;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running, done, idx, phases, finish]);

  const goTo = (nextIdx) => {
    if (nextIdx < 0 || nextIdx >= phases.length) return;
    setIdx(nextIdx);
    setSeconds(phases[nextIdx].seconds);
  };

  const restart = () => { setIdx(0); setSeconds(phases[0].seconds); setRunning(true); setDone(false); };

  const saveWorkout = async () => {
    if (user) {
      await supabase.from("workouts").insert({
        user_id:     user.id,
        workout_id:  workout.id,
        workout_name: workout.name,
        category:    workout.category,
        duration_min: Math.round(workoutSeconds(workout) / 60),
        feeling:     feeling?.label ?? null,
        logged_date: todayISO(),
      });
    }
    setSaved(true);
  };

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const bg = darkMode ? "bg-[radial-gradient(ellipse_at_top,_#2d0a2e_0%,_#140a1e_55%,_#0a0810_100%)]" : "bg-[radial-gradient(ellipse_at_top,_#ffe4f0_0%,_#f3e8ff_50%,_#fff5f7_100%)]";
  const card = darkMode ? "glass-card-dark" : "glass-card";

  /* ── Completion screen ── */
  if (done) {
    return (
      <main className={`relative min-h-screen flex items-center justify-center px-4 overflow-hidden ${bg}`}>
        <div className={`absolute top-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full blur-[110px] opacity-40 animate-float-slow pointer-events-none ${darkMode ? "bg-fuchsia-950" : "bg-fuchsia-200"}`} />
        <div className={`relative z-10 w-full max-w-md rounded-[32px] p-8 text-center animate-fade-in-up ${card}`}>
          {!saved ? (
            <>
              <div className="text-6xl mb-3 animate-heartbeat">🌸</div>
              <h1 className="text-2xl font-bold gradient-text-love">Workout complete!</h1>
              <p className={`text-sm mt-1 ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
                {Math.round(workoutSeconds(workout) / 60)} minutes of movement 💗
              </p>

              <p className={`text-sm font-semibold mt-7 mb-3 ${darkMode ? "text-white" : "text-gray-700"}`}>
                How did movement make you feel?
              </p>
              <div className="grid grid-cols-3 gap-2.5">
                {FEELINGS.map((f) => (
                  <button key={f.label} onClick={() => setFeeling(f)}
                    className={`flex flex-col items-center gap-1 py-3 rounded-2xl border transition-all
                      ${feeling?.label === f.label
                        ? "bg-gradient-to-br from-fuchsia-500 to-purple-500 text-white border-transparent scale-105 shadow-md"
                        : darkMode ? "bg-white/6 border-white/10 hover:bg-white/12" : "bg-white/55 border-white/65 hover:bg-white/80"}`}>
                    <span className="text-2xl">{f.emoji}</span>
                    <span className={`text-[10px] font-medium ${feeling?.label === f.label ? "text-white" : darkMode ? "text-gray-300" : "text-gray-500"}`}>{f.label}</span>
                  </button>
                ))}
              </div>

              <button onClick={saveWorkout} disabled={!feeling}
                className="w-full mt-7 py-3.5 rounded-2xl font-bold text-white text-sm bg-gradient-to-r from-fuchsia-500 to-purple-500 shadow-lg disabled:opacity-40 transition-all hover:scale-[1.02]">
                Save & Finish 💾
              </button>
            </>
          ) : (
            <>
              <div className="text-6xl mb-3">💗</div>
              <h1 className="text-2xl font-bold gradient-text-love">You showed up for yourself.</h1>
              <p className={`text-sm mt-2 ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
                {feeling && `Feeling ${feeling.label.toLowerCase()} ${feeling.emoji}`} — that&apos;s a beautiful thing 🌷
              </p>
              <div className="flex flex-col gap-3 mt-7">
                <Link href="/move/history" className="py-3.5 rounded-2xl font-bold text-white text-sm bg-gradient-to-r from-fuchsia-500 to-purple-500 shadow-lg transition-all hover:scale-[1.02]">
                  View Movement History
                </Link>
                <Link href="/dashboard" className={`py-3.5 rounded-2xl font-semibold text-sm border ${darkMode ? "bg-white/8 text-gray-200 border-white/10" : "bg-white/50 text-gray-500 border-white/60"}`}>
                  Done
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    );
  }

  /* ── Active timer ── */
  return (
    <main className={`relative min-h-screen flex flex-col overflow-hidden ${bg}`}>
      <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-[130px] opacity-25 pointer-events-none ${isRest ? (darkMode ? "bg-sky-950" : "bg-sky-200") : (darkMode ? "bg-fuchsia-950" : "bg-fuchsia-200")}`} />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-6">
        <button onClick={onExit} className={`p-2.5 rounded-xl border ${darkMode ? "bg-white/8 text-gray-300 border-white/10" : "bg-white/60 text-gray-500 border-white/70"}`}>
          <X size={16} />
        </button>
        <p className={`text-sm font-semibold ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{workout.name}</p>
        <div className="w-10" />
      </div>

      {/* Center */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${isRest ? "text-sky-400" : darkMode ? "text-fuchsia-300" : "text-fuchsia-500"}`}>
          {isRest ? "Rest" : `Exercise ${phases.slice(0, idx + 1).filter((p) => p.type === "work").length} of ${exerciseCount(workout)}`}
        </p>
        <h1 className={`text-3xl font-black text-center mb-8 ${darkMode ? "text-white" : "text-gray-800"}`}>{phase.name}</h1>

        {/* Ring */}
        <div className="relative w-64 h-64">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke={darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)"} strokeWidth="7" />
            <circle cx="60" cy="60" r="52" fill="none" stroke={isRest ? "#38bdf8" : "url(#wsGrad)"} strokeWidth="7" strokeLinecap="round"
              strokeDasharray={RING} strokeDashoffset={RING * (1 - progress)} style={{ transition: "stroke-dashoffset 1s linear" }} />
            <defs>
              <linearGradient id="wsGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#e879f9" /><stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-6xl font-black ${darkMode ? "text-white" : "text-gray-800"}`}>{fmt(seconds)}</span>
          </div>
        </div>

        {/* Phase progress bar */}
        <div className="w-full max-w-xs mt-8">
          <div className={`h-2 rounded-full overflow-hidden ${darkMode ? "bg-white/10" : "bg-gray-200"}`}>
            <div className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-500 transition-all duration-500"
              style={{ width: `${((idx + 1) / phases.length) * 100}%` }} />
          </div>
          <p className={`text-center text-[11px] mt-2 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
            Step {idx + 1} of {phases.length}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="relative z-10 flex items-center justify-center gap-3 px-6 pb-10">
        <button onClick={() => goTo(idx - 1)} disabled={idx === 0}
          className={`p-4 rounded-2xl border disabled:opacity-30 transition-all hover:scale-105 ${darkMode ? "bg-white/8 text-gray-300 border-white/10" : "bg-white/60 text-gray-500 border-white/70"}`}>
          <SkipBack size={18} />
        </button>
        <button onClick={() => setRunning((r) => !r)}
          className="p-6 rounded-full text-white bg-gradient-to-r from-fuchsia-500 to-purple-500 shadow-lg shadow-fuchsia-400/30 transition-all hover:scale-105 active:scale-95">
          {running ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button onClick={() => (idx + 1 >= phases.length ? finish() : goTo(idx + 1))}
          className={`p-4 rounded-2xl border transition-all hover:scale-105 ${darkMode ? "bg-white/8 text-gray-300 border-white/10" : "bg-white/60 text-gray-500 border-white/70"}`}>
          <SkipForward size={18} />
        </button>
        <button onClick={restart}
          className={`p-4 rounded-2xl border transition-all hover:scale-105 ${darkMode ? "bg-white/8 text-gray-300 border-white/10" : "bg-white/60 text-gray-500 border-white/70"}`}>
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Finish early */}
      <button onClick={finish} className={`relative z-10 mx-auto mb-8 text-xs font-semibold ${darkMode ? "text-gray-400 hover:text-fuchsia-300" : "text-gray-400 hover:text-fuchsia-500"}`}>
        Finish workout early
      </button>
    </main>
  );
}
