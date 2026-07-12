import type { AppData } from './types';
import { sampleData } from './sample-data';

const STORAGE_KEY = 'lane2030-data-v1';
const SCHEMA_VERSION_KEY = 'lane2030-schema-version';
const CURRENT_SCHEMA_VERSION = '2';

function isStaleData(data: AppData): boolean {
  return (
    data.times.length > 0 ||
    data.practices.length > 0 ||
    data.meets.length > 0 ||
    data.goals.length > 0 ||
    data.milestones.length > 0 ||
    data.colleges.length > 0
  );
}

export function loadData(): AppData {
  if (typeof window === 'undefined') return sampleData;
  try {
    const schemaVersion = localStorage.getItem(SCHEMA_VERSION_KEY);
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      saveData(sampleData);
      localStorage.setItem(SCHEMA_VERSION_KEY, CURRENT_SCHEMA_VERSION);
      return sampleData;
    }

    const parsed = JSON.parse(raw) as AppData;

    if (schemaVersion !== CURRENT_SCHEMA_VERSION && isStaleData(parsed)) {
      const fresh = { ...sampleData };
      saveData(fresh);
      localStorage.setItem(SCHEMA_VERSION_KEY, CURRENT_SCHEMA_VERSION);
      return fresh;
    }

    localStorage.setItem(SCHEMA_VERSION_KEY, CURRENT_SCHEMA_VERSION);
    return parsed;
  } catch {
    return sampleData;
  }
}

export function saveData(data: AppData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data', e);
  }
}

export function clearData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export function exportData(): string {
  return JSON.stringify(loadData(), null, 2);
}

export function importData(json: string): AppData {
  const parsed = JSON.parse(json) as AppData;
  saveData(parsed);
  return parsed;
}

export function resetToSample(): AppData {
  saveData(sampleData);
  return sampleData;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
