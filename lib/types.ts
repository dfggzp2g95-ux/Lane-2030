export type Course = 'SCY' | 'SCM' | 'LCM';

export type PracticeFocus = 'Sprint' | 'Distance' | 'Technique' | 'Recovery';

export type InterestLevel = 'Dream' | 'High' | 'Medium' | 'Low';

export type ApplicationStatus =
  | 'Researching'
  | 'In Contact'
  | 'Questionnaire'
  | 'Visit Scheduled'
  | 'Offer Received'
  | 'Committed'
  | 'Not Interested';

export type MilestoneStatus = 'Completed' | 'In Progress' | 'Upcoming';

export interface TimeEntry {
  id: string;
  event: string;
  course: Course;
  time: string;
  meet: string;
  date: string;
  isPersonalBest: boolean;
  isSeasonBest: boolean;
  notes?: string;
}

export interface Practice {
  id: string;
  date: string;
  coach: string;
  pool: string;
  yardage: number;
  duration: number;
  focus: PracticeFocus;
  energy: number;
  sleepHours: number;
  waterIntake: number;
  notes?: string;
}

export interface MeetEvent {
  id: string;
  event: string;
  course: Course;
  time: string;
  placement: number;
  splits: string[];
  reactionTime?: number;
}

export interface Meet {
  id: string;
  name: string;
  location: string;
  date: string;
  course: Course;
  events: MeetEvent[];
  notes?: string;
  videoUrl?: string;
}

export interface Goal {
  id: string;
  title: string;
  event: string;
  course: Course;
  currentTime: string;
  goalTime: string;
  deadline: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  status: MilestoneStatus;
  category:
    | 'High School Season'
    | 'Championship Meet'
    | 'Time Standard'
    | 'College Visit'
    | 'Recruiting Deadline'
    | 'Commitment'
    | 'Graduation';
}

export interface College {
  id: string;
  schoolName: string;
  division: string;
  conference: string;
  coachName: string;
  coachEmail: string;
  interestLevel: InterestLevel;
  applicationStatus: ApplicationStatus;
  visitDate?: string;
  notes?: string;
  isFavorite: boolean;
}

export interface AthleteProfile {
  name: string;
  graduationYear: number;
  school: string;
  club: string;
  coach: string;
  favoriteEvents: string[];
  collegeGoal: string;
}

export interface AppData {
  profile: AthleteProfile;
  times: TimeEntry[];
  practices: Practice[];
  meets: Meet[];
  goals: Goal[];
  milestones: Milestone[];
  colleges: College[];
}
