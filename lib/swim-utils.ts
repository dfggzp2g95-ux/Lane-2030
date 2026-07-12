import type { Goal, Practice, TimeEntry } from './types';

export function parseTimeToSeconds(time: string): number {
  if (!time) return 0;
  const clean = time.trim();
  if (clean.includes(':')) {
    const parts = clean.split(':');
    if (parts.length === 2) {
      return parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
    }
    if (parts.length === 3) {
      return (
        parseFloat(parts[0]) * 3600 +
        parseFloat(parts[1]) * 60 +
        parseFloat(parts[2])
      );
    }
  }
  return parseFloat(clean) || 0;
}

export function formatSecondsToTime(seconds: number): string {
  if (seconds >= 60) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds - mins * 60;
    return `${mins}:${secs.toFixed(2).padStart(5, '0')}`;
  }
  return seconds.toFixed(2);
}

export function timeDifference(current: string, goal: string): number {
  return parseTimeToSeconds(current) - parseTimeToSeconds(goal);
}

export function goalProgress(goal: Goal): number {
  const current = parseTimeToSeconds(goal.currentTime);
  const target = parseTimeToSeconds(goal.goalTime);
  if (current <= target) return 100;
  return Math.max(0, Math.min(100, Math.round((target / current) * 100)));
}

export function formatDate(date: string): string {
  return new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateShort(date: string): string {
  return new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function daysUntil(date: string): number {
  const target = new Date(date + 'T00:00:00').getTime();
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((target - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function isThisWeek(date: string): boolean {
  const target = new Date(date + 'T00:00:00');
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);
  return target >= startOfWeek && target < endOfWeek;
}

export function isSameMonth(date: string, ref: Date = new Date()): boolean {
  const target = new Date(date + 'T00:00:00');
  return (
    target.getMonth() === ref.getMonth() &&
    target.getFullYear() === ref.getFullYear()
  );
}

export function getWeekYardage(practices: Practice[]): number {
  return practices
    .filter((p) => isThisWeek(p.date))
    .reduce((sum, p) => sum + p.yardage, 0);
}

export function getMonthYardage(practices: Practice[]): number {
  return practices
    .filter((p) => isSameMonth(p.date))
    .reduce((sum, p) => sum + p.yardage, 0);
}

export function getPracticesThisWeek(practices: Practice[]): number {
  return practices.filter((p) => isThisWeek(p.date)).length;
}

export function getPersonalBests(times: TimeEntry[]): TimeEntry[] {
  const bests = new Map<string, TimeEntry>();
  for (const t of times) {
    const key = `${t.event}-${t.course}`;
    const existing = bests.get(key);
    if (!existing || parseTimeToSeconds(t.time) < parseTimeToSeconds(existing.time)) {
      bests.set(key, t);
    }
  }
  return Array.from(bests.values()).sort(
    (a, b) => parseTimeToSeconds(a.time) - parseTimeToSeconds(b.time)
  );
}

export function getRecentMeets(
  meets: import('./types').Meet[],
  limit = 3
) {
  return [...meets]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

export function getNextMeet(meets: import('./types').Meet[]) {
  const now = new Date();
  return [...meets]
    .filter((m) => new Date(m.date + 'T00:00:00') >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
}

export function getTodaySummary(practices: Practice[]): Practice | undefined {
  const today = new Date().toISOString().split('T')[0];
  return practices.find((p) => p.date === today);
}

export function formatYardage(yards: number): string {
  if (yards >= 1000) {
    return `${(yards / 1000).toFixed(1)}k`;
  }
  return `${yards}`;
}
