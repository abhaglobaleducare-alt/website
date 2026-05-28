export const goalTypes = ['yearly', 'quarterly', 'monthly', 'weekly', 'daily'] as const;

export const goalPriorities = ['critical', 'high', 'medium', 'low'] as const;

export const goalStatuses = [
  'pending',
  'in_progress',
  'completed',
  'overdue',
  'cancelled',
] as const;

export type GoalPriority = (typeof goalPriorities)[number];
export type GoalStatus = (typeof goalStatuses)[number];
export type GoalType = (typeof goalTypes)[number];

// Critical=red, High=orange, Medium=blue, Low=gray
export const priorityClasses: Record<GoalPriority, string> = {
  critical: 'bg-red-500/15 text-red-200 border border-red-500/40',
  high: 'bg-orange-500/15 text-orange-200 border border-orange-500/40',
  medium: 'bg-blue-500/15 text-blue-200 border border-blue-500/40',
  low: 'bg-slate-500/15 text-slate-300 border border-slate-500/40',
};

// Left accent bar color used on goal cards.
export const priorityAccent: Record<GoalPriority, string> = {
  critical: 'border-l-red-500',
  high: 'border-l-orange-500',
  medium: 'border-l-blue-500',
  low: 'border-l-slate-500',
};

export const priorityScore: Record<GoalPriority, number> = {
  critical: 90,
  high: 70,
  medium: 50,
  low: 30,
};

export const statusClasses: Record<GoalStatus, string> = {
  pending: 'bg-slate-700/40 text-slate-200',
  in_progress: 'bg-amber-500/15 text-amber-200',
  completed: 'bg-emerald-500/15 text-emerald-200',
  overdue: 'bg-red-500/15 text-red-200',
  cancelled: 'bg-slate-600/30 text-slate-400',
};

export const goalTabs = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'quarter', label: 'This Quarter' },
  { key: 'year', label: 'This Year' },
  { key: 'all', label: 'All' },
] as const;

export type GoalTab = (typeof goalTabs)[number]['key'];

export function titleCase(value: string): string {
  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
