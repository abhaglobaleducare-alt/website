CREATE TABLE leave_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  leave_type TEXT NOT NULL CHECK (leave_type IN ('casual','sick','earned','unpaid','emergency')),
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  days_count INT GENERATED ALWAYS AS (to_date - from_date + 1) STORED,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','cancelled')),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
