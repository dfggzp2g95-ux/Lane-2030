'use client';

import { createContext, useContext } from 'react';
import { useAppData, type AppDataHook } from '@/hooks/use-app-data';

const DataContext = createContext<AppDataHook | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const appData = useAppData();
  return <DataContext.Provider value={appData}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error('useData must be used within a DataProvider');
  }
  return ctx;
}
