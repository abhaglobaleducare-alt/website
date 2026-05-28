// --- Expenses ---

export const expenseCategories = [
  { value: 'vegetables_fruits', label: '🥦 Vegetables & Fruits' },
  { value: 'cleaning_supplies', label: '🧹 Cleaning Supplies' },
  { value: 'groceries', label: '🛒 Groceries' },
  { value: 'utility_bills', label: '💡 Utility Bills' },
  { value: 'transportation', label: '🚗 Transportation' },
  { value: 'maintenance_repair', label: '🔧 Maintenance & Repair' },
  { value: 'agent_commission', label: '💰 Agent Commission' },
  { value: 'medical', label: '🏥 Medical' },
  { value: 'furniture_equipment', label: '🪑 Furniture & Equipment' },
  { value: 'miscellaneous', label: '📦 Miscellaneous' },
] as const;

export function expenseCategoryLabel(value: string): string {
  return expenseCategories.find((category) => category.value === value)?.label ?? value;
}

// Suggested item names per category (rendered as <datalist> hints).
export const expenseItemSuggestions: Record<string, string[]> = {
  cleaning_supplies: [
    'Washing Powder',
    'Hand Soap',
    'Tile Cleaner',
    'Acid',
    'Toilet Cleaner',
    'Mop/Broom',
    'Dustbin Bags',
    'Glass Cleaner',
    'Disinfectant',
  ],
  groceries: ['Rice', 'Dal', 'Oil', 'Sugar', 'Salt', 'Tea', 'Spices', 'Bread', 'Eggs', 'Flour'],
  utility_bills: ['Electricity', 'Water', 'Gas', 'Internet', 'Phone', 'Cable'],
  transportation: ['Taxi', 'Airport pickup', 'Market trip', 'Hospital', 'University trip'],
  maintenance_repair: [
    'Plumbing',
    'Electrical',
    'Painting',
    'Carpentry',
    'AC service',
    'Pest control',
  ],
};

export const expenseCurrencies = ['GEL', 'INR', 'USD'] as const;
export const expensePaymentTypes = ['cash', 'bank_transfer', 'card', 'upi', 'credit'] as const;
export const expenseApprovalStatuses = ['pending', 'approved', 'rejected'] as const;

export const expenseStatusClasses: Record<string, string> = {
  pending: 'bg-yellow-500/15 text-yellow-200',
  approved: 'bg-emerald-500/15 text-emerald-200',
  rejected: 'bg-red-500/15 text-red-200',
};

// --- Infrastructure ---

export const infraCategories = [
  'furniture',
  'bedding',
  'kitchen',
  'electrical',
  'bathroom',
  'study',
  'common_area',
  'other',
] as const;

export const inventoryConditions = ['good', 'fair', 'damaged', 'missing'] as const;

export const inventoryConditionClasses: Record<string, string> = {
  good: 'bg-emerald-500/15 text-emerald-200',
  fair: 'bg-blue-500/15 text-blue-200',
  damaged: 'bg-orange-500/15 text-orange-200',
  missing: 'bg-red-500/15 text-red-200',
};

// Standard items pre-populated into the master infrastructure inventory.
export const standardInfraItems: { item_name: string; item_category: string }[] = [
  { item_name: 'Beds/Bed Frames', item_category: 'bedding' },
  { item_name: 'Mattresses', item_category: 'bedding' },
  { item_name: 'Pillows', item_category: 'bedding' },
  { item_name: 'Bedsheets (sets)', item_category: 'bedding' },
  { item_name: 'Pillow Covers', item_category: 'bedding' },
  { item_name: 'Blankets/Quilts', item_category: 'bedding' },
  { item_name: 'Bed Covers', item_category: 'bedding' },
  { item_name: 'Wardrobes/Cupboards', item_category: 'furniture' },
  { item_name: 'Study Tables', item_category: 'furniture' },
  { item_name: 'Chairs', item_category: 'furniture' },
  { item_name: 'Side Tables/Nightstands', item_category: 'furniture' },
  { item_name: 'Curtains', item_category: 'furniture' },
  { item_name: 'Mirrors', item_category: 'furniture' },
  { item_name: 'Dining Tables', item_category: 'common_area' },
  { item_name: 'Dining Chairs', item_category: 'common_area' },
  { item_name: 'Sofas', item_category: 'common_area' },
  { item_name: 'TV + Stand', item_category: 'common_area' },
  { item_name: 'Water Dispenser', item_category: 'common_area' },
  { item_name: 'Washing Machine', item_category: 'common_area' },
  { item_name: 'Refrigerator', item_category: 'common_area' },
];

// --- Store ---

export const storeCategories = [
  'cleaning_supplies',
  'groceries',
  'bedding',
  'stationery',
  'medical',
  'other',
] as const;

export const storeTransactionTypes = ['purchase', 'issue', 'return', 'adjustment'] as const;

export const storeTransactionClasses: Record<string, string> = {
  purchase: 'bg-emerald-500/15 text-emerald-200',
  issue: 'bg-orange-500/15 text-orange-200',
  return: 'bg-blue-500/15 text-blue-200',
  adjustment: 'bg-slate-500/15 text-slate-300',
};

export const issuePurposes = [
  'Cleaning',
  'Kitchen',
  'Room maintenance',
  'Common area',
  'Other',
] as const;

export function titleCase(value: string): string {
  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function money(amount: number, currency = 'GEL'): string {
  return `${currency} ${(Math.round((Number(amount) || 0) * 100) / 100).toLocaleString('en-US')}`;
}
