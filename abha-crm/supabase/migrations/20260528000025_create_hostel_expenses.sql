CREATE TABLE hostel_expenses (
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

CREATE TABLE agent_commissions (
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
