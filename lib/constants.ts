import type { Course, PracticeFocus } from './types';

export const SWIM_EVENTS = [
  '50 Free',
  '100 Free',
  '200 Free',
  '500 Free',
  '1000 Free',
  '1650 Free',
  '100 Back',
  '200 Back',
  '100 Breast',
  '200 Breast',
  '100 Fly',
  '200 Fly',
  '200 IM',
  '400 IM',
  '200 Free Relay',
  '400 Free Relay',
  '200 Medley Relay',
  '400 Medley Relay',
] as const;

export const COURSES: Course[] = ['SCY', 'SCM', 'LCM'];

export const PRACTICE_FOCUSES: PracticeFocus[] = [
  'Sprint',
  'Distance',
  'Technique',
  'Recovery',
];

export const INTEREST_LEVELS = ['Dream', 'High', 'Medium', 'Low'] as const;

export const APPLICATION_STATUSES = [
  'Researching',
  'In Contact',
  'Questionnaire',
  'Visit Scheduled',
  'Offer Received',
  'Committed',
  'Not Interested',
] as const;

export const MILESTONE_CATEGORIES = [
  'High School Season',
  'Championship Meet',
  'Time Standard',
  'College Visit',
  'Recruiting Deadline',
  'Commitment',
  'Graduation',
] as const;

export const MOTIVATIONAL_QUOTES = [
  'The water is your friend. You don’t have to fight the water, just flow through it.',
  'Champions are made in the lanes nobody is watching.',
  'Every practice is a deposit. Every race is a withdrawal.',
  'The pain of discipline weighs ounces. The pain of regret weighs tons.',
  'You don’t rise to the level of your goals. You fall to the level of your training.',
  'The pool doesn’t care how you feel. It only cares how hard you work.',
  'Smooth waters do not make skillful swimmers.',
  'Your only competition is who you were yesterday.',
  'The race is long. In the end, it’s only with yourself.',
  'Talent gets you to the blocks. Work gets you to the wall.',
];

export const APP_VERSION = '1.0.0';
export const BUILD_DATE = '2026-07-12';
export const LAST_UPDATED = '2026-07-12';
