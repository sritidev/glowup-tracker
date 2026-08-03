"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { createClient } from "../../lib/supabase/client";
import { useDarkMode } from "../hooks/useDarkMode";

export default function RegisterPage() {
  const { darkMode } = useDarkMode();
  const router   = useRouter();
  const supabase = createClient();

  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState(false);

  const validate = () => {
    if (!name.trim())          return "Please enter your name";
    if (password.length < 8)   return "Password must be at least 8 characters";
    if (password !== confirm)   return "Passwords do not match";
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error) { setError(error.message); setLoading(false); return; }
    setSuccess(true);
  };

  const handleGoogle = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  };

  const field = `w-full py-3.5 rounded-2xl text-sm border outline-none transition-all ${
    darkMode
      ? "bg-white/6 border-white/10 text-white placeholder:text-gray-500 focus:border-rose-400/50"
      : "bg-white/60 border-white/70 text-gray-700 placeholder:text-gray-400 focus:border-rose-300"
  }`;

  return (
    <main className={`
      relative min-h-screen flex items-center justify-center px-4 py-10
      overflow-hidden transition-colors duration-500
      ${darkMode
        ? "bg-[radial-gradient(ellipse_at_top_left,_#2d0a2e_0%,_#140a1e_55%,_#0a0810_100%)]"
        : "bg-[radial-gradient(ellipse_at_top_left,_#ffe4f0_0%,_#f3e8ff_55%,_#fff5f7_100%)]"
      }
    `}>
      <div className={`absolute top-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full blur-[110px] opacity-40 animate-float-slow pointer-events-none ${darkMode ? "bg-rose-950" : "bg-rose-200"}`} />
      <div className={`absolute bottom-[-60px] right-[-60px] w-[350px] h-[350px] rounded-full blur-[90px] opacity-30 animate-float pointer-events-none ${darkMode ? "bg-purple-950" : "bg-purple-200"}`} />

      <div className={`relative z-10 w-full max-w-md rounded-[32px] p-8 ${darkMode ? "glass-card-dark" : "glass-card"}`}>

        {success ? (
          <div className="text-center py-6 animate-fade-in-up">
            <div className="text-5xl mb-4">💌</div>
            <h2 className={`text-xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>Check your email!</h2>
            <p className={`text-sm leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              We sent a confirmation link to <span className="font-semibold text-rose-400">{email}</span>.
              Click it to activate your account 🌸
            </p>
            <Link href="/login" className="inline-block mt-6 px-6 py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 shadow-lg hover:scale-105 transition-all">
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-7">
              <div className="text-5xl mb-3 animate-heartbeat">🌱</div>
              <h1 className="text-3xl font-bold gradient-text-love">Start your journey</h1>
              <p className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Create your free self-love account 💕
              </p>
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-2xl bg-red-500/20 border border-red-400/30 text-red-400 text-sm text-center animate-fade-in-up">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="relative">
                <User size={15} className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-400" : "text-gray-400"}`} />
                <input type="text" placeholder="Your name" value={name}
                  onChange={(e) => setName(e.target.value)} required
                  className={`${field} pl-11 pr-4`} />
              </div>

              <div className="relative">
                <Mail size={15} className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-400" : "text-gray-400"}`} />
                <input type="email" placeholder="Email address" value={email}
                  onChange={(e) => setEmail(e.target.value)} required
                  className={`${field} pl-11 pr-4`} />
              </div>

              <div className="relative">
                <Lock size={15} className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-400" : "text-gray-400"}`} />
                <input type={showPwd ? "text" : "password"} placeholder="Password (min 8 chars)" value={password}
                  onChange={(e) => setPassword(e.target.value)} required
                  className={`${field} pl-11 pr-11`} />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-400 hover:text-gray-600"}`}>
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              <div className="relative">
                <Lock size={15} className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-400" : "text-gray-400"}`} />
                <input type={showPwd ? "text" : "password"} placeholder="Confirm password" value={confirm}
                  onChange={(e) => setConfirm(e.target.value)} required
                  className={`${field} pl-11 pr-4`} />
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-2xl font-bold text-white text-sm bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-lg shadow-rose-400/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50">
                {loading ? "Creating account…" : "Create Account 🌸"}
              </button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className={`flex-1 h-px ${darkMode ? "bg-white/10" : "bg-gray-200"}`} />
              <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>or</span>
              <div className={`flex-1 h-px ${darkMode ? "bg-white/10" : "bg-gray-200"}`} />
            </div>

            <button onClick={handleGoogle} disabled={loading}
              className={`w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl text-sm font-semibold border transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50
                ${darkMode ? "bg-white/6 border-white/10 text-gray-200 hover:bg-white/10" : "bg-white/70 border-white/80 text-gray-700 hover:bg-white/90"}`}>
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 19 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.6-3-11.3-7.5l-6.5 5C9.7 39.6 16.3 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.6 5.8l6.2 5.2C40.7 35.5 44 30.3 44 24c0-1.3-.1-2.7-.4-4z"/>
              </svg>
              Continue with Google
            </button>

            <p className={`text-center text-sm mt-6 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Already have an account?{" "}
              <Link href="/login" className={`font-semibold hover:underline ${darkMode ? "text-rose-400" : "text-rose-500"}`}>
                Sign in →
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
