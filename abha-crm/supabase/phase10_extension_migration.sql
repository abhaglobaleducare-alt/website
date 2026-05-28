-- =====================================================================
-- ABHA CRM — Phase 10 Extension migration (run once in Supabase SQL Editor)
-- =====================================================================
-- Combines every hostel migration that may still be pending:
--   024 — hostel_parent_communication        (pending from base Phase 10)
--   025 — hostel_expenses, agent_commissions  (Phase 10 Extension)
--   026 — hostel_infrastructure, room_inventory, hostel_store,
--         store_transactions                  (Phase 10 Extension)
--
-- NOTE: migrations 027–030 do not exist; 025 and 026 are the only new
-- extension migrations. This script uses CREATE TABLE IF NOT EXISTS so it
-- is safe to run even if you already applied some of these earlier.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 024 — Parent communication log
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hostel_parent_communication (
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

-- ---------------------------------------------------------------------
-- 025 — Expenses + agent commissions
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hostel_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  office_id UUID REFERENCES offices(id),
  expense_date DATE NOT NULL,
  expense_category TEXT NOT NULL CHECK (expense_category IN (
    'vegetables_fruits','cleaning_supplies','groceries',
    'utility_bills','transportation','maintenance_repair',
    'agent_commission','medical','furniture_equipment',
    'miscellaneous'
  )),
  item_name TEXT NOT NULL,
  quantity DECIMAL(10,3),
  unit TEXT,
  unit_cost DECIMAL(10,2),
  total_cost DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'GEL' CHECK (currency IN ('GEL','INR','USD')),
  payment_type TEXT CHECK (payment_type IN (
    'cash','bank_transfer','card','upi','credit'
  )),
  vendor_name TEXT,
  vendor_phone TEXT,
  receipt_url TEXT,
  notes TEXT,
  approved_by UUID REFERENCES users(id),
  approval_status TEXT DEFAULT 'pending' CHECK (
    approval_status IN ('pending','approved','rejected')
  ),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE hostel_expenses ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS agent_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  office_id UUID REFERENCES offices(id),
  agent_name TEXT NOT NULL,
  agent_phone TEXT,
  service_type TEXT NOT NULL,
  service_description TEXT,
  student_id UUID REFERENCES students(id),
  commission_amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'GEL',
  payment_date DATE,
  payment_type TEXT,
  receipt_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (
    status IN ('pending','paid','cancelled')
  ),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE agent_commissions ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------
-- 026 — Infrastructure + room inventory + store + transactions
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hostel_infrastructure (
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

CREATE TABLE IF NOT EXISTS room_inventory (
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

CREATE TABLE IF NOT EXISTS hostel_store (
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

CREATE TABLE IF NOT EXISTS store_transactions (
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

-- =====================================================================
-- End of Phase 10 Extension migration
-- =====================================================================
