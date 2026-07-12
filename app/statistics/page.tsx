'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend,
} from 'recharts';
import { BarChart3, Waves, TrendingDown, Award } from 'lucide-react';
import { useData } from '@/components/data-provider';
import { PageHeader } from '@/components/shared/page-header';
import { AnimatedCard } from '@/components/shared/animated-card';
import { StatCard } from '@/components/shared/stat-card';
import { parseTimeToSeconds, getPersonalBests } from '@/lib/swim-utils';

export default function StatisticsPage() {
  const { data } = useData();

  const weeklyYardage = useMemo(() => {
    const weeks: Record<string, number> = {};
    data.practices.forEach((p) => {
      const date = new Date(p.date + 'T00:00:00');
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay());
      const key = startOfWeek.toISOString().split('T')[0];
      weeks[key] = (weeks[key] || 0) + p.yardage;
    });
    return Object.entries(weeks)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-8)
      .map(([date, yardage]) => ({
        date: new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        yardage,
      }));
  }, [data.practices]);

  const monthlyYardage = useMemo(() => {
    const months: Record<string, number> = {};
    data.practices.forEach((p) => {
      const date = new Date(p.date + 'T00:00:00');
      const key = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      months[key] = (months[key] || 0) + p.yardage;
    });
    return Object.entries(months).map(([month, yardage]) => ({ month, yardage }));
  }, [data.practices]);

  const practiceCount = useMemo(() => {
    const months: Record<string, number> = {};
    data.practices.forEach((p) => {
      const date = new Date(p.date + 'T00:00:00');
      const key = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      months[key] = (months[key] || 0) + 1;
    });
    return Object.entries(months).map(([month, count]) => ({ month, count }));
  }, [data.practices]);

  const pbProgression = useMemo(() => {
    const bests = getPersonalBests(data.times);
    return bests.map((t) => ({
      event: t.event,
      time: parseTimeToSeconds(t.time),
      display: t.time,
    })).sort((a, b) => a.time - b.time);
  }, [data.times]);

  const improvementByEvent = useMemo(() => {
    const events: Record<string, { first: number; best: number; event: string }> = {};
    data.times.forEach((t) => {
      const key = `${t.event} (${t.course})`;
      const seconds = parseTimeToSeconds(t.time);
      if (!events[key]) {
        events[key] = { first: seconds, best: seconds, event: key };
      } else {
        events[key].best = Math.min(events[key].best, seconds);
      }
    });
    return Object.values(events)
      .map((e) => ({
        event: e.event,
        improvement: +(e.first - e.best).toFixed(2),
      }))
      .filter((e) => e.improvement > 0)
      .sort((a, b) => b.improvement - a.improvement);
  }, [data.times]);

  const totalYardage = data.practices.reduce((sum, p) => sum + p.yardage, 0);
  const totalBests = getPersonalBests(data.times).length;
  const avgImprovement = improvementByEvent.length > 0
    ? (improvementByEvent.reduce((s, e) => s + e.improvement, 0) / improvementByEvent.length).toFixed(2)
    : '0.00';

  return (
    <div className="space-y-6">
      <PageHeader title="Statistics" subtitle="Charts and insights across your training" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Yardage" value={`${(totalYardage / 1000).toFixed(0)}k`} icon={Waves} accent="primary" />
        <StatCard label="Practices" value={data.practices.length} icon={BarChart3} accent="accent" />
        <StatCard label="Personal Bests" value={totalBests} icon={Award} accent="chart-4" />
        <StatCard label="Avg Improvement" value={`${avgImprovement}s`} icon={TrendingDown} accent="chart-3" />
      </div>

      <AnimatedCard className="p-5" hover={false}>
        <h3 className="font-semibold mb-4">Weekly Yardage (Last 8 Weeks)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={weeklyYardage}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
              }}
              formatter={(v: number) => [`${v.toLocaleString()} yd`, 'Yardage']}
            />
            <Bar dataKey="yardage" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </AnimatedCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatedCard className="p-5" hover={false}>
          <h3 className="font-semibold mb-4">Monthly Yardage</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyYardage}>
              <defs>
                <linearGradient id="yardageGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }}
                formatter={(v: number) => [`${v.toLocaleString()} yd`, 'Yardage']}
              />
              <Area type="monotone" dataKey="yardage" stroke="hsl(var(--accent))" fill="url(#yardageGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </AnimatedCard>

        <AnimatedCard className="p-5" hover={false}>
          <h3 className="font-semibold mb-4">Practices per Month</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={practiceCount}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }}
                formatter={(v: number) => [v, 'Practices']}
              />
              <Bar dataKey="count" fill="hsl(var(--chart-3))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </AnimatedCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatedCard className="p-5" hover={false}>
          <h3 className="font-semibold mb-4">Personal Best Times</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pbProgression} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${v}s`} />
              <YAxis type="category" dataKey="event" stroke="hsl(var(--muted-foreground))" fontSize={11} width={90} />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }}
                formatter={(v: number) => [`${v.toFixed(2)}s`, 'Time']}
              />
              <Bar dataKey="time" fill="hsl(var(--chart-4))" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </AnimatedCard>

        <AnimatedCard className="p-5" hover={false}>
          <h3 className="font-semibold mb-4">Improvement by Event</h3>
          {improvementByEvent.length === 0 ? (
            <p className="text-sm text-muted-foreground py-12 text-center">No improvement data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={improvementByEvent} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${v}s`} />
                <YAxis type="category" dataKey="event" stroke="hsl(var(--muted-foreground))" fontSize={11} width={100} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }}
                  formatter={(v: number) => [`${v.toFixed(2)}s`, 'Improved']}
                />
                <Bar dataKey="improvement" fill="hsl(var(--chart-2))" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </AnimatedCard>
      </div>
    </div>
  );
}
