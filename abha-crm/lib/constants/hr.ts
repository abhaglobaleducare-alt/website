export const leaveTypes = ['casual', 'sick', 'earned', 'unpaid', 'emergency'] as const;
export const leaveStatuses = ['pending', 'approved', 'rejected', 'cancelled'] as const;

export type LeaveType = (typeof leaveTypes)[number];
export type LeaveStatus = (typeof leaveStatuses)[number];

// Annual entitlement (days) per leave type. null = uncapped (unpaid).
export const leaveEntitlements: Record<LeaveType, number | null> = {
  casual: 12,
  sick: 12,
  earned: 15,
  emergency: 5,
  unpaid: null,
};

export const leaveStatusClasses: Record<LeaveStatus, string> = {
  pending: 'bg-amber-500/15 text-amber-200',
  approved: 'bg-emerald-500/15 text-emerald-200',
  rejected: 'bg-red-500/15 text-red-200',
  cancelled: 'bg-slate-500/15 text-slate-300',
};

export const bonusStatuses = [
  'pending_approval',
  'approved',
  'disbursed',
  'hold',
  'cancelled',
] as const;

export type BonusStatus = (typeof bonusStatuses)[number];

export const bonusStatusClasses: Record<BonusStatus, string> = {
  pending_approval: 'bg-amber-500/15 text-amber-200',
  approved: 'bg-blue-500/15 text-blue-200',
  disbursed: 'bg-emerald-500/15 text-emerald-200',
  hold: 'bg-slate-500/15 text-slate-300',
  cancelled: 'bg-red-500/15 text-red-200',
};

// Reference distribution bonus paid to the director per referred admission.
export const REFERENCE_DISTRIBUTION_BONUS = 100000;

export function titleCase(value: string): string {
  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function inr(value: number): string {
  return `₹${Math.round(Number(value) || 0).toLocaleString('en-IN')}`;
}
