"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Camera, LogOut, Save, User, Mail, Lock, Trash2 } from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";
import { useAuth } from "../context/AuthContext";
import BottomNav from "../components/BottomNav";

export default function ProfilePage() {
  const { darkMode, toggle } = useDarkMode();
  const { user, profile, signOut, refreshProfile, supabase } = useAuth();
  const router = useRouter();

  const [name,      setName]      = useState(profile?.name ?? "");
  const [saving,    setSaving]    = useState(false);
  const [pwdOld,    setPwdOld]    = useState("");
  const [pwdNew,    setPwdNew]    = useState("");
  const [toast,     setToast]     = useState({ msg: "", type: "" });
  const [deleting,  setDeleting]  = useState(false);
  const fileRef = useRef(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  };

  const handleSaveName = async () => {
    if (!name.trim()) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ name: name.trim() })
      .eq("id", user.id);
    setSaving(false);
    if (error) { showToast(error.message, "error"); return; }
    refreshProfile();
    showToast("Name updated 🌸");
  };

  const handleChangePassword = async () => {
    if (pwdNew.length < 8) { showToast("New password must be at least 8 characters", "error"); return; }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: pwdNew });
    setSaving(false);
    if (error) { showToast(error.message, "error"); return; }
    setPwdOld(""); setPwdNew("");
    showToast("Password updated 🔐");
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext  = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });
    if (upErr) { showToast(upErr.message, "error"); return; }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    await supabase.from("profiles").update({ avatar_url: data.publicUrl }).eq("id", user.id);
    refreshProfile();
    showToast("Avatar updated 📸");
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const initials = (profile?.name ?? user?.email ?? "?")
    .split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  const inputCls = `w-full px-4 py-3 rounded-2xl text-sm border outline-none transition-all ${
    darkMode
      ? "bg-white/6 border-white/10 text-white placeholder:text-gray-500 focus:border-rose-400/50"
      : "bg-white/60 border-white/70 text-gray-700 placeholder:text-gray-400 focus:border-rose-300"
  }`;

  return (
    <main className={`
      relative min-h-screen pb-28 overflow-hidden transition-colors duration-500
      ${darkMode
        ? "bg-[radial-gradient(ellipse_at_top,_#2d0a2e_0%,_#140a1e_55%,_#0a0810_100%)]"
        : "bg-[radial-gradient(ellipse_at_top,_#ffe4f0_0%,_#f3e8ff_50%,_#fff5f7_100%)]"
      }
    `}>
      <div className={`absolute top-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full blur-[110px] opacity-30 animate-float-slow pointer-events-none ${darkMode ? "bg-rose-950" : "bg-rose-200"}`} />
      <div className={`absolute bottom-0 right-[-60px] w-[320px] h-[320px] rounded-full blur-[90px] opacity-20 animate-float pointer-events-none ${darkMode ? "bg-purple-950" : "bg-purple-200"}`} />

      {/* Toast */}
      {toast.msg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[90vw] max-w-sm">
          <div className={`px-5 py-3 rounded-2xl text-center text-sm font-semibold shadow-xl backdrop-blur-xl border animate-fade-in-up
            ${toast.type === "error" ? "bg-red-500/85 border-red-300/20 text-white" : "bg-rose-500/85 border-rose-300/20 text-white"}`}>
            {toast.msg}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 pt-6">
        <div className={`flex items-center justify-between px-5 py-3.5 rounded-2xl ${darkMode ? "glass-card-dark" : "glass-card"}`}>
          <div>
            <p className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? "text-rose-400" : "text-rose-400"}`}>Account</p>
            <h1 className="text-xl font-bold gradient-text-love">My Profile 👤</h1>
          </div>
          <button onClick={handleSignOut}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all hover:scale-105
              ${darkMode ? "bg-white/8 text-gray-300 border-white/10 hover:bg-white/14" : "bg-white/60 text-gray-500 border-white/70 hover:bg-white/85"}`}>
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 mt-5 space-y-4">

        {/* Avatar + name card */}
        <div className={`rounded-3xl p-7 text-center ${darkMode ? "glass-card-dark" : "glass-card"}`}>
          <div className="relative inline-block mb-4">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-rose-400/30 shadow-lg" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-500 to-pink-400 flex items-center justify-center text-3xl font-black text-white shadow-lg border-4 border-rose-400/30">
                {initials}
              </div>
            )}
            <button onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-pink-400 flex items-center justify-center shadow-md hover:scale-110 transition-all">
              <Camera size={13} className="text-white" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          </div>

          <p className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{profile?.name ?? "Glowing Human"}</p>
          <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{user?.email}</p>
          <p className={`text-xs mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
            Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "—"}
          </p>
        </div>

        {/* Edit name */}
        <div className={`rounded-3xl p-6 ${darkMode ? "glass-card-dark" : "glass-card"}`}>
          <p className={`text-xs font-semibold uppercase tracking-widest mb-4 ${darkMode ? "text-rose-400" : "text-rose-400"}`}>Display Name</p>
          <div className="relative mb-4">
            <User size={15} className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-400" : "text-gray-400"}`} />
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Your name" className={`${inputCls} pl-11`} />
          </div>
          <button onClick={handleSaveName} disabled={saving || !name.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 shadow-md hover:scale-105 transition-all disabled:opacity-50">
            <Save size={13} /> {saving ? "Saving…" : "Save Name"}
          </button>
        </div>

        {/* Email (read-only) */}
        <div className={`rounded-3xl p-6 ${darkMode ? "glass-card-dark" : "glass-card"}`}>
          <p className={`text-xs font-semibold uppercase tracking-widest mb-4 ${darkMode ? "text-rose-400" : "text-rose-400"}`}>Email Address</p>
          <div className="relative">
            <Mail size={15} className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-400" : "text-gray-400"}`} />
            <input type="email" value={user?.email ?? ""} readOnly
              className={`${inputCls} pl-11 opacity-60 cursor-not-allowed`} />
          </div>
          <p className={`text-xs mt-2 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Email cannot be changed here.</p>
        </div>

        {/* Change password */}
        <div className={`rounded-3xl p-6 ${darkMode ? "glass-card-dark" : "glass-card"}`}>
          <p className={`text-xs font-semibold uppercase tracking-widest mb-4 ${darkMode ? "text-rose-400" : "text-rose-400"}`}>Change Password</p>
          <div className="space-y-3 mb-4">
            <div className="relative">
              <Lock size={15} className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-400" : "text-gray-400"}`} />
              <input type="password" placeholder="New password (min 8 chars)" value={pwdNew}
                onChange={(e) => setPwdNew(e.target.value)} className={`${inputCls} pl-11`} />
            </div>
          </div>
          <button onClick={handleChangePassword} disabled={saving || !pwdNew}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 shadow-md hover:scale-105 transition-all disabled:opacity-50">
            <Lock size={13} /> {saving ? "Updating…" : "Update Password"}
          </button>
        </div>

        {/* Appearance */}
        <div className={`rounded-3xl p-6 ${darkMode ? "glass-card-dark" : "glass-card"}`}>
          <p className={`text-xs font-semibold uppercase tracking-widest mb-4 ${darkMode ? "text-rose-400" : "text-rose-400"}`}>Appearance</p>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>Dark Mode</p>
              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Easy on the eyes at night 🌙</p>
            </div>
            <button onClick={toggle}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${darkMode ? "bg-rose-500" : "bg-gray-200"}`}>
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${darkMode ? "left-6" : "left-0.5"}`} />
            </button>
          </div>
        </div>

        {/* Danger zone */}
        <div className={`rounded-3xl p-6 border ${darkMode ? "glass-card-dark border-red-500/20" : "glass-card border-red-200/40"}`}>
          <p className={`text-xs font-semibold uppercase tracking-widest mb-3 text-red-400`}>Danger Zone</p>
          <p className={`text-sm mb-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Signing out will end your session. Your data stays safe in the cloud 🔒
          </p>
          <button onClick={handleSignOut}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-red-500 to-rose-500 shadow-md hover:scale-105 transition-all">
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </div>

      <BottomNav darkMode={darkMode} />
    </main>
  );
}
