CREATE TABLE achievement_slabs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slab_name TEXT NOT NULL,
  slab_color TEXT,
  slab_icon TEXT,
  admissions_min INT NOT NULL,
  admissions_max INT,
  base_bonus DECIMAL(10,2) DEFAULT 20000,
  extra_bonus DECIMAL(10,2) DEFAULT 0,
  total_bonus_per_admission DECIMAL(10,2) GENERATED ALWAYS AS (base_bonus + extra_bonus) STORED,
  has_annual_reward BOOLEAN DEFAULT false,
  annual_reward_description TEXT,
  perks JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
