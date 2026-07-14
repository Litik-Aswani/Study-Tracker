export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatLocalDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getMondayOfWeek(dateStr: string): string {
  const d = parseLocalDate(dateStr);
  const day = d.getDay(); // 0: Sun, 1: Mon, ... 6: Sat
  // In Javascript, Sunday is 0. If it is Sunday, we go back 6 days. If Monday, go back 0.
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return formatLocalDate(monday);
}

export function getSundayOfWeek(dateStr: string): string {
  const mon = parseLocalDate(getMondayOfWeek(dateStr));
  const sun = new Date(mon.setDate(mon.getDate() + 6));
  return formatLocalDate(sun);
}

export function getDaysAgo(dateStr: string, todayStr: string): number {
  const date = parseLocalDate(dateStr);
  const today = parseLocalDate(todayStr);
  const diffTime = today.getTime() - date.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function calculateStreak(sessionDates: string[], todayStr: string): number {
  if (sessionDates.length === 0) return 0;

  // Unique sorted dates, descending (newest first)
  const uniqueDates = Array.from(new Set(sessionDates)).sort().reverse();

  const today = parseLocalDate(todayStr);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatLocalDate(yesterday);

  // If no sessions logged today AND yesterday, streak is 0
  if (!uniqueDates.includes(todayStr) && !uniqueDates.includes(yesterdayStr)) {
    return 0;
  }

  let streak = 0;
  // If they have logged today, start tracking from today. Otherwise, start from yesterday.
  const currentRefDate = uniqueDates.includes(todayStr) ? new Date(today) : new Date(yesterday);

  while (true) {
    const currentRefStr = formatLocalDate(currentRefDate);
    if (uniqueDates.includes(currentRefStr)) {
      streak++;
      currentRefDate.setDate(currentRefDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export function getFriendlyDateLabel(dateStr: string, todayStr: string): string {
  if (dateStr === todayStr) return "Today";

  const today = parseLocalDate(todayStr);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatLocalDate(yesterday);
  if (dateStr === yesterdayStr) return "Yesterday";

  const d = parseLocalDate(dateStr);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

// Check if a date falls within the same week (Mon-Sun) as the reference date
export function isSameWeek(dateStr: string, refDateStr: string): boolean {
  const monday = getMondayOfWeek(refDateStr);
  const sunday = getSundayOfWeek(refDateStr);
  return dateStr >= monday && dateStr <= sunday;
}
