'use client';

import { motion } from 'framer-motion';
import {
  User,
  GraduationCap,
  School,
  Waves,
  Users,
  Trophy,
  Target,
} from 'lucide-react';
import { useData } from '@/components/data-provider';
import { AnimatedCard } from '@/components/shared/animated-card';
import { Badge } from '@/components/ui/badge';

export function AthleteProfile() {
  const { data } = useData();
  const { profile } = data;

  const infoItems = [
    { icon: User, label: 'Name', value: profile.name },
    { icon: GraduationCap, label: 'Class', value: `Class of ${profile.graduationYear}` },
    { icon: Waves, label: 'Club', value: profile.club },
    { icon: School, label: 'School', value: profile.school },
    { icon: Users, label: 'Coach', value: profile.coach },
    { icon: Trophy, label: 'Goal', value: profile.collegeGoal },
  ];

  return (
    <AnimatedCard className="p-5" delay={0.05}>
      <div className="flex items-center gap-2 mb-4">
        <User className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Athlete Profile</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {infoItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.04 }}
              className="flex items-center gap-2.5 rounded-xl bg-muted/50 p-3"
            >
              <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="truncate text-sm font-semibold">{item.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-1.5 mb-2">
          <Target className="h-4 w-4 text-accent" />
          <p className="text-xs font-medium text-muted-foreground">
            Favorite Events
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.favoriteEvents.map((event, i) => (
            <motion.div
              key={event}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.03 }}
            >
              <Badge
                variant="outline"
                className="bg-primary/5 text-primary border-primary/20 px-3 py-1"
              >
                {event}
              </Badge>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedCard>
  );
}
