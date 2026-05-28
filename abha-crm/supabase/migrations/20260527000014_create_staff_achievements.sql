CREATE TABLE staff_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID NOT NULL REFERENCES users(id) UNIQUE,
  current_admissions_count INT DEFAULT 0,
  current_slab_id UUID REFERENCES achievement_slabs(id),
  admissions_to_next_slab INT DEFAULT 0,
  bonus_at_next_slab DECIMAL(10,2) DEFAULT 0,
  total_bonus_earned DECIMAL(12,2) DEFAULT 0,
  total_bonus_pending DECIMAL(12,2) DEFAULT 0,
  total_bonus_disbursed DECIMAL(12,2) DEFAULT 0,
  last_admission_date DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
