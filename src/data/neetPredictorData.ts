/**
 * ============================================================================
 * NEET ADMISSION DECISION ENGINE — SINGLE SOURCE OF TRUTH
 * ============================================================================
 *
 * This is the ONLY file that holds data for the NEET Analyzer.
 * Every number below is a maintainable estimate compiled by the ABHA office
 * from NEET 2025 (NTA) results and previous counselling rounds.
 *
 * ➜ To refresh for a new NEET year, edit THIS FILE ONLY. No component or engine
 *   code needs to change — the UI and prediction logic read from these exports.
 *
 * Fields marked `// EDIT` are the ones most likely to move year-on-year.
 * ============================================================================
 */

/* -------------------------------------------------------------------------- */
/*  Shared enums / literal unions                                             */
/* -------------------------------------------------------------------------- */

import { EXCHANGE_RATE_INR } from './config';

/** Convert a USD amount to whole ₹ at the site-wide rate (₹90/USD). */
export const usdToInr = (usd: number): number => Math.round(usd * EXCHANGE_RATE_INR);
export { EXCHANGE_RATE_INR };

export const CATEGORIES = ['General', 'EWS', 'OBC', 'SC', 'ST'] as const;
export type Category = (typeof CATEGORIES)[number];

export const STATES = [
  'Maharashtra',
  'Karnataka',
  'Uttar Pradesh',
  'Bihar',
  'Rajasthan',
  'Gujarat',
  'Madhya Pradesh',
  'Tamil Nadu',
  'Other',
] as const;
export type StateName = (typeof STATES)[number];

/** Maximum possible NEET score (720 in the 200-question / 180-scored era). */
export const MAX_SCORE = 720; // EDIT if NTA changes the paper pattern

/** Approx. total candidates who appeared — used for percentile framing. */
export const TOTAL_CANDIDATES = 2_200_000; // EDIT each year

/* -------------------------------------------------------------------------- */
/*  1. RANK MAPPING — piecewise linear interpolation anchors                  */
/* -------------------------------------------------------------------------- */
/**
 * Anchor points: { score → All India Rank }. The engine interpolates linearly
 * BETWEEN adjacent anchors (higher accuracy than a single global line) and
 * extrapolates gently beyond the ends. Keep this sorted by DESCENDING score.
 */
export interface RankAnchor {
  score: number;
  air: number;
}

export const rankMapping: RankAnchor[] = [
  { score: 686, air: 1 }, // EDIT — top-tier anchors move most
  { score: 680, air: 10 },
  { score: 670, air: 200 },
  { score: 660, air: 800 },
  { score: 650, air: 2_000 },
  { score: 640, air: 4_000 },
  { score: 630, air: 6_000 },
  { score: 620, air: 8_500 },
  { score: 610, air: 12_000 },
  { score: 600, air: 15_000 },
  { score: 590, air: 19_000 },
  { score: 580, air: 23_000 },
  { score: 570, air: 28_000 },
  { score: 560, air: 33_000 },
  { score: 550, air: 38_000 },
  { score: 540, air: 45_000 },
  { score: 530, air: 52_000 },
  { score: 520, air: 60_000 },
  { score: 510, air: 70_000 },
  { score: 500, air: 80_000 },
  { score: 490, air: 92_000 },
  { score: 480, air: 105_000 },
  { score: 470, air: 118_000 },
  { score: 460, air: 132_000 },
  { score: 450, air: 145_000 },
  { score: 440, air: 160_000 },
  { score: 430, air: 178_000 },
  { score: 420, air: 195_000 },
  { score: 410, air: 215_000 },
  { score: 400, air: 240_000 },
  { score: 380, air: 300_000 },
  { score: 360, air: 380_000 },
  { score: 340, air: 470_000 },
  { score: 300, air: 650_000 },
  { score: 250, air: 850_000 },
  { score: 200, air: 1_050_000 },
  { score: 144, air: 1_236_531 }, // ~General qualifying line
];

/* -------------------------------------------------------------------------- */
/*  2. GOVERNMENT (AIQ 15%) THRESHOLDS — closing ranks by category            */
/* -------------------------------------------------------------------------- */
/**
 * Indicative CLOSING All India Ranks for the 15% All India Quota in government
 * MBBS colleges (MCC counselling). "Safe" = comfortably in; "possible" = only
 * in later/stray rounds or borderline colleges.
 */
export interface GovThreshold {
  category: Category;
  safeRank: number; // strong chance at a decent Govt college via AIQ
  possibleRank: number; // borderline — later rounds / less-preferred colleges
}

export const governmentThresholds: GovThreshold[] = [
  { category: 'General', safeRank: 15_000, possibleRank: 30_000 }, // EDIT
  { category: 'EWS', safeRank: 22_000, possibleRank: 42_000 },
  { category: 'OBC', safeRank: 30_000, possibleRank: 60_000 },
  { category: 'SC', safeRank: 90_000, possibleRank: 150_000 },
  { category: 'ST', safeRank: 130_000, possibleRank: 220_000 },
];

/* -------------------------------------------------------------------------- */
/*  3. STATE QUOTA (85%) THRESHOLDS — closing ranks by state & category       */
/* -------------------------------------------------------------------------- */
/**
 * Indicative CLOSING All India Ranks for 85% state-quota Govt MBBS seats.
 * State merit lists use domicile + category; these AIR bands are the office's
 * translation of last year's state closing scores back onto AIR.
 */
export interface StateThreshold {
  state: StateName;
  /** closing AIR per category — beyond this, Govt state seat is unlikely */
  closingRank: Record<Category, number>;
  note?: string;
}

export const stateThresholds: StateThreshold[] = [
  {
    state: 'Maharashtra', // EDIT — ABHA's home state, keep most current
    closingRank: { General: 35_000, EWS: 45_000, OBC: 70_000, SC: 200_000, ST: 320_000 },
    note: 'MH CET Cell counselling — domicile & caste-validity documents decisive.',
  },
  {
    state: 'Karnataka',
    closingRank: { General: 40_000, EWS: 52_000, OBC: 85_000, SC: 230_000, ST: 340_000 },
    note: 'KEA counselling — Kannada domicile / eligibility clauses apply.',
  },
  {
    state: 'Uttar Pradesh',
    closingRank: { General: 42_000, EWS: 55_000, OBC: 88_000, SC: 260_000, ST: 400_000 },
  },
  {
    state: 'Bihar',
    closingRank: { General: 40_000, EWS: 52_000, OBC: 82_000, SC: 250_000, ST: 380_000 },
    note: 'BCECEB counselling — domicile & category certificates decisive.',
  },
  {
    state: 'Rajasthan',
    closingRank: { General: 38_000, EWS: 50_000, OBC: 78_000, SC: 220_000, ST: 300_000 },
  },
  {
    state: 'Gujarat',
    closingRank: { General: 44_000, EWS: 56_000, OBC: 90_000, SC: 250_000, ST: 350_000 },
  },
  {
    state: 'Madhya Pradesh',
    closingRank: { General: 40_000, EWS: 52_000, OBC: 82_000, SC: 240_000, ST: 330_000 },
  },
  {
    state: 'Tamil Nadu',
    closingRank: { General: 45_000, EWS: 58_000, OBC: 95_000, SC: 270_000, ST: 380_000 },
    note: '7.5% govt-school reservation & strong state board weightage.',
  },
  {
    state: 'Other',
    closingRank: { General: 40_000, EWS: 52_000, OBC: 85_000, SC: 240_000, ST: 350_000 },
    note: 'Generic all-India average — check your state counselling authority.',
  },
];

/* -------------------------------------------------------------------------- */
/*  4. PRIVATE COLLEGES — fee ranges by state (₹ per year)                    */
/* -------------------------------------------------------------------------- */
/**
 * Private/management-quota MBBS. Admission is largely fee-driven above the
 * qualifying line; there is effectively no upper rank cutoff, only a budget one.
 */
export interface PrivateFee {
  state: StateName;
  tuitionPerYearMin: number; // ₹ / year — EDIT
  tuitionPerYearMax: number;
  qualifyingRankCutoff: number; // must be at/above ~qualifying to be counselling-eligible
}

export const privateColleges: PrivateFee[] = [
  { state: 'Maharashtra', tuitionPerYearMin: 900_000, tuitionPerYearMax: 2_200_000, qualifyingRankCutoff: 1_500_000 },
  { state: 'Karnataka', tuitionPerYearMin: 1_000_000, tuitionPerYearMax: 2_500_000, qualifyingRankCutoff: 1_500_000 },
  { state: 'Uttar Pradesh', tuitionPerYearMin: 800_000, tuitionPerYearMax: 1_800_000, qualifyingRankCutoff: 1_500_000 },
  { state: 'Bihar', tuitionPerYearMin: 800_000, tuitionPerYearMax: 1_800_000, qualifyingRankCutoff: 1_500_000 },
  { state: 'Rajasthan', tuitionPerYearMin: 850_000, tuitionPerYearMax: 1_900_000, qualifyingRankCutoff: 1_500_000 },
  { state: 'Gujarat', tuitionPerYearMin: 700_000, tuitionPerYearMax: 1_700_000, qualifyingRankCutoff: 1_500_000 },
  { state: 'Madhya Pradesh', tuitionPerYearMin: 800_000, tuitionPerYearMax: 1_900_000, qualifyingRankCutoff: 1_500_000 },
  { state: 'Tamil Nadu', tuitionPerYearMin: 1_300_000, tuitionPerYearMax: 3_000_000, qualifyingRankCutoff: 1_500_000 },
  { state: 'Other', tuitionPerYearMin: 900_000, tuitionPerYearMax: 2_200_000, qualifyingRankCutoff: 1_500_000 },
];

/* -------------------------------------------------------------------------- */
/*  5. DEEMED UNIVERSITIES — fee ranges (₹ per year)                          */
/* -------------------------------------------------------------------------- */
export interface DeemedFee {
  tuitionPerYearMin: number; // EDIT
  tuitionPerYearMax: number;
  qualifyingRankCutoff: number;
  note: string;
}

export const deemedUniversities: DeemedFee = {
  tuitionPerYearMin: 1_800_000,
  tuitionPerYearMax: 3_000_000,
  qualifyingRankCutoff: 1_500_000,
  note: 'All-India deemed universities (MCC counselling). Fee-driven; among the most expensive Indian MBBS routes.',
};

/* -------------------------------------------------------------------------- */
/*  6. ABROAD OPTIONS — Georgia + Timor-Leste                                 */
/* -------------------------------------------------------------------------- */
/**
 * Costs are declared in USD (per official university/college quotations) and
 * converted to ₹ at ₹90/USD via `usdToInr` — matching config.ts. The ONE
 * exception is an India-side charge already invoiced in ₹ (e.g. the Timor
 * consultancy fee incl. GST): store it as INR directly (it is not a USD figure).
 *
 * Display rule: "from" prices round UP, savings round DOWN (conservative both
 * ways). The real computed values live in these line items; the `*Label` strings
 * are the brochure-aligned display copy.
 */
export interface AbroadCostLine {
  label: string;
  /** ₹ amount; null = "at actual cost" (no figure, e.g. air ticket) */
  amountInr: number | null;
  /** supporting detail shown under the label */
  sub?: string;
  /** one-time charge (not recurring over the course) */
  oneTime?: boolean;
  /** paid directly to the college bank account — a trust signal */
  directToCollege?: boolean;
}

export interface AbroadOption {
  country: string;
  university: string;
  city: string;
  flag: string;
  /** "6 years" | "5.5 years (4.5 academic + 1 yr internship)" — never 6 yrs for Timor */
  durationLabel: string;
  durationShort: string;
  durationYears: number;
  /** e.g. ["NMC & WHO Eligible"] — NEVER "Approved" */
  badges: string[];
  medium: string;
  /** brochure headline, e.g. "Tuition from ₹21 Lakhs" / "Total college fees under ₹20 Lakhs" */
  headlineLabel: string;
  /** computed ₹ behind the headline (for reference/logic, not display rounding) */
  headlineFromInr: number;
  /** itemised, computed cost lines for the card + breakdown */
  costLines: AbroadCostLine[];
  /** short descriptor of what the total covers */
  costSummaryNote: string;
  /** all-inclusive ₹ span (computed) — used for comparison sorting & budget-fit */
  allInclusiveFromInr: number;
  allInclusiveToInr: number;
  /** brochure display copy for the all-inclusive figure */
  allInclusiveLabel: string;
  /** prominent trust line (Timor: fees direct to college) */
  trustLine?: string;
  highlights: string[];
  footnotes: string[];
  minScoreRecommended: number;
}

/* Georgia USD inputs (brochure-aligned) */
const GEO_TUITION_MIN = 23_400; // East West $1,950/sem × 12
const GEO_TUITION_MAX = 39_000; // UoG $3,250/sem × 12
const GEO_SERVICES = 6_199; // ABHA services package, one-time
const GEO_LIVING_Y1 = 4_200; // $350/mo × 12 — mandatory ABHA Study & Stay
const GEO_LIVING_Y2_6 = 15_000; // $250/mo × 12 × 5

/* Timor-Leste USD inputs (Nalanda College official fee sheet) */
const TIM_COLLEGE = 21_850; // tuition 20,400 + lab 250 + kit 200 + visa/conv 1,000
const TIM_HOSTEL_FOOD = 16_500; // $3,000/yr × 5.5 yrs
const TIM_CONSULTANCY_INR = 147_500; // India-side, incl. 18% GST — declared in ₹, not USD

export const abroadOptions: AbroadOption[] = [
  {
    country: 'Georgia',
    university: 'ABHA partner universities (SEU · Avicenna · IBSU-SEU · East West · UoG)',
    city: 'Tbilisi',
    flag: '🇬🇪',
    durationLabel: '6 years',
    durationShort: '6 yrs',
    durationYears: 6,
    badges: ['NMC & WHO Eligible'],
    medium: 'English',
    headlineLabel: 'Tuition from ₹21 Lakhs',
    headlineFromInr: usdToInr(GEO_TUITION_MIN),
    costLines: [
      { label: 'Tuition (6 yrs)', amountInr: usdToInr(GEO_TUITION_MIN), sub: '$1,950–$3,250/sem by university · $23,400–$39,000 total' },
      { label: 'ABHA services package', amountInr: usdToInr(GEO_SERVICES), oneTime: true, sub: 'One-time $6,199 — admission, documentation, on-arrival & support' },
      { label: 'Living — Year 1 (ABHA Study & Stay)', amountInr: usdToInr(GEO_LIVING_Y1), sub: '$350/mo × 12 — Indian food, 24×7 security, own hostel' },
      { label: 'Living — Years 2–6 (private apartment)', amountInr: usdToInr(GEO_LIVING_Y2_6), sub: '~$250/mo self-cooking · $250 × 12 × 5' },
    ],
    costSummaryNote: 'All-inclusive: tuition + ABHA services + Year-1 hostel + Years 2–6 living.',
    allInclusiveFromInr: usdToInr(GEO_TUITION_MIN + GEO_SERVICES + GEO_LIVING_Y1 + GEO_LIVING_Y2_6), // $48,799
    allInclusiveToInr: usdToInr(GEO_TUITION_MAX + GEO_SERVICES + GEO_LIVING_Y1 + GEO_LIVING_Y2_6), // $64,399
    allInclusiveLabel: '~₹44L – ₹58L (all-inclusive)',
    highlights: [
      'European MBBS (MD) — NMC & WHO Eligible universities',
      'English medium, Indian-food hostels, large Indian community',
      'No donation, transparent university fees',
      'FMGE / NExT preparation support through ABHA',
    ],
    footnotes: [
      'Living costs are realistic estimates; actuals vary by lifestyle & room-sharing. Year-1 hostel per ABHA Study & Stay contract.',
      'INR indicative at ₹90/USD — actual bank rate at transfer applies.',
    ],
    minScoreRecommended: 200,
  },
  {
    country: 'Timor-Leste',
    university: 'Nalanda College of Medicine, Dili',
    city: 'Dili',
    flag: '🇹🇱',
    durationLabel: '5.5 years (4.5 yrs academic + 1 yr internship)',
    durationShort: '5.5 yrs',
    durationYears: 5.5,
    badges: ['NMC FMGL 2021 Compliant', 'NMC & WHO Eligible · WDOMS Listed'],
    medium: 'English',
    headlineLabel: 'Total college fees under ₹20 Lakhs',
    headlineFromInr: usdToInr(TIM_COLLEGE),
    trustLine: 'All college fees are paid directly to the college bank account — never to any consultancy.',
    costLines: [
      { label: 'College fees (paid directly to college)', amountInr: usdToInr(TIM_COLLEGE), directToCollege: true, sub: 'Tuition $20,400 + Lab $250 + Medical Kit $200 + Visa & Conv. $1,000 = $21,850' },
      { label: 'Hostel & Food (5.5 yrs)', amountInr: usdToInr(TIM_HOSTEL_FOOD), sub: '$3,000/year, payable half-yearly in advance' },
      { label: 'Consultancy & Visa Service (India)', amountInr: TIM_CONSULTANCY_INR, sub: 'Incl. 18% GST · payable in installments · counselling, documentation, India medical test, PCC, apostille, pre-departure' },
      { label: 'One-way air ticket to Dili', amountInr: null, sub: 'At actual cost, charged separately' },
    ],
    costSummaryNote: 'College fees direct to college; India consultancy billed separately; air ticket at actuals.',
    allInclusiveFromInr: usdToInr(TIM_COLLEGE + TIM_HOSTEL_FOOD) + TIM_CONSULTANCY_INR, // ₹35.99L
    allInclusiveToInr: usdToInr(TIM_COLLEGE + TIM_HOSTEL_FOOD) + TIM_CONSULTANCY_INR,
    allInclusiveLabel: '~₹36L (all-inclusive, excl. air ticket)',
    highlights: [
      'Total college fees below ₹20 Lakhs — most budget-friendly route',
      '5.5-year programme: 4.5 yrs academic + 1 yr internship',
      'Nalanda College of Medicine, Dili — NMC FMGL 2021 Compliant',
      'All college fees paid directly to the college — never via consultancy',
    ],
    footnotes: [
      'Fees subject to change without prior notice.',
      'INR indicative at ₹90/USD — use actual rate at transfer.',
      'Hostel & food payable half-yearly in advance; bank transfer fee $25/transfer applies.',
    ],
    minScoreRecommended: 162,
  },
];

/* ---- Savings headline: Indian private vs Georgia tuition-from ------------- */
/** Typical all-in Indian private MBBS total used for the "Save ₹XX L" headline. */
export const PRIVATE_INDIA_TYPICAL_INR = 8_000_000; // ₹80L+ — EDIT
export const GEORGIA_TUITION_FROM_INR = usdToInr(GEO_TUITION_MIN); // ~₹21L
export const GEORGIA_SAVINGS_INR = PRIVATE_INDIA_TYPICAL_INR - GEORGIA_TUITION_FROM_INR; // computed (~₹59L)
/** Displayed conservative saving (round DOWN): ₹80L − ₹25L rounded tuition. */
export const GEORGIA_SAVINGS_LABEL = '₹55L';

/* -------------------------------------------------------------------------- */
/*  7. SEAT AVAILABILITY — total seats by type (all-India)                    */
/* -------------------------------------------------------------------------- */
export interface SeatBucket {
  type: string;
  seats: number; // EDIT each year as new colleges are added
  note: string;
}

export const seatAvailability: SeatBucket[] = [
  { type: 'Government MBBS', seats: 56_000, note: 'Central + state government colleges' },
  { type: 'Private MBBS', seats: 52_000, note: 'Private & management-quota colleges' },
  { type: 'Deemed Universities', seats: 8_500, note: 'Deemed-to-be universities (MCC)' },
  { type: 'AIIMS / JIPMER', seats: 2_500, note: 'Institutes of national importance' },
];

/** Convenience: total sanctioned MBBS seats in India. */
export const TOTAL_MBBS_SEATS_INDIA = seatAvailability.reduce((s, b) => s + b.seats, 0);

/* -------------------------------------------------------------------------- */
/*  8. COST BREAKDOWNS — detailed components per route (₹, whole course)      */
/* -------------------------------------------------------------------------- */
/**
 * Total-course cost skeletons used by the CostBreakdown component. Values are
 * mid-range estimates; the engine may scale them by the user's specific inputs.
 */
export interface CostComponent {
  label: string;
  amount: number | null; // ₹ for the course; null = "at actual cost"
  sub?: string;
  oneTime?: boolean;
  directToCollege?: boolean;
}

export interface CostBreakdownEntry {
  route: string;
  currency: '₹';
  components: CostComponent[];
  note: string;
  /** overrides the numeric sum in the UI when the real figure is a labelled span */
  totalLabel?: string;
  /** prominent trust line under the total (e.g. fees paid direct to college) */
  trustLine?: string;
  footnotes?: string[];
}

export const costBreakdowns: CostBreakdownEntry[] = [
  {
    route: 'Government MBBS (India)',
    currency: '₹',
    components: [
      { label: 'Tuition (4.5 yrs)', amount: 250_000 },
      { label: 'Hostel & mess', amount: 300_000 },
      { label: 'Misc. / exams', amount: 100_000 },
    ],
    note: 'By far the cheapest route — the reason lakhs compete for ~56k seats.',
  },
  {
    route: 'Private MBBS (India)',
    currency: '₹',
    components: [
      { label: 'Tuition (4.5 yrs)', amount: 6_500_000 },
      { label: 'Hostel & mess', amount: 900_000 },
      { label: 'Misc. / exams', amount: 300_000 },
    ],
    note: 'Fees vary widely by state & college — use the college fee list for exact figures.',
  },
  {
    route: 'Deemed University (India)',
    currency: '₹',
    components: [
      { label: 'Tuition (4.5 yrs)', amount: 11_000_000 },
      { label: 'Hostel & mess', amount: 1_200_000 },
      { label: 'Misc. / exams', amount: 400_000 },
    ],
    note: 'Among the most expensive Indian MBBS routes.',
  },
  // Abroad rows derived from abroadOptions so fees live in ONE place.
  ...abroadOptions.map((o): CostBreakdownEntry => ({
    route: `MBBS ${o.country} ${o.flag}`,
    currency: '₹',
    components: o.costLines.map((l) => ({
      label: l.label,
      amount: l.amountInr,
      sub: l.sub,
      oneTime: l.oneTime,
      directToCollege: l.directToCollege,
    })),
    note: o.costSummaryNote,
    totalLabel: o.allInclusiveLabel,
    trustLine: o.trustLine,
    footnotes: o.footnotes,
  })),
];

/* -------------------------------------------------------------------------- */
/*  9. QUALIFYING PERCENTILE LINES — for the "did you qualify" check          */
/* -------------------------------------------------------------------------- */
export const qualifyingScores: Record<Category, number> = {
  General: 162, // 50th percentile — EDIT each year
  EWS: 162,
  OBC: 133, // 40th percentile
  SC: 133,
  ST: 133,
};