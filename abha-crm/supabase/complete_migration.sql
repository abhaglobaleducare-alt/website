-- === 20260527000001_create_offices.sql ===
CREATE TABLE offices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  geo_latitude DECIMAL(10,8),
  geo_longitude DECIMAL(11,8),
  geo_radius_meters INT DEFAULT 300,
  address TEXT,
  phone TEXT,
  email TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- === 20260527000002_create_users.sql ===
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('director','admin','staff','hostel_manager')),
  designation TEXT,
  office_id UUID REFERENCES offices(id),
  is_bonus_eligible BOOLEAN DEFAULT false,
  bonus_type TEXT CHECK (bonus_type IN ('admission','reference_distribution','none')),
  joining_date DATE,
  base_salary DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','inactive','on_leave','pending_invite')),
  invite_token TEXT UNIQUE,
  invite_sent_at TIMESTAMPTZ,
  invite_expires_at TIMESTAMPTZ,
  avatar_url TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- === 20260527000003_create_attendance.sql ===
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  date DATE NOT NULL,
  check_in_time TIMESTAMPTZ,
  check_in_lat DECIMAL(10,8),
  check_in_lng DECIMAL(11,8),
  check_in_address TEXT,
  check_in_selfie_url TEXT,
  is_within_geofence BOOLEAN DEFAULT false,
  check_out_time TIMESTAMPTZ,
  check_out_lat DECIMAL(10,8),
  check_out_lng DECIMAL(11,8),
  daily_summary TEXT,
  goals_accomplished JSONB DEFAULT '[]',
  work_hours DECIMAL(4,2),
  work_type TEXT DEFAULT 'office' CHECK (work_type IN ('office','field','remote','leave')),
  admin_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- === 20260527000004_create_goals.sql ===
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  parent_goal_id UUID REFERENCES goals(id),
  title TEXT NOT NULL,
  description TEXT,
  goal_type TEXT NOT NULL CHECK (goal_type IN ('yearly','quarterly','monthly','weekly','daily')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('critical','high','medium','low')),
  priority_score INT DEFAULT 50 CHECK (priority_score BETWEEN 1 AND 100),
  start_date DATE,
  due_date DATE,
  reminder_time TIME,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','in_progress','completed','overdue','cancelled')),
  completion_notes TEXT,
  completed_at TIMESTAMPTZ,
  created_by UUID REFERENCES users(id),
  assigned_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- === 20260527000005_create_students.sql ===
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_code TEXT UNIQUE,
  full_name TEXT NOT NULL,
  father_name TEXT,
  mother_name TEXT,
  dob DATE,
  gender TEXT CHECK (gender IN ('male','female','other')),
  photo_url TEXT,
  email TEXT,
  phone TEXT NOT NULL,
  parent_phone TEXT,
  whatsapp TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  reference_source TEXT CHECK (reference_source IN ('walk-in','referral','b2b','social','coaching','agent','other')),
  reference_details TEXT,
  referrer_student_id UUID REFERENCES students(id),
  reference_partner_id UUID,
  assigned_staff_id UUID REFERENCES users(id),
  office_id UUID REFERENCES offices(id),
  funnel_stage TEXT DEFAULT 'lead_generated',
  current_stage_updated_at TIMESTAMPTZ DEFAULT NOW(),
  neet_score INT,
  neet_year INT,
  twelfth_percentage DECIMAL(5,2),
  board TEXT,
  school_name TEXT,
  selected_university TEXT CHECK (selected_university IN (
    'European University (EEU)',
    'East West University',
    'Alte University',
    'SEU Georgia',
    'International European University (IEU)',
    'Avicenna International Medical University',
    'Coming Soon - Kyrgyzstan',
    'Other'
  )),
  selected_country TEXT CHECK (selected_country IN ('Georgia','Kyrgyzstan','Other')),
  intake_year INT,
  intake_month TEXT,
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- === 20260527000006_create_student_funnel_history.sql ===
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

-- === 20260527000007_create_fee_schedule.sql ===
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

-- === 20260527000008_create_agest_disbursement.sql ===
CREATE TABLE agest_disbursement (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  year_number INT NOT NULL CHECK (year_number BETWEEN 1 AND 6),
  amount_usd DECIMAL(10,2) DEFAULT 1000,
  amount_inr DECIMAL(12,2),
  conversion_rate DECIMAL(8,4),
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled','disbursed','hold','cancelled')),
  scheduled_date DATE,
  disbursed_date DATE,
  proof_url TEXT,
  approved_by UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, year_number)
);

-- === 20260527000009_create_leads.sql ===
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  parent_phone TEXT,
  email TEXT,
  city TEXT,
  state TEXT,
  neet_score INT,
  neet_year INT,
  interest TEXT CHECK (interest IN ('mbbs_abroad_georgia','mbbs_abroad_kyrgyzstan','mbbs_abroad_both','neet_coaching','both','other')),
  preferred_country TEXT CHECK (preferred_country IN ('Georgia','Kyrgyzstan','Any','Other')),
  lead_source TEXT CHECK (lead_source IN ('walk-in','phone','social','b2b','referral','whatsapp','excel_upload','other')),
  lead_status TEXT DEFAULT 'new' CHECK (lead_status IN ('new','contacted','qualified','converted','lost','not_interested')),
  follow_up_date DATE,
  notes TEXT,
  assigned_staff_id UUID REFERENCES users(id),
  office_id UUID REFERENCES offices(id),
  b2b_partner_id UUID,
  uploaded_via TEXT DEFAULT 'manual' CHECK (uploaded_via IN ('manual','excel')),
  converted_to_student_id UUID REFERENCES students(id),
  converted_at TIMESTAMPTZ,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- === 20260527000010_create_b2b_partners.sql ===
CREATE TABLE b2b_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_name TEXT NOT NULL,
  partner_type TEXT CHECK (partner_type IN ('coaching_class','consultant','agent','school','other')),
  contact_person TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  city TEXT,
  state TEXT,
  address TEXT,
  commission_percent DECIMAL(5,2) DEFAULT 0,
  agreement_url TEXT,
  total_referrals INT DEFAULT 0,
  total_conversions INT DEFAULT 0,
  preferred_country TEXT CHECK (preferred_country IN ('Georgia','Kyrgyzstan','Both','Any')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active','inactive','blacklisted')),
  added_by UUID REFERENCES users(id),
  office_id UUID REFERENCES offices(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- === 20260527000011_create_leave_applications.sql ===
CREATE TABLE leave_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  leave_type TEXT NOT NULL CHECK (leave_type IN ('casual','sick','earned','unpaid','emergency')),
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  days_count INT GENERATED ALWAYS AS (to_date - from_date + 1) STORED,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','cancelled')),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- === 20260527000012_create_admission_bonus.sql ===
CREATE TABLE admission_bonus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID NOT NULL REFERENCES users(id),
  student_id UUID NOT NULL REFERENCES students(id),
  bonus_type TEXT NOT NULL CHECK (bonus_type IN ('admission','reference_distribution')),
  bonus_amount DECIMAL(10,2) NOT NULL,
  trigger_event TEXT DEFAULT 'student_reached_university',
  eligible_date DATE,
  status TEXT DEFAULT 'pending_approval' CHECK (status IN ('pending_approval','approved','disbursed','hold','cancelled')),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  disbursed_date DATE,
  payment_proof_url TEXT,
  notes TEXT,
  referrer_student_id UUID REFERENCES students(id),
  referrer_name TEXT,
  referrer_phone TEXT,
  referrer_amount DECIMAL(10,2),
  referrer_paid BOOLEAN DEFAULT false,
  referrer_paid_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(staff_id, student_id, bonus_type)
);

-- === 20260527000013_create_achievement_slabs.sql ===
CREATE TABLE achievement_slabs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slab_name TEXT NOT NULL,
  slab_color TEXT,
  slab_icon TEXT,
  admissions_min INT NOT NULL,
  admissions_max INT,
  base_bonus DECIMAL(10,2) DEFAULT 20000,
  extra_bonus DECIMAL(10,2) DEFAULT 0,
  total_bonus_per_admission DECIMAL(10,2) GENERATED ALWAYS AS (base_bonus + extra_bonus) STORED,
  has_annual_reward BOOLEAN DEFAULT false,
  annual_reward_description TEXT,
  perks JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- === 20260527000014_create_staff_achievements.sql ===
CREATE TABLE staff_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID NOT NULL REFERENCES users(id) UNIQUE,
  current_admissions_count INT DEFAULT 0,
  current_slab_id UUID REFERENCES achievement_slabs(id),
  admissions_to_next_slab INT DEFAULT 0,
  bonus_at_next_slab DECIMAL(10,2) DEFAULT 0,
  total_bonus_earned DECIMAL(12,2) DEFAULT 0,
  total_bonus_pending DECIMAL(12,2) DEFAULT 0,
  total_bonus_disbursed DECIMAL(12,2) DEFAULT 0,
  last_admission_date DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- === 20260527000015_create_hostel_rooms.sql ===
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

-- === 20260527000016_create_hostel_room_assignments.sql ===
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

-- === 20260527000017_create_hostel_complaints.sql ===
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

-- === 20260527000018_create_hostel_daily_log.sql ===
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

-- === 20260527000019_create_notifications.sql ===
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('goal_reminder','admin_alert','lead_assigned','bonus_pending','leave_update','student_update','reference_bonus','system','general')),
  link TEXT,
  icon TEXT,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- === 20260527000020_create_audit_logs.sql ===
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL CHECK (action IN ('create','update','delete','login','logout','export')),
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- === 20260527000021_create_universities.sql ===
CREATE TABLE universities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  short_name TEXT,
  country TEXT NOT NULL CHECK (country IN ('Georgia','Kyrgyzstan')),
  city TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','coming_soon','inactive')),
  website TEXT,
  logo_url TEXT,
  mbbs_duration_years INT DEFAULT 6,
  annual_fee_usd DECIMAL(10,2),
  recognized_by JSONB DEFAULT '["MCI","WHO","NMC"]',
  notes TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- === 20260527000022_rls_policies.sql ===
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM users WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION get_user_office()
RETURNS UUID AS $$
  SELECT office_id FROM users WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

ALTER TABLE offices ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY staff_select_students ON students FOR SELECT USING (
  assigned_staff_id = auth.uid() OR auth.role() IN ('director','admin')
);
CREATE POLICY staff_insert_students ON students FOR INSERT WITH CHECK (
  assigned_staff_id = auth.uid()
);
CREATE POLICY staff_update_students ON students FOR UPDATE USING (
  assigned_staff_id = auth.uid() OR auth.role() IN ('director','admin')
) WITH CHECK (
  assigned_staff_id = auth.uid() OR auth.role() IN ('director','admin')
);
CREATE POLICY admin_manage_students ON students FOR ALL USING (
  auth.role() IN ('director','admin')
) WITH CHECK (
  auth.role() IN ('director','admin')
);

ALTER TABLE student_funnel_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE agest_disbursement ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2b_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admission_bonus ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievement_slabs ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE hostel_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE hostel_room_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE hostel_complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE hostel_daily_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;

-- === 20260527000023_indexes_and_triggers.sql ===
CREATE INDEX IF NOT EXISTS idx_users_office_id ON users(office_id);
CREATE INDEX IF NOT EXISTS idx_students_assigned_staff_id ON students(assigned_staff_id);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_staff_id ON leads(assigned_staff_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_user_date ON attendance(user_id, date);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_students_updated_at
BEFORE UPDATE ON students
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_goals_updated_at
BEFORE UPDATE ON goals
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- === supabase/seed.sql ===
-- Seed data for ABHA Global Educare LLP

INSERT INTO offices (id, name, city, country, geo_latitude, geo_longitude, geo_radius_meters, address) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Kolhapur Office', 'Kolhapur', 'India', 16.7050, 74.2433, 300, 'Kolhapur, Maharashtra, India'),
  ('22222222-2222-2222-2222-222222222222', 'Sambhajinagar Office', 'Chhatrapati Sambhajinagar', 'India', 19.8762, 75.3433, 300, 'Chhatrapati Sambhajinagar, Maharashtra, India'),
  ('44444444-4444-4444-4444-444444444444', 'Boisar Office', 'Boisar, Palghar', 'India', 19.8039, 72.7726, 300, 'Boisar, Palghar, Maharashtra, India'),
  ('33333333-3333-3333-3333-333333333333', 'Georgia Hostel', 'Tbilisi', 'Georgia', 41.6941, 44.8337, 500, 'Tbilisi, Georgia');

INSERT INTO achievement_slabs (slab_name, slab_color, slab_icon, admissions_min, admissions_max, base_bonus, extra_bonus, has_annual_reward, annual_reward_description) VALUES
  ('Bronze', '#CD7F32', '🥉', 1, 25, 20000, 0, false, NULL),
  ('Silver', '#C0C0C0', '🥈', 25, 50, 20000, 5000, false, NULL),
  ('Gold', '#FFD700', '🥇', 50, 75, 20000, 10000, false, NULL),
  ('Platinum', '#E5E4E2', '💎', 75, 100, 20000, 15000, false, NULL),
  ('Ruby', '#E5E4E2', '💎', 100, NULL, 20000, 15000, true, 'Annual special reward + recognition ceremony + international trip');

INSERT INTO universities (name, short_name, country, city, status, mbbs_duration_years, sort_order) VALUES
  ('European University', 'EEU', 'Georgia', 'Tbilisi', 'active', 6, 1),
  ('East West University', 'EWU', 'Georgia', 'Tbilisi', 'active', 6, 2),
  ('Alte University', 'ALTE', 'Georgia', 'Tbilisi', 'active', 6, 3),
  ('SEU Georgia', 'SEU', 'Georgia', 'Tbilisi', 'active', 6, 4),
  ('International European University', 'IEU', 'Kyrgyzstan', 'Bishkek', 'active', 6, 5),
  ('Avicenna International Medical University', 'AIMU', 'Kyrgyzstan', 'Bishkek', 'active', 6, 6),
  ('Coming Soon', 'TBA', 'Kyrgyzstan', 'Bishkek', 'coming_soon', 6, 7);

-- === 20260527000024_create_hostel_parent_communication.sql ===
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

-- === 20260528000025_create_hostel_expenses.sql ===
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

-- === 20260528000026_create_hostel_infrastructure.sql ===
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
