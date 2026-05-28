CREATE TABLE hostel_complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id),
  room_id UUID REFERENCES hostel_rooms(id),
  complaint_title TEXT NOT NULL,
  complaint_description TEXT NOT NULL,
  category TEXT CHECK (category IN ('maintenance','food','facilities','security','medical','other')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('urgent','high','medium','low')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved','closed')),
  resolution_notes TEXT,
  raised_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  handled_by UUID REFERENCES users(id)
);
