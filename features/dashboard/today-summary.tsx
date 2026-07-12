'use client';

import { motion } from 'framer-motion';
import { Waves, Clock, Droplets, Moon, Zap } from 'lucide-react';
import { useData } from '@/components/data-provider';
import { getTodaySummary } from '@/lib/swim-utils';

export function TodaySummary() {
  const { data } = useData();
  const today = getTodaySummary(data.practices);

  if (!today) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl border border-dashed border-border bg-muted/30 p-6 text-center"
      >
        <Waves className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          No practice logged today. Rest day or time to hit the pool?
        </p>
      </motion.div>
    );
  }

  const stats = [
    { label: 'Yardage', value: `${today.yardage.toLocaleString()} yd`, icon: Waves },
    { label: 'Duration', value: `${today.duration} min`, icon: Clock },
    { label: 'Focus', value: today.focus, icon: Zap },
    { label: 'Energy', value: `${today.energy}/10`, icon: Zap },
    { label: 'Sleep', value: `${today.sleepHours} hrs`, icon: Moon },
    { label: 'Water', value: `${today.waterIntake} L`, icon: Droplets },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Today&apos;s Training</h3>
          <p className="text-xs text-muted-foreground">{today.coach} · {today.pool}</p>
        </div>
        <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent">
          {today.focus}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-2.5 rounded-xl bg-muted/50 p-3"
            >
              <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-sm font-semibold">{stat.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
      {today.notes && (
        <p className="text-sm text-muted-foreground italic border-l-2 border-accent/40 pl-3">
          {today.notes}
        </p>
      )}
    </div>
  );
}
