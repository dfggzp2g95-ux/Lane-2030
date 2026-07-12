'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Waves, Clock, Zap, Moon, Droplets, Trash2 } from 'lucide-react';
import { useData } from '@/components/data-provider';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { AnimatedCard } from '@/components/shared/animated-card';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { PRACTICE_FOCUSES } from '@/lib/constants';
import { formatDate, getWeekYardage, getMonthYardage, getPracticesThisWeek } from '@/lib/swim-utils';
import type { Practice, PracticeFocus } from '@/lib/types';

const focusColors: Record<PracticeFocus, string> = {
  Sprint: 'bg-red-500/15 text-red-500',
  Distance: 'bg-blue-500/15 text-blue-500',
  Technique: 'bg-purple-500/15 text-purple-500',
  Recovery: 'bg-green-500/15 text-green-500',
};

export default function PracticesPage() {
  const { data, addPractice, deletePractice } = useData();
  const [selected, setSelected] = useState<Practice | null>(null);

  const weekYardage = getWeekYardage(data.practices);
  const monthYardage = getMonthYardage(data.practices);
  const practicesThisWeek = getPracticesThisWeek(data.practices);
  const totalYardage = data.practices.reduce((sum, p) => sum + p.yardage, 0);

  const sorted = [...data.practices].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Practices"
        subtitle="Log training sessions and track weekly totals"
        action={<AddPracticeDialog onAdd={addPractice} />}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="This Week" value={`${(weekYardage / 1000).toFixed(1)}k`} icon={Waves} accent="primary" trend={`${practicesThisWeek} sessions`} />
        <StatCard label="This Month" value={`${(monthYardage / 1000).toFixed(1)}k`} icon={Waves} accent="accent" trend="yards" delay={0.05} />
        <StatCard label="Total Yardage" value={`${(totalYardage / 1000).toFixed(0)}k`} icon={Waves} accent="chart-3" trend="all time" delay={0.1} />
        <StatCard label="Sessions" value={data.practices.length} icon={Clock} accent="chart-4" trend="logged" delay={0.15} />
      </div>

      {sorted.length === 0 ? (
        <EmptyState icon={Waves} title="No practices logged" description="Log your first training session." />
      ) : (
        <div className="grid gap-3">
          <AnimatePresence mode="popLayout">
            {sorted.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.02 }}
              >
                <button onClick={() => setSelected(p)} className="w-full text-left">
                  <AnimatedCard className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10">
                          <span className="text-xs font-bold text-primary">{p.yardage.toLocaleString()}</span>
                          <span className="text-[10px] text-muted-foreground">yd</span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold">{formatDate(p.date)}</p>
                          <p className="text-sm text-muted-foreground truncate">{p.coach} · {p.duration} min</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${focusColors[p.focus]}`}>
                          {p.focus}
                        </span>
                        <div className="flex gap-1.5 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Zap className="h-3 w-3" />{p.energy}</span>
                          <span className="flex items-center gap-1"><Moon className="h-3 w-3" />{p.sleepHours}h</span>
                        </div>
                      </div>
                    </div>
                  </AnimatedCard>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <PracticeDetailDialog
        practice={selected}
        onClose={() => setSelected(null)}
        onDelete={(id) => { deletePractice(id); setSelected(null); }}
      />
    </div>
  );
}

function AddPracticeDialog({ onAdd }: { onAdd: (p: Omit<Practice, 'id'>) => void }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState('');
  const [coach, setCoach] = useState('Coach Martinez');
  const [pool, setPool] = useState('Northshore Aquatic Center');
  const [yardage, setYardage] = useState(5000);
  const [duration, setDuration] = useState(90);
  const [focus, setFocus] = useState<PracticeFocus>('Sprint');
  const [energy, setEnergy] = useState(7);
  const [sleepHours, setSleepHours] = useState(8);
  const [waterIntake, setWaterIntake] = useState(2.5);
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!date) return;
    onAdd({ date, coach, pool, yardage, duration, focus, energy, sleepHours, waterIntake, notes: notes || undefined });
    setOpen(false);
    setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4 mr-2" />Log Practice</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Log Training Session</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Date</Label>
            <Input className="mt-1" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Coach</Label><Input className="mt-1" value={coach} onChange={(e) => setCoach(e.target.value)} /></div>
            <div><Label>Pool</Label><Input className="mt-1" value={pool} onChange={(e) => setPool(e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Yardage: {yardage.toLocaleString()}</Label>
              <Slider className="mt-3" value={[yardage]} onValueChange={(v) => setYardage(v[0])} min={500} max={10000} step={100} />
            </div>
            <div>
              <Label>Duration: {duration} min</Label>
              <Slider className="mt-3" value={[duration]} onValueChange={(v) => setDuration(v[0])} min={30} max={240} step={5} />
            </div>
          </div>
          <div>
            <Label>Focus</Label>
            <Select value={focus} onValueChange={(v) => setFocus(v as PracticeFocus)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {PRACTICE_FOCUSES.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Energy: {energy}/10</Label>
            <Slider className="mt-3" value={[energy]} onValueChange={(v) => setEnergy(v[0])} min={1} max={10} step={1} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Sleep: {sleepHours} hrs</Label>
              <Slider className="mt-3" value={[sleepHours]} onValueChange={(v) => setSleepHours(v[0])} min={4} max={12} step={0.5} />
            </div>
            <div>
              <Label>Water: {waterIntake} L</Label>
              <Slider className="mt-3" value={[waterIntake]} onValueChange={(v) => setWaterIntake(v[0])} min={0} max={6} step={0.25} />
            </div>
          </div>
          <div><Label>Notes</Label><Textarea className="mt-1" value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
          <Button onClick={handleSubmit} className="w-full">Save Practice</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PracticeDetailDialog({
  practice, onClose, onDelete,
}: {
  practice: Practice | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}) {
  if (!practice) return null;
  const stats = [
    { label: 'Yardage', value: `${practice.yardage.toLocaleString()} yd`, icon: Waves },
    { label: 'Duration', value: `${practice.duration} min`, icon: Clock },
    { label: 'Energy', value: `${practice.energy}/10`, icon: Zap },
    { label: 'Sleep', value: `${practice.sleepHours} hrs`, icon: Moon },
    { label: 'Water', value: `${practice.waterIntake} L`, icon: Droplets },
  ];
  return (
    <Dialog open={!!practice} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {formatDate(practice.date)}
            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${focusColors[practice.focus]}`}>{practice.focus}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{practice.coach} · {practice.pool}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex items-center gap-2 rounded-xl bg-muted/50 p-3">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-sm font-semibold">{s.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
          {practice.notes && <p className="text-sm text-muted-foreground italic border-l-2 border-accent/40 pl-3">{practice.notes}</p>}
          <Button variant="destructive" className="w-full" onClick={() => onDelete(practice.id)}>
            <Trash2 className="h-4 w-4 mr-2" />Delete Practice
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
