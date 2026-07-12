'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  accent?: 'primary' | 'accent' | 'chart-3' | 'chart-4';
  delay?: number;
}

const accentClasses = {
  primary: 'from-primary/10 to-primary/5 text-primary',
  accent: 'from-accent/10 to-accent/5 text-accent',
  'chart-3': 'from-chart-3/10 to-chart-3/5 text-chart-3',
  'chart-4': 'from-chart-4/10 to-chart-4/5 text-chart-4',
};

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  accent = 'primary',
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      className={cn(
        'relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br p-5',
        accentClasses[accent]
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
            {value}
          </p>
          {trend && (
            <p className="mt-1 text-xs text-muted-foreground">{trend}</p>
          )}
        </div>
        <div className="rounded-xl bg-background/60 p-2.5">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}
