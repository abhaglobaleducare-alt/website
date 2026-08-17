/**
 * THE COMPLETE ABHA PACKAGE — page 3 of the ALL-IN-ONE Marketing Brochure.
 *
 * One price covering everything from the first counselling call to twelve
 * months in Tbilisi, with the Early-Bird iPad included. Kept here so the
 * website and the printed brochure can never drift: change a figure once and
 * every placement follows.
 *
 * ⚠️ EXCHANGE RATE: the brochure prints its own rate of ₹95/USD, while the rest
 * of the site converts at ₹90 (EXCHANGE_RATE_INR in config.ts). We deliberately
 * do NOT run these figures through the site converter — a student holding the
 * printed brochure must see the same ₹12.66 Lakh on screen. The rate is printed
 * next to the number so the basis is never hidden. If the office settles on one
 * rate, change BROCHURE_USD_INR here and reprint, or switch to the shared
 * constant — but never let the two show different totals for the same package.
 */

export const BROCHURE_USD_INR = 95;

export interface PackageService {
  n: string;
  title: string;
  detail: string;
  /** lucide-react icon name, resolved in the component */
  icon: 'ClipboardCheck' | 'FileText' | 'HandCoins' | 'GraduationCap' | 'Stamp' | 'PlaneTakeoff' | 'MonitorPlay' | 'KeyRound' | 'BedDouble';
}

/** The nine services, in brochure order. */
export const PACKAGE_SERVICES: PackageService[] = [
  {
    n: '01',
    title: 'Application & Registration',
    detail:
      'Complete university application, student registration, document-checklist preparation, submission and full admission coordination & follow-up with the university.',
    icon: 'ClipboardCheck',
  },
  {
    n: '02',
    title: 'On-Boarding Documentation',
    detail:
      'Preparation and verification of all admission & travel documents, attestations where applicable, and guidance through the university onboarding process.',
    icon: 'FileText',
  },
  {
    n: '03',
    title: 'Consultancy & Loan Assistance',
    detail:
      'Personalised counselling for university selection, fee planning, financial guidance and complete education-loan documentation & coordination.',
    icon: 'HandCoins',
  },
  {
    n: '04',
    title: 'Admission + 1st Semester Tuition',
    detail:
      'University admission processing together with the 1st-semester tuition fee, including coordination with the university for admission confirmation & fee payment.',
    icon: 'GraduationCap',
  },
  {
    n: '05',
    title: 'Visa & Pre-Travel Documentation',
    detail:
      'Complete student-visa documentation, application coordination, invitation-related papers, travel checklist and full pre-departure guidance.',
    icon: 'Stamp',
  },
  {
    n: '06',
    title: 'Travel Insurance & Air Ticket',
    detail:
      'Travel-insurance assistance and air-ticket coordination for the journey to Georgia, with guidance on travel dates and required travel documents.',
    icon: 'PlaneTakeoff',
  },
  {
    n: '07',
    title: 'AGDRP + FMGE/NExT Coaching Portal',
    detail:
      "Access to ABHA's digital preparation platform for FMGE/NExT — practice tests, revision resources, performance analysis and exam-focused learning support.",
    icon: 'MonitorPlay',
  },
  {
    n: '08',
    title: 'On-Arrival Setup, TRC & Legal',
    detail:
      'Arrival coordination and settlement support in Georgia, Temporary Residence Card (TRC) guidance, documentation and basic legal & administrative assistance.',
    icon: 'KeyRound',
  },
  {
    n: '09',
    title: 'Accommodation & Food — 12 Months',
    detail:
      'Twelve months of student accommodation and food support — arranged stay and daily meals as per the ABHA accommodation plan.',
    icon: 'BedDouble',
  },
];

/** The Early-Bird iPad strip that sits under the nine services. */
export const EARLY_BIRD = {
  eyebrow: '★ Early-Bird Offer',
  title: 'A Useful Gift for Future Doctors',
  body:
    'Confirm your admission under the Early-Bird Offer and receive a complimentary iPad — pre-loaded for the AGDRP & FMGE/NExT portal, so preparation begins on day one. Subject to early-bird eligibility & offer terms.',
  badge: 'FREE iPad',
} as const;

/** Headline all-inclusive price. */
export const PACKAGE_PRICE = {
  usd: 13_324,
  /** ₹ exactly as printed in the brochure (13,324 × 95). */
  inr: 12_65_780,
  inrLabel: '≈ ₹12.66 Lakh',
  rateLabel: '@ ₹95 / USD = ₹12,65,780',
  title: 'All 9 Services + Early-Bird iPad',
  note: 'One payment · no separate service-wise charges',
} as const;

/**
 * Costs that fall OUTSIDE the package. Printed prominently in the brochure and
 * reproduced here for the same reason: a family that reads ₹12.66 Lakh as the
 * whole six-year cost has been misled, and finds out only after committing.
 */
export const BEYOND_PACKAGE = {
  heading: 'Beyond the package · paid later, directly',
  subheading: 'over the 6-year programme',
  rows: [
    { label: 'Remaining tuition fees — 11 semesters × $2,975', amount: '$32,725' },
    { label: 'Expected accommodation & food, remaining 5 years — 60 months × $250', amount: '$15,000' },
  ],
  footnote:
    'Figures in USD · USD/INR ≈ ₹95/$ · subject to change · for information only, not a guarantee of admission.',
} as const;
