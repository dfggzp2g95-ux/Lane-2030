'use client';

import { Sidebar } from './sidebar';
import { BottomNav } from './bottom-nav';
import { DataProvider } from '@/components/data-provider';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <DataProvider>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="lg:pl-64 min-h-screen">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="px-4 py-6 pb-28 lg:px-8 lg:py-8 lg:pb-8 max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
        </main>
        <BottomNav />
      </div>
    </DataProvider>
  );
}
