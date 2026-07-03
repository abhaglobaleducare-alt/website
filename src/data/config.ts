/**
 * ABHA Global Educare — Course/fee display configuration.
 *
 * INR figures shown anywhere on course pages are COMPUTED from this rate at
 * render time. Never hardcode converted INR amounts in the data file.
 */
export const EXCHANGE_RATE_INR = 90;

export const RATE_NOTE =
  'Indicative at ₹90/USD — actual bank exchange rate at the time of payment applies';

/** Mandatory footer shown under every course fee table. */
export const FEE_TABLE_FOOTER =
  'All fees in USD as per official university quotation/website (July 2026), subject to change. Hostel, food, insurance & living costs extra unless stated.';

/**
 * ABHA-handled charges shown, in addition to university fees, in the
 * "Other Fees & Expenses" column of every course row. Amounts are shared at the
 * time of counselling — listed here as applicable categories.
 */
export const ABHA_SERVICE_CHARGES = [
  'Admission process charges',
  'Documentation charges',
  'On-arrival services charges',
  'Food & accommodation charges',
];
