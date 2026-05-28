CREATE TABLE universities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  short_name TEXT,
  country TEXT NOT NULL CHECK (country IN ('Georgia','Kyrgyzstan')),
  city TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','coming_soon','inactive')),
  website TEXT,
  logo_url TEXT,
  mbbs_duration_years INT DEFAULT 6,
  annual_fee_usd DECIMAL(10,2),
  recognized_by JSONB DEFAULT '["MCI","WHO","NMC"]',
  notes TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
