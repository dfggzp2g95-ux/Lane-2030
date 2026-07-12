'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, ArrowUpDown, X, TrendingDown } from 'lucide-react';
import { useData } from '@/components/data-provider';
import { PageHeader } from '@/components/shared/page-header';
import { AnimatedCard } from '@/components/shared/animated-card';
import { EmptyState } from '@/components/shared/empty-state';
import { PersonalBestBadge, SeasonBestBadge } from '@/components/shared/badges';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SWIM_EVENTS, COURSES } from '@/lib/constants';
import { formatDate, parseTimeToSeconds } from '@/lib/swim-utils';
import type { Course, TimeEntry } from '@/lib/types';
import { Timer } from 'lucide-react';
import { motion as framerMotion } from 'framer-motion';

type SortKey = 'date-desc' | 'date-asc' | 'time-asc' | 'time-desc';

export default function TimesPage() {
  const { data, addTime, deleteTime } = useData();
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [eventFilter, setEventFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortKey>('date-desc');
  const [selectedEvent, setSelectedEvent] = useState<TimeEntry | null>(null);

  const filtered = data.times
    .filter((t) => {
      if (courseFilter !== 'all' && t.course !== courseFilter) return false;
      if (eventFilter !== 'all' && t.event !== eventFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          t.event.toLowerCase().includes(q) ||
          t.meet.toLowerCase().includes(q) ||
          t.notes?.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'time-asc':
          return parseTimeToSeconds(a.time) - parseTimeToSeconds(b.time);
        case 'time-desc':
          return parseTimeToSeconds(b.time) - parseTimeToSeconds(a.time);
      }
    });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Times"
        subtitle="Track every event across SCY, SCM, and LCM"
        action={<AddTimeDialog onAdd={addTime} />}
      />

      <AnimatedCard className="p-4" hover={false}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events, meets, notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="sm:w-32">
              <SelectValue placeholder="Course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {COURSES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={eventFilter} onValueChange={setEventFilter}>
            <SelectTrigger className="sm:w-40">
              <SelectValue placeholder="Event" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              {SWIM_EVENTS.map((e) => (
                <SelectItem key={e} value={e}>{e}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortKey)}>
            <SelectTrigger className="sm:w-36">
              <ArrowUpDown className="h-4 w-4 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Newest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
              <SelectItem value="time-asc">Fastest First</SelectItem>
              <SelectItem value="time-desc">Slowest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </AnimatedCard>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Timer}
          title="No times found"
          description="Try adjusting your filters or log a new time."
        />
      ) : (
        <div className="grid gap-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((t, i) => (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.02 }}
              >
                <button
                  onClick={() => setSelectedEvent(t)}
                  className="w-full text-left"
                >
                  <AnimatedCard className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10">
                          <span className="text-xs font-bold text-primary">{t.course}</span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold truncate">{t.event}</p>
                            {t.isPersonalBest && <PersonalBestBadge />}
                            {t.isSeasonBest && !t.isPersonalBest && <SeasonBestBadge />}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {t.meet} · {formatDate(t.date)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-mono text-lg font-bold">{t.time}</p>
                      </div>
                    </div>
                  </AnimatedCard>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <TimeDetailDialog
        time={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onDelete={(id) => {
          deleteTime(id);
          setSelectedEvent(null);
        }}
      />
    </div>
  );
}

function AddTimeDialog({ onAdd }: { onAdd: (t: Omit<TimeEntry, 'id'>) => void }) {
  const [open, setOpen] = useState(false);
  const [event, setEvent] = useState('');
  const [course, setCourse] = useState<Course>('SCY');
  const [time, setTime] = useState('');
  const [meet, setMeet] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!event || !time || !meet || !date) return;
    onAdd({
      event,
      course,
      time,
      meet,
      date,
      isPersonalBest: false,
      isSeasonBest: false,
      notes: notes || undefined,
    });
    setOpen(false);
    setEvent(''); setCourse('SCY'); setTime(''); setMeet(''); setDate(''); setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Log Time
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log a New Time</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Event</Label>
            <Select value={event} onValueChange={setEvent}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select event" /></SelectTrigger>
              <SelectContent>
                {SWIM_EVENTS.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Course</Label>
              <Select value={course} onValueChange={(v) => setCourse(v as Course)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {COURSES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Time</Label>
              <Input className="mt-1" placeholder="21.84" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Meet</Label>
            <Input className="mt-1" placeholder="Winter Invitational" value={meet} onChange={(e) => setMeet(e.target.value)} />
          </div>
          <div>
            <Label>Date</Label>
            <Input className="mt-1" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea className="mt-1" placeholder="Optional notes..." value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <Button onClick={handleSubmit} className="w-full">Save Time</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function TimeDetailDialog({
  time,
  onClose,
  onDelete,
}: {
  time: TimeEntry | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}) {
  if (!time) return null;

  const history = useTimeHistory(time.event, time.course);

  return (
    <Dialog open={!!time} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {time.event}
            <span className="text-sm font-normal text-muted-foreground">{time.course}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-2xl bg-muted/50 p-4">
            <div>
              <p className="text-xs text-muted-foreground">Time</p>
              <p className="font-mono text-2xl font-bold">{time.time}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Meet</p>
              <p className="text-sm font-medium">{time.meet}</p>
              <p className="text-xs text-muted-foreground">{formatDate(time.date)}</p>
            </div>
          </div>

          {time.notes && (
            <p className="text-sm text-muted-foreground italic border-l-2 border-accent/40 pl-3">
              {time.notes}
            </p>
          )}

          {history.length > 1 && (
            <div>
              <p className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                <TrendingDown className="h-4 w-4 text-accent" />
                Improvement History
              </p>
              <div className="space-y-1.5">
                {history.map((h, i) => (
                  <div
                    key={h.id}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                      h.id === time.id ? 'bg-primary/10' : 'bg-muted/40'
                    }`}
                  >
                    <span className="text-muted-foreground">{formatDate(h.date)}</span>
                    <span className="font-mono font-medium">{h.time}</span>
                    {i > 0 && (
                      <span className={`text-xs ${parseTimeToSeconds(h.time) < parseTimeToSeconds(history[i - 1].time) ? 'text-green-500' : 'text-red-500'}`}>
                        {parseTimeToSeconds(h.time) < parseTimeToSeconds(history[i - 1].time) ? '↓' : '↑'}
                        {Math.abs(parseTimeToSeconds(h.time) - parseTimeToSeconds(history[i - 1].time)).toFixed(2)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            variant="destructive"
            className="w-full"
            onClick={() => onDelete(time.id)}
          >
            Delete Time
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function useTimeHistory(event: string, course: Course) {
  const { data } = useData();
  return data.times
    .filter((t) => t.event === event && t.course === course)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
