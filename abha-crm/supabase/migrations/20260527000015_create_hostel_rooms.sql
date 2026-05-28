CREATE TABLE hostel_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_number TEXT NOT NULL,
  floor_number INT,
  room_type TEXT CHECK (room_type IN ('single','double','triple','dormitory')),
  capacity INT DEFAULT 1,
  current_occupancy INT DEFAULT 0,
  monthly_rent_usd DECIMAL(10,2),
  amenities JSONB DEFAULT '[]',
  status TEXT DEFAULT 'available' CHECK (status IN ('available','occupied','maintenance','reserved')),
  office_id UUID REFERENCES offices(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(room_number, office_id)
);
