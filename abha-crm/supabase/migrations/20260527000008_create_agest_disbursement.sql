CREATE TABLE agest_disbursement (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  year_number INT NOT NULL CHECK (year_number BETWEEN 1 AND 6),
  amount_usd DECIMAL(10,2) DEFAULT 1000,
  amount_inr DECIMAL(12,2),
  conversion_rate DECIMAL(8,4),
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled','disbursed','hold','cancelled')),
  scheduled_date DATE,
  disbursed_date DATE,
  proof_url TEXT,
  approved_by UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, year_number)
);
