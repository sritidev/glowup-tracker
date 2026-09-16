"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, X } from "lucide-react";

export default function Intro() {
  const [showChoices, setShowChoices] = useState(false);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#faf3ef] flex items-center justify-center">
      {/* Full-screen hero (phone-frame feel on large screens) */}
      <div className="relative w-full max-w-[480px] min-h-screen sm:min-h-0 sm:h-[92vh] sm:my-[4vh] sm:rounded-[40px] overflow-hidden shadow-2xl">

        {/* Illustration fills the frame */}
        <img
          src="/intro-art.png"
          alt="Self care"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gradient scrim so text is readable at the bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

        {/* Text + CTA overlay */}
        <div className="absolute inset-x-0 bottom-0 p-8 pb-10">
          <h1 className="text-white text-4xl font-black leading-[1.1] tracking-tight drop-shadow-lg">
            Self Love
            <br />Planner
          </h1>

          <p className="text-white/85 text-sm leading-relaxed mt-4 max-w-[300px] drop-shadow">
            Learning to treat yourself with love, respect, kindness and
            gentle discipline can transform your life. 💕
          </p>

          {/* Circular arrow button */}
          <button
            onClick={() => setShowChoices(true)}
            aria-label="Get started"
            className="mt-7 w-14 h-14 rounded-full bg-white/95 flex items-center justify-center shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            <ArrowRight size={22} className="text-rose-600" />
          </button>
        </div>

        {/* Choice sheet (Login / Register) */}
        {showChoices && (
          <div className="absolute inset-0 z-20 flex items-end bg-black/40 backdrop-blur-sm animate-fade-in-up">
            <div className="w-full bg-white rounded-t-[32px] p-7 pb-9">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-xl font-bold gradient-text-love">Welcome 🌸</h2>
                <button onClick={() => setShowChoices(false)} className="p-2 rounded-xl bg-gray-100 text-gray-500">
                  <X size={16} />
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-6">Let&apos;s begin your self-love journey.</p>

              <Link href="/register"
                className="block py-4 rounded-2xl font-bold text-white text-sm text-center bg-gradient-to-r from-rose-500 to-pink-500 shadow-lg shadow-rose-400/30 transition-all hover:scale-[1.02] active:scale-[0.98]">
                Create an account 🌷
              </Link>
              <Link href="/login"
                className="block mt-3 py-4 rounded-2xl font-semibold text-sm text-center border border-gray-200 text-gray-700 transition-all hover:scale-[1.02] active:scale-[0.98] hover:bg-gray-50">
                I already have an account
              </Link>

              <p className="text-center text-[11px] text-gray-400 mt-6">
                You deserve the same love you give to everyone else 💗
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
