// ── Lightweight notification helpers ────────────────────────
// Honest scope: shows a browser notification while the app is open/installed.
// True background push (fires when app is fully closed) needs a push server —
// this is a foreground reminder for today's events.

export function notifySupported() {
  return typeof window !== "undefined" && "Notification" in window;
}

export async function requestNotifyPermission() {
  if (!notifySupported()) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  try {
    return await Notification.requestPermission();
  } catch {
    return "denied";
  }
}

export function showNotification(title, body) {
  if (!notifySupported() || Notification.permission !== "granted") return false;
  try {
    new Notification(title, { body, icon: "/icon-192.png", badge: "/icon-192.png" });
    return true;
  } catch {
    return false;
  }
}

/**
 * Fire reminders for today's events — but only once per event per day,
 * tracked in localStorage so opening the app repeatedly doesn't spam.
 */
export function remindTodaysEvents(events) {
  if (!notifySupported() || Notification.permission !== "granted") return;
  const todayKey = new Date().toISOString().split("T")[0];
  const shownRaw = localStorage.getItem("slt_reminded_" + todayKey);
  const shown = shownRaw ? JSON.parse(shownRaw) : [];

  const due = events.filter((e) => e.remind && e.event_date === todayKey && !shown.includes(e.id));
  if (!due.length) return;

  due.forEach((e) => showNotification("Today 🌸 " + e.title, e.note || "You marked this for today."));
  localStorage.setItem("slt_reminded_" + todayKey, JSON.stringify([...shown, ...due.map((e) => e.id)]));
}
