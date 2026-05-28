export const leadStatuses = [
  'new',
  'contacted',
  'qualified',
  'converted',
  'lost',
  'not_interested',
] as const;

export const leadSources = [
  'walk-in',
  'phone',
  'social',
  'b2b',
  'referral',
  'whatsapp',
  'excel_upload',
  'other',
] as const;

export const leadInterests = [
  'mbbs_abroad_georgia',
  'mbbs_abroad_kyrgyzstan',
  'mbbs_abroad_both',
  'neet_coaching',
  'both',
  'other',
] as const;

export const leadPreferredCountries = ['Georgia', 'Kyrgyzstan', 'Any', 'Other'] as const;

export const leadStatusClasses = {
  new: 'bg-blue-500/15 text-blue-200',
  contacted: 'bg-yellow-500/15 text-yellow-200',
  qualified: 'bg-green-500/15 text-green-200',
  converted: 'bg-purple-500/15 text-purple-200',
  lost: 'bg-red-500/15 text-red-200',
  not_interested: 'bg-slate-500/15 text-slate-200',
} as const;

export function getLeadStatusLabel(status: string): string {
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getLeadSourceLabel(source: string): string {
  const labels: Record<string, string> = {
    'walk-in': 'Walk-in',
    phone: 'Phone',
    social: 'Social Media',
    b2b: 'B2B Partner',
    referral: 'Referral',
    whatsapp: 'WhatsApp',
    excel_upload: 'Excel Upload',
    other: 'Other',
  };
  return labels[source] ?? source;
}

export function getLeadInterestLabel(interest: string): string {
  const labels: Record<string, string> = {
    mbbs_abroad_georgia: 'MBBS - Georgia',
    mbbs_abroad_kyrgyzstan: 'MBBS - Kyrgyzstan',
    mbbs_abroad_both: 'MBBS - Both',
    neet_coaching: 'NEET Coaching',
    both: 'Both Programs',
    other: 'Other',
  };
  return labels[interest] ?? interest;
}
