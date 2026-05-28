CREATE TABLE hostel_daily_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  log_date DATE NOT NULL,
  office_id UUID REFERENCES offices(id),
  students_present INT DEFAULT 0,
  students_absent INT DEFAULT 0,
  new_arrivals INT DEFAULT 0,
  departures INT DEFAULT 0,
  issues TEXT,
  meals_served TEXT,
  notable_events TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(log_date, office_id)
);
