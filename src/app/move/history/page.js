"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sun, Moon, ArrowLeft } from "lucide-react";
import { useDarkMode } from "../../hooks/useDarkMode";
import { useAuth } from "../../context/AuthContext";
import { computeStreaks } from "../../../lib/streak";
import { mondayISO, weekdayLabel } from "../../../lib/wellness";
import { categoryMeta as catMeta } from "../../../lib/workouts";
import BottomNav from "../../components/BottomNav";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function MoveHistoryPage() {
  const { darkMode, toggle } = useDarkMode();
  const { user, supabase }   = useAuth();

  const [all,     setAll]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("workouts").select("*").eq("user_id", user.id)
        .order("completed_at", { ascending: false });
      setAll(data ?? []);
      setLoading(false);
    })();
  }, [user]);

  const monday = mondayISO();
  const thisWeek = all.filter((w) => w.logged_date >= monday);
  const weekMinutes = thisWeek.reduce((a, w) => a + (w.duration_min ?? 0), 0);
  const totalMinutes = all.reduce((a, w) => a + (w.duration_min ?? 0), 0);
  const activeDates = [...new Set(all.map((w) => w.logged_date))];
  const streak = computeStreaks(activeDates);

  // Weekly grid: day -> workout(s)
  const weekByDay = DAYS.map((label) => {
    const items = thisWeek.filter((w) => weekdayLabel(w.logged_date) === label);
    return { label, items, minutes: items.reduce((a, w) => a + (w.duration_min ?? 0), 0) };
  });

  const card = darkMode ? "glass-card-dark" : "glass-card";

  return (
    <main className={`relative min-h-screen pb-28 overflow-hidden transition-colors duration-500
      ${darkMode ? "bg-[radial-gradient(ellipse_at_top,_#2d0a2e_0%,_#140a1e_55%,_#0a0810_100%)]" : "bg-[radial-gradient(ellipse_at_top,_#ffe4f0_0%,_#f3e8ff_50%,_#fff5f7_100%)]"}`}>
      <div className={`absolute top-[-80px] right-[-80px] w-[350px] h-[350px] rounded-full blur-[100px] opacity-30 animate-float-slow pointer-events-none ${darkMode ? "bg-fuchsia-950" : "bg-fuchsia-200"}`} />

      {/* Header */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 pt-6">
        <div className={`flex items-center justify-between px-5 py-3.5 rounded-2xl ${card}`}>
          <div>
            <p className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? "text-fuchsia-400" : "text-fuchsia-500"}`}>Movement</p>
            <h1 className="text-xl font-bold gradient-text-love">Move History 🏃‍♀️</h1>
          </div>
          <button onClick={toggle} className={`p-2.5 rounded-xl border transition-all hover:scale-105 ${darkMode ? "bg-white/8 text-yellow-300 border-white/10" : "bg-black/5 text-gray-500 border-black/8"}`}>
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 mt-5 space-y-4">
        <Link href="/move" className={`inline-flex items-center gap-1.5 text-sm font-semibold ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
          <ArrowLeft size={16} /> Back to Move
        </Link>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: "🏃", label: "Total workouts", value: all.length },
            { icon: "⏱️", label: "Total minutes",  value: totalMinutes },
            { icon: "🔥", label: "Current streak", value: `${streak.current}d` },
            { icon: "🏆", label: "Longest streak", value: `${streak.longest}d` },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl p-4 text-center ${card}`}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="font-black gradient-text-love text-xl leading-none">{s.value}</div>
              <p className={`text-[10px] mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* This week */}
        <div className={`rounded-3xl p-6 ${card}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-base font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>This Week</h2>
            <span className="text-sm font-black gradient-text-love">{weekMinutes} min</span>
          </div>
          <div className="space-y-2">
            {weekByDay.map((d) => (
              <div key={d.label} className={`flex items-center gap-3 px-4 py-3 rounded-2xl
                ${d.items.length ? (darkMode ? "bg-fuchsia-500/15 border border-fuchsia-400/20" : "bg-fuchsia-400/12 border border-fuchsia-300/30") : darkMode ? "bg-white/4 border border-white/6" : "bg-white/40 border border-white/50"}`}>
                <span className={`text-sm font-bold w-10 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{d.label}</span>
                {d.items.length ? (
                  <>
                    <span className="text-lg">{catMeta(d.items[0].category).icon}</span>
                    <span className={`text-sm flex-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                      {d.items.map((w) => w.workout_name).join(", ")}
                    </span>
                    <span className={`text-xs font-semibold ${darkMode ? "text-fuchsia-300" : "text-fuchsia-500"}`}>{d.minutes} min</span>
                  </>
                ) : (
                  <span className={`text-sm flex-1 ${darkMode ? "text-gray-600" : "text-gray-400"}`}>Rest</span>
                )}
              </div>
            ))}
          </div>
          <p className={`text-center text-sm font-semibold mt-4 ${darkMode ? "text-fuchsia-300" : "text-fuchsia-500"}`}>
            Total: {weekMinutes} minutes of movement 💗
          </p>
        </div>

        {/* Full log */}
        {loading ? (
          <div className={`rounded-3xl p-10 text-center ${card}`}><p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Loading…</p></div>
        ) : all.length === 0 ? (
          <div className={`rounded-3xl p-10 text-center ${card}`}>
            <p className="text-4xl mb-3">🌱</p>
            <p className={`text-sm mb-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No workouts yet — your first movement is waiting</p>
            <Link href="/move" className="px-6 py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-fuchsia-500 to-purple-500">Explore Workouts</Link>
          </div>
        ) : (
          <div className={`rounded-3xl p-6 ${card}`}>
            <h2 className={`text-base font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>All Workouts</h2>
            <div className="space-y-2.5">
              {all.map((w) => (
                <div key={w.id} className={`flex items-center gap-3 px-4 py-3 rounded-2xl ${darkMode ? "bg-white/5 border border-white/8" : "bg-white/55 border border-white/65"}`}>
                  <span className="text-xl">{catMeta(w.category).icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>{w.workout_name}</p>
                    <p className={`text-[11px] ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {new Date(w.completed_at).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                      {w.feeling && ` · felt ${w.feeling.toLowerCase()}`}
                    </p>
                  </div>
                  <span className={`text-xs font-bold ${darkMode ? "text-fuchsia-300" : "text-fuchsia-500"}`}>{w.duration_min} min</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav darkMode={darkMode} />
    </main>
  );
}
