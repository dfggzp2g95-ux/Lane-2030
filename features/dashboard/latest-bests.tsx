'use client';

import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import { useData } from '@/components/data-provider';
import { getPersonalBests, formatDateShort } from '@/lib/swim-utils';
import { AnimatedCard } from '@/components/shared/animated-card';
import { PersonalBestBadge } from '@/components/shared/badges';

export function LatestBests() {
  const { data } = useData();
  const bests = getPersonalBests(data.times).slice(0, 5);

  return (
    <AnimatedCard className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <Award className="h-5 w-5 text-amber-500" />
        <h3 className="font-semibold">Personal Bests</h3>
      </div>
      <div className="space-y-2">
        {bests.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2.5"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{t.event}</span>
              <span className="text-xs text-muted-foreground">{t.course}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-semibold text-sm">{t.time}</span>
              <PersonalBestBadge />
            </div>
          </motion.div>
        ))}
      </div>
    </AnimatedCard>
  );
}
