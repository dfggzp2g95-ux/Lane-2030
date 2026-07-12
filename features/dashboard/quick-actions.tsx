'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Timer, Waves, Trophy, Target } from 'lucide-react';

const actions = [
  { label: 'Log Time', href: '/times', icon: Timer, color: 'text-chart-3' },
  { label: 'Add Practice', href: '/practices', icon: Waves, color: 'text-accent' },
  { label: 'Add Meet', href: '/meets', icon: Trophy, color: 'text-amber-500' },
  { label: 'New Goal', href: '/goals', icon: Target, color: 'text-primary' },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {actions.map((action, i) => {
        const Icon = action.icon;
        return (
          <motion.div
            key={action.href}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
          >
            <Link
              href={action.href}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 transition-all hover:shadow-md hover:border-primary/30"
            >
              <div className={`rounded-xl bg-muted p-2.5 group-hover:scale-110 transition-transform`}>
                <Icon className={`h-5 w-5 ${action.color}`} />
              </div>
              <span className="text-xs font-medium">{action.label}</span>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
