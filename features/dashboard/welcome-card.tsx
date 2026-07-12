'use client';

import { motion } from 'framer-motion';
import { Waves, Calendar } from 'lucide-react';
import { useData } from '@/components/data-provider';
import { daysUntil, formatDate } from '@/lib/swim-utils';
import { MOTIVATIONAL_QUOTES } from '@/lib/constants';

export function WelcomeCard() {
  const { data } = useData();
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const nextMeet = data.meets
    .filter((m) => new Date(m.date + 'T00:00:00') >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const countdown = nextMeet ? daysUntil(nextMeet.date) : null;
  const quote = MOTIVATIONAL_QUOTES[new Date().getDate() % MOTIVATIONAL_QUOTES.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-3xl gradient-primary p-6 sm:p-8 text-white"
    >
      <div className="absolute -right-8 -top-8 opacity-10">
        <Waves className="h-40 w-40" />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 text-white/80 text-sm">
          <Calendar className="h-4 w-4" />
          {today}
        </div>
        <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
          Welcome back, {data.profile.name}
        </h2>
        <p className="mt-2 text-white/80 max-w-md">
          {quote}
        </p>
        {countdown !== null && nextMeet && (
          <div className="mt-5 inline-flex items-center gap-3 rounded-2xl bg-white/15 backdrop-blur-sm px-4 py-3">
            <div className="text-center">
              <p className="text-2xl font-bold leading-none">{countdown}</p>
              <p className="text-xs text-white/70 mt-1">days</p>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div>
              <p className="text-sm font-medium">{nextMeet.name}</p>
              <p className="text-xs text-white/70">
                {formatDate(nextMeet.date)} · {nextMeet.location}
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
