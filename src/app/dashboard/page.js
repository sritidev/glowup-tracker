"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, Sparkles, Quote as QuoteIcon, Wind } from "lucide-react";
import Link from "next/link";

import { useDarkMode }     from "../hooks/useDarkMode";
import { useAuth }         from "../context/AuthContext";
import { computeStreaks }  from "../../lib/streak";
import { todayISO, mondayISO, greeting } from "../../lib/wellness";

import MoodSelector        from "../components/mood/MoodSelector";
import DailyCheckInCard    from "../components/mood/DailyCheckInCard";
import DailyAffirmation    from "../components/DailyAffirmation";
import GratitudeJournal    from "../components/GratitudeJournal";
import SelfCareRituals     from "../components/SelfCareRituals";
import DailySummary        from "../components/DailySummary";
import GlowStreak          from "../components/GlowStreak";
import WellnessToday       from "../components/wellness/WellnessToday";
import HydrationTracker    from "../components/wellness/HydrationTracker";
import SleepTracker        from "../components/wellness/SleepTracker";
import NourishTracker      from "../components/wellness/NourishTracker";
import StepsTracker        from "../components/wellness/StepsTracker";
import BottomNav           from "../components/BottomNav";

const EMPTY_CHECKIN = { boundaries: null, kindness: null, rest: null };

export default function Dashboard() {
  const { darkMode, toggle } = useDarkMode();
  const { user, profile, supabase } = useAuth();

  // Existing self-love state
  const [mood,      setMood]      = useState(null);
  const [checkin,   setCheckin]   = useState(EMPTY_CHECKIN);
  const [rituals,   setRituals]   = useState([]);
  const [gratitude, setGratitude] = useState(["", "", ""]);

  // New wellness state
  const [hydrationMl,   setHydrationMl]   = useState(0);
  const [hydrationGoal] = useState(2000);
  const [sleepMinutes,  setSleepMinutes]  = useState(null);
  const [sleepGoal]     = useState(480);
  const [nourishment,   setNourishment]   = useState([]);
  const [movementMin,   setMovementMin]   = useState(0);
  const [steps,         setSteps]         = useState(0);
  const [stepsGoal,     setStepsGoal]     = useState(8000);

  const [streak,        setStreak]        = useState({ current: 0, longest: 0 });
  const [toast,         setToast]         = useState({ msg: "", type: "" });
  const [animateStreak, setAnimateStreak] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  };

  /* ── Load today's entry + streak + movement ── */
  useEffect(() => {
    if (!user) return;
    (async () => {
      const today = todayISO();

      // Today's mood_entry (all wellness fields live here)
      const { data: todayRow } = await supabase
        .from("mood_entries")
        .select("*")
        .eq("user_id", user.id)
        .eq("logged_date", today)
        .maybeSingle();

      if (todayRow) {
        if (todayRow.mood_emoji) setMood({ emoji: todayRow.mood_emoji, label: todayRow.mood_label });
        setCheckin({
          boundaries: todayRow.boundaries ?? null,
          kindness:   todayRow.kindness ?? null,
          rest:       todayRow.rest ?? null,
        });
        setRituals(todayRow.rituals ?? []);
        setGratitude(todayRow.gratitude?.length ? [...todayRow.gratitude, "", "", ""].slice(0, 3) : ["", "", ""]);
        setHydrationMl(todayRow.hydration_ml ?? 0);
        setSleepMinutes(todayRow.sleep_minutes ?? null);
        setNourishment(todayRow.nourishment ?? []);
        setSteps(todayRow.steps ?? 0);
        setStepsGoal(todayRow.steps_goal ?? 8000);
      }

      // Streak from all logged dates
      const { data: allDates } = await supabase
        .from("mood_entries").select("logged_date").eq("user_id", user.id);
      if (allDates?.length) setStreak(computeStreaks(allDates.map((r) => r.logged_date)));

      // Today's movement minutes
      const { data: todayWorkouts } = await supabase
        .from("workouts").select("duration_min").eq("user_id", user.id).eq("logged_date", today);
      if (todayWorkouts?.length) {
        setMovementMin(todayWorkouts.reduce((a, w) => a + (w.duration_min ?? 0), 0));
      }
    })();
  }, [user]);

  /* ── Persist any wellness field immediately (upsert today's row) ── */
  const persist = async (patch) => {
    if (!user) return;
    await supabase.from("mood_entries").upsert({
      user_id: user.id,
      logged_date: todayISO(),
      hydration_goal: hydrationGoal,
      sleep_goal: sleepGoal,
      steps_goal: stepsGoal,
      ...patch,
    }, { onConflict: "user_id,logged_date" });
  };

  const handleHydration = (ml) => { setHydrationMl(ml); persist({ hydration_ml: ml }); };
  const handleSleep     = (mins) => { setSleepMinutes(mins); persist({ sleep_minutes: mins }); showToast("Sleep logged 🌙"); };
  const handleNourish   = (updater) => {
    setNourishment((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      persist({ nourishment: next });
      return next;
    });
  };
  const handleSteps     = (n) => { setSteps(n); persist({ steps: n }); };
  const handleStepsGoal = (g) => { setStepsGoal(g); persist({ steps_goal: g }); };

  /* ── Save the full daily entry (mood + checkin required, like before) ── */
  const handleSave = async () => {
    if (!mood) { showToast("Please select how your heart is feeling 💭", "error"); return; }
    if (!Object.values(checkin).every(Boolean)) { showToast("Complete your self-love check-in first 🌸", "error"); return; }

    const today = todayISO();
    const { error } = await supabase.from("mood_entries").upsert({
      user_id:    user.id,
      mood_emoji: mood.emoji,
      mood_label: mood.label,
      boundaries: checkin.boundaries,
      kindness:   checkin.kindness,
      rest:       checkin.rest,
      rituals,
      gratitude:  gratitude.filter((g) => g.trim()),
      hydration_ml: hydrationMl,
      hydration_goal: hydrationGoal,
      sleep_minutes: sleepMinutes,
      sleep_goal: sleepGoal,
      nourishment,
      steps,
      steps_goal: stepsGoal,
      logged_date: today,
    }, { onConflict: "user_id,logged_date" });

    if (error) { showToast("Could not save: " + error.message, "error"); return; }

    const { data: allDates } = await supabase
      .from("mood_entries").select("logged_date").eq("user_id", user.id);
    const newStreak = computeStreaks((allDates ?? []).map((r) => r.logged_date));
    setStreak(newStreak);

    await supabase.from("profiles").update({
      current_streak: newStreak.current,
      longest_streak: newStreak.longest,
      last_logged_date: today,
    }).eq("id", user.id);

    setAnimateStreak(true);
    setTimeout(() => setAnimateStreak(false), 700);
    showToast(newStreak.current > 1 ? `Saved — ${newStreak.current}-day streak! 🔥` : "Saved — you showed up for yourself today 💖");
  };

  const journalDone   = gratitude.some((g) => g.trim()) || !!mood;
  const breathingDone = rituals.includes("breathe");
  const firstName = (profile?.name ?? "").split(" ")[0];

  return (
    <main className={`relative min-h-screen pb-24 overflow-hidden transition-colors duration-500
      ${darkMode
        ? "bg-[radial-gradient(ellipse_at_top,_#2d0a2e_0%,_#140a1e_55%,_#0a0810_100%)]"
        : "bg-[radial-gradient(ellipse_at_top,_#ffe4f0_0%,_#f3e8ff_50%,_#fff5f7_100%)]"}`}>
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

      {/* Header / greeting */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        <div className={`flex items-center justify-between px-5 py-3.5 rounded-2xl ${darkMode ? "glass-card-dark" : "glass-card"}`}>
          <div>
            <p className={`text-xs font-medium ${darkMode ? "text-rose-300" : "text-rose-400"}`}>{greeting()} 🌸</p>
            <h1 className="text-xl font-bold gradient-text-love">{firstName ? `Hello, ${firstName}` : "Your wellness space"}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/quotes" className={`p-2.5 rounded-xl border transition-all hover:scale-105 ${darkMode ? "bg-white/8 text-rose-300 border-white/10" : "bg-white/60 text-rose-500 border-white/70"}`} title="Quotes">
              <QuoteIcon size={16} />
            </Link>
            <Link href="/breathe" className={`p-2.5 rounded-xl border transition-all hover:scale-105 ${darkMode ? "bg-white/8 text-indigo-300 border-white/10" : "bg-white/60 text-indigo-500 border-white/70"}`} title="Breathe">
              <Wind size={16} />
            </Link>
            <button onClick={toggle} className={`p-2.5 rounded-xl border transition-all hover:scale-105 ${darkMode ? "bg-white/8 text-yellow-300 border-white/10" : "bg-black/5 text-gray-500 border-black/8"}`}>
              {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>
        </div>
      </div>

      {/* Today's wellness summary — full width */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 mt-3">
        <WellnessToday
          hydrationMl={hydrationMl} hydrationGoal={hydrationGoal}
          movementMin={movementMin} sleepMinutes={sleepMinutes}
          steps={steps} stepsGoal={stepsGoal}
          journalDone={journalDone} breathingDone={breathingDone}
          darkMode={darkMode}
        />
      </div>

      {/* Grid */}
      <div className="relative z-10 max-w-7xl mx-auto mt-5 px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* LEFT — mind */}
        <div className="flex flex-col gap-5">
          <MoodSelector selectMood={mood} setSelectMood={setMood} darkMode={darkMode} />
          <DailyCheckInCard checkin={checkin} setCheckin={setCheckin} darkMode={darkMode} />
          <DailyAffirmation darkMode={darkMode} />
        </div>

        {/* CENTER — body */}
        <div className="flex flex-col gap-5">
          <HydrationTracker ml={hydrationMl} goal={hydrationGoal} onChange={handleHydration} darkMode={darkMode} />
          <StepsTracker steps={steps} goal={stepsGoal} onChange={handleSteps} onGoalChange={handleStepsGoal} darkMode={darkMode} />
          <SleepTracker sleepMinutes={sleepMinutes} goal={sleepGoal} onSave={handleSleep} darkMode={darkMode} />
          <NourishTracker nourishment={nourishment} setNourishment={handleNourish} darkMode={darkMode} />
          <GratitudeJournal gratitude={gratitude} setGratitude={setGratitude} darkMode={darkMode} />
          <DailySummary mood={mood} checkin={checkin} rituals={rituals} gratitude={gratitude} darkMode={darkMode} />

          <div className="flex gap-3">
            <button onClick={handleSave} className="flex-1 py-3.5 rounded-2xl font-bold text-white text-sm bg-gradient-to-r from-rose-500 to-pink-500 shadow-lg shadow-rose-400/25 transition-all hover:scale-[1.02] active:scale-[0.98]">
              Save Today&apos;s Entry 💾
            </button>
            <Link href="/move" className="flex-1 py-3.5 rounded-2xl font-semibold text-white text-sm text-center bg-gradient-to-r from-fuchsia-500 to-purple-500 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]">
              Move Your Body 🏃
            </Link>
          </div>
        </div>

        {/* RIGHT — momentum */}
        <div className="flex flex-col gap-5">
          <GlowStreak streak={streak} animate={animateStreak} darkMode={darkMode} />
          <SelfCareRituals rituals={rituals} setRituals={setRituals} darkMode={darkMode} />
        </div>
      </div>

      <BottomNav darkMode={darkMode} />
    </main>
  );
}
