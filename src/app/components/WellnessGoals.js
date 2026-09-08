"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Minus, Check, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const SUGGESTIONS = [
  { title: "Move 3 times this week", target: 3,  icon: "🏃" },
  { title: "Drink 2L water daily",   target: 7,  icon: "💧" },
  { title: "Journal 5 days",         target: 5,  icon: "📖" },
  { title: "Sleep 7+ hours",         target: 7,  icon: "🌙" },
  { title: "Complete 10 workouts",   target: 10, icon: "💪" },
  { title: "Practice breathing 5×",  target: 5,  icon: "🧘" },
  { title: "Build a consistent routine", target: 7, icon: "🌸" },
  { title: "Improve my mobility",    target: 5,  icon: "🌀" },
  { title: "Get stronger",           target: 8,  icon: "💗" },
];

export default function WellnessGoals({ darkMode }) {
  const { user, supabase } = useAuth();
  const [goals,   setGoals]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding,  setAdding]  = useState(false);
  const [title,   setTitle]   = useState("");
  const [target,  setTarget]  = useState(5);
  const [icon,    setIcon]    = useState("🎯");

  useEffect(() => {
    if (!user) return;
    load();
  }, [user]);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("wellness_goals").select("*").eq("user_id", user.id)
      .order("created_at", { ascending: true });
    setGoals(data ?? []);
    setLoading(false);
  };

  const addGoal = async (g) => {
    const payload = {
      user_id: user.id,
      title:   g?.title ?? title.trim(),
      target:  g?.target ?? target,
      icon:    g?.icon ?? icon,
      progress: 0,
    };
    if (!payload.title) return;
    const { data } = await supabase.from("wellness_goals").insert(payload).select().single();
    if (data) setGoals((prev) => [...prev, data]);
    setAdding(false); setTitle(""); setTarget(5); setIcon("🎯");
  };

  const updateProgress = async (goal, delta) => {
    const next = Math.max(0, Math.min(goal.target, goal.progress + delta));
    setGoals((prev) => prev.map((g) => g.id === goal.id ? { ...g, progress: next } : g));
    await supabase.from("wellness_goals").update({ progress: next }).eq("id", goal.id);
  };

  const removeGoal = async (id) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    await supabase.from("wellness_goals").delete().eq("id", id);
  };

  const card = darkMode ? "glass-card-dark" : "glass-card";
  const inp = `w-full px-4 py-3 rounded-2xl text-sm border outline-none ${darkMode ? "bg-white/6 border-white/10 text-white placeholder:text-gray-500" : "bg-white/60 border-white/70 text-gray-700 placeholder:text-gray-400"}`;

  return (
    <div className={`rounded-3xl p-6 ${card}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? "text-rose-400" : "text-rose-400"}`}>Wellness Goals</p>
          <h3 className={`text-base font-bold mt-0.5 ${darkMode ? "text-white" : "text-gray-800"}`}>🎯 What you&apos;re working toward</h3>
        </div>
        <button onClick={() => setAdding(!adding)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 shadow-md hover:scale-105 transition-all">
          {adding ? <X size={13} /> : <Plus size={13} />} {adding ? "Close" : "New"}
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className={`rounded-2xl p-4 mb-4 space-y-3 animate-fade-in-up ${darkMode ? "bg-white/5 border border-white/8" : "bg-white/50 border border-white/60"}`}>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Goal title…" className={inp} />
          <div className="flex items-center gap-3">
            <label className={`text-xs font-semibold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Target</label>
            <input type="number" min={1} value={target} onChange={(e) => setTarget(Math.max(1, +e.target.value))}
              className={`${inp} w-20 text-center`} />
            <button onClick={() => addGoal()} disabled={!title.trim()}
              className="ml-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 disabled:opacity-40">
              Add Goal
            </button>
          </div>
          {/* Suggestions */}
          <div className="flex gap-2 flex-wrap pt-1">
            {SUGGESTIONS.slice(0, 6).map((s) => (
              <button key={s.title} onClick={() => addGoal(s)}
                className={`text-[11px] px-3 py-1.5 rounded-full border transition-all hover:scale-105 ${darkMode ? "bg-white/8 text-gray-300 border-white/10" : "bg-white/60 text-gray-500 border-white/70"}`}>
                {s.icon} {s.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Goals list */}
      {loading ? (
        <p className={`text-sm text-center py-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Loading…</p>
      ) : goals.length === 0 ? (
        <p className={`text-sm text-center py-6 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          No goals yet — add one above to start growing 🌱
        </p>
      ) : (
        <div className="space-y-3">
          {goals.map((g) => {
            const pct = Math.round((g.progress / g.target) * 100);
            const complete = g.progress >= g.target;
            return (
              <div key={g.id} className={`rounded-2xl p-4 ${darkMode ? "bg-white/5 border border-white/8" : "bg-white/55 border border-white/65"}`}>
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="text-lg">{g.icon}</span>
                  <span className={`text-sm font-semibold flex-1 ${darkMode ? "text-white" : "text-gray-800"}`}>{g.title}</span>
                  {complete && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">Done 🎉</span>}
                  <button onClick={() => removeGoal(g.id)} className={`p-1.5 rounded-lg ${darkMode ? "text-gray-500 hover:text-rose-400" : "text-gray-300 hover:text-rose-400"}`}>
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className={`h-2 rounded-full overflow-hidden mb-2 ${darkMode ? "bg-white/10" : "bg-rose-100"}`}>
                  <div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-400 transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{g.progress} / {g.target} · {pct}%</span>
                  <div className="flex gap-1.5">
                    <button onClick={() => updateProgress(g, -1)}
                      className={`p-1.5 rounded-lg border ${darkMode ? "bg-white/8 text-gray-300 border-white/10" : "bg-white/60 text-gray-500 border-white/70"}`}>
                      <Minus size={13} />
                    </button>
                    <button onClick={() => updateProgress(g, 1)}
                      className="p-1.5 rounded-lg text-white bg-gradient-to-r from-rose-500 to-pink-500">
                      <Check size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
