CREATE TABLE hostel_infrastructure (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  office_id UUID REFERENCES offices(id),
  item_category TEXT NOT NULL CHECK (item_category IN (
    'furniture','bedding','kitchen','electrical',
    'bathroom','study','common_area','other'
  )),
  item_name TEXT NOT NULL,
  total_quantity INT NOT NULL DEFAULT 0,
  good_condition INT DEFAULT 0,
  damaged INT DEFAULT 0,
  under_repair INT DEFAULT 0,
  disposed INT DEFAULT 0,
  unit_cost DECIMAL(10,2),
  purchase_date DATE,
  last_inspection_date DATE,
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE hostel_infrastructure ENABLE ROW LEVEL SECURITY;

CREATE TABLE room_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES hostel_rooms(id),
  item_name TEXT NOT NULL,
  item_category TEXT NOT NULL,
  quantity_assigned INT DEFAULT 0,
  condition TEXT DEFAULT 'good' CHECK (
    condition IN ('good','fair','damaged','missing')
  ),
  notes TEXT,
  last_checked_date DATE,
  checked_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE room_inventory ENABLE ROW LEVEL SECURITY;

CREATE TABLE hostel_store (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  office_id UUID REFERENCES offices(id),
  item_name TEXT NOT NULL,
  item_category TEXT NOT NULL CHECK (item_category IN (
    'cleaning_supplies','groceries','bedding',
    'stationery','medical','other'
  )),
  unit TEXT,
  current_stock INT DEFAULT 0,
  minimum_stock_alert INT DEFAULT 5,
  unit_cost DECIMAL(10,2),
  storage_location TEXT,
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE hostel_store ENABLE ROW LEVEL SECURITY;

CREATE TABLE store_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_item_id UUID REFERENCES hostel_store(id),
  transaction_type TEXT NOT NULL CHECK (
    transaction_type IN ('purchase','issue','return','adjustment')
  ),
  quantity INT NOT NULL,
  transaction_date DATE NOT NULL,
  purpose TEXT,
  issued_to TEXT,
  room_id UUID REFERENCES hostel_rooms(id),
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE store_transactions ENABLE ROW LEVEL SECURITY;
