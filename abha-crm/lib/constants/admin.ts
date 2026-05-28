export const notificationTypes = [
  { value: 'bonus_pending', label: 'Bonus Pending' },
  { value: 'leave_update', label: 'Leave Update' },
  { value: 'student_update', label: 'Student Update' },
  { value: 'goal_reminder', label: 'Goal Reminder' },
  { value: 'admin_alert', label: 'Admin Alert' },
  { value: 'lead_assigned', label: 'Lead Assigned' },
  { value: 'reference_bonus', label: 'Reference Bonus' },
  { value: 'expense_approval', label: 'Expense Approval' },
  { value: 'low_stock_alert', label: 'Low Stock Alert' },
  { value: 'infrastructure_damage', label: 'Infrastructure Damage' },
  { value: 'system', label: 'System' },
  { value: 'general', label: 'General' },
] as const;

export function notificationTypeLabel(value: string): string {
  return notificationTypes.find((type) => type.value === value)?.label ?? value;
}

export const notificationTypeClasses: Record<string, string> = {
  bonus_pending: 'bg-amber-500/15 text-amber-200',
  leave_update: 'bg-blue-500/15 text-blue-200',
  student_update: 'bg-emerald-500/15 text-emerald-200',
  goal_reminder: 'bg-saffron/15 text-saffron',
  admin_alert: 'bg-red-500/15 text-red-200',
  lead_assigned: 'bg-purple-500/15 text-purple-200',
  reference_bonus: 'bg-amber-500/15 text-amber-200',
  expense_approval: 'bg-yellow-500/15 text-yellow-200',
  low_stock_alert: 'bg-red-500/15 text-red-200',
  infrastructure_damage: 'bg-orange-500/15 text-orange-200',
  system: 'bg-slate-500/15 text-slate-300',
  general: 'bg-slate-500/15 text-slate-300',
};

// Reports surfaced on /admin/reports. `source` drives client-side data loading.
export const reportDefinitions = [
  {
    key: 'admissions',
    title: 'Monthly Admission Report',
    description: 'Students by stage and office.',
  },
  {
    key: 'staff_productivity',
    title: 'Staff Productivity Report',
    description: 'Admissions and conversions per staff.',
  },
  {
    key: 'lead_conversion',
    title: 'Lead Conversion Report',
    description: 'Leads, sources, and conversion outcomes.',
  },
  {
    key: 'financial',
    title: 'Financial Summary',
    description: 'Fees collected and bonus liabilities.',
  },
  {
    key: 'hostel_expense',
    title: 'Hostel Expense Report',
    description: 'Expenses grouped by category.',
  },
  {
    key: 'agent_commission',
    title: 'Agent Commission Report',
    description: 'Commissions by agent and status.',
  },
  {
    key: 'b2b_performance',
    title: 'B2B Partner Performance',
    description: 'Referrals and conversions per partner.',
  },
  {
    key: 'infrastructure',
    title: 'Infrastructure Inventory Report',
    description: 'Items, condition, and inspection dates.',
  },
  {
    key: 'store_consumption',
    title: 'Store Consumption Report',
    description: 'Items issued and reorder needs.',
  },
] as const;
