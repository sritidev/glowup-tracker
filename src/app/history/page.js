"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";
import { useAuth } from "../context/AuthContext";
import BottomNav from "../components/BottomNav";

const AFFIRMATIONS = [
  "I am worthy of love exactly as I am 🌸",
  "I choose myself, today and every day 💕",
  "My feelings are valid and I honor them ✨",
  "I am enough — always have been, always will be 🌟",
  "I treat myself with the kindness I deserve 💗",
];

const MOOD_META = {
  "🥰": { label: "Loved",   bg: "bg-rose-400/20 border-rose-300/40",     text: "text-rose-500" },
  "😊": { label: "Calm",    bg: "bg-purple-400/20 border-purple-300/40", text: "text-purple-500" },
  "😐": { label: "Neutral", bg: "bg-gray-400/20 border-gray-300/40",     text: "text-gray-500" },
  "😔": { label: "Low",     bg: "bg-blue-400/20 border-blue-300/40",     text: "text-blue-500" },
  "😤": { label: "Tense",   bg: "bg-orange-400/20 border-orange-300/40", text: "text-orange-500" },
};

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

export default function HistoryPage() {
  const { darkMode, toggle } = useDarkMode();
  const { user, supabase }   = useAuth();

  const [week,         setWeek]         = useState(DAYS.map((d) => ({ day: d, mood: null })));
  const [journalCount, setJournalCount] = useState(0);
  const [journalWords, setJournalWords] = useState(0);
  const [favCount,     setFavCount]     = useState(0);
  const [ritualCount,  setRitualCount]  = useState(0);
  const [gratitude,    setGratitude]    = useState([]);
  const [affirmation,  setAffirmation]  = useState("");
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    const dayIdx = new Date().getDay() + new Date().getDate();
    setAffirmation(AFFIRMATIONS[dayIdx % AFFIRMATIONS.length]);
    if (!user) return;
    loadAll();
  }, [user]);

  const getMondayISO = () => {
    const d = new Date();
    const diff = (d.getDay() === 0 ? -6 : 1 - d.getDay());
    d.setDate(d.getDate() + diff);
    return d.toISOString().split("T")[0];
  };

  const getDayLabel = (iso) => {
    return DAYS[(new Date(iso + "T12:00:00").getDay() + 6) % 7];
  };

  const loadAll = async () => {
    setLoading(true);
    const monday = getMondayISO();

    const [moodRes, journalRes, favRes] = await Promise.all([
      supabase.from("mood_entries").select("mood_emoji, logged_date, gratitude, rituals").eq("user_id", user.id).gte("logged_date", monday),
      supabase.from("journal_entries").select("body, created_at").eq("user_id", user.id),
      supabase.from("favourite_quotes").select("id").eq("user_id", user.id),
    ]);

    if (moodRes.data?.length) {
      const updated = DAYS.map((d) => {
        const entry = moodRes.data.find((e) => getDayLabel(e.logged_date) === d);
        return { day: d, mood: entry?.mood_emoji ?? null, gratitude: entry?.gratitude ?? [], rituals: entry?.rituals ?? [] };
      });
      setWeek(updated);
      const todayEntry = moodRes.data.find((e) => e.logged_date === new Date().toISOString().split("T")[0]);
      if (todayEntry?.gratitude) setGratitude(todayEntry.gratitude);
      const allRituals = moodRes.data.flatMap((e) => e.rituals ?? []);
      setRitualCount(allRituals.length);
    }

    if (journalRes.data) {
      setJournalCount(journalRes.data.length);
      setJournalWords(journalRes.data.reduce((a, e) => a + (e.body?.trim().split(/\s+/).length ?? 0), 0));
    }

    setFavCount(favRes.data?.length ?? 0);
    setLoading(false);
  };

  const logged   = week.filter((d) => d.mood);
  const moodCounts = logged.reduce((acc, d) => { acc[d.mood] = (acc[d.mood] || 0) + 1; return acc; }, {});
  const topMood  = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const streakPct = Math.round((logged.length / 7) * 100);

  const card = `${darkMode ? "glass-card-dark" : "glass-card"}`;

  return (
    <main className={`relative min-h-screen pb-28 overflow-hidden transition-colors duration-500 ${darkMode ? "bg-[radial-gradient(ellipse_at_top,_#2d0a2e_0%,_#140a1e_55%,_#0a0810_100%)]" : "bg-[radial-gradient(ellipse_at_top,_#ffe4f0_0%,_#f3e8ff_50%,_#fff5f7_100%)]"}`}>
      <div className={`absolute top-[-80px] right-[-80px] w-[350px] h-[350px] rounded-full blur-[100px] opacity-30 animate-float-slow pointer-events-none ${darkMode ? "bg-rose-950" : "bg-rose-200"}`} />
      <div className={`absolute bottom-0 left-[-60px] w-[300px] h-[300px] rounded-full blur-[80px] opacity-20 animate-float pointer-events-none ${darkMode ? "bg-purple-950" : "bg-purple-200"}`} />

      {/* Header */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 pt-6">
        <div className={`flex items-center justify-between px-5 py-3.5 rounded-2xl ${card}`}>
          <div>
            <p className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? "text-rose-400" : "text-rose-400"}`}>Your journey</p>
            <h1 className="text-xl font-bold gradient-text-love">Love History 📊</h1>
          </div>
          <button onClick={toggle} className={`p-2.5 rounded-xl border transition-all hover:scale-105 ${darkMode ? "bg-white/8 text-yellow-300 border-white/10" : "bg-black/5 text-gray-500 border-black/8"}`}>
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 mt-5 space-y-4">

        {/* Affirmation */}
        <div className={`rounded-3xl px-6 py-5 text-center ${card}`}>
          <p className={`text-xs font-semibold uppercase tracking-widest mb-2 ${darkMode ? "text-rose-400" : "text-rose-400"}`}>Today&apos;s Affirmation</p>
          <p className={`text-sm font-semibold leading-relaxed ${darkMode ? "text-gray-100" : "text-gray-700"}`}>&ldquo;{affirmation}&rdquo;</p>
        </div>

        {/* Stats row 1 */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: "📅", label: "Days Logged",    value: logged.length, suffix: "/7" },
            { icon: "💗", label: "Top Mood",        value: topMood ?? "—", suffix: "" },
            { icon: "💆", label: "Ritual Actions",  value: ritualCount, suffix: "" },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl p-4 text-center ${card}`}>
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="font-black gradient-text-love text-xl leading-none">{s.value}<span className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-400"}`}>{s.suffix}</span></div>
              <p className={`text-[10px] mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Stats row 2 */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: "📓", label: "Journal Entries", value: journalCount, suffix: "" },
            { icon: "✍️",  label: "Words Written",   value: journalWords, suffix: "" },
            { icon: "❤️",  label: "Fav Quotes",      value: favCount,    suffix: "" },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl p-4 text-center ${card}`}>
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="font-black gradient-text-love text-xl leading-none">{s.value}<span className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-400"}`}>{s.suffix}</span></div>
              <p className={`text-[10px] mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Weekly streak bar */}
        <div className={`rounded-3xl p-6 ${card}`}>
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-base font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>🔥 Weekly Streak</h2>
            <span className="font-black gradient-text-love text-lg">{streakPct}%</span>
          </div>
          <div className={`h-2.5 rounded-full overflow-hidden ${darkMode ? "bg-white/10" : "bg-rose-100"}`}>
            <div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-400 transition-all duration-700" style={{ width: `${streakPct}%` }} />
          </div>
          <p className={`text-xs mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{logged.length}/7 days logged this week</p>
        </div>

        {/* Weekly mood grid */}
        {loading ? (
          <div className={`rounded-3xl p-10 text-center ${card}`}>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Loading your history…</p>
          </div>
        ) : logged.length === 0 ? (
          <div className={`rounded-3xl p-10 text-center ${card}`}>
            <p className="text-4xl mb-3">🌱</p>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No entries yet — start your self-love journal today 🌸</p>
          </div>
        ) : (
          <div className={`rounded-3xl p-6 ${card}`}>
            <h2 className={`text-base font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>💕 This Week&apos;s Moods</h2>
            <div className="hidden sm:flex justify-between gap-2">
              {week.map((d, i) => {
                const meta = MOOD_META[d.mood];
                return (
                  <div key={i} className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl border transition-all ${d.mood ? (meta?.bg ?? "bg-rose-400/15 border-rose-200/30") : darkMode ? "bg-white/4 border-white/6" : "bg-white/30 border-white/50"}`}>
                    <span className={`text-[11px] font-semibold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{d.day}</span>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${d.mood ? (darkMode ? "bg-white/12" : "bg-white/60") : (darkMode ? "bg-white/5" : "bg-white/30")}`}>
                      {d.mood ?? <span className={`text-sm ${darkMode ? "text-gray-600" : "text-gray-300"}`}>—</span>}
                    </div>
                    <span className={`text-[10px] font-medium ${meta?.text ?? (darkMode ? "text-gray-500" : "text-gray-400")}`}>{d.mood ? (meta?.label ?? "") : "—"}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col gap-2 sm:hidden">
              {week.map((d, i) => {
                const meta = MOOD_META[d.mood];
                return (
                  <div key={i} className={`flex items-center justify-between px-4 py-3 rounded-2xl border ${d.mood ? (meta?.bg ?? "bg-rose-400/15 border-rose-200/30") : darkMode ? "bg-white/4 border-white/6" : "bg-white/30 border-white/50"}`}>
                    <span className={`text-sm font-bold w-10 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{d.day}</span>
                    <span className="text-2xl">{d.mood ?? "—"}</span>
                    <span className={`text-xs w-16 text-right font-medium ${meta?.text ?? (darkMode ? "text-gray-500" : "text-gray-400")}`}>{d.mood ? (meta?.label ?? "") : "No entry"}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Mood breakdown */}
        {Object.keys(moodCounts).length > 0 && (
          <div className={`rounded-3xl p-6 ${card}`}>
            <h2 className={`text-base font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>🎭 Mood Breakdown</h2>
            <div className="space-y-2.5">
              {Object.entries(moodCounts).sort((a, b) => b[1] - a[1]).map(([emoji, count]) => {
                const meta = MOOD_META[emoji];
                const pct  = Math.round((count / logged.length) * 100);
                return (
                  <div key={emoji} className="flex items-center gap-3">
                    <span className="text-xl w-7 flex-shrink-0">{emoji}</span>
                    <div className="flex-1">
                      <div className={`h-2 rounded-full overflow-hidden ${darkMode ? "bg-white/10" : "bg-gray-100"}`}>
                        <div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-400 transition-all duration-700" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <span className={`text-xs font-semibold w-8 text-right ${meta?.text ?? "text-gray-500"}`}>{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Gratitude */}
        {gratitude.length > 0 && (
          <div className={`rounded-3xl p-6 ${card}`}>
            <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${darkMode ? "text-rose-400" : "text-rose-400"}`}>Today</p>
            <h2 className={`text-base font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>🙏 Gratitude Entries</h2>
            <div className="space-y-2.5">
              {gratitude.map((g, i) => (
                <div key={i} className={`flex gap-3 px-4 py-3 rounded-2xl ${darkMode ? "bg-white/5 border border-white/8" : "bg-white/55 border border-white/65"}`}>
                  <span className={`text-sm font-bold flex-shrink-0 ${darkMode ? "text-rose-400" : "text-rose-400"}`}>{i + 1}.</span>
                  <p className={`text-sm ${darkMode ? "text-gray-200" : "text-gray-700"}`}>{g}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className={`rounded-3xl px-6 py-5 text-center ${card}`}>
          <p className="text-2xl mb-2">{logged.length === 7 ? "🏆" : logged.length >= 4 ? "🌟" : logged.length >= 1 ? "🌸" : "🌱"}</p>
          <p className={`text-sm font-semibold ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
            {logged.length === 7 && "A perfect week of self-love — you are absolutely glowing 💖"}
            {logged.length >= 4 && logged.length < 7 && "More than half the week logged — keep showing up 🌸"}
            {logged.length >= 1 && logged.length < 4 && "Every entry is an act of self-love 💗"}
            {logged.length === 0 && "Your journey starts the moment you decide to begin 🌱"}
          </p>
        </div>
      </div>

      <BottomNav darkMode={darkMode} />
    </main>
  );
}
