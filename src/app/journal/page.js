"use client";

import { useState, useEffect, useMemo } from "react";
import { Sun, Moon, Search, Trash2, Plus, X, BookOpen } from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";
import { useAuth } from "../context/AuthContext";
import BottomNav from "../components/BottomNav";

const PROMPTS = [
  "What made me smile today?",
  "One thing I'm proud of myself for…",
  "A challenge I faced and how I handled it…",
  "How did I show up for myself today?",
  "What emotion is present right now, and why?",
  "Something I want to let go of…",
  "A moment I felt truly at peace today…",
  "What does my body need right now?",
  "One small win I want to celebrate…",
  "What would I tell my past self today?",
  "What am I grateful for in this moment?",
  "How can I be kinder to myself tomorrow?",
];

const MOODS = [
  { emoji: "🥰", label: "Loved" },
  { emoji: "😊", label: "Calm" },
  { emoji: "🤔", label: "Reflective" },
  { emoji: "😔", label: "Low" },
  { emoji: "😤", label: "Tense" },
  { emoji: "🌟", label: "Inspired" },
];

export default function JournalPage() {
  const { darkMode, toggle } = useDarkMode();
  const { user, supabase }   = useAuth();

  const [entries,   setEntries]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [writing,   setWriting]   = useState(false);
  const [title,     setTitle]     = useState("");
  const [body,      setBody]      = useState("");
  const [entryMood, setEntryMood] = useState(null);
  const [search,    setSearch]    = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [deleteId,  setDeleteId]  = useState(null);
  const [viewEntry, setViewEntry] = useState(null);
  const [prompt,    setPrompt]    = useState("");

  const pickPrompt = () => setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);

  useEffect(() => {
    pickPrompt();
    if (!user) return;
    loadEntries();
  }, [user]);

  const loadEntries = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setEntries(data ?? []);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!body.trim()) return;
    const now = new Date();
    const { data, error } = await supabase.from("journal_entries").insert({
      user_id:    user.id,
      title:      title.trim() || now.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }),
      body:       body.trim(),
      mood_emoji: entryMood?.emoji ?? null,
      mood_label: entryMood?.label ?? null,
    }).select().single();

    if (!error && data) {
      setEntries([data, ...entries]);
      setWriting(false);
      setTitle(""); setBody(""); setEntryMood(null);
    }
  };

  const handleDelete = async (id) => {
    await supabase.from("journal_entries").delete().eq("id", id);
    setEntries(entries.filter((e) => e.id !== id));
    setDeleteId(null);
    if (viewEntry?.id === id) setViewEntry(null);
  };

  const allTags = useMemo(() => {
    const moods = [...new Set(entries.map((e) => e.mood_label).filter(Boolean))];
    return ["All", ...moods];
  }, [entries]);

  const filtered = useMemo(() => {
    let list = entries;
    if (activeTag !== "All") list = list.filter((e) => e.mood_label === activeTag);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((e) => e.title?.toLowerCase().includes(q) || e.body?.toLowerCase().includes(q));
    }
    return list;
  }, [entries, activeTag, search]);

  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0;
  const totalWords = entries.reduce((a, e) => a + (e.body?.trim().split(/\s+/).length ?? 0), 0);
  const thisWeek   = entries.filter((e) => (Date.now() - new Date(e.created_at).getTime()) < 7 * 86400000).length;

  const card = `${darkMode ? "glass-card-dark" : "glass-card"}`;
  const inp  = `w-full px-4 py-3 rounded-2xl text-sm border outline-none transition-all ${darkMode ? "bg-white/6 border-white/10 text-gray-100 placeholder:text-gray-600 focus:border-rose-400/40" : "bg-white/60 border-white/70 text-gray-700 placeholder:text-gray-400 focus:border-rose-300"}`;

  return (
    <main className={`relative min-h-screen pb-28 overflow-hidden transition-colors duration-500 ${darkMode ? "bg-[radial-gradient(ellipse_at_top,_#2d0a2e_0%,_#140a1e_55%,_#0a0810_100%)]" : "bg-[radial-gradient(ellipse_at_top,_#ffe4f0_0%,_#f3e8ff_50%,_#fff5f7_100%)]"}`}>
      <div className={`absolute top-[-80px] right-[-80px] w-[380px] h-[380px] rounded-full blur-[110px] opacity-30 animate-float-slow pointer-events-none ${darkMode ? "bg-purple-950" : "bg-purple-200"}`} />
      <div className={`absolute bottom-0 left-[-60px] w-[300px] h-[300px] rounded-full blur-[90px] opacity-20 animate-float pointer-events-none ${darkMode ? "bg-rose-950" : "bg-rose-200"}`} />

      {/* Delete modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm px-6">
          <div className={`w-full max-w-sm rounded-3xl p-7 text-center animate-fade-in-up ${card}`}>
            <p className="text-3xl mb-3">🗑️</p>
            <h3 className={`text-base font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>Delete this entry?</h3>
            <p className={`text-sm mb-6 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>This can&apos;t be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className={`flex-1 py-3 rounded-2xl text-sm font-semibold border ${darkMode ? "bg-white/8 text-gray-200 border-white/10" : "bg-white/60 text-gray-600 border-white/70"}`}>Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-3 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-500">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* View modal */}
      {viewEntry && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-black/50 backdrop-blur-sm px-4 py-8">
          <div className={`w-full max-w-lg rounded-3xl p-7 animate-fade-in-up relative ${card}`}>
            <button onClick={() => setViewEntry(null)} className={`absolute top-4 right-4 p-2 rounded-xl border ${darkMode ? "bg-white/8 border-white/10 text-gray-300" : "bg-white/60 border-white/70 text-gray-500"}`}><X size={15} /></button>
            <div className="flex items-center gap-2 mb-1">
              {viewEntry.mood_emoji && <span className="text-xl">{viewEntry.mood_emoji}</span>}
              <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-400"}`}>{new Date(viewEntry.created_at).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span>
            </div>
            <h2 className={`text-lg font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>{viewEntry.title}</h2>
            <p className={`text-sm leading-relaxed whitespace-pre-wrap ${darkMode ? "text-gray-200" : "text-gray-700"}`}>{viewEntry.body}</p>
            <button onClick={() => { setDeleteId(viewEntry.id); setViewEntry(null); }} className="mt-6 flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-500 transition-colors">
              <Trash2 size={12} /> Delete entry
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-6">
        <div className={`flex items-center justify-between px-5 py-3.5 rounded-2xl ${card}`}>
          <div>
            <p className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? "text-rose-400" : "text-rose-400"}`}>Your Safe Space</p>
            <h1 className="text-xl font-bold gradient-text-love">My Journal 📓</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { setWriting(true); pickPrompt(); }} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 shadow-md hover:scale-105 transition-all">
              <Plus size={13} /> New Entry
            </button>
            <button onClick={toggle} className={`p-2.5 rounded-xl border transition-all hover:scale-105 ${darkMode ? "bg-white/8 text-yellow-300 border-white/10" : "bg-black/5 text-gray-500 border-black/8"}`}>
              {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 mt-5 space-y-5">

        {/* Write panel */}
        {writing && (
          <div className={`rounded-3xl p-6 animate-fade-in-up ${card}`}>
            <div className={`flex items-start gap-3 p-4 rounded-2xl mb-5 ${darkMode ? "bg-white/5 border border-white/8" : "bg-rose-50/80 border border-rose-100"}`}>
              <span className="text-lg flex-shrink-0">💭</span>
              <div className="flex-1">
                <p className={`text-xs font-semibold mb-1 ${darkMode ? "text-rose-400" : "text-rose-400"}`}>Today&apos;s Prompt</p>
                <p className={`text-sm italic ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{prompt}</p>
              </div>
              <button onClick={pickPrompt} className={`p-1.5 rounded-lg flex-shrink-0 transition-all hover:scale-110 ${darkMode ? "text-gray-400 hover:text-rose-400" : "text-gray-300 hover:text-rose-400"}`}>🔀</button>
            </div>

            <input type="text" placeholder="Entry title (optional)…" value={title} onChange={(e) => setTitle(e.target.value)} className={`${inp} mb-3`} />

            <div className="flex gap-2 mb-4 flex-wrap">
              {MOODS.map((m) => (
                <button key={m.label} onClick={() => setEntryMood(entryMood?.label === m.label ? null : m)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all
                    ${entryMood?.label === m.label ? "bg-rose-500/30 border-rose-400/40 text-white scale-105" : darkMode ? "bg-white/6 border-white/10 text-gray-300 hover:bg-white/12" : "bg-white/50 border-white/65 text-gray-500 hover:bg-white/80"}`}>
                  {m.emoji} {m.label}
                </button>
              ))}
            </div>

            <textarea rows={7} placeholder="Write freely… this is your space. No one is watching. 🌸" value={body} onChange={(e) => setBody(e.target.value)} className={`${inp} resize-none`} />
            <div className="flex items-center justify-between mt-1 mb-4">
              <span className={`text-[10px] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{wordCount} word{wordCount !== 1 ? "s" : ""}</span>
            </div>

            <div className="flex gap-3">
              <button onClick={handleSave} disabled={!body.trim()} className="flex-1 py-3.5 rounded-2xl font-bold text-white text-sm bg-gradient-to-r from-rose-500 to-pink-500 disabled:opacity-40 hover:scale-[1.02] transition-all shadow-lg shadow-rose-400/20">
                Save Entry 💾
              </button>
              <button onClick={() => setWriting(false)} className={`flex-1 py-3.5 rounded-2xl font-semibold text-sm border ${darkMode ? "bg-white/8 text-gray-200 border-white/10" : "bg-white/50 text-gray-500 border-white/60"}`}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: "📓", label: "Total",      value: entries.length },
            { icon: "📅", label: "This Week",  value: thisWeek },
            { icon: "✍️",  label: "Words",      value: totalWords },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl p-4 text-center ${card}`}>
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="font-black gradient-text-love text-xl leading-none">{s.value}</div>
              <p className={`text-[10px] mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{s.label}</p>
            </div>
          ))}
        </div>

        {entries.length > 0 && (
          <>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl ${card}`}>
              <Search size={15} className="text-gray-400 flex-shrink-0" />
              <input type="text" placeholder="Search entries…" value={search} onChange={(e) => setSearch(e.target.value)} className={`flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400 ${darkMode ? "text-white" : "text-gray-700"}`} />
              {search && <button onClick={() => setSearch("")} className="text-gray-400 hover:text-rose-400 text-lg leading-none">×</button>}
            </div>
            {allTags.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allTags.map((tag) => (
                  <button key={tag} onClick={() => setActiveTag(tag)}
                    className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold border transition-all
                      ${activeTag === tag ? "bg-rose-500 text-white border-transparent" : darkMode ? "bg-white/8 text-gray-300 border-white/10 hover:bg-white/14" : "bg-white/60 text-gray-500 border-white/70 hover:bg-white/85"}`}>
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {loading ? (
          <div className={`rounded-3xl p-10 text-center ${card}`}>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Loading your entries…</p>
          </div>
        ) : entries.length === 0 && !writing ? (
          <div className={`rounded-3xl p-10 text-center ${card}`}>
            <BookOpen size={40} className={`mx-auto mb-4 ${darkMode ? "text-rose-800" : "text-rose-200"}`} />
            <h3 className={`font-bold mb-2 ${darkMode ? "text-white" : "text-gray-700"}`}>Your journal is waiting 🌸</h3>
            <p className={`text-sm mb-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Write your first entry — your private, judgment-free space.</p>
            <button onClick={() => { setWriting(true); pickPrompt(); }} className="px-6 py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 shadow-lg hover:scale-105 transition-all">
              Write Something 💗
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((entry, i) => (
              <div key={entry.id} onClick={() => setViewEntry(entry)}
                className={`rounded-3xl p-5 cursor-pointer hover:scale-[1.01] transition-all animate-fade-in-up ${card}`}
                style={{ animationDelay: `${i * 40}ms` }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {entry.mood_emoji && <span className="text-base">{entry.mood_emoji}</span>}
                      <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-400"}`}>
                        {new Date(entry.created_at).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                      </p>
                    </div>
                    <h3 className={`text-sm font-bold mb-1.5 ${darkMode ? "text-white" : "text-gray-800"}`}>{entry.title}</h3>
                    <p className={`text-xs leading-relaxed line-clamp-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{entry.body}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setDeleteId(entry.id); }}
                    className={`flex-shrink-0 p-2 rounded-xl border transition-all hover:scale-110 ${darkMode ? "bg-white/5 border-white/8 text-gray-500 hover:text-rose-400" : "bg-white/50 border-white/60 text-gray-300 hover:text-rose-400"}`}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav darkMode={darkMode} />
    </main>
  );
}
