// ── Shared wellness helpers ─────────────────────────────────

/** Today as YYYY-MM-DD (local). */
export function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Monday of the current week as YYYY-MM-DD. */
export function mondayISO() {
  const d = new Date();
  const diff = d.getDay() === 0 ? -6 : 1 - d.getDay();
  d.setDate(d.getDate() + diff);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Monday-indexed weekday label for an ISO date. */
export function weekdayLabel(iso) {
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return labels[(new Date(iso + "T12:00:00").getDay() + 6) % 7];
}

/** Time-of-day greeting. */
export function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

/** Format minutes as "7h 20m". */
export function formatDuration(mins) {
  if (mins == null) return "—";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/** Format ml as "1.5L". */
export function formatLitres(ml) {
  return `${(ml / 1000).toFixed(1)}L`;
}

// ── Acts of Love (daily habit checklist) ────────────────────
export const ACTS_OF_LOVE = [
  { id: "sleep",    icon: "😴", label: "Got enough sleep" },
  { id: "hydrate",  icon: "💧", label: "Drank enough water" },
  { id: "move",     icon: "🏃", label: "Moved my body" },
  { id: "nourish",  icon: "🥗", label: "Nourished myself well" },
  { id: "screen",   icon: "📵", label: "Took a screen break" },
  { id: "outside",  icon: "🌤️", label: "Spent time outside" },
  { id: "creative", icon: "🎨", label: "Did something creative" },
  { id: "connect",  icon: "🤝", label: "Connected with someone I love" },
  { id: "journal",  icon: "📖", label: "Journaled or reflected" },
  { id: "breathe",  icon: "🧘", label: "Practiced deep breathing" },
];

// ── Nourishment habits ──────────────────────────────────────
export const NOURISH_HABITS = [
  { id: "breakfast", icon: "🍳", label: "Had breakfast" },
  { id: "veggies",   icon: "🥦", label: "Ate vegetables" },
  { id: "fruit",     icon: "🍓", label: "Had fruit" },
  { id: "protein",   icon: "🥚", label: "Had protein" },
  { id: "water",     icon: "💧", label: "Drank enough water" },
  { id: "mindful",   icon: "🧘", label: "Ate mindfully" },
  { id: "meals",     icon: "🍽️", label: "Didn't skip meals" },
];

// ── Achievements ────────────────────────────────────────────
// Each: { id, icon, title, group, test(stats) -> boolean }
// stats shape: { selfLoveStreak, journalCount, workoutCount, moveActiveDays,
//                breatheCount, hydrationGoalDays, sleepGoalDays }
export const ACHIEVEMENTS = [
  // Self-Love
  { id: "first-checkin", icon: "🌱", title: "First check-in",     group: "Self-Love", test: (s) => s.selfLoveStreak >= 1 },
  { id: "3-day-bloom",   icon: "🌸", title: "3-day bloomer",      group: "Self-Love", test: (s) => s.selfLoveStreak >= 3 },
  { id: "week-strong",   icon: "💗", title: "One week strong",    group: "Self-Love", test: (s) => s.selfLoveStreak >= 7 },
  // Movement
  { id: "first-workout", icon: "🏃", title: "First workout",      group: "Movement", test: (s) => s.workoutCount >= 1 },
  { id: "5-workouts",    icon: "💪", title: "5 workouts",         group: "Movement", test: (s) => s.workoutCount >= 5 },
  { id: "10-workouts",   icon: "🔥", title: "10 workouts",        group: "Movement", test: (s) => s.workoutCount >= 10 },
  { id: "30-active",     icon: "🌟", title: "30 active days",     group: "Movement", test: (s) => s.moveActiveDays >= 30 },
  // Wellness
  { id: "hydration-hero",icon: "💧", title: "Hydration Hero",     group: "Wellness", test: (s) => s.hydrationGoalDays >= 5 },
  { id: "10-breathing",  icon: "🧘", title: "10 breathing sessions", group: "Wellness", test: (s) => s.breatheCount >= 10 },
  { id: "20-journals",   icon: "📖", title: "20 journal entries", group: "Wellness", test: (s) => s.journalCount >= 20 },
  { id: "7-sleep",       icon: "🌙", title: "7 sleep-goal days",  group: "Wellness", test: (s) => s.sleepGoalDays >= 7 },
];

export function evaluateAchievements(stats) {
  return ACHIEVEMENTS.map((a) => ({ ...a, unlocked: !!a.test(stats) }));
}

/**
 * Weekly wellness score (0-100) from per-dimension completion.
 * dims: { movement:{done,goal}, mood:{done,goal}, hydration:{done,goal},
 *         sleep:{done,goal}, journaling:{done,goal} }
 */
export function wellnessScore(dims) {
  const parts = Object.values(dims).map((d) => (d.goal ? Math.min(d.done / d.goal, 1) : 0));
  if (!parts.length) return 0;
  return Math.round((parts.reduce((a, b) => a + b, 0) / parts.length) * 100);
}
