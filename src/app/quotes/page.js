"use client";

import { useState, useEffect, useMemo } from "react";
import { Sun, Moon, Heart, Share2, Search } from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";
import { useAuth } from "../context/AuthContext";
import BottomNav from "../components/BottomNav";

const ALL_QUOTES = [
  { id: 1,  text: "You yourself, as much as anybody in the entire universe, deserve your love and affection.", author: "Buddha", category: "Self Worth" },
  { id: 2,  text: "To love oneself is the beginning of a lifelong romance.", author: "Oscar Wilde", category: "Self Worth" },
  { id: 3,  text: "You are enough. You have enough. You do enough.", author: "Unknown", category: "Self Worth" },
  { id: 4,  text: "Owning our story and loving ourselves through that process is the bravest thing we'll ever do.", author: "Brené Brown", category: "Self Worth" },
  { id: 5,  text: "You are not a drop in the ocean. You are the entire ocean in a drop.", author: "Rumi", category: "Self Worth" },
  { id: 6,  text: "No one can make you feel inferior without your consent.", author: "Eleanor Roosevelt", category: "Self Worth" },
  { id: 7,  text: "You are worthy of the love you keep trying to give everyone else.", author: "Unknown", category: "Self Worth" },
  { id: 8,  text: "Rest is not idleness. It is the key to a beautiful life.", author: "Unknown", category: "Healing" },
  { id: 9,  text: "Give yourself the same compassion you would give a good friend.", author: "Unknown", category: "Healing" },
  { id: 10, text: "Healing is not linear. Be patient with yourself.", author: "Unknown", category: "Healing" },
  { id: 11, text: "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, annoyed, frustrated, scared, or anxious.", author: "Lori Deschene", category: "Healing" },
  { id: 12, text: "The most powerful relationship you will ever have is the relationship with yourself.", author: "Steve Maraboli", category: "Healing" },
  { id: 13, text: "Be patient with yourself. Nothing in nature blooms all year.", author: "Unknown", category: "Growth" },
  { id: 14, text: "You are allowed to be both a masterpiece and a work in progress simultaneously.", author: "Sophia Bush", category: "Growth" },
  { id: 15, text: "Growth is painful. Change is painful. But nothing is as painful as staying stuck somewhere you don't belong.", author: "Mandy Hale", category: "Growth" },
  { id: 16, text: "Fall in love with taking care of yourself — mind, body, spirit.", author: "Unknown", category: "Growth" },
  { id: 17, text: "She believed she could, so she did.", author: "R.S. Grey", category: "Courage" },
  { id: 18, text: "Courage is not the absence of fear, but the triumph over it.", author: "Nelson Mandela", category: "Courage" },
  { id: 19, text: "You are braver than you believe, stronger than you seem, and smarter than you think.", author: "A.A. Milne", category: "Courage" },
  { id: 20, text: "Daring to set boundaries is about having the courage to love ourselves.", author: "Brené Brown", category: "Courage" },
  { id: 21, text: "Peace is the result of retraining your mind to process life as it is.", author: "Wayne Dyer", category: "Inner Peace" },
  { id: 22, text: "You don't always need a plan. Sometimes you just need to breathe, trust, let go.", author: "Mandy Hale", category: "Inner Peace" },
  { id: 23, text: "Almost everything will work again if you unplug it for a few minutes, including you.", author: "Anne Lamott", category: "Inner Peace" },
  { id: 24, text: "Within you there is a stillness and a sanctuary to which you can retreat at any time.", author: "Hermann Hesse", category: "Inner Peace" },
  { id: 25, text: "Gratitude turns what we have into enough.", author: "Unknown", category: "Gratitude" },
  { id: 26, text: "The more grateful I am, the more beauty I see.", author: "Mary Davis", category: "Gratitude" },
  { id: 27, text: "Wear gratitude like a cloak and it will feed every corner of your life.", author: "Rumi", category: "Gratitude" },
  { id: 28, text: "Acknowledging the good that you already have in your life is the foundation for all abundance.", author: "Eckhart Tolle", category: "Gratitude" },
  { id: 29, text: "The present moment is the only moment available to us.", author: "Thich Nhat Hanh", category: "Mindfulness" },
  { id: 30, text: "You can't calm the storm, so stop trying. What you can do is calm yourself.", author: "Timber Hawkeye", category: "Mindfulness" },
  { id: 31, text: "Breathe. You're going to be okay. Breathe and remember that you've been in this place before.", author: "Daniell Koepke", category: "Mindfulness" },
];

const CATEGORIES = ["All", "Self Worth", "Healing", "Growth", "Courage", "Inner Peace", "Gratitude", "Mindfulness"];

const CAT_COLORS = {
  "Self Worth":  { active: "bg-rose-500 text-white",    text: "text-rose-500",    bg: "bg-rose-400/15",    border: "border-rose-300/30" },
  "Healing":     { active: "bg-purple-500 text-white",  text: "text-purple-500",  bg: "bg-purple-400/15",  border: "border-purple-300/30" },
  "Growth":      { active: "bg-emerald-500 text-white", text: "text-emerald-500", bg: "bg-emerald-400/15", border: "border-emerald-300/30" },
  "Courage":     { active: "bg-orange-500 text-white",  text: "text-orange-500",  bg: "bg-orange-400/15",  border: "border-orange-300/30" },
  "Inner Peace": { active: "bg-sky-500 text-white",     text: "text-sky-500",     bg: "bg-sky-400/15",     border: "border-sky-300/30" },
  "Gratitude":   { active: "bg-yellow-500 text-white",  text: "text-yellow-600",  bg: "bg-yellow-400/15",  border: "border-yellow-300/30" },
  "Mindfulness": { active: "bg-teal-500 text-white",    text: "text-teal-500",    bg: "bg-teal-400/15",    border: "border-teal-300/30" },
};

export default function QuotesPage() {
  const { darkMode, toggle } = useDarkMode();
  const { user, supabase }   = useAuth();

  const [category,  setCategory]  = useState("All");
  const [search,    setSearch]    = useState("");
  const [favIds,    setFavIds]    = useState([]);
  const [showFavs,  setShowFavs]  = useState(false);
  const [dailyIdx,  setDailyIdx]  = useState(0);
  const [copied,    setCopied]    = useState(null);

  useEffect(() => {
    const d = new Date();
    setDailyIdx((d.getFullYear() * 1000 + d.getMonth() * 31 + d.getDate()) % ALL_QUOTES.length);
    if (!user) return;
    supabase.from("favourite_quotes").select("quote_id").eq("user_id", user.id)
      .then(({ data }) => setFavIds((data ?? []).map((r) => r.quote_id)));
  }, [user]);

  const toggleFav = async (qid) => {
    if (!user) return;
    if (favIds.includes(qid)) {
      await supabase.from("favourite_quotes").delete().eq("user_id", user.id).eq("quote_id", qid);
      setFavIds(favIds.filter((id) => id !== qid));
    } else {
      await supabase.from("favourite_quotes").insert({ user_id: user.id, quote_id: qid });
      setFavIds([...favIds, qid]);
    }
  };

  const handleShare = async (q) => {
    const text = `"${q.text}" — ${q.author}`;
    if (navigator.share) { await navigator.share({ title: "Self Love Quote", text }); }
    else { await navigator.clipboard.writeText(text); setCopied(q.id); setTimeout(() => setCopied(null), 2000); }
  };

  const filtered = useMemo(() => {
    let list = showFavs ? ALL_QUOTES.filter((q) => favIds.includes(q.id)) : ALL_QUOTES;
    if (category !== "All") list = list.filter((q) => q.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((i) => i.text.toLowerCase().includes(q) || i.author.toLowerCase().includes(q));
    }
    return list;
  }, [category, search, showFavs, favIds]);

  const daily = ALL_QUOTES[dailyIdx];
  const card  = `${darkMode ? "glass-card-dark" : "glass-card"}`;

  return (
    <main className={`relative min-h-screen pb-28 overflow-hidden transition-colors duration-500 ${darkMode ? "bg-[radial-gradient(ellipse_at_top,_#2d0a2e_0%,_#140a1e_55%,_#0a0810_100%)]" : "bg-[radial-gradient(ellipse_at_top,_#ffe4f0_0%,_#f3e8ff_50%,_#fff5f7_100%)]"}`}>
      <div className={`absolute top-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full blur-[110px] opacity-30 animate-float-slow pointer-events-none ${darkMode ? "bg-rose-950" : "bg-rose-200"}`} />
      <div className={`absolute bottom-0 right-[-60px] w-[320px] h-[320px] rounded-full blur-[90px] opacity-20 animate-float pointer-events-none ${darkMode ? "bg-purple-950" : "bg-purple-200"}`} />

      {/* Header */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-6">
        <div className={`flex items-center justify-between px-5 py-3.5 rounded-2xl ${card}`}>
          <div>
            <p className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? "text-rose-400" : "text-rose-400"}`}>Daily Wisdom</p>
            <h1 className="text-xl font-bold gradient-text-love">Love Quotes ✨</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { setShowFavs(!showFavs); setCategory("All"); }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all hover:scale-105
                ${showFavs ? "bg-rose-500 text-white border-rose-400" : darkMode ? "bg-white/8 text-gray-300 border-white/10" : "bg-white/60 text-gray-500 border-white/70"}`}>
              <Heart size={12} className={showFavs ? "fill-white" : ""} /> {favIds.length}
            </button>
            <button onClick={toggle} className={`p-2.5 rounded-xl border transition-all hover:scale-105 ${darkMode ? "bg-white/8 text-yellow-300 border-white/10" : "bg-black/5 text-gray-500 border-black/8"}`}>
              {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 mt-5 space-y-5">

        {/* Daily hero */}
        <div className={`rounded-3xl p-6 ${card}`}>
          <div className="flex items-center justify-between mb-3">
            <p className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? "text-rose-400" : "text-rose-400"}`}>Today&apos;s Quote</p>
            <span className={`text-[10px] px-2.5 py-1 rounded-full border font-semibold ${CAT_COLORS[daily.category]?.text ?? "text-rose-400"} ${darkMode ? "bg-white/8 border-white/10" : (CAT_COLORS[daily.category]?.bg ?? "") + " " + (CAT_COLORS[daily.category]?.border ?? "")}`}>
              {daily.category}
            </span>
          </div>
          <div className={`relative px-5 py-5 rounded-2xl ${darkMode ? "bg-white/5 border border-white/8" : "bg-white/55 border border-rose-100/60"}`}>
            <span className={`absolute top-2 left-3 text-3xl leading-none select-none ${darkMode ? "text-rose-800" : "text-rose-200"}`}>&ldquo;</span>
            <p className={`text-base font-semibold leading-relaxed px-3 text-center ${darkMode ? "text-gray-100" : "text-gray-700"}`}>{daily.text}</p>
            <span className={`absolute bottom-1 right-3 text-3xl leading-none select-none ${darkMode ? "text-rose-800" : "text-rose-200"}`}>&rdquo;</span>
          </div>
          <p className={`text-right text-xs font-medium mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>— {daily.author}</p>
          <div className="flex gap-2 mt-4 justify-end">
            <button onClick={() => toggleFav(daily.id)} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all hover:scale-105 ${favIds.includes(daily.id) ? "bg-rose-500 text-white border-rose-400" : darkMode ? "bg-white/8 text-gray-300 border-white/10" : "bg-white/60 text-gray-500 border-white/70"}`}>
              <Heart size={12} className={favIds.includes(daily.id) ? "fill-white" : ""} />
              {favIds.includes(daily.id) ? "Saved" : "Save"}
            </button>
            <button onClick={() => handleShare(daily)} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all hover:scale-105 ${darkMode ? "bg-white/8 text-gray-300 border-white/10" : "bg-white/60 text-gray-500 border-white/70"}`}>
              <Share2 size={12} /> {copied === daily.id ? "Copied!" : "Share"}
            </button>
          </div>
        </div>

        {/* Search */}
        <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl ${card}`}>
          <Search size={15} className="text-gray-400" />
          <input type="text" placeholder="Search quotes or authors…" value={search} onChange={(e) => setSearch(e.target.value)}
            className={`flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400 ${darkMode ? "text-white" : "text-gray-700"}`} />
          {search && <button onClick={() => setSearch("")} className="text-gray-400 hover:text-rose-400 text-lg leading-none">×</button>}
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => {
            const isActive = category === cat && !showFavs;
            const c = CAT_COLORS[cat];
            return (
              <button key={cat} onClick={() => { setCategory(cat); setShowFavs(false); }}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold border transition-all
                  ${isActive ? (c?.active ?? "bg-rose-500 text-white") + " border-transparent" : darkMode ? "bg-white/8 text-gray-300 border-white/10 hover:bg-white/14" : "bg-white/60 text-gray-500 border-white/70 hover:bg-white/85"}`}>
                {cat}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className={`rounded-3xl p-10 text-center ${card}`}>
            <p className="text-3xl mb-2">🔍</p>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              {showFavs ? "No favourites yet — tap ♥ on any quote to save it" : "No quotes match your search"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((q, i) => {
              const c = CAT_COLORS[q.category];
              return (
                <div key={q.id} className={`rounded-3xl p-5 flex flex-col gap-3 animate-fade-in-up ${card}`} style={{ animationDelay: `${i * 40}ms` }}>
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full border font-semibold flex-shrink-0 ${c?.text ?? "text-rose-400"} ${darkMode ? "bg-white/8 border-white/10" : (c?.bg ?? "bg-rose-100") + " " + (c?.border ?? "border-rose-200")}`}>
                      {q.category}
                    </span>
                    <button onClick={() => toggleFav(q.id)} className="flex-shrink-0 transition-all hover:scale-110 active:scale-95">
                      <Heart size={15} className={favIds.includes(q.id) ? "fill-rose-500 text-rose-500" : darkMode ? "text-gray-500" : "text-gray-300"} />
                    </button>
                  </div>
                  <p className={`text-sm leading-relaxed flex-1 ${darkMode ? "text-gray-100" : "text-gray-700"}`}>&ldquo;{q.text}&rdquo;</p>
                  <div className="flex items-center justify-between">
                    <p className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-400"}`}>— {q.author}</p>
                    <button onClick={() => handleShare(q)} className={`p-1.5 rounded-lg transition-all hover:scale-110 ${darkMode ? "text-gray-500 hover:text-rose-400" : "text-gray-300 hover:text-rose-400"}`}>
                      {copied === q.id ? <span className="text-[10px] text-rose-400 font-semibold">Copied!</span> : <Share2 size={13} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <p className={`text-center text-xs pb-4 ${darkMode ? "text-gray-600" : "text-gray-400"}`}>
          {filtered.length} quote{filtered.length !== 1 ? "s" : ""} · Fill your heart with words that lift you up 🌸
        </p>
      </div>

      <BottomNav darkMode={darkMode} />
    </main>
  );
}
