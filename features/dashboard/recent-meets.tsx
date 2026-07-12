'use client';

import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { useData } from '@/components/data-provider';
import { getRecentMeets, formatDateShort } from '@/lib/swim-utils';
import { AnimatedCard } from '@/components/shared/animated-card';

export function RecentMeets() {
  const { data } = useData();
  const recent = getRecentMeets(data.meets, 3);

  return (
    <AnimatedCard className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-5 w-5 text-amber-500" />
        <h3 className="font-semibold">Recent Meets</h3>
      </div>
      <div className="space-y-3">
        {recent.map((meet, i) => (
          <motion.div
            key={meet.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-start justify-between rounded-xl bg-muted/40 px-3 py-2.5"
          >
            <div>
              <p className="font-medium text-sm">{meet.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatDateShort(meet.date)} · {meet.course}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">
                {meet.events.length} events
              </p>
              <div className="flex gap-1 mt-0.5">
                {meet.events.slice(0, 3).map((e) => (
                  <span
                    key={e.id}
                    className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary"
                  >
                    {e.placement <= 3 ? `#${e.placement}` : e.event.split(' ')[0]}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </AnimatedCard>
  );
}
