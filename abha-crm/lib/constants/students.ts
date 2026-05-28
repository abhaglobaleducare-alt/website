export const genders = ['male', 'female', 'other'] as const;

export const referenceSources = [
  'walk-in',
  'referral',
  'b2b',
  'social',
  'coaching',
  'agent',
  'other',
] as const;

export const countries = ['Georgia', 'Kyrgyzstan'] as const;

export const universitiesByCountry = {
  Georgia: [
    'European University (EEU)',
    'East West University',
    'Alte University',
    'SEU Georgia',
  ] as const,
  Kyrgyzstan: [
    'International European University (IEU)',
    'Avicenna International Medical University',
    'Coming Soon - Kyrgyzstan',
  ] as const,
} as const;

export const funnelStages = [
  'Lead Generated',
  'Initial Call / Enquiry',
  'Counselling Done',
  'Registration Done (Token Fee)',
  'Documentation Started',
  'Admission Confirmed',
  'Fee Collection Tranche 1',
  'Visa Processing',
  'Visa Approved',
  'Add-ons / Gifts Delivered',
  'Flying / Departure',
  'University Registration in Georgia/Kyrgyzstan',
  'Hostel Access + First Fees Paid',
] as const;

export const stageStatusClasses = {
  pending: 'bg-slate-800 text-slate-200',
  in_progress: 'bg-amber-500/15 text-amber-200',
  completed: 'bg-emerald-500/15 text-emerald-200',
} as const;
