"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Sun, Moon, Play, Square, RotateCcw } from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";
import BottomNav from "../components/BottomNav";

const TECHNIQUES = [
  {
    id: "478",
    name: "4-7-8 Calm",
    emoji: "🌙",
    desc: "Reduces anxiety and helps you fall asleep",
    color: "from-indigo-500 to-purple-500",
    glow: "shadow-indigo-400/30",
    phases: [
      { label: "Inhale",  duration: 4, instruction: "Breathe in slowly through your nose…" },
      { label: "Hold",    duration: 7, instruction: "Hold your breath gently…" },
      { label: "Exhale",  duration: 8, instruction: "Breathe out completely through your mouth…" },
    ],
  },
  {
    id: "box",
    name: "Box Breathing",
    emoji: "⬜",
    desc: "Balances the nervous system and boosts focus",
    color: "from-sky-500 to-teal-500",
    glow: "shadow-sky-400/30",
    phases: [
      { label: "Inhale",  duration: 4, instruction: "Breathe in gently…" },
      { label: "Hold",    duration: 4, instruction: "Hold — feel steady…" },
      { label: "Exhale",  duration: 4, instruction: "Release slowly…" },
      { label: "Hold",    duration: 4, instruction: "Rest — you're safe…" },
    ],
  },
  {
    id: "44",
    name: "4-4 Energise",
    emoji: "⚡",
    desc: "Quick reset to feel alert and present",
    color: "from-rose-500 to-pink-500",
    glow: "shadow-rose-400/30",
    phases: [
      { label: "Inhale", duration: 4, instruction: "Breathe in, feel alive…" },
      { label: "Exhale", duration: 4, instruction: "Breathe out, release tension…" },
    ],
  },
  {
    id: "relax",
    name: "Deep Relax",
    emoji: "🌊",
    desc: "Long exhale activates the rest response",
    color: "from-emerald-500 to-teal-500",
    glow: "shadow-emerald-400/30",
    phases: [
      { label: "Inhale", duration: 5, instruction: "Deep breath in through the nose…" },
      { label: "Hold",   duration: 2, instruction: "Brief hold…" },
      { label: "Exhale", duration: 8, instruction: "Long, slow breath out…" },
    ],
  },
];

export default function BreathePage() {
  const { darkMode, toggle } = useDarkMode();
  const [selected,    setSelected]    = useState(TECHNIQUES[0]);
  const [running,     setRunning]     = useState(false);
  const [phaseIdx,    setPhaseIdx]    = useState(0);
  const [seconds,     setSeconds]     = useState(0);
  const [cycles,      setCycles]      = useState(0);
  const [totalSecs,   setTotalSecs]   = useState(0);
  const intervalRef = useRef(null);

  const phase = selected.phases[phaseIdx];
  const progress = phase ? (seconds / phase.duration) : 0;

  const stop = useCallback(() => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setPhaseIdx(0);
    setSeconds(0);
  }, []);

  const reset = useCallback(() => {
    stop();
    setCycles(0);
    setTotalSecs(0);
  }, [stop]);

  useEffect(() => {
    if (!running) return;

    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        const next = s + 1;
        setTotalSecs((t) => t + 1);
        if (next >= phase.duration) {
          setPhaseIdx((pi) => {
            const nextPi = (pi + 1) % selected.phases.length;
            if (nextPi === 0) setCycles((c) => c + 1);
            return nextPi;
          });
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [running, phase, selected.phases.length]);

  useEffect(() => { if (running) setSeconds(0); }, [phaseIdx, running]);

  const handleSelect = (t) => {
    reset();
    setSelected(t);
  };

  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;

  const ringCircumference = 2 * Math.PI * 52;
  const ringOffset = ringCircumference * (1 - progress);

  const scaleVal = phase?.label === "Inhale"
    ? 0.75 + progress * 0.55
    : phase?.label === "Exhale"
      ? 1.3 - progress * 0.55
      : running ? 1.3 : 0.85;

  return (
    <main className={`
      relative min-h-screen pb-28 overflow-hidden transition-colors duration-500
      ${darkMode
        ? "bg-[radial-gradient(ellipse_at_top,_#0a0818_0%,_#0f0a1e_60%,_#080810_100%)]"
        : "bg-[radial-gradient(ellipse_at_top,_#e8f4ff_0%,_#f0e8ff_50%,_#fff5f7_100%)]"
      }
    `}>
      {/* Blobs */}
      <div className={`absolute top-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full blur-[120px] opacity-25 animate-float-slow pointer-events-none ${darkMode ? "bg-indigo-950" : "bg-indigo-200"}`} />
      <div className={`absolute bottom-0 right-[-60px] w-[320px] h-[320px] rounded-full blur-[100px] opacity-20 animate-float pointer-events-none ${darkMode ? "bg-purple-950" : "bg-purple-200"}`} />

      {/* Header */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 pt-6">
        <div className={`flex items-center justify-between px-5 py-3.5 rounded-2xl ${darkMode ? "glass-card-dark" : "glass-card"}`}>
          <div>
            <p className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? "text-indigo-400" : "text-indigo-400"}`}>Mindful Breathing</p>
            <h1 className="text-xl font-bold gradient-text">Breathe 🫁</h1>
          </div>
          <button onClick={toggle} className={`p-2.5 rounded-xl border transition-all hover:scale-105 ${darkMode ? "bg-white/8 text-yellow-300 border-white/10" : "bg-black/5 text-gray-500 border-black/8"}`}>
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 mt-5 space-y-5">

        {/* Technique selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TECHNIQUES.map((t) => (
            <button key={t.id} onClick={() => handleSelect(t)}
              className={`rounded-2xl p-4 text-left border transition-all duration-200 hover:scale-[1.02]
                ${selected.id === t.id
                  ? `bg-gradient-to-br ${t.color} text-white border-transparent shadow-lg ${t.glow}`
                  : darkMode ? "glass-card-dark hover:bg-white/10" : "glass-card hover:bg-white/60"
                }`}>
              <div className="text-2xl mb-2">{t.emoji}</div>
              <p className={`text-xs font-bold leading-snug ${selected.id === t.id ? "text-white" : darkMode ? "text-gray-200" : "text-gray-700"}`}>{t.name}</p>
              <p className={`text-[10px] mt-0.5 leading-snug ${selected.id === t.id ? "text-white/70" : darkMode ? "text-gray-500" : "text-gray-400"}`}>{t.desc}</p>
            </button>
          ))}
        </div>

        {/* Breathing circle */}
        <div className={`rounded-3xl p-8 flex flex-col items-center gap-6 ${darkMode ? "glass-card-dark" : "glass-card"}`}>
          {/* Phase label */}
          <div className="text-center h-10 flex flex-col items-center justify-center">
            {running ? (
              <>
                <p className={`text-xl font-black gradient-text`}>{phase?.label}</p>
                <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{phase?.instruction}</p>
              </>
            ) : (
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                {cycles > 0 ? `${cycles} cycle${cycles > 1 ? "s" : ""} completed 🌸` : "Press play to begin"}
              </p>
            )}
          </div>

          {/* Animated circle */}
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* Ring SVG */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none"
                stroke={darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}
                strokeWidth="6" />
              {running && (
                <circle cx="60" cy="60" r="52" fill="none"
                  stroke={`url(#breatheGrad_${selected.id})`} strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringOffset}
                  style={{ transition: "stroke-dashoffset 0.9s linear" }}
                />
              )}
              <defs>
                <linearGradient id={`breatheGrad_${selected.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={selected.id === "box" ? "#0ea5e9" : selected.id === "44" ? "#f43f8a" : selected.id === "relax" ? "#10b981" : "#818cf8"} />
                  <stop offset="100%" stopColor={selected.id === "box" ? "#14b8a6" : selected.id === "44" ? "#ec4899" : selected.id === "relax" ? "#14b8a6" : "#a855f7"} />
                </linearGradient>
              </defs>
            </svg>

            {/* Blob that breathes */}
            <div
              className={`w-28 h-28 rounded-full bg-gradient-to-br ${selected.color} opacity-80 shadow-xl transition-transform duration-1000 ease-in-out`}
              style={{ transform: `scale(${scaleVal})` }}
            />

            {/* Timer in centre */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {running ? (
                <span className="text-3xl font-black text-white drop-shadow-md">
                  {phase.duration - seconds}
                </span>
              ) : (
                <span className="text-4xl">{selected.emoji}</span>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-3">
            <button onClick={running ? stop : () => setRunning(true)}
              className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r ${selected.color} shadow-lg hover:scale-[1.03] active:scale-[0.97] transition-all`}>
              {running ? <><Square size={15} /> Pause</> : <><Play size={15} /> {cycles > 0 ? "Resume" : "Start"}</>}
            </button>
            <button onClick={reset}
              className={`p-3.5 rounded-2xl border transition-all hover:scale-105 ${darkMode ? "bg-white/8 text-gray-300 border-white/10" : "bg-white/60 text-gray-500 border-white/70"}`}>
              <RotateCcw size={16} />
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-6 text-center">
            <div>
              <p className="text-lg font-black gradient-text">{cycles}</p>
              <p className={`text-[10px] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Cycles</p>
            </div>
            <div>
              <p className="text-lg font-black gradient-text">{mins}:{String(secs).padStart(2, "0")}</p>
              <p className={`text-[10px] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Time</p>
            </div>
            <div>
              <p className="text-lg font-black gradient-text">{selected.phases.length}</p>
              <p className={`text-[10px] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Phases</p>
            </div>
          </div>
        </div>

        {/* Phase guide */}
        <div className={`rounded-3xl p-6 ${darkMode ? "glass-card-dark" : "glass-card"}`}>
          <p className={`text-xs font-semibold uppercase tracking-widest mb-4 ${darkMode ? "text-indigo-400" : "text-indigo-400"}`}>
            How it works — {selected.name}
          </p>
          <div className="flex gap-3 flex-wrap">
            {selected.phases.map((p, i) => (
              <div key={i}
                className={`flex-1 min-w-[80px] px-4 py-3 rounded-2xl text-center border transition-all duration-500
                  ${running && phaseIdx === i
                    ? `bg-gradient-to-br ${selected.color} text-white border-transparent shadow-md`
                    : darkMode ? "bg-white/5 border-white/8" : "bg-white/50 border-white/65"
                  }`}>
                <p className={`text-xs font-bold ${running && phaseIdx === i ? "text-white" : darkMode ? "text-gray-200" : "text-gray-700"}`}>{p.label}</p>
                <p className={`text-xl font-black mt-0.5 ${running && phaseIdx === i ? "text-white" : "gradient-text"}`}>{p.duration}s</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tip */}
        <div className={`rounded-3xl px-5 py-4 text-center ${darkMode ? "glass-card-dark" : "glass-card"}`}>
          <p className={`text-xs leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            💡 Even 3 minutes of mindful breathing can reduce cortisol levels and calm your nervous system. You deserve this pause 🌸
          </p>
        </div>
      </div>

      <BottomNav darkMode={darkMode} />
    </main>
  );
}
