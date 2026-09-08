// ── Workout catalog ─────────────────────────────────────────
// Movement-focused, not calorie/weight-loss focused. Gentle, feminine,
// encouraging. Each workout has timed exercises (work + rest phases).

export const CATEGORIES = [
  { id: "walking",    label: "Walking",    icon: "🚶‍♀️" },
  { id: "stretching", label: "Stretching", icon: "🤸‍♀️" },
  { id: "mobility",   label: "Mobility",   icon: "🌀" },
  { id: "yoga",       label: "Yoga",       icon: "🧘‍♀️" },
  { id: "strength",   label: "Strength",   icon: "💪" },
  { id: "cardio",     label: "Cardio",     icon: "💗" },
  { id: "dance",      label: "Dance",      icon: "💃" },
  { id: "recovery",   label: "Recovery",   icon: "🌙" },
];

export const DURATIONS   = [5, 10, 15, 20, 30];
export const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];
export const GOALS = [
  "Get Stronger",
  "Improve Mobility",
  "Feel Energised",
  "Build Consistency",
  "Relax & Recover",
];

// Post-workout feelings
export const FEELINGS = [
  { emoji: "😊", label: "Energised" },
  { emoji: "😌", label: "Calm" },
  { emoji: "💪", label: "Strong" },
  { emoji: "🥰", label: "Proud" },
  { emoji: "😴", label: "Relaxed" },
  { emoji: "😐", label: "Same as before" },
];

// Helper to build timed exercise sequences
const work = (name, sec = 40) => ({ name, seconds: sec, type: "work" });
const rest = (sec = 20) => ({ name: "Rest", seconds: sec, type: "rest" });

function interleave(exercises, restSec = 20) {
  const out = [];
  exercises.forEach((ex, i) => {
    out.push(ex);
    if (i < exercises.length - 1) out.push(rest(restSec));
  });
  return out;
}

export const WORKOUTS = [
  {
    id: "gentle-strength-10",
    name: "Gentle Strength",
    category: "strength",
    duration: 10,
    difficulty: "Beginner",
    goal: "Get Stronger",
    color: "from-rose-500 to-pink-500",
    desc: "Soft, foundational strength to feel capable and steady.",
    exercises: interleave([work("Squats"), work("Glute Bridges"), work("Wall Push-ups"), work("Core Hold", 30)]),
  },
  {
    id: "morning-stretch-5",
    name: "Morning Stretch",
    category: "stretching",
    duration: 5,
    difficulty: "Beginner",
    goal: "Improve Mobility",
    color: "from-amber-400 to-orange-400",
    desc: "Wake your body gently with slow, loving stretches.",
    exercises: interleave([work("Neck Rolls", 30), work("Shoulder Opener", 30), work("Side Stretch", 30), work("Forward Fold", 30)], 10),
  },
  {
    id: "energy-cardio-15",
    name: "Feel-Good Cardio",
    category: "cardio",
    duration: 15,
    difficulty: "Intermediate",
    goal: "Feel Energised",
    color: "from-fuchsia-500 to-pink-500",
    desc: "Light cardio to lift your energy and mood.",
    exercises: interleave([work("March in Place"), work("Step Touch"), work("Knee Lifts"), work("Gentle Jumps"), work("Arm Circles")]),
  },
  {
    id: "calm-yoga-15",
    name: "Calming Yoga Flow",
    category: "yoga",
    duration: 15,
    difficulty: "Beginner",
    goal: "Relax & Recover",
    color: "from-purple-500 to-fuchsia-500",
    desc: "A soothing flow to release tension and soften.",
    exercises: interleave([work("Child's Pose", 45), work("Cat-Cow", 45), work("Downward Dog", 45), work("Cobra", 45), work("Seated Twist", 45)], 15),
  },
  {
    id: "mobility-reset-10",
    name: "Mobility Reset",
    category: "mobility",
    duration: 10,
    difficulty: "Beginner",
    goal: "Improve Mobility",
    color: "from-teal-500 to-emerald-500",
    desc: "Loosen stiff joints and move with more ease.",
    exercises: interleave([work("Hip Circles"), work("Ankle Rolls", 30), work("Spine Rolls"), work("Wrist Mobility", 30)]),
  },
  {
    id: "mindful-walk-20",
    name: "Mindful Walk",
    category: "walking",
    duration: 20,
    difficulty: "Beginner",
    goal: "Build Consistency",
    color: "from-sky-500 to-teal-400",
    desc: "A gentle walk — indoors or out. Just move & breathe.",
    exercises: [work("Warm-up Stroll", 120), work("Steady Walk", 600), work("Cool-down Stroll", 120)],
  },
  {
    id: "dance-joy-15",
    name: "Dance It Out",
    category: "dance",
    duration: 15,
    difficulty: "Beginner",
    goal: "Feel Energised",
    color: "from-pink-500 to-rose-400",
    desc: "Put on a song you love and move freely.",
    exercises: interleave([work("Free Dance", 60), work("Hip Sways", 45), work("Arm Grooves", 45), work("Spin & Shine", 45), work("Cool Down Sway", 60)], 15),
  },
  {
    id: "evening-recovery-10",
    name: "Evening Recovery",
    category: "recovery",
    duration: 10,
    difficulty: "Beginner",
    goal: "Relax & Recover",
    color: "from-indigo-500 to-purple-500",
    desc: "Wind down and prepare your body for restful sleep.",
    exercises: interleave([work("Legs Up the Wall", 90), work("Reclined Twist", 60), work("Knee to Chest", 60), work("Deep Breathing", 90)], 10),
  },
  {
    id: "strong-core-20",
    name: "Strong & Steady Core",
    category: "strength",
    duration: 20,
    difficulty: "Intermediate",
    goal: "Get Stronger",
    color: "from-rose-500 to-fuchsia-500",
    desc: "Build a strong centre — gently and mindfully.",
    exercises: interleave([work("Dead Bug"), work("Bird Dog"), work("Plank", 30), work("Glute Bridges"), work("Side Plank", 30), work("Core Hold", 30)]),
  },
  {
    id: "power-cardio-30",
    name: "Power Flow",
    category: "cardio",
    duration: 30,
    difficulty: "Advanced",
    goal: "Feel Energised",
    color: "from-rose-600 to-pink-600",
    desc: "A fuller session to feel powerful and alive.",
    exercises: interleave([work("Jumping Jacks"), work("High Knees"), work("Squat Pulses"), work("Mountain Climbers"), work("Lunges"), work("Burpees (gentle)"), work("Cool Down", 60)]),
  },
];

export function getWorkout(id) {
  return WORKOUTS.find((w) => w.id === id) ?? null;
}

/** Total seconds of a workout (sum of all phases). */
export function workoutSeconds(w) {
  return (w?.exercises ?? []).reduce((a, e) => a + e.seconds, 0);
}

/** Count of actual exercises (excluding rest phases). */
export function exerciseCount(w) {
  return (w?.exercises ?? []).filter((e) => e.type === "work").length;
}

export function categoryMeta(id) {
  return CATEGORIES.find((c) => c.id === id) ?? { id, label: id, icon: "🏃" };
}
