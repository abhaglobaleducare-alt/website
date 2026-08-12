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

/** Approx. total candidates who APPEARED — used for percentile framing. */
export const TOTAL_CANDIDATES = 2_000_000; // NEET 2026: ~20 lakh appeared — EDIT each year

/**
 * Official NTA NEET 2026 category-wise QUALIFIED counts (press release, 16 Jul
 * 2026; total 11.21 lakh). These are the honest denominators behind every
 * "how many people are ahead of me in my category" statement the engine makes —
 * never estimate them.
 */
export const CATEGORY_QUALIFIED_2026: Record<Category, number> = {
  General: 291_000, // 2.91 lakh
  EWS: 95_026,
  OBC: 512_000, // OBC-NCL, 5.12 lakh
  SC: 159_000, // 1.59 lakh
  ST: 63_716,
};

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

/*
 * ⚠️ CALIBRATED TO THE OFFICIAL NEET 2026 RESULT DISTRIBUTION (result declared
 * 16 July 2026). Any future recalibration MUST match NTA official cumulative
 * counts: 1,492 candidates ≥650 · 10,160 ≥600 · 90,780 ≥500 (2026). Reject any
 * source table that contradicts these — e.g. 600→AIR 4,000 is STALE 2025 data
 * (2026 actual is ~10,160). Grounding: top score 715/720; 138 candidates >690;
 * 11.21 lakh qualified of ~20 lakh appeared. Anchors dated July 2026.
 * Update anchors only via a reviewed commit — student data proposes, founder
 * disposes (see /api/air-calibration-report).
 */
export const rankMapping: RankAnchor[] = [
  { score: 715, air: 1 }, // top scorer 715/720
  { score: 700, air: 33 },
  { score: 686, air: 160 }, // 138 candidates > 690
  { score: 650, air: 1_493 }, // 1,492 candidates ≥ 650
  { score: 635, air: 2_600 },
  { score: 601, air: 10_160 }, // 10,160 candidates ≥ 600
  { score: 562, air: 28_000 }, // ~last AIQ Gen/UR govt seat
  { score: 559, air: 29_500 },
  { score: 551, air: 35_000 },
  { score: 501, air: 90_780 }, // 90,780 candidates ≥ 500
  { score: 451, air: 140_000 },
  { score: 401, air: 190_000 },
  { score: 351, air: 250_000 },
  { score: 301, air: 330_000 },
  { score: 251, air: 440_000 },
  { score: 213, air: 560_000 },
  // Below 213 (the UR qualifying line) precision collapses — extend smoothly to
  // the total qualified (~11.21 lakh) at 177, the lowest qualifying mark of all.
  { score: 177, air: 1_121_000 }, // lowest qualifying mark (OBC/SC/ST) · 11.21 lakh qualified
];

/** Total candidates who qualified NEET 2026 (≈ last qualified rank). */
export const TOTAL_QUALIFIED_2026 = 1_121_000;
/** Below this score the estimate is "qualifying-borderline" (low precision). */
export const QUALIFYING_BORDERLINE_SCORE = 213;
/** Human-facing calibration label — render visibly; it is a selling point. */
export const CALIBRATION_LABEL = 'Calibrated to the official NEET 2026 result distribution';
/** Where the college cutoffs (as opposed to the rank curve) come from. */
export const CUTOFF_BASIS_LABEL =
  'College cutoffs from the last completed counselling (MCC & state authorities, 2025), uplifted for the 9,911 new MBBS seats in the NMC 2026 matrix';
/** The counselling cycle this build is aimed at. */
export const COUNSELLING_YEAR = 2026;

/* -------------------------------------------------------------------------- */
/*  2. GOVERNMENT (AIQ 15%) THRESHOLDS — closing ranks by category            */
/* -------------------------------------------------------------------------- */
/**
 * Indicative CLOSING All India Ranks for the 15% All India Quota in government
 * MBBS colleges (MCC counselling). "Safe" = comfortably in; "possible" = only
 * in later/stray rounds or borderline colleges.
 */
/**
 * Provenance of a cutoff row. Rendered to the student and used by
 * `calculateConfidence` — an unverified row must never read as verified.
 *  - 'verified' : traced to a published closing rank from the last COMPLETED
 *                 counselling (NEET 2025 / MCC / state authority).
 *  - 'modelled' : ABHA office estimate; no published closing rank sourced yet.
 */
export type DataQuality = 'verified' | 'modelled';

/**
 * NEET 2026 seat-growth allowance. The NMC 2026 matrix added 9,911 MBBS seats
 * (1,27,028 → 1,36,939; government 63,296). Closing ranks are driven by the
 * SEAT COUNT, not by the mark distribution, so more seats push every closing
 * rank slightly deeper. We uplift the verified NEET 2025 closing ranks by this
 * factor rather than inventing 2026 numbers before counselling concludes.
 *
 * ⚠️ Closing MARKS moved far more than closing RANKS between 2025 and 2026
 * (500 marks = AIR 52,437 in 2025 but AIR ~90,780 in 2026). Never carry a
 * marks-based cutoff across years — only ranks.
 */
export const SEAT_GROWTH_UPLIFT_2026 = 1.05;

export interface GovThreshold {
  category: Category;
  safeRank: number; // strong chance at a decent Govt college via AIQ
  possibleRank: number; // borderline — later rounds / less-preferred colleges
  /** published AIQ closing AIR from the last COMPLETED counselling (2025) */
  closingRank2025?: number;
  dataQuality: DataQuality;
}

/*
 * Verified against MCC 2025 Round-3 AIQ government MBBS closing ranks:
 *   UR 26,178 · OBC-NCL 26,231 · SC ~1,36,445 · ST ~1,62,975.
 * KEY CORRECTION (Aug 2026): OBC-NCL closes essentially LEVEL WITH UR in the
 * All India Quota — the old 30k/60k OBC row was far too generous and told OBC
 * students they were safe when they were not. In AIQ the OBC pool is huge
 * (5.12 lakh qualified in 2026) relative to its 27% of only ~9.5k AIQ seats.
 * `possibleRank` = verified 2025 closing × SEAT_GROWTH_UPLIFT_2026, rounded.
 * `safeRank` ≈ 0.7 × possible — a decent college, not the last stray seat.
 */
export const governmentThresholds: GovThreshold[] = [
  { category: 'General', safeRank: 19_000, possibleRank: 27_500, closingRank2025: 26_178, dataQuality: 'verified' },
  // EWS: MCC does not publish a single headline EWS closing rank; band taken
  // from counselling-tracker consensus (AIR ~30k–34k) — flagged as modelled.
  { category: 'EWS', safeRank: 24_000, possibleRank: 34_000, dataQuality: 'modelled' },
  { category: 'OBC', safeRank: 19_500, possibleRank: 27_500, closingRank2025: 26_231, dataQuality: 'verified' },
  { category: 'SC', safeRank: 100_000, possibleRank: 143_000, closingRank2025: 136_445, dataQuality: 'verified' },
  { category: 'ST', safeRank: 120_000, possibleRank: 171_000, closingRank2025: 162_975, dataQuality: 'verified' },
];

/* -------------------------------------------------------------------------- */
/*  Category-rank estimation scaffold (C3)                                     */
/* -------------------------------------------------------------------------- */
/**
 * Per-category score→Category-Rank anchor curves. INTENTIONALLY EMPTY at launch:
 * we do NOT fabricate category-rank estimates without data. A curve for a
 * category is added ONLY after the calibration report shows ≥30 real actual
 * data points for it (see /api/air-calibration-report) — via a reviewed commit,
 * never auto-applied. Until then, non-General verdicts use category-relaxed
 * score thresholds and nudge the student to enter their Category Rank.
 */
export const categoryAnchors: Partial<Record<Category, RankAnchor[]>> = {
  // OBC: [ ... ] // add once ≥30 actual OBC data points are collected & reviewed
};

/* -------------------------------------------------------------------------- */
/*  3. STATE QUOTA (85%) THRESHOLDS — closing ranks by state & category       */
/* -------------------------------------------------------------------------- */
/**
 * Indicative CLOSING All India Ranks for 85% state-quota Govt MBBS seats.
 * State merit lists use domicile + category; these AIR bands are the office's
 * translation of recent prior-year state closing scores back onto AIR.
 */
export interface StateThreshold {
  state: StateName;
  /** closing AIR per category — beyond this, Govt state seat is unlikely */
  closingRank: Record<Category, number>;
  note?: string;
  /** 'verified' only where a published state closing rank was traced */
  dataQuality: DataQuality;
  /** which authority published the figures / would publish them */
  authority: string;
  /** the last COMPLETED counselling the row is traced to (verified rows only) */
  sourceYear?: number;
  /**
   * Government MBBS seats physically located in this state (NMC 2026 matrix).
   * null for 'Other', which is not a single state — we must not invent a number
   * for a student whose state we do not know.
   */
  govtSeats: number | null;
  /** Private + deemed MBBS seats located in this state (NMC 2026 matrix). */
  privateSeats: number | null;
}

/*
 * MAHARASHTRA IS VERIFIED (MH CET Cell 2025 government MBBS closing AIRs):
 *   Open   R1 ~42,000 → R3 47,500 → final/stray 52,437 (500 marks)
 *   OBC    R3 ~48,000
 *   EWS    R1 66,192 → R3 69,260
 *   SC     R1 1,52,122 → R3 1,60,759
 *   ST     R1 3,33,988 → R3 3,43,334
 * Stored values = last-round closing × SEAT_GROWTH_UPLIFT_2026, rounded.
 *
 * TWO CORRECTIONS this fixes for Maharashtra students:
 *   1. Open was modelled at 35,000 — the real 2025 seat closed at 52,437. The
 *      old table was telling Kolhapur/Pune open-category students a govt seat
 *      was out of reach when it was still live.
 *   2. EWS and OBC were INVERTED. In Maharashtra OBC closes near Open (~48k)
 *      because SEBC is a separate bucket, while EWS closes far later (~69k).
 *
 * Every other state stays 'modelled': no published state closing rank has been
 * traced for it, so the UI and the confidence score must say so out loud. The
 * Open/EWS bands were widened in line with the Maharashtra evidence (the old
 * office model was systematically too tight on open-category state quota);
 * OBC/SC/ST keep the office estimates because Maharashtra's SEBC split does not
 * generalise. Replace a row with 'verified' only once its authority's closing
 * rank is sourced — never by analogy.
 */
export const stateThresholds: StateThreshold[] = [
  {
    state: 'Maharashtra', // EDIT — ABHA's home state, keep most current
    govtSeats: 6_000,
    privateSeats: 7_099,
    closingRank: { General: 55_000, EWS: 72_000, OBC: 50_000, SC: 169_000, ST: 360_000 },
    note: 'MH CET Cell counselling — domicile & caste-validity documents decisive. In Maharashtra OBC closes close to Open, while EWS closes much later.',
    dataQuality: 'verified',
    authority: 'MH CET Cell',
    sourceYear: 2025,
  },
  {
    state: 'Karnataka',
    govtSeats: 4_400,
    privateSeats: 10_995,
    closingRank: { General: 60_000, EWS: 78_000, OBC: 85_000, SC: 230_000, ST: 340_000 },
    note: 'KEA counselling — Kannada domicile / eligibility clauses apply.',
    dataQuality: 'modelled',
    authority: 'KEA',
  },
  {
    state: 'Uttar Pradesh',
    govtSeats: 5_700,
    privateSeats: 8_300,
    closingRank: { General: 63_000, EWS: 82_000, OBC: 88_000, SC: 260_000, ST: 400_000 },
    dataQuality: 'modelled',
    authority: 'UP DGME',
  },
  {
    state: 'Bihar',
    govtSeats: 1_710,
    privateSeats: 2_450,
    closingRank: { General: 60_000, EWS: 78_000, OBC: 82_000, SC: 250_000, ST: 380_000 },
    note: 'BCECEB counselling — domicile & category certificates decisive.',
    dataQuality: 'modelled',
    authority: 'BCECEB',
  },
  {
    state: 'Rajasthan',
    govtSeats: 4_480,
    privateSeats: 3_600,
    closingRank: { General: 57_000, EWS: 75_000, OBC: 78_000, SC: 220_000, ST: 300_000 },
    dataQuality: 'modelled',
    authority: 'RajUHS',
  },
  {
    state: 'Gujarat',
    govtSeats: 4_250,
    privateSeats: 3_500,
    closingRank: { General: 66_000, EWS: 84_000, OBC: 90_000, SC: 250_000, ST: 350_000 },
    dataQuality: 'modelled',
    authority: 'Gujarat ACPUGMEC',
  },
  {
    state: 'Madhya Pradesh',
    govtSeats: 3_020,
    privateSeats: 3_000,
    closingRank: { General: 60_000, EWS: 78_000, OBC: 82_000, SC: 240_000, ST: 330_000 },
    dataQuality: 'modelled',
    authority: 'MP DME',
  },
  {
    state: 'Tamil Nadu',
    govtSeats: 5_349,
    privateSeats: 8_650,
    closingRank: { General: 68_000, EWS: 87_000, OBC: 95_000, SC: 270_000, ST: 380_000 },
    note: '7.5% govt-school reservation & strong state board weightage.',
    dataQuality: 'modelled',
    authority: 'TN MCC (Selection Committee)',
  },
  {
    state: 'Other',
    govtSeats: null,
    privateSeats: null,
    closingRank: { General: 60_000, EWS: 78_000, OBC: 85_000, SC: 240_000, ST: 350_000 },
    note: 'Generic all-India average — check your state counselling authority.',
    dataQuality: 'modelled',
    authority: 'your state counselling authority',
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
  /** label prefix used when rendering the headline in the selected currency */
  headlinePrefix: string;
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
  /** short suffix shown after the currency-aware all-inclusive range */
  allInclusiveSuffix: string;
  /** prominent trust line (Timor: fees direct to college) */
  trustLine?: string;
  highlights: string[];
  footnotes: string[];
  minScoreRecommended: number;
}

/* Georgia USD inputs (brochure-aligned) */
const GEO_TUITION_MIN = 23_400; // East West $1,950/sem × 12
const GEO_TUITION_MAX = 39_000; // UoG $3,250/sem × 12
const GEO_SERVICES = 6_199; // All Services package (application → on-ground), one-time
const GEO_LIVING_Y1 = 4_200; // $350/mo × 12 — mandatory Year-1 hostel accommodation & food
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
    headlinePrefix: 'Tuition from',
    headlineFromInr: usdToInr(GEO_TUITION_MIN),
    costLines: [
      { label: 'Tuition (6 yrs)', amountInr: usdToInr(GEO_TUITION_MIN), sub: '$1,950–$3,250/sem by university · $23,400–$39,000 total' },
      { label: 'All Services — from application to on-ground', amountInr: usdToInr(GEO_SERVICES), oneTime: true, sub: 'One-time $6,199 — application, admission, documentation, travel & on-ground support' },
      { label: 'Hostel Accommodation and Food — Year 1', amountInr: usdToInr(GEO_LIVING_Y1), sub: '$350/mo × 12 — Indian food, 24×7 security, own hostel' },
      { label: 'Living — Years 2–6 (private apartment)', amountInr: usdToInr(GEO_LIVING_Y2_6), sub: '~$250/mo self-cooking · $250 × 12 × 5' },
    ],
    costSummaryNote: 'All-inclusive: tuition + All Services package + Year-1 hostel + Years 2–6 living.',
    allInclusiveFromInr: usdToInr(GEO_TUITION_MIN + GEO_SERVICES + GEO_LIVING_Y1 + GEO_LIVING_Y2_6), // $48,799
    allInclusiveToInr: usdToInr(GEO_TUITION_MAX + GEO_SERVICES + GEO_LIVING_Y1 + GEO_LIVING_Y2_6), // $64,399
    allInclusiveLabel: '~₹44L – ₹58L (all-inclusive)',
    allInclusiveSuffix: 'all-inclusive',
    highlights: [
      'European MBBS (MD) — NMC & WHO Eligible universities',
      'English medium, Indian-food hostels, large Indian community',
      'No donation, transparent university fees',
      'FMGE / NExT preparation support through ABHA',
    ],
    footnotes: [
      'Living costs are realistic estimates; actuals vary by lifestyle & room-sharing. Year-1 hostel accommodation & food is a mandatory package.',
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
    headlinePrefix: 'Total college fees',
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
    allInclusiveSuffix: 'all-inclusive · excl. air ticket',
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

/**
 * OFFICIAL NMC MBBS seat matrix for NEET 2026 (released for 2026-27 admissions):
 *   1,36,939 seats across 823 colleges = 63,296 government (441 colleges)
 *   + 73,643 private & deemed (382 colleges). That is 9,911 NEW seats (+7.8%)
 *   over 2025's 1,27,028 — and 78.7% of the new seats are private.
 * AIIMS (~2,257) and JIPMER (243) are Institutes of National Importance and sit
 * OUTSIDE the 1,36,939 matrix, so they are added as their own bucket here.
 * Deemed universities (~58 NMC-approved, ~11,500 MBBS seats) are a SUBSET of the
 * NMC "private" figure — split out below so the buckets still sum correctly.
 * EDIT each year.
 */
export const NMC_TOTAL_MBBS_SEATS_2026 = 136_939;
export const NMC_GOVT_MBBS_SEATS_2026 = 63_296;
export const NMC_PRIVATE_AND_DEEMED_SEATS_2026 = 73_643;
export const NMC_MEDICAL_COLLEGES_2026 = 823;
export const NMC_NEW_SEATS_2026 = 9_911;
const DEEMED_MBBS_SEATS_2026 = 11_500; // subset of NMC_PRIVATE_AND_DEEMED_SEATS_2026
/** Institutes of National Importance — AIIMS ~2,257 + JIPMER 243. All-India
 *  merit through MCC: no domicile requirement, reachable from any state. */
export const INI_MBBS_SEATS_2026 = 2_500;

export const seatAvailability: SeatBucket[] = [
  { type: 'Government MBBS', seats: NMC_GOVT_MBBS_SEATS_2026, note: 'Central + state government colleges (441 colleges) — the cheapest seats, and the hardest' },
  {
    type: 'Private MBBS',
    seats: NMC_PRIVATE_AND_DEEMED_SEATS_2026 - DEEMED_MBBS_SEATS_2026,
    note: 'Private & management-quota colleges (NMC lists private + deemed together as 73,643)',
  },
  { type: 'Deemed Universities', seats: DEEMED_MBBS_SEATS_2026, note: '~58 deemed-to-be universities — 100% filled through MCC, no domicile bar' },
  { type: 'AIIMS / JIPMER', seats: INI_MBBS_SEATS_2026, note: 'Institutes of national importance (AIIMS ~2,257 + JIPMER 243) — counted outside the NMC matrix' },
];

/** Convenience: total sanctioned MBBS seats in India (NMC matrix + INIs). */
export const TOTAL_MBBS_SEATS_INDIA = seatAvailability.reduce((s, b) => s + b.seats, 0);

/* -------------------------------------------------------------------------- */
/*  7b. SEAT REALITY — why 63,296 govt seats still needs a rank under ~26,000  */
/* -------------------------------------------------------------------------- */
/**
 * The single most-asked question on this tool: "there are 63,000 government
 * seats, so why do I need AIR 26,000?" The answer is arithmetic, not opinion —
 * quota split first, then reservation. Everything here is derived, not typed,
 * so it can never drift from the seat matrix above.
 *
 *  1. Every state government seat splits 15% All India Quota / 85% State Quota.
 *  2. Within each quota, reservation applies: SC 15% · ST 7.5% · OBC-NCL 27% ·
 *     EWS 10% — leaving 40.5% unreserved. (PwD 5% is horizontal, i.e. carved
 *     out of each vertical category, so it is not subtracted again here.)
 *  3. So an open-category student is not competing for 63,296 seats. They are
 *     competing for the ~40.5% that are unreserved — and within AIQ that is a
 *     few thousand seats nationally, which is exactly why the last AIQ UR seat
 *     closed at AIR 26,178.
 */
export const AIQ_SHARE = 0.15;
export const STATE_QUOTA_SHARE = 0.85;

/** Vertical reservation shares applied inside each quota. */
export const RESERVATION_SHARE: Record<Category, number> = {
  General: 0.405, // unreserved remainder
  EWS: 0.10,
  OBC: 0.27, // OBC-NCL
  SC: 0.15,
  ST: 0.075,
};

/** Government MBBS seats in the 15% All India Quota (indicative). */
export const AIQ_GOVT_SEATS = Math.round(NMC_GOVT_MBBS_SEATS_2026 * AIQ_SHARE);
/** Government MBBS seats in the 85% home-state quota (indicative). */
export const STATE_GOVT_SEATS = NMC_GOVT_MBBS_SEATS_2026 - AIQ_GOVT_SEATS;

/** Government seats realistically open to a given category, across both quotas. */
export function govtSeatsForCategory(category: Category): number {
  return Math.round(NMC_GOVT_MBBS_SEATS_2026 * RESERVATION_SHARE[category]);
}

/* -------------------------------------------------------------------------- */
/*  7c. STATE-LEVEL RESERVATION — Maharashtra's split is NOT the central one   */
/* -------------------------------------------------------------------------- */
/**
 * ⚠️ The 85% state quota does NOT use the central 15/7.5/27/10 split. Maharashtra
 * runs its own schedule through the CET Cell:
 *   SC 13% · ST 7% · OBC 19% · EWS 10% · VJ-A 3% · NT-B 2.5% · NT-C 3.5% ·
 *   NT-D 2% · SBC 2%  →  open/unreserved ≈ 38%
 * Applying the central percentages to a state-quota pool overstates OBC (27 vs
 * 19) and understates the open category (40.5 vs 38) — the same class of error
 * as the old OBC AIQ row. Only add a state here once its schedule is sourced.
 *
 * VJ/NT/SBC (13% combined) are real Maharashtra categories that the analyzer's
 * five-way selector does not model; they are surfaced as a labelled residual so
 * the column still sums honestly instead of silently vanishing.
 */
export const MH_STATE_RESERVATION: Record<Category, number> = {
  General: 0.38, // open/unreserved after MH's schedule + EWS
  EWS: 0.1,
  OBC: 0.19,
  SC: 0.13,
  ST: 0.07,
};
/** VJ-A + NT-B + NT-C + NT-D + SBC — Maharashtra-only categories, 13% combined. */
export const MH_VJNT_SBC_SHARE = 0.13;

/**
 * Share of seats run through the CET Cell state quota (where the state
 * reservation schedule applies) in BOTH government and private colleges in
 * Maharashtra. The other 15% is All India Quota in government colleges and
 * institutional/management/NRI in private ones — neither follows the state
 * schedule, so category rows must never be computed on the full college total.
 */
export const MH_STATE_QUOTA_SHARE = 0.85;

/**
 * Maharashtra Medical Education & Drugs Dept GR, 23 July 2026 — the INSTITUTIONAL
 * ROUND is abolished for private medical & dental colleges. Every admission,
 * including stray-vacancy rounds, now runs through the CET Cell's CAP; seats left
 * vacant after the CAP cut-off simply stay vacant.
 *
 * ⚠️ Do NOT restate this as "the management quota is abolished" — a very common
 * misreading. What ended is the college-run ROUND that sat outside CAP. The
 * management and NRI seat CATEGORIES still exist, still carry their own (much
 * higher) fees, and still carry no caste reservation; they are simply allotted
 * by the CET Cell on merit now instead of by the college. No source supports the
 * stronger claim, so the copy must not make it.
 */
export const MH_2026_CAP_RULE =
  '2026 पासून private colleges चा institutional round बंद — stray vacancy सह सर्व जागा CET Cell च्या CAP मधूनच भरल्या जातात. Management/NRI हे seat category म्हणून कायम आहेत, फक्त आता college नव्हे तर CET Cell merit वर allotment करते.';

/** Same GR: declining a seat in the FINAL CAP round now costs two years. */
export const MH_2026_SEAT_BLOCKING_RULE =
  'शेवटच्या CAP round मध्ये जागा मिळूनही नाकारली, तर पुढील दोन शैक्षणिक वर्षं Maharashtra च्या UG medical/dental प्रवेशांना मुकावं लागतं. पहिल्या round नंतर मात्र free exit आहे.';

/**
 * The full Maharashtra 2026 rule-change note, rendered as a prominent callout on
 * the analyzer and the Marathi NEET Zone pages.
 *
 * The `myth` block is the point of the whole note. The news was widely reported
 * as "management quota abolished", which is wrong and would change what a family
 * decides — a parent who believes the quota is gone stops planning for its fees.
 * What ended is the college-run round outside CAP. Keep the correction attached
 * to the announcement wherever the announcement appears; never ship one without
 * the other.
 */
export const MH_2026_RULE_CHANGE = {
  title: 'Maharashtra 2026 — admission rule change',
  source: 'वैद्यकीय शिक्षण व औषधी द्रव्ये विभाग, शासन निर्णय — २३ जुलै २०२६',
  confirmed: [
    'Private medical / dental colleges चा institutional round पूर्णपणे बंद.',
    'Stray vacancy सह 100% जागा आता CET Cell च्या CAP मधूनच भरल्या जातील.',
    'CAP cut-off नंतर जागा रिकाम्या राहिल्या तर त्या रिकाम्याच राहतील — कॉलेजला त्या स्वतः भरता येणार नाहीत.',
    'शेवटच्या CAP round मध्ये जागा मिळूनही नाकारली, तर पुढील दोन शैक्षणिक वर्षं Maharashtra च्या UG medical/dental प्रवेशांना मुकावं लागेल. पहिल्या round नंतर मात्र free exit आहे.',
  ],
  mythTitle: 'गैरसमज टाळा',
  myth: '"Management quota बंद झाला"',
  truth:
    'हे बरोबर नाही. बंद झाला तो round — म्हणजे CAP बाहेर कॉलेज स्वतः चालवत असलेली प्रवेश प्रक्रिया. Management आणि NRI या seat categories तशाच आहेत, त्यांचं वेगळं (खूप जास्त) शुल्कही तसंच आहे, आणि त्यांना जातनिहाय आरक्षणही लागू नाही. फरक एवढाच की आता allotment कॉलेज नव्हे तर CET Cell merit वर करते.',
  practicalTitle: 'पालक विचारतील तेव्हा',
  practical:
    '"Management quota गेला का?" — उत्तर: नाही. पण आता donation किंवा direct admission शक्य नाही; सर्व जागा CAP मधून merit वर मिळतात.',
  caution:
    'हा शासन निर्णय CAP सुरू होण्याच्या अगदी आधीचा आहे. अंमलबजावणीचे तपशील — विशेषतः रिकाम्या NRI जागांचं काय होतं — CET Cell च्या information brochure मध्ये स्पष्ट होतील; प्रवेशाचा निर्णय घेण्यापूर्वी ते एकदा पडताळून घ्या.',
} as const;

/** Per-state reservation schedules. Only states whose schedule we have actually
 *  sourced appear here — the state seat-matrix table renders only for those. */
export const stateReservation: Partial<Record<StateName, Record<Category, number>>> = {
  Maharashtra: MH_STATE_RESERVATION,
};

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
  /** overrides the numeric sum in the UI when the real figure is a labelled span (INR copy) */
  totalLabel?: string;
  /** numeric all-inclusive ₹ range (for currency-aware rendering of the total) */
  totalFromInr?: number;
  totalToInr?: number;
  /** ₹ tuition / direct-college fees (below the all-inclusive total) — for the
   *  "budget covers tuition but not the full total" middle state */
  tuitionFromInr?: number;
  /** short suffix for the total, e.g. "all-inclusive" */
  totalSuffix?: string;
  /** prominent trust line under the total (e.g. fees paid direct to college) */
  trustLine?: string;
  footnotes?: string[];
}

/* -------------------------------------------------------------------------- */
/*  8b. GOVERNMENT MBBS FEES — official, and far higher than a flat estimate   */
/* -------------------------------------------------------------------------- */
/**
 * ⚠️ A single flat "government MBBS ≈ ₹6.5L total" figure is wrong, and wrong in
 * the direction that hurts a family planning a budget. Maharashtra's OPEN-category
 * TUITION ALONE is ₹1,52,100 a year — about ₹6.8L over the course, more than the
 * old all-in estimate.
 *
 * Official MH CET Cell notification, government medical colleges, AY 2025-26
 * (per year, ₹):
 *
 *   Component            OPEN(>8L)   SC & ST   VJ & NT   OPEN/EWS(≤8L)+OBC/SEBC
 *                                                          Female      Male
 *   Tuition               1,52,100        0         0           0      76,050
 *   Library                  1,000    1,000     1,000       1,000       1,000
 *   Development              5,000    5,000     5,000       5,000       5,000
 *   Gymkhana                   500      500       500         500         500
 *   Admission (one-time)     1,500    1,500     1,500       1,500       1,500
 *   Library deposit (1×)     2,000    2,000     2,000       2,000       2,000
 *   TOTAL                 1,62,100   10,000    10,000      10,000      86,050
 *   Hostel rent              4,000        —     4,000       4,000       4,000
 *
 * The analyzer collects neither family income nor gender, so it cannot resolve
 * the last two columns. SC & ST is unconditional and IS applied. For General,
 * EWS and OBC we quote the OPEN figure — the most a family could pay — and say
 * plainly in the copy that a scholarship-eligible candidate may pay ₹10,000 a
 * year instead. Never silently assume the waiver applies.
 */
export const MBBS_ACADEMIC_YEARS = 4.5; // 4.5 academic + 1 internship year

export interface GovtFeeSchedule {
  /** annual tuition (the component that actually varies) */
  tuitionPerYear: number;
  /** library + development + gymkhana, per year */
  otherRecurringPerYear: number;
  /** admission fee + library deposit, charged once */
  oneTime: number;
  /** notified hostel rent per year (mess/food is separate and not notified) */
  hostelRentPerYear: number;
}

export const MH_GOVT_FEES_OPEN: GovtFeeSchedule = {
  tuitionPerYear: 152_100,
  otherRecurringPerYear: 6_500,
  oneTime: 3_500,
  hostelRentPerYear: 4_000,
};

/** SC & ST: tuition fully waived — unconditional in the notification. */
export const MH_GOVT_FEES_SC_ST: GovtFeeSchedule = {
  tuitionPerYear: 0,
  otherRecurringPerYear: 6_500,
  oneTime: 3_500,
  hostelRentPerYear: 4_000,
};

/** Mess/food and books are NOT in the notified fee — students pay them directly. */
export const MESS_FOOD_PER_YEAR = 48_000; // ~₹4,000/month
export const BOOKS_MISC_TOTAL = 100_000; // instruments, books, exam & misc, whole course

/** National fallback: government fees vary enormously between states (AIIMS is
 *  ~₹1,600 for the WHOLE course; Tamil Nadu ~₹13,600/yr; Maharashtra ₹1.52L/yr).
 *  Without a sourced schedule for a state we must not pretend to precision. */
export const GOVT_FEES_NATIONAL_INDICATIVE: GovtFeeSchedule = {
  tuitionPerYear: 50_000,
  otherRecurringPerYear: 6_000,
  oneTime: 3_500,
  hostelRentPerYear: 12_000,
};

/**
 * Per-state government MBBS fees. THREE states are now traced to the state's own
 * official document; the rest come from published fee summaries and say so.
 *
 * The spread is the whole point, and it is enormous — Maharashtra charges about
 * 25× Tamil Nadu's tuition for the same government MBBS degree:
 *
 *   Maharashtra   ₹1,52,100/yr tuition · ₹1,62,100/yr total   OFFICIAL
 *   Karnataka        ₹55,000/yr tuition · ₹71,350/yr total    OFFICIAL
 *   Tamil Nadu        ₹6,000/yr tuition · ₹18,073/yr total    OFFICIAL
 *
 * `hostelVerified` is tracked separately because a source can notify tuition
 * without notifying hostel rent — only Maharashtra's notification does both, so
 * the other hostel figures stay flagged as indicative in the UI.
 *
 * Add a state only with a document you can cite. States left out fall back to
 * GOVT_FEES_NATIONAL_INDICATIVE, which is honest about being a guess.
 */
export interface StateGovtFee extends GovtFeeSchedule {
  /** traced to the state's own official notification/prospectus/GO */
  verified: boolean;
  /** is the hostel figure from that same source, or our own estimate? */
  hostelVerified: boolean;
  /** what the numbers came from, shown to the student */
  source: string;
}

export const STATE_GOVT_FEES: Partial<Record<StateName, StateGovtFee>> = {
  Maharashtra: {
    tuitionPerYear: 152_100,
    otherRecurringPerYear: 6_500, // library 1,000 + development 5,000 + gymkhana 500
    oneTime: 3_500, // admission 1,500 + library deposit 2,000
    hostelRentPerYear: 4_000,
    verified: true,
    hostelVerified: true,
    source: 'MH CET Cell fee notification, AY 2025-26',
  },
  Karnataka: {
    tuitionPerYear: 55_000,
    otherRecurringPerYear: 16_350, // university 9,350 + college fees 7,000
    oneTime: 0,
    hostelRentPerYear: 12_000, // not in the GO — our estimate
    verified: true,
    hostelVerified: false,
    source: 'Karnataka Government Order DME/MED/110/RGU2024 (₹64,350 paid to KEA + ₹7,000 college fee = ₹71,350/yr)',
  },
  'Tamil Nadu': {
    tuitionPerYear: 6_000,
    otherRecurringPerYear: 11_073, // special 2,000 + library 1,000 + university 7,473 + LIC 300 + Red Cross 100 + misc 100 + flag day 100
    oneTime: 1_000, // caution deposit (refundable)
    hostelRentPerYear: 12_000, // not in the prospectus — our estimate
    verified: true,
    hostelVerified: false,
    source: 'TN Selection Committee (DME) MBBS prospectus — ₹18,073/yr all-in for government colleges',
  },
  // Published fee summaries, not the states' own notifications:
  Rajasthan: { tuitionPerYear: 73_900, otherRecurringPerYear: 6_000, oneTime: 3_500, hostelRentPerYear: 12_000, verified: false, hostelVerified: false, source: 'published state fee summaries' },
  'Uttar Pradesh': { tuitionPerYear: 45_000, otherRecurringPerYear: 6_000, oneTime: 3_500, hostelRentPerYear: 12_000, verified: false, hostelVerified: false, source: 'published state fee summaries (range ₹36,000–₹54,600)' },
  Gujarat: { tuitionPerYear: 25_000, otherRecurringPerYear: 6_000, oneTime: 3_500, hostelRentPerYear: 12_000, verified: false, hostelVerified: false, source: 'published state fee summaries' },
  // Bihar (published range ₹9,000–₹1,00,000) and Madhya Pradesh are too wide or
  // unsourced to pin — they use the national fallback rather than a made-up number.
};

export function govtFeeSchedule(state: StateName, category: Category): {
  fees: GovtFeeSchedule;
  /** traced to the state's own official fee notification */
  verified: boolean;
  /** the hostel figure specifically — often unnotified even when tuition is */
  hostelVerified: boolean;
  /** the tuition figure belongs to THIS state, not a national average */
  stateSpecific: boolean;
  note: string;
} {
  if (state === 'Maharashtra') {
    const scSt = category === 'SC' || category === 'ST';
    return {
      fees: scSt ? MH_GOVT_FEES_SC_ST : MH_GOVT_FEES_OPEN,
      verified: true,
      hostelVerified: true,
      stateSpecific: true,
      note: scSt
        ? 'MH CET Cell notified fees, AY 2025-26. SC & ST tuition is fully waived — you pay ₹10,000 a year in college fees.'
        : 'MH CET Cell notified fees, AY 2025-26: ₹1,62,100 a year for the open category. If you qualify for the MAHADBT scholarship (family income ≤ ₹8 lakh), this drops to ₹10,000 a year — and to ₹86,050 for OBC/EWS male candidates. Confirm your bracket before budgeting.',
    };
  }

  const sf = STATE_GOVT_FEES[state];
  if (sf) {
    const yearly = sf.tuitionPerYear + sf.otherRecurringPerYear;
    return {
      fees: sf,
      verified: sf.verified,
      hostelVerified: sf.hostelVerified,
      stateSpecific: true,
      note: sf.verified
        ? `${state} government MBBS: about ₹${yearly.toLocaleString('en-IN')} a year in college fees (tuition ₹${sf.tuitionPerYear.toLocaleString(
            'en-IN',
          )}). Source: ${sf.source}. Reserved categories and scholarship-eligible candidates usually pay less — several states waive tuition outright.`
        : `${state} government MBBS tuition is about ₹${sf.tuitionPerYear.toLocaleString(
            'en-IN',
          )} a year, from ${sf.source} — not ${state}'s own notification, so confirm before budgeting. Reserved categories usually pay less or nothing.`,
    };
  }

  return {
    fees: GOVT_FEES_NATIONAL_INDICATIVE,
    verified: false,
    hostelVerified: false,
    stateSpecific: false,
    note: `Government fees vary enormously by state — AIIMS is about ₹1,600 for the entire course, Tamil Nadu about ₹11,000 a year, Maharashtra ₹1,52,100 a year. This is an indicative all-India figure; check ${state}'s official fee notification.`,
  };
}

/** The Government MBBS row, computed for this student rather than hard-coded. */
export function governmentCostEntry(state: StateName, category: Category): CostBreakdownEntry {
  const { fees, verified, hostelVerified, stateSpecific, note } = govtFeeSchedule(state, category);
  const y = MBBS_ACADEMIC_YEARS;
  const tuitionTotal = Math.round(fees.tuitionPerYear * y);
  const collegeOther = Math.round(fees.otherRecurringPerYear * y) + fees.oneTime;
  const hostelTotal = Math.round(fees.hostelRentPerYear * y);
  const messTotal = Math.round(MESS_FOOD_PER_YEAR * y);

  return {
    route: stateSpecific ? `Government MBBS (${state})` : 'Government MBBS (India)',
    currency: '₹',
    components: [
      {
        label: `Tuition (${y} yrs)`,
        amount: tuitionTotal,
        sub:
          fees.tuitionPerYear === 0
            ? 'Tuition waived for your category'
            : `₹${fees.tuitionPerYear.toLocaleString('en-IN')} per year`,
      },
      {
        label: 'Library, development, gymkhana & admission',
        amount: collegeOther,
        sub: `₹${fees.otherRecurringPerYear.toLocaleString('en-IN')}/yr + ₹${fees.oneTime.toLocaleString('en-IN')} one-time`,
      },
      {
        label: `Hostel rent (${y} yrs)`,
        amount: hostelTotal,
        sub: `₹${fees.hostelRentPerYear.toLocaleString('en-IN')} per year${hostelVerified ? ' as notified' : ' (indicative — not in the fee notification)'}`,
      },
      { label: `Mess & food (${y} yrs)`, amount: messTotal, sub: '~₹4,000/month — paid to the mess, not part of the notified college fee' },
      { label: 'Books, instruments, exams & misc.', amount: BOOKS_MISC_TOTAL },
    ],
    note: `${verified ? '' : 'Indicative. '}${note} Still by far the cheapest route — the reason lakhs compete for ~63k government seats.`,
  };
}

/** Cost table for THIS student: the government row is computed, the rest fixed. */
export function buildCostBreakdowns(state: StateName, category: Category): CostBreakdownEntry[] {
  return costBreakdowns.map((c) =>
    c.route.startsWith('Government MBBS') ? governmentCostEntry(state, category) : c,
  );
}

export const costBreakdowns: CostBreakdownEntry[] = [
  {
    route: 'Government MBBS (India)',
    currency: '₹',
    components: [
      { label: `Tuition (${MBBS_ACADEMIC_YEARS} yrs)`, amount: 250_000 },
      { label: 'Hostel & mess', amount: 300_000 },
      { label: 'Misc. / exams', amount: 100_000 },
    ],
    note: 'By far the cheapest route — the reason lakhs compete for ~63k government seats.',
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
    totalFromInr: o.allInclusiveFromInr,
    totalToInr: o.allInclusiveToInr,
    tuitionFromInr: o.headlineFromInr,
    totalSuffix: o.allInclusiveSuffix,
    trustLine: o.trustLine,
    footnotes: o.footnotes,
  })),
];

/* -------------------------------------------------------------------------- */
/*  9. QUALIFYING PERCENTILE LINES — for the "did you qualify" check          */
/* -------------------------------------------------------------------------- */
/**
 * OFFICIAL NTA NEET 2026 qualifying cutoffs (declared 16 July 2026):
 *   General / EWS      50th percentile → 715–213
 *   OBC / SC / ST      40th percentile → 212–177
 *   PwBD (UR/EWS)      45th percentile → 212–194
 *
 * ⚠️ These gate `isQualified()`, which gates EVERY verdict in the engine. The
 * previous values (162 / 133) were a year out of date and told candidates
 * scoring 162–212 that they had qualified when they had not — the single most
 * damaging error the tool could make. 2025's UR line was 144; 2026 jumped to
 * 213 because scores inflated. Re-check against the NTA notice every year.
 */
export const qualifyingScores: Record<Category, number> = {
  General: 213, // 50th percentile — EDIT each year from the NTA notice
  EWS: 213,
  OBC: 177, // 40th percentile
  SC: 177,
  ST: 177,
};