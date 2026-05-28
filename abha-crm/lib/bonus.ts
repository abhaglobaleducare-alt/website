import { supabaseAdmin } from './supabase/server';

export interface Slab {
  id: string;
  slab_name: string;
  slab_color: string | null;
  slab_icon: string | null;
  admissions_min: number;
  admissions_max: number | null;
  base_bonus: number;
  extra_bonus: number;
  total_bonus_per_admission: number;
  has_annual_reward: boolean;
  annual_reward_description: string | null;
}

export interface BonusRow {
  id: string;
  staff_id: string;
  student_id: string;
  bonus_type: 'admission' | 'reference_distribution';
  bonus_amount: number;
  status: string;
}

export interface BonusSummary {
  admissionsCount: number;
  currentSlab: Slab | null;
  nextSlab: Slab | null;
  admissionsToNextSlab: number | null;
  slabThreshold: number | null; // denominator for the progress bar
  nextAdmissionEarns: number;
  totalEarned: number;
  totalPending: number;
  totalDisbursed: number;
}

export async function getSlabs(): Promise<Slab[]> {
  const { data } = await supabaseAdmin
    .from('achievement_slabs')
    .select('*')
    .order('admissions_min', { ascending: true });
  return (data ?? []) as Slab[];
}

// Highest slab whose admissions_min <= count. Resolves boundary overlaps
// (e.g. 25 -> Silver, not Bronze) by preferring the higher minimum.
export function slabForCount(slabs: Slab[], count: number): Slab | null {
  let result: Slab | null = null;
  for (const slab of slabs) {
    if (slab.admissions_min <= count) result = slab;
  }
  return result;
}

const PENDING_STATUSES = ['pending_approval', 'approved', 'hold'];

export function summarizeBonuses(slabs: Slab[], bonuses: BonusRow[]): BonusSummary {
  const admissionsCount = bonuses.filter((b) => b.bonus_type === 'admission').length;

  const currentSlab = admissionsCount > 0 ? slabForCount(slabs, admissionsCount) : null;
  const nextAdmissionSlab = slabForCount(slabs, admissionsCount + 1);
  const nextAdmissionEarns = nextAdmissionSlab
    ? Number(nextAdmissionSlab.total_bonus_per_admission)
    : 20000;

  // Progress is measured toward the current slab's max (the next promotion point).
  // Before any admission, target the first slab's ceiling.
  const referenceSlab = currentSlab ?? slabs[0] ?? null;
  const slabThreshold = referenceSlab?.admissions_max ?? null;
  const admissionsToNextSlab =
    slabThreshold !== null ? Math.max(slabThreshold - admissionsCount, 0) : null;
  const nextSlab = slabThreshold !== null ? slabForCount(slabs, slabThreshold + 1) : null;

  let totalPending = 0;
  let totalDisbursed = 0;
  bonuses.forEach((bonus) => {
    const amount = Number(bonus.bonus_amount) || 0;
    if (bonus.status === 'disbursed') totalDisbursed += amount;
    else if (PENDING_STATUSES.includes(bonus.status)) totalPending += amount;
  });

  return {
    admissionsCount,
    currentSlab,
    nextSlab,
    admissionsToNextSlab,
    slabThreshold,
    nextAdmissionEarns,
    totalEarned: totalPending + totalDisbursed,
    totalPending,
    totalDisbursed,
  };
}

// Bonus amount the staff member's NEXT admission would earn, slab-based.
export async function nextAdmissionBonusAmount(staffId: string): Promise<number> {
  const { count } = await supabaseAdmin
    .from('admission_bonus')
    .select('id', { count: 'exact', head: true })
    .eq('staff_id', staffId)
    .eq('bonus_type', 'admission');

  const slabs = await getSlabs();
  const slab = slabForCount(slabs, (count ?? 0) + 1);
  return slab ? Number(slab.total_bonus_per_admission) : 20000;
}
