'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, Moon, Sun, Monitor, Download, Upload, Trash2, RotateCcw,
  Waves, Info,
} from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { useData } from '@/components/data-provider';
import { PageHeader } from '@/components/shared/page-header';
import { AnimatedCard } from '@/components/shared/animated-card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { exportData, importData } from '@/lib/storage';
import { APP_VERSION, BUILD_DATE, LAST_UPDATED } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { replaceData, resetData } = useData();
  const fileRef = useRef<HTMLInputElement>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lane2030-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = importData(ev.target?.result as string);
        replaceData(data);
        toast.success('Data imported successfully');
      } catch {
        toast.error('Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  const themeOptions = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Theme, data management, and about" />

      <AnimatedCard className="p-5" delay={0}>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Sun className="h-5 w-5 text-primary" />
          Appearance
        </h3>
        <Label className="text-sm text-muted-foreground mb-3 block">Theme</Label>
        <div className="grid grid-cols-3 gap-3">
          {themeOptions.map((opt) => {
            const Icon = opt.icon;
            const isActive = theme === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all',
                  isActive
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/30'
                )}
              >
                <Icon className={cn('h-6 w-6', isActive ? 'text-primary' : 'text-muted-foreground')} />
                <span className={cn('text-sm font-medium', isActive ? 'text-primary' : 'text-muted-foreground')}>
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Currently using {resolvedTheme} mode
        </p>
      </AnimatedCard>

      <AnimatedCard className="p-5" delay={0.05}>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Download className="h-5 w-5 text-primary" />
          Data Management
        </h3>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />Export Data
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4 mr-2" />Import Data
          </Button>
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />

          {!confirmReset ? (
            <Button variant="outline" className="w-full justify-start" onClick={() => setConfirmReset(true)}>
              <RotateCcw className="h-4 w-4 mr-2" />Reset to Sample Data
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="destructive" className="flex-1" onClick={() => { resetData(); setConfirmReset(false); toast.success('Data reset to sample'); }}>
                Confirm Reset
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setConfirmReset(false)}>
                Cancel
              </Button>
            </div>
          )}

          {!confirmClear ? (
            <Button variant="outline" className="w-full justify-start text-destructive" onClick={() => setConfirmClear(true)}>
              <Trash2 className="h-4 w-4 mr-2" />Clear All Data
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="destructive" className="flex-1" onClick={() => {
                replaceData({
                  profile: {
                    name: 'Tristan',
                    graduationYear: 2030,
                    school: 'Fulshear High School',
                    club: 'FRST',
                    coach: 'Coach Adam',
                    favoriteEvents: ['200 IM', '200 Free', '100 Free', '100 Back', '50 Free'],
                    collegeGoal: 'NCAA Division I',
                  },
                  times: [], practices: [], meets: [], goals: [], milestones: [], colleges: [],
                });
                setConfirmClear(false);
                toast.success('All data cleared');
              }}>
                Confirm Clear
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setConfirmClear(false)}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </AnimatedCard>

      <AnimatedCard className="p-5" delay={0.1}>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          About
        </h3>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
            <Waves className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="font-bold text-lg">Lane 2030</p>
            <p className="text-xs text-muted-foreground">Competitive Swimming Tracker</p>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Version</span>
            <span className="font-mono font-medium">{APP_VERSION}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Build Date</span>
            <span className="font-medium">{BUILD_DATE}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last Updated</span>
            <span className="font-medium">{LAST_UPDATED}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
          Built for athletes chasing their dreams. Every practice counts.
        </p>
      </AnimatedCard>
    </div>
  );
}
