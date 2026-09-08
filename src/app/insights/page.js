"use client";

import { useEffect, useState, useMemo } from "react";
import { Sun, Moon, TrendingUp } from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";
import { useAuth } from "../context/AuthContext";
import { computeInsights, buildCalendar } from "../../lib/insights";
import { computeStreaks } from "../../lib/streak";
import { mondayISO, formatDuration, wellnessScore } from "../../lib/wellness";
import { moodScore } from "../../lib/moods";
import BottomNav from "../components/BottomNav";

export default function InsightsPage() {
  const { darkMode, toggle } = useDarkMode();
  const { user, supabase }   = useAuth();

  const [moods,    setMoods]    = useState([]);
  const [journals, setJournals] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [m, j, w] = await Promise.all([
        supabase.from("mood_entries").select("*").eq("user_id", user.id).order("logged_date", { ascending: true }),
        supabase.from("journal_entries").select("created_at").eq("user_id", user.id),
        supabase.from("workouts").select("*").eq("user_id", user.id),
      ]);
      setMoods(m.data ?? []);
      setJournals(j.data ?? []);
      setWorkouts(w.data ?? []);
      setLoading(false);
    })();
  }, [user]);

  const insights = useMemo(() => computeInsights(moods), [moods]);
  const calendar = useMemo(() => buildCalendar(moods, 35), [moods]);
  const streak   = useMemo(() => computeStreaks(moods.map((e) => e.logged_date)), [moods]);

  // ── This week's dimensions ──
  const week = useMemo(() => {
    const monday = mondayISO();
    const wkMoods    = moods.filter((m) => m.logged_date >= monday);
    const wkWorkouts = workouts.filter((w) => w.logged_date >= monday);
    const wkJournals = journals.filter((j) => j.created_at.split("T")[0] >= monday);

    const moodDays      = wkMoods.filter((m) => m.mood_emoji).length;
    const moveDays      = new Set(wkWorkouts.map((w) => w.logged_date)).size;
    const hydrationDays = wkMoods.filter((m) => (m.hydration_ml ?? 0) >= (m.hydration_goal ?? 2000)).length;
    const sleepDays     = wkMoods.filter((m) => m.sleep_minutes != null && m.sleep_minutes >= (m.sleep_goal ?? 480)).length;
    const journalDays   = new Set(wkJournals.map((j) => j.created_at.split("T")[0])).size;
    const breatheDays   = wkMoods.filter((m) => (m.rituals ?? []).includes("breathe")).length;

    const sleepVals = wkMoods.map((m) => m.sleep_minutes).filter((s) => s != null);
    const avgSleep  = sleepVals.length ? Math.round(sleepVals.reduce((a, b) => a + b, 0) / sleepVals.length) : null;
    const moveMinutes = wkWorkouts.reduce((a, w) => a + (w.duration_min ?? 0), 0);

    const stepsGoalDays = wkMoods.filter((m) => (m.steps ?? 0) >= (m.steps_goal ?? 8000)).length;
    const totalSteps    = wkMoods.reduce((a, m) => a + (m.steps ?? 0), 0);

    return { moodDays, moveDays, hydrationDays, sleepDays, journalDays, breatheDays, avgSleep, moveMinutes, workoutCount: wkWorkouts.length, stepsGoalDays, totalSteps };
  }, [moods, workouts, journals]);

  const score = wellnessScore({
    movement:   { done: week.moveDays,      goal: 5 },
    mood:       { done: week.moodDays,      goal: 7 },
    hydration:  { done: week.hydrationDays, goal: 7 },
    sleep:      { done: week.sleepDays,     goal: 7 },
    journaling: { done: week.journalDays,   goal: 7 },
  });

  // ── Movement → mood correlation ──
  const correlation = useMemo(() => {
    const moveDates = new Set(workouts.map((w) => w.logged_date));
    const withScore = moods.filter((m) => m.mood_emoji && moodScore(m.mood_emoji) != null);
    const moveDay = withScore.filter((m) => moveDates.has(m.logged_date));
    const restDay = withScore.filter((m) => !moveDates.has(m.logged_date));
    const avg = (arr) => arr.length ? arr.reduce((a, m) => a + moodScore(m.mood_emoji), 0) / arr.length : null;
    return { move: avg(moveDay), rest: avg(restDay), moveN: moveDay.length, restN: restDay.length };
  }, [moods, workouts]);

  const bars = [
    { label: "Movement",     done: week.moveDays,      goal: 5, emoji: "🏃" },
    { label: "Steps goal",   done: week.stepsGoalDays, goal: 7, emoji: "🚶‍♀️" },
    { label: "Mood check-ins", done: week.moodDays,    goal: 7, emoji: "💗" },
    { label: "Hydration",    done: week.hydrationDays, goal: 7, emoji: "💧" },
    { label: "Sleep",        done: week.sleepDays,     goal: 7, emoji: "😴" },
    { label: "Journaling",   done: week.journalDays,   goal: 7, emoji: "📖" },
    { label: "Breathing",    done: week.breatheDays,   goal: 7, emoji: "🧘" },
  ];

  // ── Observations ──
  const observations = [];
  if (week.workoutCount > 0) observations.push(`You moved your body ${week.workoutCount} time${week.workoutCount > 1 ? "s" : ""} this week.`);
  if (week.totalSteps > 0)   observations.push(`You walked ${week.totalSteps.toLocaleString()} steps this week.`);
  if (week.breatheDays > 0)  observations.push(`You practiced breathing on ${week.breatheDays} day${week.breatheDays > 1 ? "s" : ""}.`);
  if (week.journalDays > 0)  observations.push(`You journaled ${week.journalDays} day${week.journalDays > 1 ? "s" : ""} this week.`);
  if (week.avgSleep != null) observations.push(`Your average sleep was ${formatDuration(week.avgSleep)}.`);
  if (week.hydrationDays > 0) observations.push(`You hit your hydration goal ${week.hydrationDays} day${week.hydrationDays > 1 ? "s" : ""}.`);
  if (correlation.move != null && correlation.rest != null && correlation.moveN >= 2 && correlation.rest >= 2 && correlation.move > correlation.rest) {
    observations.push("Your mood was logged as more positive on days you moved. 💗");
  }

  const card = darkMode ? "glass-card-dark" : "glass-card";

  return (
    <main className={`relative min-h-screen pb-28 overflow-hidden transition-colors duration-500
      ${darkMode ? "bg-[radial-gradient(ellipse_at_top,_#2d0a2e_0%,_#140a1e_55%,_#0a0810_100%)]" : "bg-[radial-gradient(ellipse_at_top,_#ffe4f0_0%,_#f3e8ff_50%,_#fff5f7_100%)]"}`}>
      <div className={`absolute top-[-80px] right-[-80px] w-[350px] h-[350px] rounded-full blur-[100px] opacity-30 animate-float-slow pointer-events-none ${darkMode ? "bg-rose-950" : "bg-rose-200"}`} />
      <div className={`absolute bottom-0 left-[-60px] w-[300px] h-[300px] rounded-full blur-[80px] opacity-20 animate-float pointer-events-none ${darkMode ? "bg-purple-950" : "bg-purple-200"}`} />

      {/* Header */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 pt-6">
        <div className={`flex items-center justify-between px-5 py-3.5 rounded-2xl ${card}`}>
          <div>
            <p className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? "text-rose-400" : "text-rose-400"}`}>Mind & Body</p>
            <h1 className="text-xl font-bold gradient-text-love">Insights 📈</h1>
          </div>
          <button onClick={toggle} className={`p-2.5 rounded-xl border transition-all hover:scale-105 ${darkMode ? "bg-white/8 text-yellow-300 border-white/10" : "bg-black/5 text-gray-500 border-black/8"}`}>
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 mt-5 space-y-4">
        {loading ? (
          <div className={`rounded-3xl p-10 text-center ${card}`}>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Gathering your week…</p>
          </div>
        ) : (
          <>
            {/* Weekly wellness score */}
            <div className={`rounded-3xl p-6 ${card}`}>
              <div className="flex items-center justify-between mb-2">
                <h2 className={`text-base font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>🌸 Your Week</h2>
                <div className="text-right">
                  <p className="text-3xl font-black gradient-text-love leading-none">{score}%</p>
                  <p className={`text-[10px] ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Consistency</p>
                </div>
              </div>
              <div className="space-y-3 mt-4">
                {bars.map((b) => {
                  const pct = Math.min(Math.round((b.done / b.goal) * 100), 100);
                  return (
                    <div key={b.label} className="flex items-center gap-3">
                      <span className="text-base w-6 flex-shrink-0">{b.emoji}</span>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className={`text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{b.label}</span>
                          <span className={`text-[10px] font-semibold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{b.done}/{b.goal}</span>
                        </div>
                        <div className={`h-2 rounded-full overflow-hidden ${darkMode ? "bg-white/10" : "bg-rose-100"}`}>
                          <div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-400 transition-all duration-700" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Movement → mood */}
            {correlation.move != null && correlation.rest != null && correlation.moveN >= 1 && correlation.restN >= 1 && (
              <div className={`rounded-3xl p-6 ${card}`}>
                <h2 className={`text-base font-bold mb-1 ${darkMode ? "text-white" : "text-gray-800"}`}>💗 How movement makes you feel</h2>
                <p className={`text-xs mb-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Average mood on days you moved vs rested</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className={`rounded-2xl p-4 text-center ${darkMode ? "bg-fuchsia-500/15 border border-fuchsia-400/20" : "bg-fuchsia-400/12 border border-fuchsia-300/30"}`}>
                    <p className="text-2xl mb-1">🏃</p>
                    <p className="text-lg font-black gradient-text-love leading-none">{correlation.move.toFixed(1)}<span className="text-xs">/5</span></p>
                    <p className={`text-[10px] mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Days you moved</p>
                  </div>
                  <div className={`rounded-2xl p-4 text-center ${darkMode ? "bg-white/5 border border-white/8" : "bg-white/55 border border-white/65"}`}>
                    <p className="text-2xl mb-1">🌙</p>
                    <p className="text-lg font-black gradient-text-love leading-none">{correlation.rest.toFixed(1)}<span className="text-xs">/5</span></p>
                    <p className={`text-[10px] mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Rest days</p>
                  </div>
                </div>
                {correlation.move > correlation.rest && (
                  <p className={`text-xs text-center mt-3 font-medium ${darkMode ? "text-fuchsia-300" : "text-fuchsia-500"}`}>
                    You tend to feel better on days you move 🌷
                  </p>
                )}
              </div>
            )}

            {/* Observations */}
            {observations.length > 0 && (
              <div className={`rounded-3xl p-6 ${card}`}>
                <h2 className={`text-base font-bold mb-3 ${darkMode ? "text-white" : "text-gray-800"}`}>✨ This week&apos;s reflections</h2>
                <div className="space-y-2">
                  {observations.map((o, i) => (
                    <div key={i} className={`flex items-start gap-2.5 px-4 py-2.5 rounded-2xl ${darkMode ? "bg-white/5 border border-white/8" : "bg-white/55 border border-white/65"}`}>
                      <span className="text-rose-400 mt-0.5">🌸</span>
                      <p className={`text-sm ${darkMode ? "text-gray-200" : "text-gray-700"}`}>{o}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All-time stat cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`rounded-2xl p-4 text-center ${card}`}>
                <div className="text-2xl mb-1">{insights.topMood?.emoji ?? "🌱"}</div>
                <div className={`font-black text-sm ${insights.topMood?.color ?? ""}`}>{insights.topMood?.label ?? "—"}</div>
                <p className={`text-[10px] mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Most common mood</p>
              </div>
              <div className={`rounded-2xl p-4 text-center ${card}`}>
                <div className="text-2xl mb-1">🔥</div>
                <div className="font-black gradient-text-love text-lg leading-none">{streak.current}d</div>
                <p className={`text-[10px] mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Current streak</p>
              </div>
              <div className={`rounded-2xl p-4 text-center ${card}`}>
                <div className="text-2xl mb-1">🏃</div>
                <div className="font-black gradient-text-love text-lg leading-none">{workouts.length}</div>
                <p className={`text-[10px] mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Total workouts</p>
              </div>
              <div className={`rounded-2xl p-4 text-center ${card}`}>
                <div className="text-2xl mb-1">🗓️</div>
                <div className="font-black gradient-text-love text-lg leading-none">{insights.total}</div>
                <p className={`text-[10px] mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Days logged</p>
              </div>
            </div>

            {/* Calendar heatmap */}
            {insights.total > 0 && (
              <div className={`rounded-3xl p-6 ${card}`}>
                <h2 className={`text-base font-bold mb-1 ${darkMode ? "text-white" : "text-gray-800"}`}>🗓️ Last 5 Weeks</h2>
                <p className={`text-xs mb-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Coloured by your mood each day</p>
                <div className="grid grid-cols-7 gap-1.5">
                  {["M","T","W","T","F","S","S"].map((d, i) => (
                    <div key={i} className={`text-center text-[9px] font-semibold ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{d}</div>
                  ))}
                  {calendar.map((cell) => (
                    <div key={cell.iso} title={`${cell.iso}${cell.mood ? " · " + cell.mood.label : ""}`}
                      className={`aspect-square rounded-lg flex items-center justify-center text-sm transition-all
                        ${cell.emoji ? (cell.mood?.bg ?? "bg-rose-400/20 border-rose-300/40") + " border" : darkMode ? "bg-white/4 border border-white/6" : "bg-white/40 border border-white/60"}
                        ${cell.isToday ? "ring-2 ring-rose-400/70" : ""}`}>
                      {cell.emoji ?? <span className={`text-[9px] ${darkMode ? "text-gray-600" : "text-gray-300"}`}>{cell.date}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mood distribution */}
            {insights.distribution.length > 0 && (
              <div className={`rounded-3xl p-6 ${card}`}>
                <h2 className={`text-base font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>🎭 Mood Distribution</h2>
                <div className="space-y-2.5">
                  {insights.distribution.map((m) => (
                    <div key={m.emoji} className="flex items-center gap-3">
                      <span className="text-xl w-7 flex-shrink-0">{m.emoji}</span>
                      <div className="flex-1">
                        <div className={`h-2.5 rounded-full overflow-hidden ${darkMode ? "bg-white/10" : "bg-gray-100"}`}>
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${m.pct}%`, background: m.hex }} />
                        </div>
                      </div>
                      <span className={`text-xs font-semibold w-14 text-right ${m.color}`}>{m.count} ({m.pct}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {insights.total === 0 && workouts.length === 0 && (
              <div className={`rounded-3xl p-10 text-center ${card}`}>
                <TrendingUp size={40} className={`mx-auto mb-4 ${darkMode ? "text-rose-800" : "text-rose-200"}`} />
                <h3 className={`font-bold mb-2 ${darkMode ? "text-white" : "text-gray-700"}`}>No insights yet 🌱</h3>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Log moods and movement, and your patterns will bloom here.</p>
              </div>
            )}

            {/* Footer */}
            <div className={`rounded-3xl px-6 py-5 text-center ${card}`}>
              <p className="text-2xl mb-2">🌷</p>
              <p className={`text-sm font-semibold ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                {score >= 70 ? "You're taking beautiful care of yourself 💖"
                  : score >= 40 ? "Steady progress — be proud of showing up 🌸"
                  : "Every small step counts. Be gentle with yourself 🫂"}
              </p>
            </div>
          </>
        )}
      </div>

      <BottomNav darkMode={darkMode} />
    </main>
  );
}
