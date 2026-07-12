'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trophy, MapPin, Clock, Video, Trash2, Medal } from 'lucide-react';
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
import { COURSES, SWIM_EVENTS } from '@/lib/constants';
import { formatDate } from '@/lib/swim-utils';
import type { Course, Meet, MeetEvent } from '@/lib/types';

const placementColors: Record<number, string> = {
  1: 'bg-amber-500/20 text-amber-600 dark:text-amber-400',
  2: 'bg-slate-400/20 text-slate-500',
  3: 'bg-orange-700/20 text-orange-700 dark:text-orange-400',
};

export default function MeetsPage() {
  const { data, addMeet, deleteMeet } = useData();
  const [selected, setSelected] = useState<Meet | null>(null);

  const sorted = [...data.meets].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Meets"
        subtitle="Race results, splits, and placements"
        action={<AddMeetDialog onAdd={addMeet} />}
      />

      {sorted.length === 0 ? (
        <EmptyState icon={Trophy} title="No meets logged" description="Add your first meet to track results." />
      ) : (
        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {sorted.map((meet, i) => {
              const medals = meet.events.filter((e) => e.placement <= 3).length;
              return (
                <motion.div
                  key={meet.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <button onClick={() => setSelected(meet)} className="w-full text-left">
                    <AnimatedCard className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-lg">{meet.name}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                            <MapPin className="h-3.5 w-3.5" />{meet.location}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                            <Clock className="h-3.5 w-3.5" />{formatDate(meet.date)} · {meet.course}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <Badge variant="outline" className="bg-primary/5">{meet.events.length} events</Badge>
                          {medals > 0 && (
                            <div className="flex items-center gap-1 text-amber-500">
                              <Medal className="h-4 w-4" />
                              <span className="text-xs font-medium">{medals} {medals === 1 ? 'podium' : 'podiums'}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {meet.events.slice(0, 4).map((e) => (
                          <div key={e.id} className="flex items-center gap-1.5 rounded-lg bg-muted/50 px-2.5 py-1.5">
                            <span className="text-xs font-medium">{e.event}</span>
                            <span className="font-mono text-xs font-semibold">{e.time}</span>
                            {e.placement <= 3 && (
                              <span className={`rounded px-1 py-0.5 text-[10px] font-bold ${placementColors[e.placement]}`}>
                                #{e.placement}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </AnimatedCard>
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <MeetDetailDialog
        meet={selected}
        onClose={() => setSelected(null)}
        onDelete={(id) => { deleteMeet(id); setSelected(null); }}
      />
    </div>
  );
}

function AddMeetDialog({ onAdd }: { onAdd: (m: Omit<Meet, 'id'>) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [course, setCourse] = useState<Course>('SCY');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!name || !date) return;
    onAdd({ name, location, date, course, events: [], notes: notes || undefined });
    setOpen(false);
    setName(''); setLocation(''); setDate(''); setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4 mr-2" />Add Meet</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Add a Meet</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div><Label>Meet Name</Label><Input className="mt-1" value={name} onChange={(e) => setName(e.target.value)} placeholder="Winter Invitational" /></div>
          <div><Label>Location</Label><Input className="mt-1" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Crown Point, IN" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Date</Label><Input className="mt-1" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
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
          <div><Label>Notes</Label><Textarea className="mt-1" value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
          <Button onClick={handleSubmit} className="w-full">Save Meet</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MeetDetailDialog({
  meet, onClose, onDelete,
}: {
  meet: Meet | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}) {
  if (!meet) return null;
  return (
    <Dialog open={!!meet} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{meet.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />{meet.location}
            <span>·</span>
            <Clock className="h-4 w-4" />{formatDate(meet.date)}
            <span>·</span>
            <Badge variant="outline">{meet.course}</Badge>
          </div>

          {meet.notes && (
            <p className="text-sm text-muted-foreground italic border-l-2 border-accent/40 pl-3">{meet.notes}</p>
          )}

          {meet.videoUrl && (
            <a href={meet.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
              <Video className="h-4 w-4" />Watch race video
            </a>
          )}

          <div className="space-y-3">
            <p className="font-semibold text-sm">Events</p>
            {meet.events.length === 0 ? (
              <p className="text-sm text-muted-foreground">No events logged yet.</p>
            ) : (
              meet.events.map((e) => <EventDetail key={e.id} event={e} />)
            )}
          </div>

          <Button variant="destructive" className="w-full" onClick={() => onDelete(meet.id)}>
            <Trash2 className="h-4 w-4 mr-2" />Delete Meet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EventDetail({ event }: { event: MeetEvent }) {
  return (
    <div className="rounded-xl bg-muted/40 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-medium">{event.event}</span>
          <Badge variant="outline" className="text-xs">{event.course}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold">{event.time}</span>
          {event.placement <= 3 && (
            <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${placementColors[event.placement]}`}>
              #{event.placement}
            </span>
          )}
        </div>
      </div>
      {event.splits.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {event.splits.map((split, i) => (
            <span key={i} className="rounded-md bg-background px-2 py-1 font-mono text-xs">
              {split}
            </span>
          ))}
        </div>
      )}
      {event.reactionTime !== undefined && (
        <p className="text-xs text-muted-foreground mt-2">Reaction: {event.reactionTime}s</p>
      )}
    </div>
  );
}
