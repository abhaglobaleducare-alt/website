export const roomTypes = ['single', 'double', 'triple', 'dormitory'] as const;
export const roomStatuses = ['available', 'occupied', 'maintenance', 'reserved'] as const;

export const roomStatusClasses: Record<string, string> = {
  available: 'bg-emerald-500/15 text-emerald-200',
  occupied: 'bg-blue-500/15 text-blue-200',
  maintenance: 'bg-orange-500/15 text-orange-200',
  reserved: 'bg-yellow-500/15 text-yellow-200',
};

export const complaintCategories = [
  'maintenance',
  'food',
  'facilities',
  'security',
  'medical',
  'other',
] as const;

export const complaintPriorities = ['urgent', 'high', 'medium', 'low'] as const;
export const complaintStatuses = ['open', 'in_progress', 'resolved', 'closed'] as const;

export const complaintPriorityClasses: Record<string, string> = {
  urgent: 'bg-red-500/15 text-red-200 border border-red-500/40',
  high: 'bg-orange-500/15 text-orange-200 border border-orange-500/40',
  medium: 'bg-yellow-500/15 text-yellow-200 border border-yellow-500/40',
  low: 'bg-slate-500/15 text-slate-300 border border-slate-500/40',
};

export const complaintStatusClasses: Record<string, string> = {
  open: 'bg-red-500/15 text-red-200',
  in_progress: 'bg-amber-500/15 text-amber-200',
  resolved: 'bg-emerald-500/15 text-emerald-200',
  closed: 'bg-slate-500/15 text-slate-300',
};

export const feeStatuses = ['pending', 'partial', 'paid', 'overdue', 'waived'] as const;

export const feeStatusClasses: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-200',
  partial: 'bg-blue-500/15 text-blue-200',
  paid: 'bg-emerald-500/15 text-emerald-200',
  overdue: 'bg-red-500/15 text-red-200',
  waived: 'bg-slate-500/15 text-slate-300',
};

export const agestStatuses = ['scheduled', 'disbursed', 'hold', 'cancelled'] as const;

export const agestStatusClasses: Record<string, string> = {
  scheduled: 'bg-amber-500/15 text-amber-200',
  disbursed: 'bg-emerald-500/15 text-emerald-200',
  hold: 'bg-orange-500/15 text-orange-200',
  cancelled: 'bg-slate-500/15 text-slate-300',
};

export const parentChannels = ['call', 'whatsapp', 'email', 'sms', 'in_person', 'other'] as const;

// Students at "Flying / Departure" (Stage 11) onward are hostel-relevant.
export const hostelStudentStages = [
  'Flying / Departure',
  'University Registration in Georgia/Kyrgyzstan',
  'Hostel Access + First Fees Paid',
] as const;

export function titleCase(value: string): string {
  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function usd(value: number): string {
  return `$${Math.round(Number(value) || 0).toLocaleString('en-US')}`;
}
