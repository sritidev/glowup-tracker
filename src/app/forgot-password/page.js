"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { createClient } from "../../lib/supabase/client";
import { useDarkMode } from "../hooks/useDarkMode";

export default function ForgotPasswordPage() {
  const { darkMode } = useDarkMode();
  const supabase = createClient();
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/callback?next=/profile`,
    });
    if (error) { setError(error.message); setLoading(false); return; }
    setSent(true);
  };

  return (
    <main className={`
      relative min-h-screen flex items-center justify-center px-4
      overflow-hidden transition-colors duration-500
      ${darkMode
        ? "bg-[radial-gradient(ellipse_at_top_left,_#2d0a2e_0%,_#140a1e_55%,_#0a0810_100%)]"
        : "bg-[radial-gradient(ellipse_at_top_left,_#ffe4f0_0%,_#f3e8ff_55%,_#fff5f7_100%)]"
      }
    `}>
      <div className={`absolute top-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full blur-[110px] opacity-40 animate-float-slow pointer-events-none ${darkMode ? "bg-rose-950" : "bg-rose-200"}`} />
      <div className={`absolute bottom-[-60px] right-[-60px] w-[350px] h-[350px] rounded-full blur-[90px] opacity-30 animate-float pointer-events-none ${darkMode ? "bg-purple-950" : "bg-purple-200"}`} />

      <div className={`relative z-10 w-full max-w-md rounded-[32px] p-8 ${darkMode ? "glass-card-dark" : "glass-card"}`}>
        {sent ? (
          <div className="text-center py-6 animate-fade-in-up">
            <div className="text-5xl mb-4">💌</div>
            <h2 className={`text-xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>Email sent!</h2>
            <p className={`text-sm leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Check your inbox for a password reset link. It expires in 1 hour 🌸
            </p>
            <Link href="/login" className="inline-block mt-6 px-6 py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 shadow-lg hover:scale-105 transition-all">
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-7">
              <div className="text-5xl mb-3">🔑</div>
              <h1 className="text-2xl font-bold gradient-text-love">Reset password</h1>
              <p className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                We&apos;ll send a reset link to your email
              </p>
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-2xl bg-red-500/20 border border-red-400/30 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleReset} className="space-y-4">
              <div className="relative">
                <Mail size={15} className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-400" : "text-gray-400"}`} />
                <input type="email" placeholder="Your email address" value={email}
                  onChange={(e) => setEmail(e.target.value)} required
                  className={`w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm border outline-none transition-all
                    ${darkMode ? "bg-white/6 border-white/10 text-white placeholder:text-gray-500 focus:border-rose-400/50" : "bg-white/60 border-white/70 text-gray-700 placeholder:text-gray-400 focus:border-rose-300"}`}
                />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-2xl font-bold text-white text-sm bg-gradient-to-r from-rose-500 to-pink-500 shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50">
                {loading ? "Sending…" : "Send Reset Link 💌"}
              </button>
            </form>

            <p className={`text-center text-sm mt-6 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              <Link href="/login" className={`font-semibold hover:underline ${darkMode ? "text-rose-400" : "text-rose-500"}`}>
                ← Back to Sign In
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
