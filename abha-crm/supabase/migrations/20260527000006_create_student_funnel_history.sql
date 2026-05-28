CREATE TABLE student_funnel_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  stage TEXT NOT NULL,
  stage_status TEXT DEFAULT 'completed' CHECK (stage_status IN ('pending','in_progress','completed')),
  stage_notes TEXT,
  documents_url JSONB DEFAULT '[]',
  amount DECIMAL(10,2),
  payment_method TEXT,
  payment_date DATE,
  payment_receipt_url TEXT,
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
