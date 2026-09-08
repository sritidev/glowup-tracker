// ── Insights / trends computation ──────────────────────────
// Takes an array of mood_entries rows: { mood_emoji, logged_date, ... }
// and derives all the analytics the /insights page renders.

import { MOODS, moodByEmoji, moodScore } from "./moods";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function parseDate(iso) {
  return new Date(iso + "T12:00:00");
}

/**
 * @param {Array<{mood_emoji:string, logged_date:string}>} entries
 */
export function computeInsights(entries) {
  const valid = (entries ?? []).filter((e) => e.mood_emoji && e.logged_date);
  const total = valid.length;

  if (total === 0) {
    return {
      total: 0,
      distribution: [],
      topMood: null,
      bestDay: null,
      avgScore: 0,
      avgScorePct: 0,
      dayOfWeek: [],
    };
  }

  // ── Mood distribution ──
  const counts = {};
  for (const e of valid) counts[e.mood_emoji] = (counts[e.mood_emoji] ?? 0) + 1;

  const distribution = MOODS
    .map((m) => ({
      ...m,
      count: counts[m.emoji] ?? 0,
      pct: Math.round(((counts[m.emoji] ?? 0) / total) * 100),
    }))
    .filter((m) => m.count > 0)
    .sort((a, b) => b.count - a.count);

  const topMood = distribution[0] ?? null;

  // ── Average score (1–5) ──
  const scores = valid.map((e) => moodScore(e.mood_emoji)).filter((s) => s != null);
  const avgScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  const avgScorePct = Math.round((avgScore / 5) * 100);

  // ── Average score by day of week ──
  const dowSum = Array(7).fill(0);
  const dowCount = Array(7).fill(0);
  for (const e of valid) {
    const s = moodScore(e.mood_emoji);
    if (s == null) continue;
    const dow = parseDate(e.logged_date).getDay();
    dowSum[dow] += s;
    dowCount[dow] += 1;
  }
  const dayOfWeek = WEEKDAYS.map((label, i) => ({
    label,
    avg: dowCount[i] ? dowSum[i] / dowCount[i] : 0,
    count: dowCount[i],
  }));

  // ── Best day of the week (highest average, needs ≥1 entry) ──
  const daysWithData = dayOfWeek.filter((d) => d.count > 0);
  const bestDay = daysWithData.length
    ? daysWithData.reduce((best, d) => (d.avg > best.avg ? d : best))
    : null;

  return { total, distribution, topMood, bestDay, avgScore, avgScorePct, dayOfWeek };
}

/**
 * Build a calendar grid for the last `days` days (default 35 = 5 weeks).
 * Returns array of { date, iso, emoji, mood } — oldest first, padded so
 * the grid starts on a Monday column.
 */
export function buildCalendar(entries, days = 35) {
  const byDate = {};
  for (const e of entries ?? []) {
    if (e.mood_emoji && e.logged_date) byDate[e.logged_date] = e.mood_emoji;
  }

  const cells = [];
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const emoji = byDate[iso] ?? null;
    cells.push({
      iso,
      date: d.getDate(),
      emoji,
      mood: emoji ? moodByEmoji(emoji) : null,
      isToday: i === 0,
    });
  }

  return cells;
}
