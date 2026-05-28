export const partnerTypes = ['coaching_class', 'consultant', 'agent', 'school', 'other'] as const;

export const partnerStatuses = ['active', 'inactive', 'blacklisted'] as const;

export const partnerCountries = ['Georgia', 'Kyrgyzstan', 'Both', 'Any'] as const;

export type PartnerType = (typeof partnerTypes)[number];
export type PartnerStatus = (typeof partnerStatuses)[number];

export const partnerStatusClasses: Record<PartnerStatus, string> = {
  active: 'bg-emerald-500/15 text-emerald-200',
  inactive: 'bg-slate-500/15 text-slate-300',
  blacklisted: 'bg-red-500/15 text-red-200',
};

export function partnerTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    coaching_class: 'Coaching Class',
    consultant: 'Consultant',
    agent: 'Agent',
    school: 'School',
    other: 'Other',
  };
  return labels[type] ?? type;
}

export function titleCase(value: string): string {
  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
