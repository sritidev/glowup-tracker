// ── Shared mood metadata ────────────────────────────────────
// One source of truth for mood emoji, label, colors, and a numeric
// "score" (1–5) used for trend charts. Higher = more positive.

export const MOODS = [
  { emoji: "🥰", label: "Loved",   score: 5, color: "text-rose-400",   hex: "#fb7185", bg: "bg-rose-400/20 border-rose-300/40",     desc: "Feeling full of love" },
  { emoji: "😊", label: "Calm",    score: 4, color: "text-purple-400", hex: "#c084fc", bg: "bg-purple-400/20 border-purple-300/40", desc: "Peaceful and grounded" },
  { emoji: "😐", label: "Neutral", score: 3, color: "text-gray-400",   hex: "#9ca3af", bg: "bg-gray-400/20 border-gray-300/40",     desc: "Just getting through" },
  { emoji: "😔", label: "Low",     score: 2, color: "text-blue-400",   hex: "#60a5fa", bg: "bg-blue-400/20 border-blue-300/40",     desc: "A little down today" },
  { emoji: "😤", label: "Tense",   score: 1, color: "text-orange-400", hex: "#fb923c", bg: "bg-orange-400/20 border-orange-300/40", desc: "Stressed or overwhelmed" },
];

/** Look up mood metadata by emoji. */
export function moodByEmoji(emoji) {
  return MOODS.find((m) => m.emoji === emoji) ?? null;
}

/** Numeric score (1–5) for an emoji, or null if unknown. */
export function moodScore(emoji) {
  return moodByEmoji(emoji)?.score ?? null;
}
