/**
 * Copy for the NEET analyzer budget field + transparency advisory.
 * Kept here (not inline) so it can be localised later. NONE of this changes any
 * fee/pricing figure — it is form guidance only.
 */

export const BUDGET_LABEL = 'Family Budget — Total for the full course';
export const BUDGET_LABEL_OPTIONAL = 'optional · in ₹ Lakh';

/** Always-visible helper under the label (not a tooltip). */
export const BUDGET_HELPER =
  'Please enter your total budget: Tuition Fees + Hostel/Living + Food + Visa & Documentation + Other charges = Total Budget. Not tuition alone — this helps us recommend honestly.';

/** Small visual formula strip. */
export const BUDGET_FORMULA_PARTS = ['Tuition', 'Living', 'Food', 'Visa/Docs', 'Other'];
export const BUDGET_FORMULA_TOTAL = 'Total';

export const BUDGET_PLACEHOLDER = 'Total budget e.g. 40';

/** Transparency advisory shown above the budget field. */
export const BUDGET_ADVISORY =
  'A friendly transparency note: If any consultancy quotes a very low all-inclusive package (e.g. ₹15–18 Lakhs for the complete MBBS abroad course), please verify what it actually covers. Such quotes are often tuition-only — hostel, food, visa, documentation & other charges may appear after admission as hidden costs. Always ask for a written, itemized breakup before paying anyone — including us. ABHA shows you the complete all-inclusive cost upfront.';

/** Phrases within BUDGET_ADVISORY to emphasise (bold) when rendered. */
export const BUDGET_ADVISORY_BOLD = [
  'A friendly transparency note:',
  'very low all-inclusive package',
  'often tuition-only',
  'hidden costs',
  'written, itemized breakup',
  'complete all-inclusive cost upfront',
];
