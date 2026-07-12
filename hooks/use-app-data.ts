'use client';

import { useCallback, useEffect, useState } from 'react';
import type {
  AppData,
  College,
  Goal,
  Meet,
  Milestone,
  Practice,
  TimeEntry,
} from '@/lib/types';
import { loadData, saveData, generateId, resetToSample } from '@/lib/storage';
import { sampleData } from '@/lib/sample-data';

export function useAppData() {
  const [data, setData] = useState<AppData>(sampleData);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setData(loadData());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveData(data);
  }, [data, loaded]);

  // Times
  const addTime = useCallback((time: Omit<TimeEntry, 'id'>) => {
    setData((d) => ({
      ...d,
      times: [...d.times, { ...time, id: generateId() }],
    }));
  }, []);

  const updateTime = useCallback((id: string, updates: Partial<TimeEntry>) => {
    setData((d) => ({
      ...d,
      times: d.times.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  }, []);

  const deleteTime = useCallback((id: string) => {
    setData((d) => ({ ...d, times: d.times.filter((t) => t.id !== id) }));
  }, []);

  // Practices
  const addPractice = useCallback((practice: Omit<Practice, 'id'>) => {
    setData((d) => ({
      ...d,
      practices: [...d.practices, { ...practice, id: generateId() }],
    }));
  }, []);

  const updatePractice = useCallback(
    (id: string, updates: Partial<Practice>) => {
      setData((d) => ({
        ...d,
        practices: d.practices.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
      }));
    },
    []
  );

  const deletePractice = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      practices: d.practices.filter((p) => p.id !== id),
    }));
  }, []);

  // Meets
  const addMeet = useCallback((meet: Omit<Meet, 'id'>) => {
    setData((d) => ({
      ...d,
      meets: [...d.meets, { ...meet, id: generateId() }],
    }));
  }, []);

  const updateMeet = useCallback((id: string, updates: Partial<Meet>) => {
    setData((d) => ({
      ...d,
      meets: d.meets.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    }));
  }, []);

  const deleteMeet = useCallback((id: string) => {
    setData((d) => ({ ...d, meets: d.meets.filter((m) => m.id !== id) }));
  }, []);

  // Goals
  const addGoal = useCallback((goal: Omit<Goal, 'id'>) => {
    setData((d) => ({
      ...d,
      goals: [...d.goals, { ...goal, id: generateId() }],
    }));
  }, []);

  const updateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    setData((d) => ({
      ...d,
      goals: d.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    }));
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setData((d) => ({ ...d, goals: d.goals.filter((g) => g.id !== id) }));
  }, []);

  // Milestones
  const addMilestone = useCallback((milestone: Omit<Milestone, 'id'>) => {
    setData((d) => ({
      ...d,
      milestones: [...d.milestones, { ...milestone, id: generateId() }],
    }));
  }, []);

  const updateMilestone = useCallback(
    (id: string, updates: Partial<Milestone>) => {
      setData((d) => ({
        ...d,
        milestones: d.milestones.map((ms) =>
          ms.id === id ? { ...ms, ...updates } : ms
        ),
      }));
    },
    []
  );

  const deleteMilestone = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      milestones: d.milestones.filter((ms) => ms.id !== id),
    }));
  }, []);

  // Colleges
  const addCollege = useCallback((college: Omit<College, 'id'>) => {
    setData((d) => ({
      ...d,
      colleges: [...d.colleges, { ...college, id: generateId() }],
    }));
  }, []);

  const updateCollege = useCallback(
    (id: string, updates: Partial<College>) => {
      setData((d) => ({
        ...d,
        colleges: d.colleges.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        ),
      }));
    },
    []
  );

  const deleteCollege = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      colleges: d.colleges.filter((c) => c.id !== id),
    }));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      colleges: d.colleges.map((c) =>
        c.id === id ? { ...c, isFavorite: !c.isFavorite } : c
      ),
    }));
  }, []);

  // Data management
  const replaceData = useCallback((newData: AppData) => {
    setData(newData);
  }, []);

  const resetData = useCallback(() => {
    setData(resetToSample());
  }, []);

  return {
    data,
    loaded,
    addTime,
    updateTime,
    deleteTime,
    addPractice,
    updatePractice,
    deletePractice,
    addMeet,
    updateMeet,
    deleteMeet,
    addGoal,
    updateGoal,
    deleteGoal,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    addCollege,
    updateCollege,
    deleteCollege,
    toggleFavorite,
    replaceData,
    resetData,
  };
}

export type AppDataHook = ReturnType<typeof useAppData>;
