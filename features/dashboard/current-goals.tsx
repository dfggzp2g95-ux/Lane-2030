'use client';

import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import { useData } from '@/components/data-provider';
import { goalProgress, formatDateShort } from '@/lib/swim-utils';
import { AnimatedCard } from '@/components/shared/animated-card';
import { Progress } from '@/components/ui/progress';
import { daysUntil } from '@/lib/swim-utils';

export function CurrentGoals() {
  const { data } = useData();
  const goals = data.goals.slice(0, 4);

  return (
    <AnimatedCard className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <Target className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Current Goals</h3>
      </div>
      <div className="space-y-4">
        {goals.map((goal, i) => {
          const progress = goalProgress(goal);
          const days = daysUntil(goal.deadline);
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium">{goal.title}</span>
                <span className="text-xs text-muted-foreground">
                  {days > 0 ? `${days}d left` : 'Overdue'}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-xs text-muted-foreground">
                  {goal.currentTime}
                </span>
                <div className="flex-1">
                  <Progress value={progress} className="h-2" />
                </div>
                <span className="font-mono text-xs font-semibold">
                  {goal.goalTime}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {progress}% · Due {formatDateShort(goal.deadline)}
              </p>
            </motion.div>
          );
        })}
      </div>
    </AnimatedCard>
  );
}
