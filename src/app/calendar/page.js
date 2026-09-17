"use client";

import { useEffect, useState, useMemo } from "react";
import { Sun, Moon, ChevronLeft, ChevronRight, Plus, Trash2, X, Bell, BellOff } from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";
import { useAuth } from "../context/AuthContext";
import { requestNotifyPermission, remindTodaysEvents, notifySupported } from "../../lib/notify";
import BottomNav from "../components/BottomNav";

const TYPES = [
  { id: "personal",  label: "Personal",  emoji: "🌸", color: "bg-rose-400" },
  { id: "selfcare",  label: "Self-Care", emoji: "💆", color: "bg-purple-400" },
  { id: "health",    label: "Health",    emoji: "🩺", color: "bg-sky-400" },
  { id: "social",    label: "Social",    emoji: "🥰", color: "bg-fuchsia-400" },
  { id: "goal",      label: "Goal",      emoji: "🎯", color: "bg-emerald-400" },
];
const typeMeta = (id) => TYPES.find((t) => t.id === id) ?? TYPES[0];

const iso = (y, m, d) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export default function CalendarPage() {
  const { darkMode, toggle } = useDarkMode();
  const { user, supabase }   = useAuth();

  const now = new Date();
  const [year,  setYear]  = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(null);   // iso date string
  const [adding, setAdding] = useState(false);
  const [notifOn, setNotifOn] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  // form
  const [title, setTitle] = useState("");
  const [type,  setType]  = useState("personal");
  const [note,  setNote]  = useState("");
  const [remind, setRemind] = useState(true);

  useEffect(() => {
    if (!user) return;
    load();
    if (notifySupported()) setNotifOn(Notification.permission === "granted");
  }, [user]);

  const load = async () => {
    const { data } = await supabase.from("calendar_events").select("*").eq("user_id", user.id);
    setEvents(data ?? []);
    if (data) remindTodaysEvents(data);
  };

  const enableNotifs = async () => {
    const res = await requestNotifyPermission();
    setNotifOn(res === "granted");
    if (res === "granted") remindTodaysEvents(events);
  };

  const addEvent = async () => {
    if (!title.trim() || !selected) return;
    const { data, error } = await supabase.from("calendar_events").insert({
      user_id: user.id, title: title.trim(), event_date: selected, event_type: type, note: note.trim() || null, remind,
    }).select().single();
    if (error) {
      setErrMsg("Couldn't save this event. Please try again in a moment.");
      setTimeout(() => setErrMsg(""), 4000);
      return;
    }
    if (data) setEvents((prev) => [...prev, data]);
    setAdding(false); setTitle(""); setNote(""); setType("personal"); setRemind(true);
  };

  const removeEvent = async (id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    await supabase.from("calendar_events").delete().eq("id", id);
  };

  // Build calendar grid (Monday-first)
  const cells = useMemo(() => {
    const first = new Date(year, month, 1);
    const startPad = (first.getDay() + 6) % 7; // Mon=0
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const arr = [];
    for (let i = 0; i < startPad; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
    return arr;
  }, [year, month]);

  const eventsByDate = useMemo(() => {
    const map = {};
    for (const e of events) (map[e.event_date] ??= []).push(e);
    return map;
  }, [events]);

  const todayIso = iso(now.getFullYear(), now.getMonth(), now.getDate());
  const selectedEvents = selected ? (eventsByDate[selected] ?? []) : [];

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(year - 1); } else setMonth(month - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(year + 1); } else setMonth(month + 1); };

  const card = darkMode ? "glass-card-dark" : "glass-card";
  const inp = `w-full px-4 py-3 rounded-2xl text-sm border outline-none ${darkMode ? "bg-white/6 border-white/10 text-white placeholder:text-gray-500" : "bg-white/60 border-white/70 text-gray-700 placeholder:text-gray-400"}`;

  return (
    <main className={`relative min-h-screen pb-28 overflow-hidden transition-colors duration-500
      ${darkMode ? "bg-[radial-gradient(ellipse_at_top,_#2d0a2e_0%,_#140a1e_55%,_#0a0810_100%)]" : "bg-[radial-gradient(ellipse_at_top,_#ffe4f0_0%,_#f3e8ff_50%,_#fff5f7_100%)]"}`}>
      <div className={`absolute top-[-80px] right-[-80px] w-[350px] h-[350px] rounded-full blur-[100px] opacity-30 animate-float-slow pointer-events-none ${darkMode ? "bg-rose-950" : "bg-rose-200"}`} />

      {/* Add-event modal */}
      {adding && selected && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-6">
          <div className={`w-full max-w-md rounded-3xl p-6 animate-fade-in-up ${card}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-base font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                New event · {new Date(selected + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </h3>
              <button onClick={() => setAdding(false)} className={`p-2 rounded-xl border ${darkMode ? "bg-white/8 border-white/10 text-gray-300" : "bg-white/60 border-white/70 text-gray-500"}`}><X size={15} /></button>
            </div>
            <input type="text" placeholder="Event title…" value={title} onChange={(e) => setTitle(e.target.value)} className={`${inp} mb-3`} />
            <div className="flex gap-2 flex-wrap mb-3">
              {TYPES.map((t) => (
                <button key={t.id} onClick={() => setType(t.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${type === t.id ? "bg-rose-500 text-white border-transparent" : darkMode ? "bg-white/6 text-gray-300 border-white/10" : "bg-white/55 text-gray-500 border-white/65"}`}>
                  {t.emoji} {t.label}
                </button>
              ))}
            </div>
            <textarea rows={2} placeholder="Note (optional)…" value={note} onChange={(e) => setNote(e.target.value)} className={`${inp} resize-none mb-3`} />
            <button onClick={() => setRemind(!remind)}
              className={`flex items-center gap-2 text-xs font-semibold mb-4 ${remind ? "text-rose-400" : darkMode ? "text-gray-500" : "text-gray-400"}`}>
              {remind ? <Bell size={14} /> : <BellOff size={14} />} Remind me on the day
            </button>
            <button onClick={addEvent} disabled={!title.trim()}
              className="w-full py-3 rounded-2xl font-bold text-white text-sm bg-gradient-to-r from-rose-500 to-pink-500 disabled:opacity-40 transition-all hover:scale-[1.02]">
              Add Event
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 pt-6">
        <div className={`flex items-center justify-between px-5 py-3.5 rounded-2xl ${card}`}>
          <div>
            <p className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? "text-rose-400" : "text-rose-400"}`}>Your moments</p>
            <h1 className="text-xl font-bold gradient-text-love">Calendar 📅</h1>
          </div>
          <div className="flex items-center gap-2">
            {notifySupported() && (
              <button onClick={enableNotifs} title="Reminders"
                className={`p-2.5 rounded-xl border transition-all hover:scale-105 ${notifOn ? "bg-rose-500 text-white border-rose-400" : darkMode ? "bg-white/8 text-gray-300 border-white/10" : "bg-white/60 text-gray-500 border-white/70"}`}>
                {notifOn ? <Bell size={16} /> : <BellOff size={16} />}
              </button>
            )}
            <button onClick={toggle} className={`p-2.5 rounded-xl border transition-all hover:scale-105 ${darkMode ? "bg-white/8 text-yellow-300 border-white/10" : "bg-black/5 text-gray-500 border-black/8"}`}>
              {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 mt-5 space-y-4">
        {errMsg && (
          <div className="px-5 py-3 rounded-2xl text-center text-sm font-semibold border bg-red-500/85 border-red-300/20 text-white animate-fade-in-up">
            {errMsg}
          </div>
        )}
        {/* Month nav + grid */}
        <div className={`rounded-3xl p-6 ${card}`}>
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className={`p-2 rounded-xl border ${darkMode ? "bg-white/8 text-gray-300 border-white/10" : "bg-white/60 text-gray-500 border-white/70"}`}><ChevronLeft size={16} /></button>
            <h2 className={`text-base font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{MONTHS[month]} {year}</h2>
            <button onClick={nextMonth} className={`p-2 rounded-xl border ${darkMode ? "bg-white/8 text-gray-300 border-white/10" : "bg-white/60 text-gray-500 border-white/70"}`}><ChevronRight size={16} /></button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {["M","T","W","T","F","S","S"].map((d, i) => (
              <div key={i} className={`text-center text-[10px] font-semibold ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              if (d === null) return <div key={i} />;
              const dISO = iso(year, month, d);
              const dayEvents = eventsByDate[dISO] ?? [];
              const isToday = dISO === todayIso;
              const isSel = dISO === selected;
              return (
                <button key={i} onClick={() => setSelected(dISO)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all
                    ${isSel ? "bg-gradient-to-br from-rose-500 to-pink-500 text-white" : isToday ? (darkMode ? "bg-white/10 ring-1 ring-rose-400/50" : "bg-rose-100 ring-1 ring-rose-300") : darkMode ? "hover:bg-white/6" : "hover:bg-white/50"}`}>
                  <span className={`text-xs font-semibold ${isSel ? "text-white" : darkMode ? "text-gray-200" : "text-gray-700"}`}>{d}</span>
                  {dayEvents.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5">
                      {dayEvents.slice(0, 3).map((e, j) => (
                        <span key={j} className={`w-1 h-1 rounded-full ${isSel ? "bg-white" : typeMeta(e.event_type).color}`} />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected day */}
        {selected && (
          <div className={`rounded-3xl p-6 ${card}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-base font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                {new Date(selected + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </h3>
              <button onClick={() => setAdding(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500">
                <Plus size={13} /> Add
              </button>
            </div>
            {selectedEvents.length === 0 ? (
              <p className={`text-sm text-center py-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No events — add one to mark this day 🌸</p>
            ) : (
              <div className="space-y-2">
                {selectedEvents.map((e) => (
                  <div key={e.id} className={`flex items-start gap-3 px-4 py-3 rounded-2xl ${darkMode ? "bg-white/5 border border-white/8" : "bg-white/55 border border-white/65"}`}>
                    <span className="text-lg">{typeMeta(e.event_type).emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>{e.title}</p>
                      {e.note && <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{e.note}</p>}
                      {e.remind && <span className="inline-flex items-center gap-1 text-[10px] text-rose-400 mt-1"><Bell size={9} /> Reminder on</span>}
                    </div>
                    <button onClick={() => removeEvent(e.id)} className={`p-1.5 rounded-lg ${darkMode ? "text-gray-500 hover:text-rose-400" : "text-gray-300 hover:text-rose-400"}`}><Trash2 size={13} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Upcoming */}
        {(() => {
          const upcoming = [...events].filter((e) => e.event_date >= todayIso).sort((a, b) => a.event_date.localeCompare(b.event_date)).slice(0, 5);
          if (!upcoming.length) return null;
          return (
            <div className={`rounded-3xl p-6 ${card}`}>
              <h3 className={`text-base font-bold mb-3 ${darkMode ? "text-white" : "text-gray-800"}`}>🔜 Upcoming</h3>
              <div className="space-y-2">
                {upcoming.map((e) => (
                  <div key={e.id} className="flex items-center gap-3">
                    <div className={`w-11 flex-shrink-0 text-center rounded-xl py-1 ${darkMode ? "bg-white/6" : "bg-rose-50"}`}>
                      <p className={`text-[9px] uppercase font-bold ${darkMode ? "text-gray-400" : "text-rose-400"}`}>{new Date(e.event_date + "T12:00:00").toLocaleDateString("en-US", { month: "short" })}</p>
                      <p className={`text-sm font-black ${darkMode ? "text-white" : "text-gray-800"}`}>{new Date(e.event_date + "T12:00:00").getDate()}</p>
                    </div>
                    <span className="text-base">{typeMeta(e.event_type).emoji}</span>
                    <p className={`text-sm flex-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>{e.title}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>

      <BottomNav darkMode={darkMode} />
    </main>
  );
}
