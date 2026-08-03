"use client";

import Link from "next/link";
import { useDarkMode } from "./hooks/useDarkMode";
import BottomNav from "./components/BottomNav.js";
import { Sun, Moon } from "lucide-react";

const features = [
  {
    icon: "💗",
    title: "Daily Journal",
    desc: "Log your mood, check-in, gratitude & self-care rituals",
    href: "/dashboard",
    color: "from-rose-500 to-pink-500",
    bg: "bg-rose-400/15",
    border: "border-rose-300/30",
  },
  {
    icon: "📓",
    title: "My Journal",
    desc: "Write freely — your private, judgment-free space",
    href: "/journal",
    color: "from-purple-500 to-fuchsia-500",
    bg: "bg-purple-400/15",
    border: "border-purple-300/30",
  },
  {
    icon: "✨",
    title: "Love Quotes",
    desc: "Daily self-love quotes across 7 soul-nourishing categories",
    href: "/quotes",
    color: "from-amber-400 to-orange-400",
    bg: "bg-amber-400/15",
    border: "border-amber-300/30",
  },
  {
    icon: "🫁",
    title: "Breathe",
    desc: "Guided breathing — calm anxiety, boost focus, find peace",
    href: "/breathe",
    color: "from-sky-500 to-teal-400",
    bg: "bg-sky-400/15",
    border: "border-sky-300/30",
  },
  {
    icon: "📅",
    title: "History",
    desc: "See your weekly mood patterns and gratitude entries",
    href: "/history",
    color: "from-emerald-500 to-green-400",
    bg: "bg-emerald-400/15",
    border: "border-emerald-300/30",
  },
];

export default function Home() {
  const { darkMode, toggle } = useDarkMode();

  return (
    <main className={`
      relative min-h-screen flex flex-col items-center justify-center
      px-4 pb-24 overflow-hidden transition-colors duration-500
      ${darkMode
        ? "bg-[radial-gradient(ellipse_at_top_left,_#2d0a2e_0%,_#140a1e_55%,_#0a0810_100%)]"
        : "bg-[radial-gradient(ellipse_at_top_left,_#ffe4f0_0%,_#f3e8ff_55%,_#fff5f7_100%)]"
      }
    `}>
      {/* Blobs */}
      <div className={`absolute top-[-100px] left-[-100px] w-[450px] h-[450px] rounded-full blur-[110px] opacity-40 animate-float-slow pointer-events-none ${darkMode ? "bg-rose-950" : "bg-rose-200"}`} />
      <div className={`absolute bottom-[-80px] right-[-80px] w-[380px] h-[380px] rounded-full blur-[90px] opacity-30 animate-float pointer-events-none ${darkMode ? "bg-purple-950" : "bg-purple-200"}`} />
      <div className={`absolute top-1/2 right-1/4 w-[200px] h-[200px] rounded-full blur-[70px] opacity-20 animate-float-slow pointer-events-none ${darkMode ? "bg-fuchsia-950" : "bg-fuchsia-100"}`} />

      {/* Dark mode toggle — top right */}
      <button
        onClick={toggle}
        className={`
          absolute top-5 right-5 z-20 p-2.5 rounded-xl border transition-all hover:scale-105
          ${darkMode ? "bg-white/8 text-yellow-300 border-white/10" : "bg-white/60 text-gray-500 border-white/70"}
        `}
      >
        {darkMode ? <Sun size={17} /> : <Moon size={17} />}
      </button>

      {/* Hero card */}
      <div className={`
        relative z-10 w-full max-w-sm md:max-w-lg
        rounded-[38px] p-8 animate-float
        ${darkMode ? "glass-card-dark" : "glass-card"}
      `}>
        {/* Brand */}
        <div className="text-center mb-6">
          <div className="text-5xl animate-heartbeat mb-3">🌸</div>
          <h1 className="text-4xl font-bold gradient-text-love leading-tight tracking-tight">
            Self Love
          </h1>
          <p className={`text-sm font-semibold mt-0.5 ${darkMode ? "text-rose-300" : "text-rose-400"}`}>
            Tracker ✨
          </p>
          <p className={`mt-2 text-sm leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
            A gentle daily companion for your inner world 💕
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-7">
          {features.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className={`
                flex items-center gap-3 px-4 py-3.5 rounded-2xl border
                transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                ${darkMode
                  ? "bg-white/5 border-white/8 hover:bg-white/10"
                  : `${f.bg} ${f.border} hover:bg-white/60`
                }
              `}
            >
              <span className="text-2xl flex-shrink-0">{f.icon}</span>
              <div className="min-w-0">
                <p className={`text-xs font-bold leading-tight ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
                  {f.title}
                </p>
                <p className={`text-[10px] mt-0.5 leading-snug line-clamp-2 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                  {f.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Primary CTA */}
        <Link
          href="/dashboard"
          className="
            block py-4 rounded-2xl font-bold text-white text-sm text-center
            bg-gradient-to-r from-rose-500 to-pink-500
            hover:from-rose-600 hover:to-pink-600
            shadow-lg shadow-rose-400/30
            transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
          "
        >
          Begin Today&apos;s Self-Love Check-In 🌸
        </Link>

        <Link
          href="/dashboard"
          className={`block mt-3 text-xs uppercase tracking-widest font-medium text-center transition-colors ${darkMode ? "text-gray-500 hover:text-rose-300" : "text-gray-400 hover:text-rose-500"}`}
        >
          Continue my journey →
        </Link>
      </div>

      {/* Tagline */}
      <p className={`relative z-10 mt-5 text-xs text-center max-w-xs leading-relaxed ${darkMode ? "text-gray-600" : "text-gray-400"}`}>
        You deserve the same love you give to everyone else 💗
      </p>

      <BottomNav darkMode={darkMode} />
    </main>
  );
}
