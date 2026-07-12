'use client';

import { Badge } from '@/components/ui/badge';
import { Award, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PersonalBestBadge({ className }: { className?: string }) {
  return (
    <Badge
      className={cn(
        'gap-1 bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
        className
      )}
      variant="outline"
    >
      <Award className="h-3 w-3" />
      PB
    </Badge>
  );
}

export function SeasonBestBadge({ className }: { className?: string }) {
  return (
    <Badge
      className={cn(
        'gap-1 bg-accent/15 text-accent border-accent/30',
        className
      )}
      variant="outline"
    >
      <Flame className="h-3 w-3" />
      SB
    </Badge>
  );
}
