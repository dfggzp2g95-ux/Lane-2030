'use client';

import { useData } from '@/components/data-provider';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { AnimatedCard } from '@/components/shared/animated-card';
import { WelcomeCard } from '@/features/dashboard/welcome-card';
import { AthleteProfile } from '@/features/dashboard/athlete-profile';
import { QuickActions } from '@/features/dashboard/quick-actions';
import { TodaySummary } from '@/features/dashboard/today-summary';
import { LatestBests } from '@/features/dashboard/latest-bests';
import { CurrentGoals } from '@/features/dashboard/current-goals';
import { RecentMeets } from '@/features/dashboard/recent-meets';
import { getWeekYardage, getPracticesThisWeek, getPersonalBests } from '@/lib/swim-utils';
import { Waves, Calendar, Timer, Award } from 'lucide-react';

export default function DashboardPage() {
  const { data } = useData();

  const weekYardage = getWeekYardage(data.practices);
  const practicesThisWeek = getPracticesThisWeek(data.practices);
  const totalBests = getPersonalBests(data.times).length;
  const totalTimes = data.times.length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Your competitive swimming journey to 2030"
      />

      <WelcomeCard />

      <AthleteProfile />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Weekly Yardage"
          value={`${(weekYardage / 1000).toFixed(1)}k`}
          icon={Waves}
          accent="primary"
          trend={`${practicesThisWeek} practices this week`}
          delay={0}
        />
        <StatCard
          label="Practices"
          value={practicesThisWeek}
          icon={Calendar}
          accent="accent"
          trend="this week"
          delay={0.05}
        />
        <StatCard
          label="Total Times"
          value={totalTimes}
          icon={Timer}
          accent="chart-3"
          trend={`${totalBests} personal bests`}
          delay={0.1}
        />
        <StatCard
          label="Personal Bests"
          value={totalBests}
          icon={Award}
          accent="chart-4"
          trend="across all events"
          delay={0.15}
        />
      </div>

      <QuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatedCard className="p-5">
          <TodaySummary />
        </AnimatedCard>
        <LatestBests />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CurrentGoals />
        <RecentMeets />
      </div>
    </div>
  );
}
