"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, Clock } from "lucide-react";
import Link from "next/link";

import { useDarkMode }     from "../hooks/useDarkMode";
import { useAuth }         from "../context/AuthContext";
import MoodSelector        from "../components/mood/MoodSelector";
import DailyCheckInCard    from "../components/mood/DailyCheckInCard";
import DailyAffirmation    from "../components/DailyAffirmation";
import GratitudeJournal    from "../components/GratitudeJournal";
import SelfCareRituals     from "../components/SelfCareRituals";
import DailySummary        from "../components/DailySummary";
import WeeklyPreview       from "../components/WeeklyPreview";
import GlowStreak          from "../components/GlowStreak";
import BottomNav           from "../components/BottomNav";

const EMPTY_CHECKIN = { boundaries: null, kindness: null, rest: null };
const INITIAL_WEEK  = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => ({ day: d, mood: null }));

export default function Dashboard() {
  const { darkMode, toggle } = useDarkMode();
  const { user, supabase }   = useAuth();

  const [mood,           setMood]          = useState(null);
  const [checkin,        setCheckin]        = useState(EMPTY_CHECKIN);
  const [rituals,        setRituals]        = useState([]);
  const [gratitude,      setGratitude]      = useState(["", "", ""]);
  const [week,           setWeek]           = useState(INITIAL_WEEK);
  const [toast,          setToast]          = useState({ msg: "", type: "" });
  const [animateStreak,  setAnimateStreak]  = useState(false);

  /* ── Load this week's mood entries ── */
  useEffect(() => {
    if (!user) return;
    (async () => {
      const monday = getMondayISO();
      const { data } = await supabase
        .from("mood_entries")
        .select("mood_emoji, logged_date")
        .eq("user_id", user.id)
        .gte("logged_date", monday);

      if (data?.length) {
        const updated = INITIAL_WEEK.map((d) => {
          const entry = data.find((e) => getDayLabel(e.logged_date) === d.day);
          return entry ? { ...d, mood: entry.mood_emoji } : d;
        });
        setWeek(updated);
      }
    })();
  }, [user]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  };

  const handleSave = async () => {
    if (!mood) { showToast("Please select how your heart is feeling 💭", "error"); return; }
    if (!Object.values(checkin).every(Boolean)) { showToast("Complete your self-love check-in first 🌸", "error"); return; }

    const today      = new Date().toISOString().split("T")[0];
    const dayLabel   = getDayLabel(today);
    const { error }  = await supabase.from("mood_entries").upsert({
      user_id:    user.id,
      mood_emoji: mood.emoji,
      mood_label: mood.label,
      boundaries: checkin.boundaries,
      kindness:   checkin.kindness,
      rest:       checkin.rest,
      rituals:    rituals,
      gratitude:  gratitude.filter((g) => g.trim()),
      logged_date: today,
    }, { onConflict: "user_id,logged_date" });

    if (error) { showToast("Could not save: " + error.message, "error"); return; }

    const updated = week.map((d) => d.day === dayLabel ? { ...d, mood: mood.emoji } : d);
    setWeek(updated);
    setAnimateStreak(true);
    setTimeout(() => setAnimateStreak(false), 700);
    showToast("Saved — you showed up for yourself today 💖");
  };

  const handleReset = () => {
    setMood(null); setCheckin(EMPTY_CHECKIN); setRituals([]); setGratitude(["", "", ""]);
  };

  return (
    <main className={`
      relative min-h-screen pb-24 overflow-hidden transition-colors duration-500
      ${darkMode
        ? "bg-[radial-gradient(ellipse_at_top,_#2d0a2e_0%,_#140a1e_55%,_#0a0810_100%)]"
        : "bg-[radial-gradient(ellipse_at_top,_#ffe4f0_0%,_#f3e8ff_50%,_#fff5f7_100%)]"
      }
    `}>
      <div className={`absolute top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full blur-[120px] opacity-30 animate-float-slow pointer-events-none ${darkMode ? "bg-rose-950" : "bg-rose-200"}`} />
      <div className={`absolute bottom-0 right-[-80px] w-[400px] h-[400px] rounded-full blur-[100px] opacity-20 animate-float pointer-events-none ${darkMode ? "bg-purple-950" : "bg-purple-200"}`} />

      {toast.msg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[90vw] max-w-sm">
          <div className={`px-5 py-3 rounded-2xl text-center text-sm font-semibold shadow-xl backdrop-blur-xl border animate-fade-in-up
            ${toast.type === "error" ? "bg-red-500/85 border-red-300/20 text-white" : "bg-rose-500/85 border-rose-300/20 text-white"}`}>
            {toast.msg}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        <div className={`flex items-center justify-between px-5 py-3.5 rounded-2xl ${darkMode ? "glass-card-dark" : "glass-card"}`}>
          <div>
            <p className={`text-xs font-medium ${darkMode ? "text-rose-300" : "text-rose-400"}`}>Your safe space 🌸</p>
            <h1 className="text-xl font-bold gradient-text-love">Self Love Journal</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/history" className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all hover:scale-105
              ${darkMode ? "bg-rose-500/20 text-rose-200 border-rose-400/20" : "bg-rose-500/15 text-rose-600 border-rose-200/40"}`}>
              <Clock size={13} /> History
            </Link>
            <button onClick={toggle} className={`p-2.5 rounded-xl border transition-all hover:scale-105
              ${darkMode ? "bg-white/8 text-yellow-300 border-white/10" : "bg-black/5 text-gray-500 border-black/8"}`}>
              {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="relative z-10 max-w-7xl mx-auto mt-5 px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="flex flex-col gap-5">
          <WeeklyPreview week={week} darkMode={darkMode} />
          <DailyAffirmation darkMode={darkMode} />
        </div>

        <div className="flex flex-col gap-5">
          <MoodSelector selectMood={mood} setSelectMood={setMood} darkMode={darkMode} />
          <DailyCheckInCard checkin={checkin} setCheckin={setCheckin} darkMode={darkMode} />
          <GratitudeJournal gratitude={gratitude} setGratitude={setGratitude} darkMode={darkMode} />
          <DailySummary mood={mood} checkin={checkin} rituals={rituals} gratitude={gratitude} darkMode={darkMode} />
          <div className="flex gap-3">
            <button onClick={handleSave} className="flex-1 py-3.5 rounded-2xl font-bold text-white text-sm bg-gradient-to-r from-rose-500 to-pink-500 shadow-lg shadow-rose-400/25 transition-all hover:scale-[1.02] active:scale-[0.98]">
              Save Today&apos;s Entry 💾
            </button>
            <button onClick={handleReset} className={`flex-1 py-3.5 rounded-2xl font-semibold text-sm border transition-all hover:scale-[1.02] active:scale-[0.98]
              ${darkMode ? "bg-white/8 text-gray-200 border-white/10" : "bg-white/50 text-gray-500 border-white/60"}`}>
              Reset 🔄
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <GlowStreak week={week} animate={animateStreak} darkMode={darkMode} />
          <SelfCareRituals rituals={rituals} setRituals={setRituals} darkMode={darkMode} />
        </div>
      </div>

      <BottomNav darkMode={darkMode} />
    </main>
  );
}

// ── helpers ──────────────────────────────────
function getMondayISO() {
  const d = new Date();
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1 - day);
  d.setDate(d.getDate() + diff);
  return d.toISOString().split("T")[0];
}

function getDayLabel(iso) {
  const labels = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  return labels[new Date(iso + "T12:00:00").getDay()];
}
