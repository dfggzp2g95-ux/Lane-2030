'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Map, Trash2, CheckCircle2, Circle, Clock, Flag } from 'lucide-react';
import { useData } from '@/components/data-provider';
import { PageHeader } from '@/components/shared/page-header';
import { AnimatedCard } from '@/components/shared/animated-card';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { MILESTONE_CATEGORIES } from '@/lib/constants';
import { formatDate, daysUntil } from '@/lib/swim-utils';
import type { Milestone, MilestoneStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

const statusConfig: Record<MilestoneStatus, { icon: typeof Circle; color: string; dot: string }> = {
  Completed: { icon: CheckCircle2, color: 'text-green-500', dot: 'bg-green-500' },
  'In Progress': { icon: Clock, color: 'text-blue-500', dot: 'bg-blue-500' },
  Upcoming: { icon: Circle, color: 'text-muted-foreground', dot: 'bg-muted-foreground' },
};

const categoryColors: Record<string, string> = {
  'High School Season': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  'Championship Meet': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  'Time Standard': 'bg-accent/10 text-accent border-accent/20',
  'College Visit': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  'Recruiting Deadline': 'bg-red-500/10 text-red-500 border-red-500/20',
  Commitment: 'bg-green-500/10 text-green-500 border-green-500/20',
  Graduation: 'bg-primary/10 text-primary border-primary/20',
};

export default function RoadmapPage() {
  const { data, addMilestone, updateMilestone, deleteMilestone } = useData();

  const sorted = [...data.milestones].sort(
    (a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
  );

  const completed = sorted.filter((m) => m.status === 'Completed').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roadmap"
        subtitle={`The path to 2030 · ${completed} of ${sorted.length} milestones completed`}
        action={<AddMilestoneDialog onAdd={addMilestone} />}
      />

      {sorted.length === 0 ? (
        <EmptyState icon={Map} title="No milestones yet" description="Start building your roadmap to 2030." />
      ) : (
        <div className="relative">
          <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-border" />
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {sorted.map((m, i) => (
                <motion.div
                  key={m.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: i * 0.03 }}
                  className="relative pl-12 sm:pl-16"
                >
                  <div className={cn(
                    'absolute left-2.5 sm:left-4.5 top-5 h-3 w-3 rounded-full ring-4 ring-background',
                    statusConfig[m.status].dot
                  )} />
                  <MilestoneCard
                    milestone={m}
                    onToggle={() =>
                      updateMilestone(m.id, {
                        status: m.status === 'Completed' ? 'Upcoming' : 'Completed',
                      })
                    }
                    onDelete={() => deleteMilestone(m.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}

function MilestoneCard({
  milestone, onToggle, onDelete,
}: {
  milestone: Milestone;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const StatusIcon = statusConfig[milestone.status].icon;
  const days = daysUntil(milestone.targetDate);
  const isPast = days < 0 && milestone.status !== 'Completed';

  return (
    <AnimatedCard className={cn('p-5', isPast && 'border-destructive/30')}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <StatusIcon className={cn('h-4 w-4 shrink-0', statusConfig[milestone.status].color)} />
            <h3 className={cn('font-semibold', milestone.status === 'Completed' && 'line-through text-muted-foreground')}>
              {milestone.title}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">{milestone.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className={cn('text-xs', categoryColors[milestone.category])}>
              {milestone.category}
            </Badge>
            <span className="text-xs text-muted-foreground">{formatDate(milestone.targetDate)}</span>
            {milestone.status !== 'Completed' && (
              <span className={cn('text-xs', isPast ? 'text-destructive' : 'text-muted-foreground')}>
                {isPast ? `${Math.abs(days)}d overdue` : `${days}d away`}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1 shrink-0">
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onToggle}>
            <Flag className={cn('h-4 w-4', milestone.status === 'Completed' ? 'text-green-500' : 'text-muted-foreground')} />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onDelete}>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </AnimatedCard>
  );
}

function AddMilestoneDialog({ onAdd }: { onAdd: (m: Omit<Milestone, 'id'>) => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState<Milestone['category']>('High School Season');

  const handleSubmit = () => {
    if (!title || !targetDate) return;
    onAdd({ title, description, targetDate, status: 'Upcoming', category });
    setOpen(false);
    setTitle(''); setDescription(''); setTargetDate('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4 mr-2" />Add Milestone</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Add Milestone</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div><Label>Title</Label><Input className="mt-1" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Sectionals" /></div>
          <div><Label>Description</Label><Textarea className="mt-1" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="First high school sectional meet" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Target Date</Label><Input className="mt-1" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} /></div>
            <div>
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as Milestone['category'])}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MILESTONE_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleSubmit} className="w-full">Save Milestone</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
