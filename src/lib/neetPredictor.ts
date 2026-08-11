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
  EXCHANGE_RATE_INR,
  QUALIFYING_BORDERLINE_SCORE,
  CALIBRATION_LABEL,
  CUTOFF_BASIS_LABEL,
  MAX_SCORE,
  TOTAL_CANDIDATES,
  TOTAL_MBBS_SEATS_INDIA,
  CATEGORY_QUALIFIED_2026,
  NMC_GOVT_MBBS_SEATS_2026,
  NMC_TOTAL_MBBS_SEATS_2026,
  NMC_MEDICAL_COLLEGES_2026,
  NMC_NEW_SEATS_2026,
  AIQ_GOVT_SEATS,
  STATE_GOVT_SEATS,
  RESERVATION_SHARE,
  govtSeatsForCategory,
  type Category,
  type StateName,
  type AbroadOption,
  type CostBreakdownEntry,
  type DataQuality,
} from '@/data/neetPredictorData';

export { PRIVATE_INDIA_TYPICAL_INR, GEORGIA_SAVINGS_INR, GEORGIA_SAVINGS_LABEL, GEORGIA_TUITION_FROM_INR, CALIBRATION_LABEL, CUTOFF_BASIS_LABEL };

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
  /** provenance of the cutoff behind this verdict — shown to the student */
  dataQuality?: DataQuality;
  /** one-line citation of the cutoff used, e.g. "MCC 2025 Round 3: AIR 26,178" */
  cutoffSource?: string;
}

export interface PredictorInputs {
  score: number;
  category: Category;
  state: StateName;
  budget?: number; // total budget in ₹ for the whole course (optional)
  allIndiaRank?: number; // actual AIR if the student already has their result (optional)
  categoryRank?: number; // reserved-category rank from the rank card (optional)
}

export type AirSource = 'actual' | 'estimated';

export interface RankRange {
  from: number;
  to: number;
  /** true when the score is in the low-precision qualifying-borderline zone */
  borderline: boolean;
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

/** Currency-aware money formatter. `inr` is the base ₹ amount. */
export function money(inr: number, currency: 'INR' | 'USD' = 'INR'): string {
  if (currency === 'USD') {
    const usd = Math.round(inr / EXCHANGE_RATE_INR);
    return `$${usd.toLocaleString('en-US')}`;
  }
  return formatINR(inr);
}

/**
 * Graduated chance + probability from a rank against a "safe" and "possible"
 * (borderline) rank. Probability decays continuously so a rank far beyond the
 * cutoff reads ~1–2% (not a flat bucket value). Fixes the "everyone sees 12%"
 * problem for very low scores.
 */
function graduatedChance(rank: number, safeR: number, possibleR: number): { chance: Chance; probability: number } {
  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
  const lerp = (x: number, x0: number, x1: number, y0: number, y1: number) =>
    y0 + (y1 - y0) * clamp((x - x0) / (x1 - x0 || 1), 0, 1);

  if (rank <= safeR) return { chance: 'high', probability: Math.round(clamp(lerp(rank, 0, safeR, 95, 78), 78, 96)) };
  if (rank <= possibleR) return { chance: 'moderate', probability: Math.round(lerp(rank, safeR, possibleR, 68, 50)) };
  if (rank <= possibleR * 1.8) return { chance: 'low', probability: Math.round(lerp(rank, possibleR, possibleR * 1.8, 45, 22)) };
  if (rank <= possibleR * 4) return { chance: 'very-low', probability: Math.round(lerp(rank, possibleR * 1.8, possibleR * 4, 18, 4)) };
  return { chance: 'very-low', probability: Math.max(1, Math.round(lerp(rank, possibleR * 4, possibleR * 10, 4, 1))) };
}

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

/** Round to a human-friendly figure (never false precision). */
function roundNice(n: number): number {
  if (n < 1_000) return Math.max(1, Math.round(n / 50) * 50);
  if (n < 20_000) return Math.round(n / 500) * 500;
  if (n < 100_000) return Math.round(n / 1_000) * 1_000;
  return Math.round(n / 5_000) * 5_000;
}

/**
 * Estimated AIR as a RANGE (± proportional to local anchor spacing) — never a
 * false-precision single number. e.g. a score between two widely-spaced anchors
 * gets a wider band. Used for DISPLAY; verdict logic uses the point estimate.
 */
export function estimateRankRange(score: number): RankRange {
  const mid = estimateRank(score);
  const clamped = Math.max(0, Math.min(MAX_SCORE, score));
  let span = mid * 0.3; // fallback when beyond the anchor ends
  for (let i = 0; i < rankMapping.length - 1; i++) {
    const hi = rankMapping[i];
    const lo = rankMapping[i + 1];
    if (clamped <= hi.score && clamped >= lo.score) {
      span = lo.air - hi.air;
      break;
    }
  }
  const half = Math.max(200, 0.15 * span);
  return {
    from: Math.max(1, roundNice(mid - half)),
    to: roundNice(mid + half),
    borderline: score < QUALIFYING_BORDERLINE_SCORE,
  };
}

// Dev-only sanity asserts — these MUST hold for the NEET-2026 anchors (see the
// ⚠️ validation comment above rankMapping). Warns loudly if a future edit drifts.
if (process.env.NODE_ENV !== 'production') {
  const checks: Array<[number, number]> = [
    [600, 10_200],
    [562, 28_000],
    [551, 35_000],
    [501, 90_780],
    [450, 140_000],
    [300, 330_000],
  ];
  for (const [s, exp] of checks) {
    const got = estimateRank(s);
    if (Math.abs(got - exp) / exp > 0.2) {
      // eslint-disable-next-line no-console
      console.warn(`[air-calibration] anchor sanity drift: score ${s} -> ${got} (expected ~${exp})`);
    }
  }
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
  airSource: AirSource = 'estimated',
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
  const { chance, probability } = graduatedChance(rank, t.safeRank, t.possibleRank);
  const headline =
    chance === 'high'
      ? 'Realistic Government MBBS chance via AIQ'
      : chance === 'moderate'
        ? 'Realistic Government chance — likely in later rounds'
        : chance === 'low'
          ? 'Government unlikely via AIQ — explore state quota, private & abroad'
          : 'Government MBBS highly unlikely at this rank — focus on state quota / private / abroad';

  // Ground the verdict in the published closing rank rather than a bare number.
  const cutoffSource = t.closingRank2025
    ? `MCC 2025 Round 3 · ${category === 'General' ? 'UR' : category} government MBBS closed at AIR ${formatRank(
        t.closingRank2025,
      )}`
    : `${category} AIQ band — ABHA office estimate, not a published MCC closing rank`;

  return {
    ...base,
    chance,
    probability,
    headline,
    dataQuality: t.dataQuality,
    cutoffSource,
    detail: `Your ${airLabel(airSource)} AIR ${formatRank(rank)} vs a ${category} AIQ safe rank around ${formatRank(
      t.safeRank,
    )} (borderline ~${formatRank(t.possibleRank)}). ${cutoffSource}; we uplift it for the ${formatRank(
      NMC_NEW_SEATS_2026,
    )} new MBBS seats in the NMC 2026 matrix. The 15% AIQ is only about ${formatRank(
      AIQ_GOVT_SEATS,
    )} government seats nationally — fill all MCC choices and attend every round.`,
  };
}

/** Copy helper so we never call a student's real AIR an "estimate". */
function airLabel(source: AirSource): string {
  return source === 'actual' ? 'actual' : 'estimated';
}

/* -------------------------------------------------------------------------- */
/*  predictStateQuota — 85% home-state seats                                  */
/* -------------------------------------------------------------------------- */

export function predictStateQuota(
  rank: number,
  category: Category,
  state: StateName,
  score: number,
  categoryRank?: number,
  airSource: AirSource = 'estimated',
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
  const { chance, probability } = graduatedChance(rank, closing * 0.7, closing);
  const headline =
    chance === 'high'
      ? `Strong chance in ${state} state quota`
      : chance === 'moderate'
        ? 'Borderline — likely in later rounds'
        : chance === 'low'
          ? 'Unlikely unless cutoffs relax'
          : 'State government seat highly unlikely at this rank';

  // Reserved-category guidance: use the Category Rank when the student provides
  // it; otherwise nudge them to add it (we never fabricate a category rank).
  let reservedNote = '';
  if (category !== 'General') {
    reservedNote =
      categoryRank && categoryRank > 0
        ? ` Using your ${category} category rank (${formatRank(categoryRank)}) for reserved-seat guidance.`
        : ` For precise reserved-seat guidance, enter your Category Rank from the rank card.`;
  }

  // Provenance: only Maharashtra is traced to a published state closing rank.
  const cutoffSource =
    st.dataQuality === 'verified'
      ? `${st.authority} ${st.sourceYear} government MBBS ${category} closing rank, uplifted for the 2026 seat matrix`
      : `${st.authority} has not published a closing rank we could trace — this ${state} band is an ABHA office estimate, so treat it as directional`;

  // The 85% state quota is where most government seats actually are — say so.
  const quotaNote = ` The 85% state quota holds roughly ${formatRank(
    STATE_GOVT_SEATS,
  )} of India's ${formatRank(NMC_GOVT_MBBS_SEATS_2026)} government MBBS seats, so domicile is usually your strongest card.`;

  return {
    ...base,
    chance,
    probability,
    headline,
    dataQuality: st.dataQuality,
    cutoffSource,
    detail: `${airLabel(airSource) === 'actual' ? 'Actual' : 'Estimated'} AIR ${formatRank(
      rank,
    )} vs ${state} ${category} closing around ${formatRank(closing)} (${cutoffSource}).${quotaNote}${
      st.note ? ' ' + st.note : ''
    }${reservedNote}`,
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
/*  generateSeatReality — "63,296 seats, so why do I need AIR 26,000?"        */
/* -------------------------------------------------------------------------- */
/**
 * The most-asked question on the tool, answered with arithmetic instead of
 * opinion: quota split first, then reservation. Every figure is derived from
 * the NMC 2026 seat matrix, so this can never contradict the Seat Reality Check.
 */
export interface SeatReality {
  headline: string;
  /** government MBBS seats realistically open to THIS student's category */
  categorySeats: number;
  categorySharePct: number;
  aiqSeats: number;
  stateSeats: number;
  /** candidates who qualified NEET 2026 in this category (official NTA) */
  categoryQualified: number;
  /** how many qualified candidates chase each open government seat */
  competitionRatio: number;
  points: string[];
}

export function generateSeatReality(category: Category): SeatReality {
  const categorySeats = govtSeatsForCategory(category);
  const categoryQualified = CATEGORY_QUALIFIED_2026[category];
  const competitionRatio = Math.round(categoryQualified / categorySeats);
  const sharePct = Math.round(RESERVATION_SHARE[category] * 1000) / 10;
  const catLabel = category === 'General' ? 'unreserved (open)' : category;

  return {
    headline: `${formatRank(
      NMC_GOVT_MBBS_SEATS_2026,
    )} government MBBS seats exist — but only about ${formatRank(categorySeats)} of them are ${catLabel}`,
    categorySeats,
    categorySharePct: sharePct,
    aiqSeats: AIQ_GOVT_SEATS,
    stateSeats: STATE_GOVT_SEATS,
    categoryQualified,
    competitionRatio,
    points: [
      `India has ${formatRank(NMC_TOTAL_MBBS_SEATS_2026)} MBBS seats across ${NMC_MEDICAL_COLLEGES_2026} colleges in the NMC 2026 matrix — ${formatRank(
        NMC_GOVT_MBBS_SEATS_2026,
      )} of them government. That is ${formatRank(NMC_NEW_SEATS_2026)} more seats than 2025.`,
      `Every government seat splits two ways first: 15% All India Quota (~${formatRank(
        AIQ_GOVT_SEATS,
      )} seats, open to any state) and 85% State Quota (~${formatRank(
        STATE_GOVT_SEATS,
      )} seats, for domicile candidates only).`,
      `Reservation then applies inside each quota — SC 15%, ST 7.5%, OBC-NCL 27%, EWS 10%, leaving 40.5% unreserved. As a ${catLabel} candidate you are competing for roughly ${sharePct}% of those seats, not 100%.`,
      `${formatRank(categoryQualified)} candidates qualified NEET 2026 in your category — about ${competitionRatio} qualified candidates for every ${catLabel} government seat.`,
      `That ratio, not the headline seat count, is why the last ${
        category === 'General' ? 'General' : category
      } AIQ government seat closes where it does.`,
    ],
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

  // State-specific rules add uncertainty — driven by real provenance, not by a
  // hardcoded state name, so adding a verified state automatically lifts this.
  const st = stateThresholds.find((s) => s.state === inputs.state)!;
  if (st.dataQuality === 'verified') {
    reasons.push(
      `${inputs.state} closing ranks are traced to published ${st.authority} ${st.sourceYear} results — our best-sourced state.`,
    );
  } else {
    score -= 10;
    reasons.push(
      `${inputs.state} closing ranks are an ABHA office estimate, not a published ${st.authority} figure — confirm with the state authority.`,
    );
  }

  // AIQ provenance for the student's own category (EWS is modelled, not published).
  const gov = governmentThresholds.find((g) => g.category === inputs.category)!;
  if (gov.dataQuality === 'verified' && gov.closingRank2025) {
    reasons.push(
      `Your ${inputs.category} All India Quota band is anchored to the published MCC 2025 closing rank (AIR ${formatRank(
        gov.closingRank2025,
      )}).`,
    );
  } else {
    score -= 6;
    reasons.push(
      `MCC does not publish a single headline ${inputs.category} AIQ closing rank — that band is estimated, so read it as a range.`,
    );
  }

  score = Math.max(45, Math.min(95, score));
  const level: ConfidenceScore['level'] = score >= 80 ? 'High' : score >= 62 ? 'Medium' : 'Low';
  reasons.push(
    `Rank estimates are calibrated to the official NEET 2026 result distribution. ${CUTOFF_BASIS_LABEL}.`,
  );

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

/** Budget assessment against the ALL-INCLUSIVE total:
 *  - 'yes'     : budget covers the full all-inclusive total
 *  - 'partial' : budget covers tuition/college fees but NOT the full total
 *  - 'no'      : budget is below even tuition
 *  - null      : no budget entered */
export type BudgetFit = 'yes' | 'partial' | 'no' | null;

export interface CostRow {
  route: string;
  /** numeric all-inclusive ₹ used for sorting & budget-fit (nulls skipped) */
  total: number;
  /** display string — a brochure label (e.g. "~₹44L – ₹58L") when present, else formatted total */
  displayTotal: string;
  /** numeric ₹ range for currency-aware rendering (abroad routes) */
  totalFromInr?: number;
  totalToInr?: number;
  totalSuffix?: string;
  /** ₹ tuition / direct-college fees, when the route has a tuition-vs-total split */
  tuitionFromInr?: number;
  /** true only when budget covers the FULL all-inclusive total */
  withinBudget: boolean | null;
  /** three-state budget assessment vs the all-inclusive total */
  budgetFit: BudgetFit;
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
    // 3-state assessment vs the ALL-INCLUSIVE total (matches the "enter a TOTAL
    // budget" ask on the form — never compares a total against tuition alone).
    let budgetFit: BudgetFit = null;
    if (budget != null) {
      if (total <= budget) budgetFit = 'yes';
      else if (c.tuitionFromInr != null && c.tuitionFromInr <= budget) budgetFit = 'partial';
      else budgetFit = 'no';
    }
    return {
      route: c.route,
      total,
      displayTotal: c.totalLabel ?? formatINR(total),
      totalFromInr: c.totalFromInr,
      totalToInr: c.totalToInr,
      totalSuffix: c.totalSuffix,
      tuitionFromInr: c.tuitionFromInr,
      withinBudget: budget == null ? null : budgetFit === 'yes',
      budgetFit,
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
    const nonGovWithin = rows.filter((r) => r.budgetFit === 'yes' && r.route !== 'Government MBBS (India)');
    // cheapest abroad route the budget at least covers tuition/college fees for
    const partialAbroad = rows
      .filter((r) => r.budgetFit === 'partial' && isAbroad(r.route) && r.tuitionFromInr != null)
      .sort((a, b) => a.total - b.total)[0];

    if (nonGovWithin.length) {
      verdict = `Your ${formatINR(budget)} total budget covers the all-inclusive cost of: ${nonGovWithin
        .map((r) => r.route)
        .join(', ')}.`;
    } else if (partialAbroad) {
      // Honest middle: budget covers tuition/college fees but not the full total.
      verdict = `Your ${formatINR(budget)} budget covers the tuition / college fees for ${partialAbroad.route} (${formatINR(
        partialAbroad.tuitionFromInr!,
      )}), but the full all-inclusive total is about ${formatINR(
        partialAbroad.total,
      )}. Education-loan & instalment options can be discussed at counselling to bridge the gap.`;
    } else if (rows.some((r) => r.budgetFit === 'yes')) {
      verdict = `Only a government seat fits ${formatINR(budget)} in full${
        cheapestAbroad ? ` — an abroad route (from ${cheapestAbroad.displayTotal}) is the next most affordable way to widen your options` : ''
      }.`;
    } else {
      const top2 = rows
        .slice(0, 2)
        .map((r) => `${r.route} (${r.displayTotal})`)
        .join(' or ');
      verdict = `No route's all-inclusive total fits ${formatINR(budget)}. The most affordable paths are ${top2} — worth reviewing your budget & loan options in a counselling session.`;
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
        { order: 3, title: 'Reserve an abroad seat in parallel', detail: 'Begin a Georgia/Timor-Leste application now so a confirmed NMC-eligible seat is ready if government rounds miss.', timing: 'Alongside counselling' },
        { order: 4, title: 'Decide by the deadline', detail: 'If government seat comes, take it; otherwise proceed with the reserved abroad seat — no gap year.', timing: 'By final round' },
      ],
    };
  }

  return {
    headline: 'Your best-value roadmap',
    steps: [
      { order: 1, title: 'Run the cost comparison', detail: 'Put Indian private/deemed total cost next to Georgia/Timor-Leste — the gap is usually decisive.', timing: 'Today' },
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
  /** display range for the rank (point value = `rank`) */
  rankRange: RankRange;
  /** whether `rank` came from the student's actual AIR or our estimate */
  airSource: AirSource;
  /** "Calibrated to the official NEET 2026 result distribution" */
  calibrationLabel: string;
  /** where the college cutoffs (not the rank curve) are sourced from */
  cutoffBasisLabel: string;
  /** the quota + reservation arithmetic behind the seat count */
  seatReality: SeatReality;
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
  // Use the student's actual AIR when provided; otherwise estimate from score.
  const usingActual = !!(inputs.allIndiaRank && inputs.allIndiaRank > 0);
  const rank = usingActual ? Math.round(inputs.allIndiaRank!) : estimateRank(inputs.score);
  const airSource: AirSource = usingActual ? 'actual' : 'estimated';
  const rankRange: RankRange = usingActual
    ? { from: rank, to: rank, borderline: false }
    : estimateRankRange(inputs.score);
  const percentile = estimatePercentile(inputs.score);
  const qualified = isQualified(inputs.score, inputs.category);

  const government = predictGovernmentChance(rank, inputs.category, inputs.score, airSource);
  const state = predictStateQuota(rank, inputs.category, inputs.state, inputs.score, inputs.categoryRank, airSource);
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
    rankRange,
    airSource,
    calibrationLabel: CALIBRATION_LABEL,
    cutoffBasisLabel: CUTOFF_BASIS_LABEL,
    seatReality: generateSeatReality(inputs.category),
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
/*  Legal-safe phrasing (never "guaranteed" / "not possible" / "you will get") */
/* -------------------------------------------------------------------------- */

export function chancePhrase(chance: Chance): string {
  switch (chance) {
    case 'high':
      return 'a strong likelihood';
    case 'moderate':
      return 'a moderate chance';
    case 'low':
      return 'a low likelihood';
    case 'very-low':
      return 'an unlikely chance based on historical trends';
    case 'not-qualified':
    default:
      return 'no eligibility yet (below the qualifying line)';
  }
}

/** One-line teaser shown above the registration wall, before full results. */
export function previewLine(a: FullAnalysis): string {
  if (!a.qualified) {
    return 'Based on your score, you are currently below the NEET qualifying line for your category — but there are still MBBS pathways worth exploring. Unlock the full analysis to see them.';
  }
  const best = a.government.probability >= a.state.probability ? a.government : a.state;
  return `Based on your score, you have ${chancePhrase(
    best.chance,
  )} of a Government MBBS seat. Unlock the full analysis for your rank, every route, costs and a personalised roadmap.`;
}

/* -------------------------------------------------------------------------- */
/*  Internal helpers                                                          */
/* -------------------------------------------------------------------------- */

function sumCost(route: string): number {
  const entry = costBreakdowns.find((c) => c.route.startsWith(route.split(' (')[0]));
  return entry ? entry.components.reduce((s, x) => s + (x.amount ?? 0), 0) : 0;
}
