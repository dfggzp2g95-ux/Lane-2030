import {
  LayoutDashboard,
  Timer,
  Waves,
  Trophy,
  Target,
  Map,
  GraduationCap,
  Settings,
  BarChart3,
  MoreHorizontal,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  description: string;
}

export const SIDEBAR_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard, description: 'Overview & quick actions' },
  { label: 'Times', href: '/times', icon: Timer, description: 'Track every event' },
  { label: 'Practices', href: '/practices', icon: Waves, description: 'Log training sessions' },
  { label: 'Meets', href: '/meets', icon: Trophy, description: 'Race results & splits' },
  { label: 'Goals', href: '/goals', icon: Target, description: 'Targets & progress' },
  { label: 'Roadmap', href: '/roadmap', icon: Map, description: 'Path to 2030' },
  { label: 'Recruiting', href: '/recruiting', icon: GraduationCap, description: 'College tracking' },
  { label: 'Statistics', href: '/statistics', icon: BarChart3, description: 'Charts & insights' },
  { label: 'Settings', href: '/settings', icon: Settings, description: 'Theme & data' },
];

export const MOBILE_PRIMARY_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard, description: '' },
  { label: 'Times', href: '/times', icon: Timer, description: '' },
  { label: 'Meets', href: '/meets', icon: Trophy, description: '' },
  { label: 'Goals', href: '/goals', icon: Target, description: '' },
];

export const MOBILE_MORE_ITEMS: NavItem[] = [
  { label: 'Practices', href: '/practices', icon: Waves, description: '' },
  { label: 'Roadmap', href: '/roadmap', icon: Map, description: '' },
  { label: 'Recruiting', href: '/recruiting', icon: GraduationCap, description: '' },
  { label: 'Statistics', href: '/statistics', icon: BarChart3, description: '' },
  { label: 'Settings', href: '/settings', icon: Settings, description: '' },
];

export { MoreHorizontal };
