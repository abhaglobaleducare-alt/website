CREATE TABLE hostel_room_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id),
  room_id UUID NOT NULL REFERENCES hostel_rooms(id),
  check_in_date DATE,
  expected_check_out DATE,
  actual_check_out DATE,
  monthly_fee_usd DECIMAL(10,2),
  status TEXT DEFAULT 'active' CHECK (status IN ('active','checked_out','transferred')),
  assigned_by UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
