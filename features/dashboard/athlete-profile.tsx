'use client';

import {
  GraduationCap,
  School,
  Waves,
  UserRound,
  Trophy,
} from 'lucide-react';

import { useData } from '@/components/data-provider';
import { AnimatedCard } from '@/components/shared/animated-card';
import { Badge } from '@/components/ui/badge';

export function AthleteProfile() {
  const { data } = useData();
  const profile = data.profile;

  return (
    <AnimatedCard className="overflow-hidden">
      <div className="border-b border-border bg-muted/40 p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <UserRound className="h-7 w-7" />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Athlete profile
            </p>

            <h2 className="text-xl font-bold">
              {profile.name}
            </h2>

            <p className="text-sm text-muted-foreground">
              Class of {profile.graduationYear}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <ProfileItem
            icon={Waves}
            label="Club Team"
            value={profile.club}
          />

          <ProfileItem
            icon={School}
            label="High School"
            value={profile.school}
          />

          <ProfileItem
            icon={UserRound}
            label="Coach"
            value={profile.coach}
          />

          <ProfileItem
            icon={GraduationCap}
            label="College Goal"
            value={profile.collegeGoal}
          />
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-primary" />
            <p className="text-sm font-medium">Primary events</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {profile.favoriteEvents.map((event) => (
              <Badge key={event} variant="secondary">
                {event}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
}

interface ProfileItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

function ProfileItem({
  icon: Icon,
  label,
  value,
}: ProfileItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-xl bg-primary/10 p-2 text-primary">
        <Icon className="h-4 w-4" />
      </div>

      <div>
        <p className="text-xs text-muted-foreground">
          {label}
        </p>

        <p className="text-sm font-semibold">
          {value}
        </p>
      </div>
    </div>
  );
}