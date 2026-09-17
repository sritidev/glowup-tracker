"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const UPDATED = "February 2026";

export default function PrivacyPolicy() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top,_#ffe4f0_0%,_#f3e8ff_50%,_#fff5f7_100%)]">
      <div className="absolute top-[-80px] left-[-80px] w-[380px] h-[380px] rounded-full blur-[110px] opacity-30 animate-float-slow pointer-events-none bg-rose-200" />
      <div className="absolute bottom-0 right-[-60px] w-[300px] h-[300px] rounded-full blur-[90px] opacity-20 animate-float pointer-events-none bg-purple-200" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 mb-5">
          <ArrowLeft size={16} /> Back
        </Link>

        <div className="glass-card rounded-3xl p-7 sm:p-9">
          <div className="text-4xl mb-2">🌸</div>
          <h1 className="text-3xl font-bold gradient-text-love">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mt-1">MyAura · Last updated {UPDATED}</p>

          <div className="mt-7 space-y-7 text-sm leading-relaxed text-gray-700">

            <Section title="1. About MyAura">
              MyAura is a self-care, wellness and personal-growth application that helps you track your
              wellbeing, build healthy routines, and organize personal inspiration. This policy explains
              what information we collect, how we use it, and the choices you have — including how the
              optional Pinterest integration works.
            </Section>

            <Section title="2. Information we collect">
              <p className="mb-2">We collect only what is needed to provide the app:</p>
              <List items={[
                "Account information — your email address and display name, used to create and secure your account.",
                "Wellness data you enter — moods, check-ins, journal entries, gratitude notes, hydration, sleep, movement, steps, habits, goals, calendar events, books and similar entries you choose to log.",
                "Optional profile details — such as an avatar image you upload.",
                "Technical data — basic information required to keep you signed in and to operate the app securely.",
              ]} />
              <p className="mt-2">You are always in control of the personal content you add, and you can edit or delete it at any time.</p>
            </Section>

            <Section title="3. The Pinterest integration (optional)">
              <p className="mb-2">
                Connecting Pinterest is completely optional. If you choose to connect your Pinterest account,
                MyAura uses Pinterest&apos;s official API with your permission to:
              </p>
              <List items={[
                "Verify your Pinterest account so the connection can be linked to your MyAura account.",
                "Read your Pinterest boards and Pins so you can browse them inside MyAura.",
                "Let you save selected Pins to a private MyAura Inspiration collection.",
              ]} />
              <p className="mt-3 mb-2">We request only read-only permissions. Specifically:</p>
              <List items={[
                "user_accounts:read — to identify your connected Pinterest account.",
                "boards:read — to show your boards.",
                "pins:read — to show and let you save your Pins.",
              ]} />
              <p className="mt-3">
                MyAura will <strong>never publish, modify, create, or delete</strong> any content on your
                Pinterest account. Pinterest content is used only as a source of personal inspiration inside MyAura.
              </p>
            </Section>

            <Section title="4. What we store from Pinterest">
              <p className="mb-2">When you connect Pinterest, we store:</p>
              <List items={[
                "A secure access token (and refresh token, if provided) so the connection stays active. These are stored server-side and are never exposed to your browser or to other users.",
                "Your Pinterest username, to show which account is connected.",
              ]} />
              <p className="mt-3 mb-2">When you save a Pin to your Inspiration collection, we store only that Pin&apos;s details for your reference:</p>
              <List items={[
                "The Pin&apos;s title, description, image URL and link back to Pinterest.",
                "The category you assign (e.g. self-care, wellness, fitness, style, travel, goals, lifestyle, personal growth) and any personal note you add.",
              ]} />
              <p className="mt-3">
                We do not bulk-copy, scrape, or cache your Pinterest content. We only keep the specific Pins
                you deliberately choose to save.
              </p>
            </Section>

            <Section title="5. How we use your information">
              <List items={[
                "To provide the app&apos;s features and show your own data back to you.",
                "To keep you signed in and keep your account secure.",
                "To display your saved Pinterest inspiration inside your private collection.",
              ]} />
              <p className="mt-2">
                We do not sell your personal data. We do not use your Pinterest content for advertising, and
                we do not share it with other users.
              </p>
            </Section>

            <Section title="6. How your data is protected">
              <List items={[
                "Your data is stored with our database provider (Supabase) and protected by row-level security, so you can only access your own data.",
                "Pinterest access tokens and secrets are handled only on the server and are never sent to the browser.",
                "Authenticated Pinterest data is never cached by the app&apos;s offline (PWA) layer.",
                "All requests to Pinterest are made securely on your behalf after verifying you are signed in.",
              ]} />
            </Section>

            <Section title="7. Disconnecting Pinterest & deleting data">
              <List items={[
                "You can disconnect Pinterest at any time from the ✨ My Inspiration screen. Disconnecting securely removes your stored Pinterest tokens from our system.",
                "You can remove any saved Pin from your Inspiration collection at any time.",
                "You can request deletion of your MyAura account and associated data by contacting us. When your account is deleted, your Pinterest connection and saved inspiration are deleted along with it.",
              ]} />
            </Section>

            <Section title="8. Data retention">
              We keep your data for as long as your account is active. Pinterest tokens are removed when you
              disconnect, and saved Pins are removed when you delete them or your account.
            </Section>

            <Section title="9. Third-party services">
              <p className="mb-2">MyAura relies on a small number of trusted services:</p>
              <List items={[
                "Supabase — authentication and database storage.",
                "Pinterest — only if you choose to connect it, governed by Pinterest&apos;s own Privacy Policy and Terms.",
              ]} />
              <p className="mt-2">
                Your use of Pinterest through MyAura is also subject to{" "}
                <a href="https://policy.pinterest.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-rose-500 font-semibold hover:underline">Pinterest&apos;s Privacy Policy</a>.
              </p>
            </Section>

            <Section title="10. Children's privacy">
              MyAura is not intended for children under 13 (or the minimum age required in your country).
              We do not knowingly collect data from children.
            </Section>

            <Section title="11. Changes to this policy">
              We may update this policy from time to time. When we do, we&apos;ll update the &ldquo;Last updated&rdquo;
              date at the top of this page.
            </Section>

            <Section title="12. Contact us">
              If you have any questions about this policy or your data, please contact us at{" "}
              <a href="mailto:singhsriti10@gmail.com" className="text-rose-500 font-semibold hover:underline">singhsriti10@gmail.com</a>.
            </Section>

          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          MyAura — take care of your mind, take care of your body, be kind to yourself 💗
        </p>
      </div>
    </main>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="text-base font-bold text-gray-800 mb-2">{title}</h2>
      <div className="text-gray-600">{children}</div>
    </section>
  );
}

function List({ items }) {
  return (
    <ul className="space-y-1.5 pl-1">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span className="text-rose-400 flex-shrink-0 mt-0.5">•</span>
          <span dangerouslySetInnerHTML={{ __html: item }} />
        </li>
      ))}
    </ul>
  );
}
