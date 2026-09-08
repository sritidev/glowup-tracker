// ── Streak helpers ─────────────────────────────────────────
// A "streak" = consecutive calendar days that have a logged entry.
// Current streak counts back from today (or yesterday if today isn't
// logged yet — so the streak doesn't break until a full day is missed).

/** Convert a Date or ISO string to a YYYY-MM-DD string (local). */
function toKey(d) {
  const date = typeof d === "string" ? new Date(d + "T12:00:00") : d;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Number of whole days between two YYYY-MM-DD keys (b - a). */
function daysBetween(aKey, bKey) {
  const a = new Date(aKey + "T12:00:00");
  const b = new Date(bKey + "T12:00:00");
  return Math.round((b - a) / 86400000);
}

/**
 * Compute current + longest streak from a list of logged dates.
 * @param {string[]} loggedDates - array of YYYY-MM-DD strings (any order, dupes ok)
 * @returns {{ current: number, longest: number }}
 */
export function computeStreaks(loggedDates) {
  if (!loggedDates || loggedDates.length === 0) {
    return { current: 0, longest: 0 };
  }

  // Unique + sorted ascending
  const keys = [...new Set(loggedDates.map((d) => toKey(d)))].sort();

  // Longest streak — walk sorted keys, count consecutive runs
  let longest = 1;
  let run = 1;
  for (let i = 1; i < keys.length; i++) {
    if (daysBetween(keys[i - 1], keys[i]) === 1) {
      run += 1;
      longest = Math.max(longest, run);
    } else {
      run = 1;
    }
  }

  // Current streak — count back from today; allow today to be unlogged
  const todayKey = toKey(new Date());
  const yesterdayKey = toKey(new Date(Date.now() - 86400000));
  const keySet = new Set(keys);

  let current = 0;
  let cursor;
  if (keySet.has(todayKey)) cursor = todayKey;
  else if (keySet.has(yesterdayKey)) cursor = yesterdayKey;
  else return { current: 0, longest };

  while (keySet.has(cursor)) {
    current += 1;
    const prev = new Date(cursor + "T12:00:00");
    prev.setDate(prev.getDate() - 1);
    cursor = toKey(prev);
  }

  return { current, longest: Math.max(longest, current) };
}

/** Level metadata based on current streak length. */
export function streakLevel(streak) {
  if (streak >= 30) return { label: "Self-Love Legend 👑", color: "text-yellow-400" };
  if (streak >= 14) return { label: "Unstoppable 🔥",       color: "text-orange-400" };
  if (streak >= 7)  return { label: "Radiating Love 💖",    color: "text-rose-400" };
  if (streak >= 3)  return { label: "Blooming 🌸",          color: "text-pink-400" };
  if (streak >= 1)  return { label: "Gently Growing 🌱",    color: "text-fuchsia-400" };
  return              { label: "Just starting 💗",          color: "text-gray-400" };
}
