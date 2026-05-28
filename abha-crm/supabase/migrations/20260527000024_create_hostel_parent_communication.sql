CREATE TABLE hostel_parent_communication (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id),
  office_id UUID REFERENCES offices(id),
  communication_date DATE NOT NULL DEFAULT CURRENT_DATE,
  channel TEXT CHECK (channel IN ('call','whatsapp','email','sms','in_person','other')),
  subject TEXT,
  notes TEXT,
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_date DATE,
  logged_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE hostel_parent_communication ENABLE ROW LEVEL SECURITY;
