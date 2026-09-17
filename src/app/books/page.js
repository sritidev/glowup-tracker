"use client";

import { useEffect, useState, useMemo } from "react";
import { Sun, Moon, Plus, Trash2, X, Star, Search, BookOpen } from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";
import { useAuth } from "../context/AuthContext";
import BottomNav from "../components/BottomNav";

function Stars({ value, onChange, size = 16, readOnly = false }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" disabled={readOnly}
          onClick={() => !readOnly && onChange?.(n)}
          className={readOnly ? "" : "transition-transform hover:scale-110"}>
          <Star size={size} className={n <= value ? "fill-amber-400 text-amber-400" : "text-gray-300"} />
        </button>
      ))}
    </div>
  );
}

export default function BooksPage() {
  const { darkMode, toggle } = useDarkMode();
  const { user, supabase }   = useAuth();

  const [books,   setBooks]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding,  setAdding]  = useState(false);
  const [search,  setSearch]  = useState("");
  const [view,    setView]    = useState(null);
  const [errMsg,  setErrMsg]  = useState("");

  // form
  const [title,      setTitle]      = useState("");
  const [author,     setAuthor]     = useState("");
  const [rating,     setRating]     = useState(0);
  const [experience, setExperience] = useState("");
  const [finishedOn, setFinishedOn] = useState("");

  useEffect(() => {
    if (!user) return;
    load();
  }, [user]);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("books").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setBooks(data ?? []);
    setLoading(false);
  };

  const resetForm = () => { setTitle(""); setAuthor(""); setRating(0); setExperience(""); setFinishedOn(""); };

  const addBook = async () => {
    if (!title.trim()) return;
    const { data, error } = await supabase.from("books").insert({
      user_id: user.id, title: title.trim(), author: author.trim() || null,
      rating, experience: experience.trim() || null, finished_on: finishedOn || null,
    }).select().single();
    if (error) {
      setErrMsg("Couldn't save this book. Please try again in a moment.");
      setTimeout(() => setErrMsg(""), 4000);
      return;
    }
    if (data) setBooks((prev) => [data, ...prev]);
    setAdding(false); resetForm();
  };

  const removeBook = async (id) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
    await supabase.from("books").delete().eq("id", id);
    if (view?.id === id) setView(null);
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return books;
    const q = search.toLowerCase();
    return books.filter((b) => b.title.toLowerCase().includes(q) || (b.author ?? "").toLowerCase().includes(q));
  }, [books, search]);

  const avgRating = books.length ? (books.reduce((a, b) => a + (b.rating || 0), 0) / books.filter((b) => b.rating).length || 0) : 0;
  const card = darkMode ? "glass-card-dark" : "glass-card";
  const inp = `w-full px-4 py-3 rounded-2xl text-sm border outline-none ${darkMode ? "bg-white/6 border-white/10 text-white placeholder:text-gray-500" : "bg-white/60 border-white/70 text-gray-700 placeholder:text-gray-400"}`;

  return (
    <main className={`relative min-h-screen pb-28 overflow-hidden transition-colors duration-500
      ${darkMode ? "bg-[radial-gradient(ellipse_at_top,_#2d0a2e_0%,_#140a1e_55%,_#0a0810_100%)]" : "bg-[radial-gradient(ellipse_at_top,_#ffe4f0_0%,_#f3e8ff_50%,_#fff5f7_100%)]"}`}>
      <div className={`absolute top-[-80px] left-[-80px] w-[350px] h-[350px] rounded-full blur-[100px] opacity-30 animate-float-slow pointer-events-none ${darkMode ? "bg-amber-950" : "bg-amber-200"}`} />
      <div className={`absolute bottom-0 right-[-60px] w-[300px] h-[300px] rounded-full blur-[90px] opacity-20 animate-float pointer-events-none ${darkMode ? "bg-rose-950" : "bg-rose-200"}`} />

      {/* Add modal */}
      {adding && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-black/50 backdrop-blur-sm px-4 py-8">
          <div className={`w-full max-w-md rounded-3xl p-6 animate-fade-in-up ${card}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-base font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>📖 Add a book</h3>
              <button onClick={() => { setAdding(false); resetForm(); }} className={`p-2 rounded-xl border ${darkMode ? "bg-white/8 border-white/10 text-gray-300" : "bg-white/60 border-white/70 text-gray-500"}`}><X size={15} /></button>
            </div>
            <input type="text" placeholder="Book title…" value={title} onChange={(e) => setTitle(e.target.value)} className={`${inp} mb-3`} />
            <input type="text" placeholder="Author (optional)" value={author} onChange={(e) => setAuthor(e.target.value)} className={`${inp} mb-3`} />
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-xs font-semibold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Your rating</span>
              <Stars value={rating} onChange={setRating} size={20} />
            </div>
            <textarea rows={4} placeholder="How was the experience? What did it make you feel or think?" value={experience} onChange={(e) => setExperience(e.target.value)} className={`${inp} resize-none mb-3`} />
            <div className="mb-4">
              <label className={`text-xs font-semibold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Finished on (optional)</label>
              <input type="date" value={finishedOn} onChange={(e) => setFinishedOn(e.target.value)} className={`${inp} mt-1`} />
            </div>
            <button onClick={addBook} disabled={!title.trim()}
              className="w-full py-3 rounded-2xl font-bold text-white text-sm bg-gradient-to-r from-amber-500 to-rose-500 disabled:opacity-40 transition-all hover:scale-[1.02]">
              Add to Shelf
            </button>
          </div>
        </div>
      )}

      {/* View modal */}
      {view && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-black/50 backdrop-blur-sm px-4 py-8">
          <div className={`w-full max-w-lg rounded-3xl p-6 relative animate-fade-in-up ${card}`}>
            <button onClick={() => setView(null)} className={`absolute top-4 right-4 p-2 rounded-xl border ${darkMode ? "bg-white/8 border-white/10 text-gray-300" : "bg-white/60 border-white/70 text-gray-500"}`}><X size={15} /></button>
            <div className="text-4xl mb-2">📖</div>
            <h2 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{view.title}</h2>
            {view.author && <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>by {view.author}</p>}
            <div className="my-3"><Stars value={view.rating} readOnly /></div>
            {view.finished_on && <p className={`text-xs mb-3 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Finished {new Date(view.finished_on + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>}
            {view.experience && <p className={`text-sm leading-relaxed whitespace-pre-wrap ${darkMode ? "text-gray-200" : "text-gray-700"}`}>{view.experience}</p>}
            <button onClick={() => removeBook(view.id)} className="mt-5 flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-500"><Trash2 size={12} /> Remove from shelf</button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 pt-6">
        <div className={`flex items-center justify-between px-5 py-3.5 rounded-2xl ${card}`}>
          <div>
            <p className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? "text-amber-400" : "text-amber-500"}`}>Reading Life</p>
            <h1 className="text-xl font-bold gradient-text-love">My Bookshelf 📚</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setAdding(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-rose-500 shadow-md hover:scale-105 transition-all">
              <Plus size={13} /> Add Book
            </button>
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
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: "📚", label: "Books read", value: books.length },
            { icon: "⭐", label: "Avg rating", value: books.some((b) => b.rating) ? avgRating.toFixed(1) : "—" },
            { icon: "🏆", label: "5-star reads", value: books.filter((b) => b.rating === 5).length },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl p-4 text-center ${card}`}>
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="font-black gradient-text-love text-xl leading-none">{s.value}</div>
              <p className={`text-[10px] mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        {books.length > 0 && (
          <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl ${card}`}>
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input type="text" placeholder="Search title or author…" value={search} onChange={(e) => setSearch(e.target.value)}
              className={`flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400 ${darkMode ? "text-white" : "text-gray-700"}`} />
            {search && <button onClick={() => setSearch("")} className="text-gray-400 hover:text-rose-400 text-lg leading-none">×</button>}
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className={`rounded-3xl p-10 text-center ${card}`}><p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Loading your shelf…</p></div>
        ) : books.length === 0 ? (
          <div className={`rounded-3xl p-10 text-center ${card}`}>
            <BookOpen size={40} className={`mx-auto mb-4 ${darkMode ? "text-amber-800" : "text-amber-200"}`} />
            <h3 className={`font-bold mb-2 ${darkMode ? "text-white" : "text-gray-700"}`}>Your shelf is empty 📚</h3>
            <p className={`text-sm mb-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Add a book you&apos;ve read and capture how it made you feel.</p>
            <button onClick={() => setAdding(true)} className="px-6 py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-rose-500 shadow-lg hover:scale-105 transition-all">Add Your First Book</button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((b, i) => (
              <div key={b.id} onClick={() => setView(b)}
                className={`rounded-3xl p-5 cursor-pointer hover:scale-[1.01] transition-all animate-fade-in-up ${card}`}
                style={{ animationDelay: `${i * 40}ms` }}>
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-16 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl bg-gradient-to-br from-amber-400/30 to-rose-400/30 border ${darkMode ? "border-white/10" : "border-white/60"}`}>📖</div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-sm font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{b.title}</h3>
                    {b.author && <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>by {b.author}</p>}
                    {b.rating > 0 && <div className="mt-1"><Stars value={b.rating} readOnly size={13} /></div>}
                    {b.experience && <p className={`text-xs mt-1.5 leading-relaxed line-clamp-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{b.experience}</p>}
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); removeBook(b.id); }} className={`flex-shrink-0 p-2 rounded-xl border ${darkMode ? "bg-white/5 border-white/8 text-gray-500 hover:text-rose-400" : "bg-white/50 border-white/60 text-gray-300 hover:text-rose-400"}`}><Trash2 size={13} /></button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className={`rounded-3xl p-8 text-center ${card}`}><p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No books match your search 🔍</p></div>
            )}
          </div>
        )}
      </div>

      <BottomNav darkMode={darkMode} />
    </main>
  );
}
