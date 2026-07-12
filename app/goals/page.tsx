'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, Trash2, Calendar, TrendingDown } from 'lucide-react';
import { useData } from '@/components/data-provider';
import { PageHeader } from '@/components/shared/page-header';
import { AnimatedCard } from '@/components/shared/animated-card';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { COURSES, SWIM_EVENTS } from '@/lib/constants';
import { goalProgress, formatDate, daysUntil, parseTimeToSeconds, timeDifference } from '@/lib/swim-utils';
import type { Course, Goal } from '@/lib/types';

export default function GoalsPage() {
  const { data, addGoal, deleteGoal } = useData();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Goals"
        subtitle="Set targets and track your progress"
        action={<AddGoalDialog onAdd={addGoal} />}
      />

      {data.goals.length === 0 ? (
        <EmptyState icon={Target} title="No goals set" description="Create your first goal to start tracking progress." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {data.goals.map((goal, i) => {
              const progress = goalProgress(goal);
              const diff = timeDifference(goal.currentTime, goal.goalTime);
              const days = daysUntil(goal.deadline);
              const isOverdue = days < 0;
              return (
                <motion.div
                  key={goal.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <GoalCard goal={goal} progress={progress} diff={diff} days={days} isOverdue={isOverdue} onDelete={deleteGoal} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function GoalCard({
  goal, progress, diff, days, isOverdue, onDelete,
}: {
  goal: Goal; progress: number; diff: number; days: number; isOverdue: boolean; onDelete: (id: string) => void;
}) {
  return (
    <AnimatedCard className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold">{goal.title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{goal.event} · {goal.course}</p>
        </div>
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onDelete(goal.id)}>
          <Trash2 className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-sm text-muted-foreground">{goal.currentTime}</span>
            <span className="font-mono text-sm font-semibold">{goal.goalTime}</span>
          </div>
          <Progress value={progress} className="h-2.5" />
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1.5 text-sm">
          <TrendingDown className={`h-4 w-4 ${diff > 0 ? 'text-green-500' : 'text-muted-foreground'}`} />
          <span className="text-muted-foreground">
            {diff > 0 ? `${diff.toFixed(2)}s to go` : 'Goal achieved!'}
          </span>
        </div>
        <Badge variant={isOverdue ? 'destructive' : 'outline'} className="gap-1">
          <Calendar className="h-3 w-3" />
          {isOverdue ? 'Overdue' : `${days}d left`}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground mt-2">Due {formatDate(goal.deadline)}</p>
    </AnimatedCard>
  );
}

function AddGoalDialog({ onAdd }: { onAdd: (g: Omit<Goal, 'id'>) => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [event, setEvent] = useState('');
  const [course, setCourse] = useState<Course>('SCY');
  const [currentTime, setCurrentTime] = useState('');
  const [goalTime, setGoalTime] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = () => {
    if (!title || !event || !currentTime || !goalTime || !deadline) return;
    onAdd({ title, event, course, currentTime, goalTime, deadline });
    setOpen(false);
    setTitle(''); setEvent(''); setCurrentTime(''); setGoalTime(''); setDeadline('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4 mr-2" />New Goal</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Create a Goal</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div><Label>Title</Label><Input className="mt-1" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Sub-21 50 Free" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Event</Label>
              <Select value={event} onValueChange={setEvent}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {SWIM_EVENTS.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Course</Label>
              <Select value={course} onValueChange={(v) => setCourse(v as Course)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {COURSES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Current Time</Label><Input className="mt-1" value={currentTime} onChange={(e) => setCurrentTime(e.target.value)} placeholder="21.84" /></div>
            <div><Label>Goal Time</Label><Input className="mt-1" value={goalTime} onChange={(e) => setGoalTime(e.target.value)} placeholder="20.99" /></div>
          </div>
          <div><Label>Deadline</Label><Input className="mt-1" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} /></div>
          <Button onClick={handleSubmit} className="w-full">Save Goal</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
