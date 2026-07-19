/**
 * ============================================================================
 * NEET PREDICTION ENGINE
 * ============================================================================
 *
 * Pure functions only. No React, no UI, no side effects. Every function takes
 * plain inputs and returns a typed result object. The UI renders these objects;
 * it never computes anything itself.
 *
 * All data is read from `@/data/neetPredictorData`. To change outcomes, edit
 * that data file — not this engine.
 * ============================================================================
 */

import {
  rankMapping,
  governmentThresholds,
  stateThresholds,
  privateColleges,
  deemedUniversities,
  abroadOptions,
  seatAvailability,
  costBreakdowns,
  qualifyingScores,
  GEORGIA_SAVINGS_INR,
  GEORGIA_SAVINGS_LABEL,
  PRIVATE_INDIA_TYPICAL_INR,
  GEORGIA_TUITION_FROM_INR,
  MAX_SCORE,
  TOTAL_CANDIDATES,
  TOTAL_MBBS_SEATS_INDIA,
  type Category,
  type StateName,
  type AbroadOption,
  type CostBreakdownEntry,
} from '@/data/neetPredictorData';

export { PRIVATE_INDIA_TYPICAL_INR, GEORGIA_SAVINGS_INR, GEORGIA_SAVINGS_LABEL, GEORGIA_TUITION_FROM_INR };

/* -------------------------------------------------------------------------- */
/*  Shared result types                                                       */
/* -------------------------------------------------------------------------- */

export type Chance = 'high' | 'moderate' | 'low' | 'very-low' | 'not-qualified';

export interface PredictionResult {
  key: string;
  title: string;
  chance: Chance;
  /** 0–100 probability estimate for the meter */
  probability: number;
  headline: string;
  detail: string;
  /** indicative fee/cost line for cards that need it (₹ total course) */
  costTotal?: number;
  costLabel?: string;
}

export interface PredictorInputs {
  score: number;
  category: Category;
  state: StateName;
  budget?: number; // total budget in ₹ for the whole course (optional)
}

/* -------------------------------------------------------------------------- */
/*  Formatting helpers (exported — the UI shares them for consistency)        */
/* -------------------------------------------------------------------------- */

export function formatINR(amount: number): string {
  if (amount >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(2)} Cr`;
  if (amount >= 100_000) return `₹${(amount / 100_000).toFixed(1)} L`;
  if (amount >= 1_000) return `₹${(amount / 1_000).toFixed(0)}K`;
  return `₹${amount}`;
}

export function formatRank(rank: number): string {
  return rank.toLocaleString('en-IN');
}

const chanceProbability: Record<Chance, number> = {
  high: 88,
  moderate: 60,
  low: 32,
  'very-low': 12,
  'not-qualified': 0,
};

/* -------------------------------------------------------------------------- */
/*  Core: estimateRank — piecewise linear interpolation                        */
/* -------------------------------------------------------------------------- */

export function estimateRank(score: number): number {
  const clamped = Math.max(0, Math.min(MAX_SCORE, score));

  // rankMapping is sorted descending by score. Find the bracket [hi, lo].
  for (let i = 0; i < rankMapping.length - 1; i++) {
    const hi = rankMapping[i];
    const lo = rankMapping[i + 1];
    if (clamped <= hi.score && clamped >= lo.score) {
      const scoreSpan = hi.score - lo.score;
      if (scoreSpan === 0) return hi.air;
      const t = (hi.score - clamped) / scoreSpan; // 0 at hi, 1 at lo
      const air = hi.air + t * (lo.air - hi.air);
      return Math.max(1, Math.round(air));
    }
  }

  // Above the top anchor → best rank; below the last anchor → extrapolate.
  if (clamped > rankMapping[0].score) return 1;
  const last = rankMapping[rankMapping.length - 1];
  return last.air;
}

/** Rough percentile (higher score → higher percentile). */
export function estimatePercentile(score: number): number {
  const rank = estimateRank(score);
  const pct = 100 * (1 - rank / TOTAL_CANDIDATES);
  return Math.max(0, Math.min(99.99, Number(pct.toFixed(2))));
}

export function isQualified(score: number, category: Category): boolean {
  return score >= qualifyingScores[category];
}

/* -------------------------------------------------------------------------- */
/*  predictGovernmentChance — 15% All India Quota                             */
/* -------------------------------------------------------------------------- */

export function predictGovernmentChance(
  rank: number,
  category: Category,
  score: number,
): PredictionResult {
  const base = {
    key: 'government',
    title: 'Government MBBS — All India Quota (15%)',
    costLabel: 'Total course cost',
    costTotal: sumCost('Government MBBS (India)'),
  };

  if (!isQualified(score, category)) {
    return {
      ...base,
      chance: 'not-qualified',
      probability: 0,
      headline: 'Below the qualifying line',
      detail:
        'You need to cross the NEET qualifying percentile for your category before any government counselling is possible.',
    };
  }

  const t = governmentThresholds.find((g) => g.category === category)!;
  let chance: Chance;
  let headline: string;

  if (rank <= t.safeRank) {
    chance = 'high';
    headline = 'Strong chance at a Government seat';
  } else if (rank <= t.possibleRank) {
    chance = 'moderate';
    headline = 'Possible in later rounds';
  } else if (rank <= t.possibleRank * 1.8) {
    chance = 'low';
    headline = 'Unlikely via AIQ — keep as an outside shot';
  } else {
    chance = 'very-low';
    headline = 'AIQ government seat is very unlikely';
  }

  return {
    ...base,
    chance,
    probability: chanceProbability[chance],
    headline,
    detail: `Your estimated AIR ${formatRank(rank)} vs a ${category} AIQ safe rank around ${formatRank(
      t.safeRank,
    )} (borderline ~${formatRank(t.possibleRank)}). Fill all MCC choices and attend every round.`,
  };
}

/* -------------------------------------------------------------------------- */
/*  predictStateQuota — 85% home-state seats                                  */
/* -------------------------------------------------------------------------- */

export function predictStateQuota(
  rank: number,
  category: Category,
  state: StateName,
  score: number,
): PredictionResult {
  const base = {
    key: 'state',
    title: `Government MBBS — ${state} State Quota (85%)`,
    costLabel: 'Total course cost',
    costTotal: sumCost('Government MBBS (India)'),
  };

  if (!isQualified(score, category)) {
    return {
      ...base,
      chance: 'not-qualified',
      probability: 0,
      headline: 'Below the qualifying line',
      detail: 'Cross the qualifying percentile first — state counselling needs a valid NEET qualification.',
    };
  }

  const st = stateThresholds.find((s) => s.state === state)!;
  const closing = st.closingRank[category];
  let chance: Chance;
  let headline: string;

  if (rank <= closing * 0.7) {
    chance = 'high';
    headline = `Strong chance in ${state} state quota`;
  } else if (rank <= closing) {
    chance = 'moderate';
    headline = 'Borderline — likely in later rounds';
  } else if (rank <= closing * 1.6) {
    chance = 'low';
    headline = 'Unlikely unless cutoffs relax';
  } else {
    chance = 'very-low';
    headline = 'State government seat very unlikely';
  }

  return {
    ...base,
    chance,
    probability: chanceProbability[chance],
    headline,
    detail: `Estimated AIR ${formatRank(rank)} vs ${state} ${category} closing around ${formatRank(
      closing,
    )}.${st.note ? ' ' + st.note : ''}`,
  };
}

/* -------------------------------------------------------------------------- */
/*  predictPrivate — private + deemed (budget-driven)                         */
/* -------------------------------------------------------------------------- */

export function predictPrivate(
  rank: number,
  category: Category,
  state: StateName,
  score: number,
): PredictionResult {
  const p = privateColleges.find((c) => c.state === state)!;
  const total = sumCost('Private MBBS (India)');
  const base = {
    key: 'private',
    title: `Private MBBS — ${state}`,
    costLabel: 'Total course cost (approx.)',
    costTotal: total,
  };

  if (!isQualified(score, category) || rank > p.qualifyingRankCutoff) {
    return {
      ...base,
      chance: 'not-qualified',
      probability: 0,
      headline: 'Not counselling-eligible',
      detail: 'Private admission still needs a valid NEET qualification to enter counselling.',
    };
  }

  return {
    ...base,
    chance: 'high',
    probability: 82,
    headline: 'Open to you — the constraint is budget, not rank',
    detail: `Private seats in ${state} run roughly ${formatINR(p.tuitionPerYearMin)}–${formatINR(
      p.tuitionPerYearMax,
    )} per year in tuition. Admission is fee-driven once you have qualified.`,
  };
}

export function predictDeemed(
  rank: number,
  category: Category,
  score: number,
): PredictionResult {
  const total = sumCost('Deemed University (India)');
  const base = {
    key: 'deemed',
    title: 'Deemed University MBBS',
    costLabel: 'Total course cost (approx.)',
    costTotal: total,
  };

  if (!isQualified(score, category) || rank > deemedUniversities.qualifyingRankCutoff) {
    return {
      ...base,
      chance: 'not-qualified',
      probability: 0,
      headline: 'Not counselling-eligible',
      detail: 'Deemed counselling (MCC) needs a valid NEET qualification.',
    };
  }

  return {
    ...base,
    chance: 'high',
    probability: 80,
    headline: 'Open to you — high fee route',
    detail: `${deemedUniversities.note} Tuition roughly ${formatINR(
      deemedUniversities.tuitionPerYearMin,
    )}–${formatINR(deemedUniversities.tuitionPerYearMax)} per year.`,
  };
}

/* -------------------------------------------------------------------------- */
/*  predictAbroad — Georgia / Timor-Leste (costs computed USD → ₹)            */
/* -------------------------------------------------------------------------- */

export interface AbroadResult extends PredictionResult {
  options: AbroadOption[];
  /** ₹ saved vs a typical Indian private total (computed, for reference) */
  savingsInr: number;
}

export function predictAbroad(rank: number, score: number, category: Category): AbroadResult {
  const options = abroadOptions;

  const qualified = isQualified(score, category);
  const cheapest = options.reduce((a, b) => (a.allInclusiveFromInr < b.allInclusiveFromInr ? a : b));

  return {
    key: 'abroad',
    title: 'MBBS Abroad — NMC & WHO Eligible',
    chance: qualified ? 'high' : 'not-qualified',
    probability: qualified ? 90 : 0,
    headline: qualified
      ? 'A confirmed NMC & WHO Eligible MBBS seat at transparent fees'
      : 'Qualify NEET first — it is mandatory even for MBBS abroad',
    detail: qualified
      ? `No rank race and no donation. All-inclusive cost from about ${formatINR(
          cheapest.allInclusiveFromInr,
        )} — a fraction of Indian private/deemed. NMC & WHO Eligible; ABHA supports FMGE/NExT prep.`
      : 'Since 2018, NEET qualification is compulsory to study MBBS abroad and practise in India afterwards.',
    costLabel: 'All-inclusive cost from',
    costTotal: cheapest.allInclusiveFromInr,
    options,
    savingsInr: GEORGIA_SAVINGS_INR,
  };
}

/* -------------------------------------------------------------------------- */
/*  calculateConfidence — how reliable is this prediction                     */
/* -------------------------------------------------------------------------- */

export interface ConfidenceScore {
  score: number; // 0–100
  level: 'High' | 'Medium' | 'Low';
  reasons: string[];
}

export function calculateConfidence(inputs: PredictorInputs): ConfidenceScore {
  const reasons: string[] = [];
  let score = 90;

  // Volatility band: 550–650 is where a handful of marks swing thousands of ranks.
  if (inputs.score >= 550 && inputs.score <= 650) {
    score -= 25;
    reasons.push('Your score sits in the 550–650 volatility zone where a few marks swing ranks by thousands.');
  } else {
    reasons.push('Your score is outside the steepest part of the rank curve, so the rank estimate is more stable.');
  }

  // Reserved categories depend on documents/validity that we cannot see.
  if (inputs.category !== 'General') {
    score -= 8;
    reasons.push('Reserved-category seats also depend on caste-validity & domicile documents we cannot verify here.');
  }

  // State-specific rules add uncertainty.
  if (inputs.state !== 'Maharashtra') {
    score -= 5;
    reasons.push(`${inputs.state} counselling rules are modelled at all-India average — confirm with the state authority.`);
  } else {
    reasons.push('Maharashtra data is the most current in our dataset.');
  }

  score = Math.max(45, Math.min(95, score));
  const level: ConfidenceScore['level'] = score >= 80 ? 'High' : score >= 62 ? 'Medium' : 'Low';
  reasons.push('These are estimates from last year’s cutoffs — final cutoffs move with paper difficulty and seat matrix.');

  return { score, level, reasons };
}

/* -------------------------------------------------------------------------- */
/*  generateRecommendation — the single "what should I do" verdict            */
/* -------------------------------------------------------------------------- */

export interface Recommendation {
  verdict: string;
  primary: string;
  primaryKey: string;
  reasoning: string;
  backups: string[];
  tone: 'positive' | 'balanced' | 'action';
}

export function generateRecommendation(
  inputs: PredictorInputs,
  results: {
    government: PredictionResult;
    state: PredictionResult;
    abroad: AbroadResult;
  },
): Recommendation {
  const { government, state, abroad } = results;
  const bestGov = Math.max(government.probability, state.probability);

  if (!isQualified(inputs.score, inputs.category)) {
    return {
      verdict: 'Re-attempt NEET or plan a strong 2nd attempt',
      primary: 'Focused re-preparation',
      primaryKey: 'government',
      reasoning:
        'Your score is below the qualifying percentile. A structured drop year (with ABHA’s NEET portal & mock tests) is the highest-return move before considering any admission route.',
      backups: ['ABHA NEET Practice Hub — full mock tests', 'Counselling on realistic target scores'],
      tone: 'action',
    };
  }

  if (bestGov >= 80) {
    return {
      verdict: 'Chase Government MBBS — it is well within reach',
      primary: government.probability >= state.probability ? 'Government AIQ (15%)' : `${inputs.state} State Quota (85%)`,
      primaryKey: government.probability >= state.probability ? 'government' : 'state',
      reasoning:
        'Your rank comfortably clears government cutoffs. Fill both MCC and state-quota choices fully, attend every round, and secure the lowest-cost, highest-value seat available.',
      backups: ['Private / deemed as a paid safety net', 'MBBS abroad only if you miss all government rounds'],
      tone: 'positive',
    };
  }

  if (bestGov >= 45) {
    return {
      verdict: 'Two-track it: pursue Government AND lock an abroad backup',
      primary: 'Government counselling + Georgia backup',
      primaryKey: 'state',
      reasoning:
        'You are in the borderline band — government is possible in later/stray rounds but not guaranteed. Attend counselling seriously, and in parallel reserve an NMC-eligible abroad seat so you are never left without an MBBS.',
      backups: ['MBBS Georgia (European MBBS, transparent fees)', 'BDS/BAMS/BHMS as NEET-based alternatives'],
      tone: 'balanced',
    };
  }

  // Low government chance — the honest budget decision.
  return {
    verdict: 'Compare abroad vs Indian private on total cost + value',
    primary: 'MBBS Georgia 🇬🇪',
    primaryKey: 'abroad',
    reasoning:
      'A government seat is unlikely at this rank. The real choice is between an expensive Indian private/deemed seat and a far cheaper NMC-eligible European MBBS. For most families, MBBS abroad wins on total cost without compromising eligibility to practise in India.',
    backups: ['Indian private / deemed (if budget allows)', 'BDS/BAMS/BHMS if you prefer to stay in India'],
    tone: 'action',
  };
}

/* -------------------------------------------------------------------------- */
/*  generateCostComparison — rank routes by total cost vs budget              */
/* -------------------------------------------------------------------------- */

export interface CostRow {
  route: string;
  /** numeric all-inclusive ₹ used for sorting & budget-fit (nulls skipped) */
  total: number;
  /** display string — a brochure label (e.g. "~₹44L – ₹58L") when present, else formatted total */
  displayTotal: string;
  withinBudget: boolean | null; // null when no budget given
  note: string;
  trustLine?: string;
}

export interface CostComparison {
  budget: number | null;
  rows: CostRow[];
  cheapest: CostRow;
  verdict: string;
}

export function generateCostComparison(
  budget: number | null,
  _results?: unknown,
): CostComparison {
  const rows: CostRow[] = costBreakdowns.map((c) => {
    const total = c.components.reduce((s, x) => s + (x.amount ?? 0), 0);
    return {
      route: c.route,
      total,
      displayTotal: c.totalLabel ?? formatINR(total),
      withinBudget: budget == null ? null : total <= budget,
      note: c.note,
      trustLine: c.trustLine,
    };
  });

  rows.sort((a, b) => a.total - b.total);
  const cheapest = rows[0];

  const isAbroad = (route: string) => route.includes('Georgia') || route.includes('Timor-Leste');
  const cheapestAbroad = rows.filter((r) => isAbroad(r.route)).sort((a, b) => a.total - b.total)[0];

  let verdict: string;
  if (budget == null) {
    verdict = `Cheapest route: ${cheapest.route} at ${cheapest.displayTotal} total. Add a budget above to see what fits.`;
  } else {
    const within = rows.filter((r) => r.withinBudget);
    const nonGovWithin = within.filter((r) => r.route !== 'Government MBBS (India)');

    if (nonGovWithin.length) {
      verdict = `Within your ${formatINR(budget)} budget: ${nonGovWithin.map((r) => r.route).join(', ')}.`;
    } else if (within.length) {
      // only the government seat fits
      verdict = `Only a government seat fits ${formatINR(budget)}${
        cheapestAbroad ? ` — and an abroad route (from ${cheapestAbroad.displayTotal}) is the next most affordable way to widen your options` : ''
      }.`;
    } else {
      // nothing fits, not even a government seat
      const top2 = rows
        .slice(0, 2)
        .map((r) => `${r.route} (${r.displayTotal})`)
        .join(' or ');
      verdict = `No route fully fits ${formatINR(budget)}. The most affordable paths are ${top2} — worth reviewing your budget in a counselling session.`;
    }
  }

  return { budget, rows, cheapest, verdict };
}

/* -------------------------------------------------------------------------- */
/*  generatePersonalizedRoadmap — ordered next steps                         */
/* -------------------------------------------------------------------------- */

export interface RoadmapStep {
  order: number;
  title: string;
  detail: string;
  timing: string;
}

export interface Roadmap {
  headline: string;
  steps: RoadmapStep[];
}

export function generatePersonalizedRoadmap(
  inputs: PredictorInputs,
  recommendation: Recommendation,
): Roadmap {
  if (!isQualified(inputs.score, inputs.category)) {
    return {
      headline: 'Your re-preparation roadmap',
      steps: [
        { order: 1, title: 'Diagnose the gap', detail: 'Take a full ABHA mock test to find exactly which subjects cost you the qualifying line.', timing: 'This week' },
        { order: 2, title: 'Structured drop-year plan', detail: 'Chapter-wise notes, animated PPTs and weekly tests on the ABHA NEET portal.', timing: 'Next 6–8 months' },
        { order: 3, title: 'Book a counselling call', detail: 'Set a realistic target score and a parallel abroad plan as insurance.', timing: 'Now' },
      ],
    };
  }

  const common: RoadmapStep[] = [
    { order: 1, title: 'Register for counselling', detail: 'Create accounts on MCC (mcc.nic.in) AND your state authority — one does not cover the other.', timing: 'As soon as counselling opens' },
    { order: 2, title: 'Fill choices fully', detail: 'Lock every acceptable college; never leave preferences blank — later rounds relax cutoffs.', timing: 'Choice-filling window' },
  ];

  if (recommendation.tone === 'positive') {
    return {
      headline: 'Your government-seat roadmap',
      steps: [
        ...common,
        { order: 3, title: 'Attend every round', detail: 'Do not exit after Round 1 — stray-vacancy rounds often yield better colleges.', timing: 'All rounds' },
        { order: 4, title: 'Keep a paid backup ready', detail: 'Shortlist one private/deemed and one abroad option so a delay never leaves you without a seat.', timing: 'In parallel' },
      ],
    };
  }

  if (recommendation.tone === 'balanced') {
    return {
      headline: 'Your two-track roadmap',
      steps: [
        ...common,
        { order: 3, title: 'Reserve an abroad seat in parallel', detail: 'Begin a Georgia/Kyrgyzstan application now so a confirmed NMC-eligible seat is ready if government rounds miss.', timing: 'Alongside counselling' },
        { order: 4, title: 'Decide by the deadline', detail: 'If government seat comes, take it; otherwise proceed with the reserved abroad seat — no gap year.', timing: 'By final round' },
      ],
    };
  }

  return {
    headline: 'Your best-value roadmap',
    steps: [
      { order: 1, title: 'Run the cost comparison', detail: 'Put Indian private/deemed total cost next to Georgia/Kyrgyzstan — the gap is usually decisive.', timing: 'Today' },
      { order: 2, title: 'Shortlist NMC-eligible abroad universities', detail: 'ABHA filters only NMC & WHO eligible universities so your Indian licence is never at risk.', timing: 'This week' },
      { order: 3, title: 'Book a free counselling session', detail: 'Lock documents, fees and intake so your seat is confirmed for this academic year.', timing: 'Now' },
    ],
  };
}

/* -------------------------------------------------------------------------- */
/*  runFullAnalysis — one call that produces the entire decision object       */
/* -------------------------------------------------------------------------- */

export interface FullAnalysis {
  inputs: PredictorInputs;
  rank: number;
  percentile: number;
  qualified: boolean;
  government: PredictionResult;
  state: PredictionResult;
  private: PredictionResult;
  deemed: PredictionResult;
  abroad: AbroadResult;
  confidence: ConfidenceScore;
  recommendation: Recommendation;
  costComparison: CostComparison;
  roadmap: Roadmap;
  seatAvailability: typeof seatAvailability;
  totalSeats: number;
  costBreakdowns: CostBreakdownEntry[];
}

export function runFullAnalysis(inputs: PredictorInputs): FullAnalysis {
  const rank = estimateRank(inputs.score);
  const percentile = estimatePercentile(inputs.score);
  const qualified = isQualified(inputs.score, inputs.category);

  const government = predictGovernmentChance(rank, inputs.category, inputs.score);
  const state = predictStateQuota(rank, inputs.category, inputs.state, inputs.score);
  const priv = predictPrivate(rank, inputs.category, inputs.state, inputs.score);
  const deemed = predictDeemed(rank, inputs.category, inputs.score);
  const abroad = predictAbroad(rank, inputs.score, inputs.category);

  const confidence = calculateConfidence(inputs);
  const recommendation = generateRecommendation(inputs, { government, state, abroad });
  const costComparison = generateCostComparison(inputs.budget ?? null);
  const roadmap = generatePersonalizedRoadmap(inputs, recommendation);

  return {
    inputs,
    rank,
    percentile,
    qualified,
    government,
    state,
    private: priv,
    deemed,
    abroad,
    confidence,
    recommendation,
    costComparison,
    roadmap,
    seatAvailability,
    totalSeats: TOTAL_MBBS_SEATS_INDIA,
    costBreakdowns,
  };
}

/* -------------------------------------------------------------------------- */
/*  Internal helpers                                                          */
/* -------------------------------------------------------------------------- */

function sumCost(route: string): number {
  const entry = costBreakdowns.find((c) => c.route.startsWith(route.split(' (')[0]));
  return entry ? entry.components.reduce((s, x) => s + (x.amount ?? 0), 0) : 0;
}
