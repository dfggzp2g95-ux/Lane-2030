'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, GraduationCap, Star, Mail, Trash2, MapPin, Calendar } from 'lucide-react';
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
import { INTEREST_LEVELS, APPLICATION_STATUSES } from '@/lib/constants';
import { formatDate } from '@/lib/swim-utils';
import type { College, InterestLevel, ApplicationStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

const interestColors: Record<InterestLevel, string> = {
  Dream: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  High: 'bg-green-500/15 text-green-500',
  Medium: 'bg-blue-500/15 text-blue-500',
  Low: 'bg-muted text-muted-foreground',
};

const statusColors: Record<ApplicationStatus, string> = {
  Researching: 'bg-muted text-muted-foreground',
  'In Contact': 'bg-blue-500/15 text-blue-500',
  Questionnaire: 'bg-purple-500/15 text-purple-500',
  'Visit Scheduled': 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  'Offer Received': 'bg-green-500/15 text-green-500',
  Committed: 'bg-primary/15 text-primary',
  'Not Interested': 'bg-red-500/15 text-red-500',
};

export default function RecruitingPage() {
  const { data, addCollege, updateCollege, deleteCollege, toggleFavorite } = useData();
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const filtered = showFavoritesOnly
    ? data.colleges.filter((c) => c.isFavorite)
    : data.colleges;

  const sorted = [...filtered].sort((a, b) => {
    if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
    return a.schoolName.localeCompare(b.schoolName);
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recruiting"
        subtitle={`${data.colleges.length} colleges tracked · ${data.colleges.filter(c => c.isFavorite).length} favorites`}
        action={
          <div className="flex gap-2">
            <Button
              variant={showFavoritesOnly ? 'default' : 'outline'}
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            >
              <Star className={cn('h-4 w-4 mr-2', showFavoritesOnly && 'fill-current')} />
              Favorites
            </Button>
            <AddCollegeDialog onAdd={addCollege} />
          </div>
        }
      />

      {sorted.length === 0 ? (
        <EmptyState icon={GraduationCap} title="No colleges tracked" description="Add a college to start tracking recruiting." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {sorted.map((college, i) => (
              <motion.div
                key={college.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
              >
                <CollegeCard
                  college={college}
                  onToggleFavorite={() => toggleFavorite(college.id)}
                  onUpdate={(updates) => updateCollege(college.id, updates)}
                  onDelete={() => deleteCollege(college.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function CollegeCard({
  college, onToggleFavorite, onUpdate, onDelete,
}: {
  college: College;
  onToggleFavorite: () => void;
  onUpdate: (updates: Partial<College>) => void;
  onDelete: () => void;
}) {
  return (
    <AnimatedCard className={cn('p-5', college.isFavorite && 'border-amber-500/40')}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-lg">{college.schoolName}</h3>
          <p className="text-sm text-muted-foreground">
            {college.division} · {college.conference}
          </p>
        </div>
        <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={onToggleFavorite}>
          <Star className={cn('h-5 w-5', college.isFavorite ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground')} />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className={cn('rounded-full px-2.5 py-1 text-xs font-medium', interestColors[college.interestLevel])}>
          {college.interestLevel} Interest
        </span>
        <span className={cn('rounded-full px-2.5 py-1 text-xs font-medium', statusColors[college.applicationStatus])}>
          {college.applicationStatus}
        </span>
      </div>

      <div className="space-y-1.5 text-sm">
        <p className="text-muted-foreground">{college.coachName}</p>
        {college.coachEmail && (
          <a href={`mailto:${college.coachEmail}`} className="flex items-center gap-1.5 text-primary hover:underline">
            <Mail className="h-3.5 w-3.5" />{college.coachEmail}
          </a>
        )}
        {college.visitDate && (
          <p className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />Visit: {formatDate(college.visitDate)}
          </p>
        )}
      </div>

      {college.notes && (
        <p className="text-sm text-muted-foreground italic mt-3 border-l-2 border-accent/40 pl-3">
          {college.notes}
        </p>
      )}

      <div className="flex items-center gap-2 mt-4">
        <Select
          value={college.applicationStatus}
          onValueChange={(v) => onUpdate({ applicationStatus: v as ApplicationStatus })}
        >
          <SelectTrigger className="h-8 text-xs flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {APPLICATION_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onDelete}>
          <Trash2 className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
    </AnimatedCard>
  );
}

function AddCollegeDialog({ onAdd }: { onAdd: (c: Omit<College, 'id'>) => void }) {
  const [open, setOpen] = useState(false);
  const [schoolName, setSchoolName] = useState('');
  const [division, setDivision] = useState('NCAA D1');
  const [conference, setConference] = useState('');
  const [coachName, setCoachName] = useState('');
  const [coachEmail, setCoachEmail] = useState('');
  const [interestLevel, setInterestLevel] = useState<InterestLevel>('Medium');
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus>('Researching');
  const [visitDate, setVisitDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!schoolName) return;
    onAdd({
      schoolName, division, conference, coachName, coachEmail,
      interestLevel, applicationStatus,
      visitDate: visitDate || undefined,
      notes: notes || undefined,
      isFavorite: false,
    });
    setOpen(false);
    setSchoolName(''); setConference(''); setCoachName(''); setCoachEmail(''); setNotes(''); setVisitDate('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4 mr-2" />Add College</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Add a College</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div><Label>School Name</Label><Input className="mt-1" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} placeholder="University of Michigan" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Division</Label><Input className="mt-1" value={division} onChange={(e) => setDivision(e.target.value)} /></div>
            <div><Label>Conference</Label><Input className="mt-1" value={conference} onChange={(e) => setConference(e.target.value)} placeholder="Big Ten" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Coach Name</Label><Input className="mt-1" value={coachName} onChange={(e) => setCoachName(e.target.value)} placeholder="Coach Richardson" /></div>
            <div><Label>Coach Email</Label><Input className="mt-1" value={coachEmail} onChange={(e) => setCoachEmail(e.target.value)} placeholder="swim@umich.edu" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Interest Level</Label>
              <Select value={interestLevel} onValueChange={(v) => setInterestLevel(v as InterestLevel)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {INTEREST_LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={applicationStatus} onValueChange={(v) => setApplicationStatus(v as ApplicationStatus)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {APPLICATION_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div><Label>Visit Date</Label><Input className="mt-1" type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} /></div>
          <div><Label>Notes</Label><Textarea className="mt-1" value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
          <Button onClick={handleSubmit} className="w-full">Save College</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
