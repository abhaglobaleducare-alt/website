CREATE TABLE fee_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  fee_type TEXT NOT NULL CHECK (fee_type IN ('tuition','hostel','visa','documentation','addon','other')),
  year_number INT CHECK (year_number BETWEEN 1 AND 6),
  description TEXT,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  paid_amount DECIMAL(10,2) DEFAULT 0,
  pending_amount DECIMAL(10,2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
  currency TEXT DEFAULT 'INR' CHECK (currency IN ('INR','USD','GEL','KGS')),
  due_date DATE,
  paid_date DATE,
  payment_mode TEXT CHECK (payment_mode IN ('cash','bank_transfer','upi','cheque','online','wire_transfer')),
  receipt_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','partial','paid','overdue','waived')),
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
