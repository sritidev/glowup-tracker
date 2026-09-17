"use client";

import { useEffect, useState, useMemo } from "react";
import { Sun, Moon, X, Trash2, ExternalLink, Check, Sparkles, ChevronLeft, RefreshCw, Target } from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";
import { useAuth } from "../context/AuthContext";
import BottomNav from "../components/BottomNav";

const CATEGORIES = [
  { id: "Inspiration", emoji: "✨" },
  { id: "Self-care",   emoji: "🌿" },
  { id: "Wellness",    emoji: "🧘" },
  { id: "Goals",       emoji: "🎯" },
  { id: "Style",       emoji: "👗" },
  { id: "Travel",      emoji: "🌍" },
  { id: "Fitness",     emoji: "💪" },
  { id: "Learning",    emoji: "📚" },
  { id: "Lifestyle",   emoji: "🏡" },
  { id: "Quotes",      emoji: "💭" },
  { id: "Other",       emoji: "🌸" },
];
const catEmoji = (id) => CATEGORIES.find((c) => c.id === id)?.emoji ?? "✨";

const ERR = {
  not_configured: "Pinterest isn't set up yet. Please try again later.",
  cancelled:      "Pinterest connection was cancelled.",
  invalid_state:  "Something looked off with the sign-in. Please try connecting again.",
  auth_failed:    "We couldn't connect to Pinterest. Please try again.",
  save_failed:    "We connected but couldn't save it. Please try again.",
  needs_reconnect:"Your Pinterest session expired. Please reconnect.",
};

export default function PinterestPage() {
  const { darkMode, toggle } = useDarkMode();
  const { user, supabase }   = useAuth();

  const [tab, setTab] = useState("inspiration"); // "boards" | "inspiration"
  const [status, setStatus] = useState({ loading: true, connected: false, username: null, configured: true });
  const [toast, setToast] = useState({ msg: "", type: "" });

  // Pinterest browsing
  const [boards, setBoards]   = useState(null);
  const [board,  setBoard]    = useState(null);
  const [pins,   setPins]     = useState(null);
  const [loadingBoards, setLoadingBoards] = useState(false);
  const [loadingPins,   setLoadingPins]   = useState(false);

  // Saved inspiration
  const [saved, setSaved] = useState([]);
  const [filter, setFilter] = useState("All");

  // Save / edit modal
  const [savePin, setSavePin] = useState(null);   // the Pinterest pin being saved
  const [editRow, setEditRow] = useState(null);   // an inspiration_pins row being edited
  const [formCat, setFormCat] = useState("Inspiration");
  const [formNote, setFormNote] = useState("");
  const [busy, setBusy] = useState(false);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast({ msg: "", type: "" }), 3000); };

  // Read ?connected / ?error from the OAuth redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("connected")) { showToast("Pinterest connected 🌸"); window.history.replaceState({}, "", "/pinterest"); }
    const e = params.get("error");
    if (e) { showToast(ERR[e] ?? "Something went wrong.", "error"); window.history.replaceState({}, "", "/pinterest"); }
  }, []);

  useEffect(() => {
    if (!user) return;
    loadStatus();
    loadSaved();
  }, [user]);

  const loadStatus = async () => {
    try {
      const res = await fetch("/api/pinterest/status");
      const data = await res.json();
      setStatus({ loading: false, connected: data.connected, username: data.username, configured: data.configured });
    } catch {
      setStatus({ loading: false, connected: false, username: null, configured: true });
    }
  };

  const loadSaved = async () => {
    const { data } = await supabase.from("inspiration_pins").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setSaved(data ?? []);
  };

  const loadBoards = async () => {
    setLoadingBoards(true);
    try {
      const res = await fetch("/api/pinterest/boards");
      const data = await res.json();
      if (!res.ok) { handleApiError(data.error); setBoards([]); return; }
      setBoards(data.boards);
    } catch { showToast("Couldn't load boards.", "error"); setBoards([]); }
    finally { setLoadingBoards(false); }
  };

  const openBoard = async (b) => {
    setBoard(b); setPins(null); setLoadingPins(true);
    try {
      const res = await fetch(`/api/pinterest/pins?board_id=${encodeURIComponent(b.id)}`);
      const data = await res.json();
      if (!res.ok) { handleApiError(data.error); setPins([]); return; }
      setPins(data.pins);
    } catch { showToast("Couldn't load pins.", "error"); setPins([]); }
    finally { setLoadingPins(false); }
  };

  const handleApiError = (code) => {
    if (code === "needs_reconnect") { setStatus((s) => ({ ...s, connected: false })); showToast(ERR.needs_reconnect, "error"); }
    else showToast("Pinterest is having a moment. Please try again.", "error");
  };

  const connect = () => { window.location.href = "/api/pinterest/connect"; };

  const disconnect = async () => {
    setBusy(true);
    try {
      await fetch("/api/pinterest/disconnect", { method: "POST" });
      setStatus((s) => ({ ...s, connected: false, username: null }));
      setBoards(null); setBoard(null); setPins(null);
      showToast("Pinterest disconnected.");
    } catch { showToast("Couldn't disconnect.", "error"); }
    finally { setBusy(false); }
  };

  // Open save modal for a Pinterest pin (or show already-saved)
  const savedIds = useMemo(() => new Set(saved.map((s) => s.pinterest_pin_id)), [saved]);
  const openSave = (pin) => {
    const existing = saved.find((s) => s.pinterest_pin_id === pin.id);
    if (existing) { openEdit(existing); return; }
    setSavePin(pin); setFormCat("Inspiration"); setFormNote("");
  };
  const openEdit = (row) => { setEditRow(row); setFormCat(row.category ?? "Inspiration"); setFormNote(row.note ?? ""); };

  const doSave = async () => {
    if (!savePin) return;
    setBusy(true);
    const { data, error } = await supabase.from("inspiration_pins").insert({
      user_id: user.id,
      pinterest_pin_id: savePin.id,
      board_id: board?.id ?? null,
      title: savePin.title,
      description: savePin.description,
      image_url: savePin.image,
      pinterest_url: savePin.link,
      category: formCat,
      note: formNote.trim() || null,
    }).select().single();
    setBusy(false);
    if (error) { showToast(error.code === "23505" ? "Already saved to MyAura ✓" : "Couldn't save. Try again.", "error"); setSavePin(null); return; }
    setSaved((p) => [data, ...p]);
    setSavePin(null);
    showToast("Saved to MyAura ✨");
  };

  const doEdit = async () => {
    if (!editRow) return;
    setBusy(true);
    const { data, error } = await supabase.from("inspiration_pins")
      .update({ category: formCat, note: formNote.trim() || null, updated_at: new Date().toISOString() })
      .eq("id", editRow.id).select().single();
    setBusy(false);
    if (error) { showToast("Couldn't update.", "error"); return; }
    setSaved((p) => p.map((r) => r.id === data.id ? data : r));
    setEditRow(null);
    showToast("Updated 🌸");
  };

  const removePin = async (id) => {
    setSaved((p) => p.filter((r) => r.id !== id));
    await supabase.from("inspiration_pins").delete().eq("id", id);
    setEditRow(null);
  };

  // Inspiration → Action: turn a saved pin into a wellness goal
  const addAsGoal = async (row) => {
    setBusy(true);
    const { data, error } = await supabase.from("wellness_goals").insert({
      user_id: user.id, title: row.title || "Inspiration goal", target: 1, icon: catEmoji(row.category), progress: 0,
    }).select().single();
    if (!error && data) {
      await supabase.from("inspiration_pins").update({ linked_type: "goal", linked_id: data.id }).eq("id", row.id);
      setSaved((p) => p.map((r) => r.id === row.id ? { ...r, linked_type: "goal", linked_id: data.id } : r));
      showToast("Added to your Goals 🎯");
    } else showToast("Couldn't add goal.", "error");
    setBusy(false);
    setEditRow(null);
  };

  const filteredSaved = useMemo(() => {
    if (filter === "All") return saved;
    return saved.filter((s) => s.category === filter);
  }, [saved, filter]);

  const usedCategories = useMemo(() => ["All", ...CATEGORIES.map((c) => c.id).filter((c) => saved.some((s) => s.category === c))], [saved]);

  const card = darkMode ? "glass-card-dark" : "glass-card";
  const inp  = `w-full px-4 py-3 rounded-2xl text-sm border outline-none ${darkMode ? "bg-white/6 border-white/10 text-white placeholder:text-gray-500" : "bg-white/60 border-white/70 text-gray-700 placeholder:text-gray-400"}`;
  const pill = (active) => `flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${active ? "bg-rose-500 text-white border-transparent" : darkMode ? "bg-white/8 text-gray-300 border-white/10 hover:bg-white/14" : "bg-white/60 text-gray-500 border-white/70 hover:bg-white/85"}`;

  return (
    <main className={`relative min-h-screen pb-28 overflow-hidden transition-colors duration-500 ${darkMode ? "bg-[radial-gradient(ellipse_at_top,_#2d0a2e_0%,_#140a1e_55%,_#0a0810_100%)]" : "bg-[radial-gradient(ellipse_at_top,_#ffe4f0_0%,_#f3e8ff_50%,_#fff5f7_100%)]"}`}>
      <div className={`absolute top-[-80px] left-[-80px] w-[380px] h-[380px] rounded-full blur-[110px] opacity-30 animate-float-slow pointer-events-none ${darkMode ? "bg-rose-950" : "bg-rose-200"}`} />
      <div className={`absolute bottom-0 right-[-60px] w-[300px] h-[300px] rounded-full blur-[90px] opacity-20 animate-float pointer-events-none ${darkMode ? "bg-purple-950" : "bg-purple-200"}`} />

      {toast.msg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[90vw] max-w-sm">
          <div className={`px-5 py-3 rounded-2xl text-center text-sm font-semibold shadow-xl backdrop-blur-xl border animate-fade-in-up ${toast.type === "error" ? "bg-red-500/85 border-red-300/20 text-white" : "bg-rose-500/85 border-rose-300/20 text-white"}`}>
            {toast.msg}
          </div>
        </div>
      )}

      {/* Save modal */}
      {savePin && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-black/50 backdrop-blur-sm px-4 py-8">
          <div className={`w-full max-w-md rounded-3xl p-6 animate-fade-in-up ${card}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-base font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>Save to MyAura ✨</h3>
              <button onClick={() => setSavePin(null)} className={`p-2 rounded-xl border ${darkMode ? "bg-white/8 border-white/10 text-gray-300" : "bg-white/60 border-white/70 text-gray-500"}`}><X size={15} /></button>
            </div>
            {savePin.image && <img src={savePin.image} alt="" className="w-full h-40 object-cover rounded-2xl mb-3" />}
            {savePin.title && <p className={`text-sm font-semibold mb-3 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>{savePin.title}</p>}
            <p className={`text-xs font-semibold mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Category</p>
            <div className="flex gap-2 flex-wrap mb-4">
              {CATEGORIES.map((c) => (
                <button key={c.id} onClick={() => setFormCat(c.id)} className={pill(formCat === c.id)}>{c.emoji} {c.id}</button>
              ))}
            </div>
            <textarea rows={2} placeholder="Add a personal note (optional)…" value={formNote} onChange={(e) => setFormNote(e.target.value)} className={`${inp} resize-none mb-4`} />
            <button onClick={doSave} disabled={busy} className="w-full py-3 rounded-2xl font-bold text-white text-sm bg-gradient-to-r from-rose-500 to-pink-500 disabled:opacity-40 transition-all hover:scale-[1.02]">
              {busy ? "Saving…" : "Save to MyAura"}
            </button>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editRow && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-black/50 backdrop-blur-sm px-4 py-8">
          <div className={`w-full max-w-md rounded-3xl p-6 animate-fade-in-up ${card}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-base font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>Edit inspiration</h3>
              <button onClick={() => setEditRow(null)} className={`p-2 rounded-xl border ${darkMode ? "bg-white/8 border-white/10 text-gray-300" : "bg-white/60 border-white/70 text-gray-500"}`}><X size={15} /></button>
            </div>
            {editRow.image_url && <img src={editRow.image_url} alt="" className="w-full h-40 object-cover rounded-2xl mb-3" />}
            {editRow.title && <p className={`text-sm font-semibold mb-3 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>{editRow.title}</p>}
            <p className={`text-xs font-semibold mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Category</p>
            <div className="flex gap-2 flex-wrap mb-4">
              {CATEGORIES.map((c) => (
                <button key={c.id} onClick={() => setFormCat(c.id)} className={pill(formCat === c.id)}>{c.emoji} {c.id}</button>
              ))}
            </div>
            <textarea rows={2} placeholder="Personal note…" value={formNote} onChange={(e) => setFormNote(e.target.value)} className={`${inp} resize-none mb-4`} />
            <div className="flex gap-2 mb-3">
              <button onClick={doEdit} disabled={busy} className="flex-1 py-3 rounded-2xl font-bold text-white text-sm bg-gradient-to-r from-rose-500 to-pink-500 disabled:opacity-40 transition-all hover:scale-[1.02]">Save changes</button>
              {editRow.pinterest_url && (
                <a href={editRow.pinterest_url} target="_blank" rel="noopener noreferrer" className={`px-4 py-3 rounded-2xl border flex items-center ${darkMode ? "bg-white/8 text-gray-200 border-white/10" : "bg-white/60 text-gray-600 border-white/70"}`}><ExternalLink size={15} /></a>
              )}
            </div>
            {!editRow.linked_type && (
              <button onClick={() => addAsGoal(editRow)} disabled={busy} className={`w-full py-2.5 rounded-2xl text-xs font-semibold border flex items-center justify-center gap-1.5 mb-2 ${darkMode ? "bg-white/6 text-gray-200 border-white/10" : "bg-white/55 text-gray-600 border-white/65"}`}>
                <Target size={13} /> Add to my Goals
              </button>
            )}
            {editRow.linked_type === "goal" && (
              <p className="text-center text-xs text-emerald-400 mb-2">🎯 Linked to your Goals</p>
            )}
            <button onClick={() => removePin(editRow.id)} className="w-full flex items-center justify-center gap-1.5 text-xs text-rose-400 hover:text-rose-500 mt-1"><Trash2 size={12} /> Remove from MyAura</button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-6">
        <div className={`flex items-center justify-between px-5 py-3.5 rounded-2xl ${card}`}>
          <div>
            <p className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? "text-rose-400" : "text-rose-400"}`}>From Pinterest, for you</p>
            <h1 className="text-xl font-bold gradient-text-love">My Inspiration ✨</h1>
          </div>
          <button onClick={toggle} className={`p-2.5 rounded-xl border transition-all hover:scale-105 ${darkMode ? "bg-white/8 text-yellow-300 border-white/10" : "bg-black/5 text-gray-500 border-black/8"}`}>
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 mt-5 space-y-4">

        {/* Connection state */}
        {status.loading ? (
          <div className={`rounded-3xl p-10 text-center ${card}`}><p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Loading…</p></div>
        ) : !status.connected ? (
          <div className={`rounded-3xl p-8 text-center ${card}`}>
            <div className="text-5xl mb-3">✨</div>
            <h3 className={`text-lg font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>Bring the things that inspire you into MyAura.</h3>
            <p className={`text-sm mb-6 max-w-sm mx-auto ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Connect Pinterest to browse your boards and save inspiration — mood boards, self-care ideas, goals — right here.
            </p>
            <button onClick={connect} disabled={!status.configured}
              className="px-6 py-3.5 rounded-2xl font-bold text-white text-sm bg-gradient-to-r from-rose-500 to-pink-500 shadow-lg shadow-rose-400/25 transition-all hover:scale-[1.02] disabled:opacity-40">
              Connect Pinterest
            </button>
            {!status.configured && <p className="text-xs text-gray-400 mt-3">Pinterest isn&apos;t configured yet.</p>}
            {saved.length > 0 && <p className={`text-xs mt-5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>You still have {saved.length} saved inspiration{saved.length !== 1 ? "s" : ""} below 👇</p>}
          </div>
        ) : (
          <div className={`rounded-2xl px-5 py-3 flex items-center justify-between ${card}`}>
            <p className={`text-sm ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
              Pinterest connected <span className="text-emerald-400">✓</span>{status.username && <span className={darkMode ? "text-gray-400" : "text-gray-500"}> · @{status.username}</span>}
            </p>
            <button onClick={disconnect} disabled={busy} className={`text-xs font-semibold px-3 py-1.5 rounded-lg border ${darkMode ? "bg-white/8 text-gray-300 border-white/10" : "bg-white/60 text-gray-500 border-white/70"}`}>Disconnect</button>
          </div>
        )}

        {/* Tabs (only when connected) */}
        {status.connected && (
          <div className="flex gap-2">
            <button onClick={() => { setTab("boards"); if (!boards) loadBoards(); }} className={pill(tab === "boards")}>My Boards</button>
            <button onClick={() => setTab("inspiration")} className={pill(tab === "inspiration")}>My Inspiration{saved.length ? ` (${saved.length})` : ""}</button>
          </div>
        )}

        {/* BOARDS TAB */}
        {status.connected && tab === "boards" && (
          <>
            {!board ? (
              loadingBoards ? (
                <div className={`rounded-3xl p-10 text-center ${card}`}><p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Loading your boards…</p></div>
              ) : boards && boards.length === 0 ? (
                <div className={`rounded-3xl p-10 text-center ${card}`}><p className="text-3xl mb-2">📌</p><p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No boards found on your Pinterest.</p></div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {(boards ?? []).map((b) => (
                    <button key={b.id} onClick={() => openBoard(b)} className={`rounded-3xl overflow-hidden text-left hover:scale-[1.02] transition-all ${card}`}>
                      <div className="h-28 bg-gradient-to-br from-rose-400/30 to-purple-400/30 flex items-center justify-center overflow-hidden">
                        {b.image ? <img src={b.image} alt="" className="w-full h-full object-cover" /> : <span className="text-4xl">📌</span>}
                      </div>
                      <div className="p-3">
                        <p className={`text-sm font-bold truncate ${darkMode ? "text-white" : "text-gray-800"}`}>{b.name}</p>
                        {b.pinCount != null && <p className={`text-[11px] ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{b.pinCount} pins</p>}
                      </div>
                    </button>
                  ))}
                </div>
              )
            ) : (
              <>
                <button onClick={() => { setBoard(null); setPins(null); }} className={`inline-flex items-center gap-1.5 text-sm font-semibold ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
                  <ChevronLeft size={16} /> {board.name}
                </button>
                {loadingPins ? (
                  <div className={`rounded-3xl p-10 text-center ${card}`}><p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Loading pins…</p></div>
                ) : pins && pins.length === 0 ? (
                  <div className={`rounded-3xl p-10 text-center ${card}`}><p className="text-3xl mb-2">🖼️</p><p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>This board has no pins yet.</p></div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {(pins ?? []).map((p) => {
                      const already = savedIds.has(p.id);
                      return (
                        <div key={p.id} className={`rounded-2xl overflow-hidden ${card}`}>
                          {p.image ? <img src={p.image} alt="" className="w-full h-36 object-cover" /> : <div className="w-full h-36 flex items-center justify-center text-3xl bg-gradient-to-br from-rose-400/20 to-purple-400/20">🖼️</div>}
                          <div className="p-2.5">
                            {p.title && <p className={`text-[11px] font-semibold line-clamp-2 mb-2 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>{p.title}</p>}
                            <button onClick={() => openSave(p)}
                              className={`w-full py-2 rounded-xl text-[11px] font-bold transition-all ${already ? (darkMode ? "bg-white/8 text-emerald-300 border border-white/10" : "bg-emerald-50 text-emerald-600 border border-emerald-200") : "text-white bg-gradient-to-r from-rose-500 to-pink-500"}`}>
                              {already ? "Saved ✓" : "Save to MyAura"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* INSPIRATION TAB */}
        {tab === "inspiration" && (
          <>
            {saved.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {usedCategories.map((c) => (
                  <button key={c} onClick={() => setFilter(c)} className={pill(filter === c)}>{c === "All" ? "All" : `${catEmoji(c)} ${c}`}</button>
                ))}
              </div>
            )}
            {saved.length === 0 ? (
              <div className={`rounded-3xl p-10 text-center ${card}`}>
                <Sparkles size={38} className={`mx-auto mb-4 ${darkMode ? "text-rose-800" : "text-rose-200"}`} />
                <h3 className={`font-bold mb-2 ${darkMode ? "text-white" : "text-gray-700"}`}>Keep the things that inspire you ✨</h3>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {status.connected ? "Browse My Boards and tap “Save to MyAura” on any pin." : "Connect Pinterest above to start saving inspiration."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredSaved.map((r) => (
                  <div key={r.id} className={`rounded-2xl overflow-hidden ${card}`}>
                    {r.image_url ? <img src={r.image_url} alt="" className="w-full h-36 object-cover" /> : <div className="w-full h-36 flex items-center justify-center text-3xl bg-gradient-to-br from-rose-400/20 to-purple-400/20">✨</div>}
                    <div className="p-2.5">
                      <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full mb-1 font-semibold ${darkMode ? "bg-white/10 text-gray-300" : "bg-rose-50 text-rose-500"}`}>{catEmoji(r.category)} {r.category}</span>
                      {r.title && <p className={`text-[11px] font-semibold line-clamp-2 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>{r.title}</p>}
                      {r.note && <p className={`text-[10px] mt-1 line-clamp-2 italic ${darkMode ? "text-gray-400" : "text-gray-500"}`}>“{r.note}”</p>}
                      <div className="flex gap-1.5 mt-2">
                        <button onClick={() => openEdit(r)} className={`flex-1 py-1.5 rounded-lg text-[10px] font-semibold border ${darkMode ? "bg-white/8 text-gray-200 border-white/10" : "bg-white/60 text-gray-600 border-white/70"}`}>Edit</button>
                        {r.pinterest_url && <a href={r.pinterest_url} target="_blank" rel="noopener noreferrer" className={`px-2.5 py-1.5 rounded-lg border ${darkMode ? "bg-white/8 text-gray-300 border-white/10" : "bg-white/60 text-gray-500 border-white/70"}`}><ExternalLink size={12} /></a>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <BottomNav darkMode={darkMode} />
    </main>
  );
}
