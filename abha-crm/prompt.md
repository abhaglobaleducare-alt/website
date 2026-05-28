# 🚀 ABHA GLOBAL EDUCARE — STAFF CRM & PRODUCTIVITY SYSTEM

## MASTER PROMPT FOR VS CODE CLAUDE CODE

**Copy everything below this line and paste it into Claude Code in VS Code.**

---

# PROJECT BRIEF — READ FULLY BEFORE STARTING

You are acting as my **Senior Full-Stack Engineer + Solutions Architect** for ABHA Global Educare LLP. I want you to build a **production-grade, mobile-first, multi-role Staff CRM & Productivity System** from scratch in this VS Code workspace.

## ⚡ EXECUTION RULES (MOST IMPORTANT)

1. **DO NOT generate everything in one shot.** Build the project in **phases** (described below). After each phase, summarize what's done and ask me to confirm before moving forward.
2. **ASK ME CLARIFYING QUESTIONS** whenever you need credentials, API keys, design choices, or business logic decisions — DO NOT assume.
3. **Create proper folder structure FIRST**, then add files inside it.
4. **Use TypeScript strict mode** everywhere. No `any` types unless absolutely justified.
5. **Every component must be mobile-first responsive.**
6. **Write clean, commented, production-ready code** — no placeholder mock code, no `TODO: implement later` unless I explicitly ask to skip something.
7. **Use environment variables** for ALL secrets. Create a `.env.example` file with placeholders.
8. **At the end of each phase, give me:** (a) what was built, (b) commands to run/test it, (c) what's next.

---

## 🏢 COMPANY DETAILS (USE EXACTLY AS WRITTEN)

- **Company:** ABHA Global Educare LLP
- **Tagline:** AI-Powered NEET & MBBS Abroad Student Support Ecosystem
- **Admin Email:** abhaglobaleducare@gmail.com
- **Admin Mobile:** +91 7249409376
- **Brand Colors:** Use a professional palette — Deep Navy Blue (#0B2545), Saffron Accent (#F5A623), White, with subtle gradients. Make it look premium, not childish.

### 📍 OFFICES (3 total)

| Office         | City                                   | Country | Type              |
| -------------- | -------------------------------------- | ------- | ----------------- |
| Kolhapur       | Kolhapur, Maharashtra                  | India   | Main Office       |
| Sambhajinagar  | Chhatrapati Sambhajinagar, Maharashtra | India   | Main Office       |
| Georgia Hostel | Tbilisi                                | Georgia | Hostel Operations |

### 👥 PEOPLE (Pre-seed these in database)

**Directors (Super Admin — full access to everything):**

1. Anandrao Bapu Patil
2. Bhagyashree Anandrao Patil
3. Uddhav Anandrao Patil

**Admin (Operations Head):**

- Email: abhaglobaleducare@gmail.com
- Mobile: +91 7249409376

**Office Managers (Bonus-eligible Staff):**

1. **Ashok Sudam Patil Devarde** — Kolhapur Office
2. **Yashwantrao Zamarao Patil** — Chhatrapati Sambhajinagar Office

**Hostel Manager (Georgia)** — To be appointed later by admin. Build the role and portal now; admin will create the user when ready.

---

## 🛠️ MANDATORY TECH STACK

**Frontend:**

- Next.js 14 (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- shadcn/ui components
- Lucide React icons
- Framer Motion (subtle animations only)
- React Hook Form + Zod validation
- TanStack Query (React Query)
- Recharts (for dashboards)
- date-fns (for dates)

**Backend & Database:**

- Supabase (PostgreSQL + Auth + Storage + Realtime + Row-Level Security)
- Next.js API Routes for custom server logic
- Supabase Edge Functions for scheduled jobs (goal reminders, daily summaries)

**Mobile:**

- PWA setup (manifest.json, service worker, install prompt)
- Capacitor optional (we'll add later)

**Integrations (placeholders now, wire up when keys provided):**

- Resend or Brevo — staff invite emails
- Google Maps JavaScript API — geo-location, geo-fencing
- WhatsApp Cloud API — notifications (Phase 2)
- Twilio/MSG91 — OTP (Phase 2)

**Quality & DevOps:**

- ESLint + Prettier + Husky pre-commit hooks
- Sentry for error tracking (config only, activate later)
- Vercel deployment-ready

---

## 📁 REQUIRED FOLDER STRUCTURE

Create this exact structure:

```
abha-crm/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── invite/[token]/        # Staff invite acceptance
│   │   └── forgot-password/
│   ├── (staff)/
│   │   ├── dashboard/
│   │   ├── check-in/
│   │   ├── goals/
│   │   ├── students/
│   │   ├── leads/
│   │   ├── b2b-partners/
│   │   ├── leave/
│   │   ├── salary/
│   │   └── profile/
│   ├── (admin)/
│   │   ├── dashboard/
│   │   ├── staff/
│   │   ├── students/
│   │   ├── leads/
│   │   ├── b2b-partners/
│   │   ├── finance/
│   │   ├── attendance/
│   │   ├── reports/
│   │   └── settings/
│   ├── (hostel)/
│   │   ├── dashboard/
│   │   ├── rooms/
│   │   ├── students/
│   │   ├── fees/
│   │   └── complaints/
│   ├── api/
│   │   ├── auth/
│   │   ├── staff/
│   │   ├── students/
│   │   ├── leads/
│   │   ├── attendance/
│   │   ├── goals/
│   │   ├── invite/
│   │   └── upload/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/                        # shadcn components
│   ├── shared/                    # reusable components
│   ├── staff/
│   ├── admin/
│   └── hostel/
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── auth/
│   ├── utils/
│   ├── validations/               # Zod schemas
│   └── constants/
├── hooks/
├── types/
├── supabase/
│   ├── migrations/                # SQL migration files
│   ├── seed.sql                   # Initial data (offices, directors)
│   └── functions/                 # Edge functions
├── public/
│   ├── icons/
│   └── manifest.json
├── middleware.ts                  # Next.js middleware for auth/RBAC
├── .env.example
├── .env.local                     # I will fill this
├── README.md
└── package.json
```

---

## 🎯 COMPLETE FEATURE REQUIREMENTS

### MODULE 1: AUTHENTICATION & USER MANAGEMENT

**Login System:**

- Email + Password login (Supabase Auth)
- "Forgot password" flow with email reset
- Sessions persist for 7 days
- Auto-redirect based on role after login:
  - `director` / `admin` → `/admin/dashboard`
  - `staff` → `/staff/dashboard`
  - `hostel_manager` → `/hostel/dashboard`

**Staff Invitation Flow:**

- Admin goes to `/admin/staff/new` and fills: Full Name, Email, Phone, Office, Role, Designation, Joining Date, Bonus-Eligible (yes/no)
- System generates a secure invite token (UUID, expires in 48 hours)
- System sends email via Resend to the new staff with a link: `https://yourdomain.com/invite/{token}`
- Staff opens link → sees pre-filled name → sets password → account activated
- Until activation, status = "pending_invite"
- Admin can resend invite if expired

**Role-Based Access Control (RBAC):**

- Roles: `director`, `admin`, `staff`, `hostel_manager`
- Use Next.js middleware to protect routes
- Use Supabase Row-Level Security (RLS) policies — staff can ONLY read/write their own data; admin & directors can read/write all
- Hostel manager can only access hostel-related data + students in Georgia

---

### MODULE 2: GEO-ATTENDANCE (CHECK-IN / CHECK-OUT)

**Morning Check-In:**

- Big prominent button on staff dashboard: "Check In to Start Day"
- On click:
  1. Request geolocation permission
  2. Capture current latitude/longitude
  3. Calculate distance from assigned office (Haversine formula)
  4. If within 300m radius → `is_within_geofence = true`; if outside → flag but allow (field work)
  5. Capture optional selfie via camera (upload to Supabase Storage)
  6. Save record with timestamp
- Show success message: "Checked in at [address] at [time]"
- Disable check-in button once done (re-enable next day)

**Evening Check-Out:**

- Button changes to "Check Out & Submit Daily Report"
- On click, show a modal with:
  - Auto-filled list of goals marked complete today (with notes)
  - Free-text field: "Summary of today's work" (mandatory)
  - Captures location again
- Save check-out time, calculate `work_hours`
- Lock the day's record

**Admin View:**

- `/admin/attendance` — see all staff attendance for any date
- Filter by office, staff, date range
- Show: name, check-in time, check-in location (with Google Maps link), check-out time, work hours, daily summary, geo-fence status
- Export to Excel

---

### MODULE 3: GOAL MANAGEMENT SYSTEM (HIERARCHICAL)

**Goal Hierarchy:**

- Yearly Goals → Quarterly Goals → Monthly Goals → Weekly Goals → Daily Goals
- A goal can have a parent goal (e.g., a daily goal can belong to a weekly goal)

**Goal Properties:**

- Title, Description
- Type (yearly/quarterly/monthly/weekly/daily)
- Priority (Critical / High / Medium / Low) — color-coded
- Start date, Due date
- Reminder time (HH:MM) — for popup notifications
- Status: Pending / In Progress / Completed / Overdue
- Completion notes (mandatory when marking complete)
- Created by (self or admin)

**Staff Capabilities:**

- Add their own goals
- Mark goals as complete with notes
- View goals in tabs: Today / This Week / This Month / This Quarter / This Year
- Sort/filter by priority, due date, status

**Admin Capabilities:**

- View all staff's goals
- Add, edit, delete goals for any staff
- Assign new goals to any staff
- See completion rate analytics

**Priority Popup System:**

- When a goal's reminder_time arrives, show a popup modal on the staff's screen
- If staff is offline, show a notification badge on next login
- High & Critical priority goals also trigger browser push notifications
- Use Supabase Realtime to push reminders live

---

### MODULE 4: STUDENT FUNNEL / CRM (CORE MODULE)

This is the MOST IMPORTANT module. Every staff member needs to manage their assigned students through a 13-stage journey.

**Student Funnel Stages:**

1. Lead Generated
2. Initial Call / Enquiry
3. Counselling Done
4. Registration Done (Token Fee Paid)
5. Documentation Started
6. Admission Confirmed (University Selected)
7. Fee Collection — Tranche 1
8. Visa Processing
9. Visa Approved
10. Add-ons / Gifts Delivered
11. Flying / Departure
12. University Registration in Georgia
13. Hostel Access + First Hostel Fees Paid

**Each Student Record Contains:**

- **Basic Info:** Full name, father name, mother name, DOB, gender, photo
- **Contact:** Email, phone, parent phone, WhatsApp, address, city, state
- **Reference Source:** Walk-in / Referral / B2B Partner / Social Media / Coaching Class / Agent
- **Reference Details:** Which partner/source specifically (dropdown if B2B)
- **Academic:** NEET score, NEET year, 12th percentage, board, school name
- **Admission:** Selected university (dropdown: EEU, East West, Alte, SEU), country (Georgia), intake year, intake month
- **Funnel Stage:** Current stage + history of stage changes (audit log)
- **Assigned Staff:** Auto-set to current logged-in staff who registered them
- **Office:** Auto-set based on assigned staff's office
- **Created/Updated timestamps + user**

**For Each Stage, Track:**

- Status (pending/in-progress/completed)
- Date completed
- Notes
- Documents uploaded (passport scan, certificates, etc.)
- Payment received (if applicable) with amount, mode, receipt upload
- Updated by which staff & when

**Fee Schedule (Year-wise for 6 years of MBBS):**

- Tuition Fee (Year 1, 2, 3, 4, 5, 6)
- Hostel Fee (Year 1, 2, 3, 4, 5, 6) — separate
- Visa Fee
- Documentation Fee
- Add-ons / Gifts
- Other charges

For each fee item: Total amount, Paid amount, Pending amount, Due date, Paid date, Payment mode, Receipt URL, Status

**AGEST Scholarship Disbursements:**

- Track $1000 scholarship per year × 6 years
- Year number, USD amount, INR amount, conversion rate
- Status: Scheduled / Disbursed / On Hold
- Scheduled date, Disbursed date, Proof URL
- Approved by which director/admin

**Staff Capabilities:**

- Add new student (form with all fields above)
- View list of students assigned to them
- Update stages, fees, documents for their students
- Search/filter by name, phone, stage, university
- Quick stage progression buttons

**Admin Capabilities:**

- View ALL students across all offices
- Filter by: Office, Staff, Stage, University, Date range, Reference source
- Edit any student's data
- Reassign students between staff
- Bulk export to Excel
- See full audit trail of every change

---

### MODULE 5: LEAD MANAGEMENT

**Lead vs Student:**

- A **Lead** is a contact who has shown interest but not yet registered
- Once a lead is "converted," create a Student record from them

**Lead Fields:**

- Full name, phone, parent phone, email, city
- NEET score (optional)
- Interest area (MBBS Abroad / NEET Coaching / Both)
- Lead source (Walk-in / Phone / Social Media / B2B / Referral / Other)
- Lead status (New / Contacted / Qualified / Converted / Lost)
- Follow-up date
- Notes
- Assigned staff (auto = current user, or admin assigns)
- B2B Partner ID (if from B2B source)
- Office (auto from staff)

**Manual Add:**

- Form-based add with validation

**Excel Bulk Upload:**

- Staff uploads .xlsx file
- Provide a downloadable template with required columns
- Validate each row → show preview with errors
- On confirm, insert all valid rows tagged with current staff & office
- Show success count + error report

**Staff Capabilities:**

- View their own leads
- Update status, add follow-up dates, notes
- Convert lead → Student (with confirmation modal that pre-fills student form)
- Excel upload

**Admin Capabilities:**

- View ALL leads from all staff and offices
- Filter by: Office, Staff, Status, Source, Date range, B2B Partner
- Reassign leads between staff
- Bulk actions (mark contacted, assign, delete)
- Conversion rate analytics per staff

---

### MODULE 6: B2B PARTNERS & COACHING CLASSES

**Partner Fields:**

- Partner Name, Type (Coaching Class / Consultant / Agent / Other)
- Contact Person Name, Phone, Email
- City, Address
- Commission percentage (e.g., 10%)
- Agreement document upload
- Status (Active / Inactive)
- Added by, Office, Date

**Auto-Linking Logic:**

- When a Lead has `b2b_partner_id` set and is converted to Student, the partner's "linked students" list auto-updates
- Partner profile page shows: total students referred, conversion rate, total commission earned, current students in funnel

**Staff Capabilities:**

- Add B2B partners they personally bring
- See their partners + linked students

**Admin Capabilities:**

- View all partners across offices
- Edit/disable partners
- Commission payout tracking

---

### MODULE 7: HR — LEAVE APPLICATIONS

**Staff Side:**

- Apply for leave: type (casual / sick / earned / unpaid), from date, to date, reason
- View own leave history with status
- See leave balance (configurable per staff)

**Admin Side:**

- View all pending leave requests
- Approve / Reject with optional comment
- See team leave calendar
- Configure leave balance per staff per year

---

### MODULE 8: SALARY, BONUS & ACHIEVEMENTS

**For Each Staff:**

- Base salary (visible to staff)
- Bonus eligibility flag

**Admission Bonus (₹20,000 per successful admission):**

- **Eligible Staff:** Ashok Sudam Patil Devarde (Kolhapur), Yashwantrao Zamarao Patil (Sambhajinagar)
- **Trigger:** When a student's funnel_stage moves to "University Registration in Georgia" (Stage 12)
- **Disbursement Rule:** Bonus is APPROVED (not disbursed) at this trigger. Actual payout happens after admin confirms student physically reached university destination.
- Auto-create a bonus record: staff_id, student_id, amount = 20000, status = pending_approval
- Admin gets notification to approve & disburse

**Achievement Slabs (Gamification):**

- Bronze: 1–5 admissions → standard ₹20k each
- Silver: 6–10 admissions → ₹20k + ₹5k extra per admission
- Gold: 11–20 admissions → ₹20k + ₹10k extra
- Platinum: 21+ admissions → ₹20k + ₹15k extra + annual reward

Show progress on staff dashboard:

> "You're at 4/5 admissions to unlock Silver tier! Next admission earns ₹25,000."

**Salary Page (Staff View):**

- Current base salary
- Total bonus earned (year-to-date)
- Pending bonus (approved but not disbursed)
- Achievement tier & progress
- Next milestone reward

**Admin Salary Module:**

- View all staff salary structure
- Edit base salary, bonus eligibility
- Approve & mark bonuses as disbursed
- Monthly payroll summary

---

### MODULE 9: HOSTEL MANAGER PORTAL (Georgia)

A separate dashboard scoped only to Georgia operations.

**Room Management:**

- Total rooms, room number, capacity, current occupancy
- Assign students to rooms
- Room status (available / occupied / under maintenance)

**Student Hostel Records:**

- All students who have flown to Georgia (Stage 11+)
- Room assigned, check-in date, expected check-out
- Hostel fee schedule (year-wise)

**Hostel Fee Tracking:**

- Year-wise fee schedule per student
- Payment status (paid / pending / overdue)
- Payment confirmation upload
- Auto-reminders to admin for overdue

**Complaints Management:**

- Students or admin can log complaints
- Hostel manager updates status (open / in-progress / resolved)
- Resolution notes + date

**Parent Communication Log:**

- Log of calls/messages made to parents
- Date, subject, notes

**Daily Operations Log:**

- Daily entry: students present, issues, attendance, meals served, notable events

---

### MODULE 10: ADMIN MASTER DASHBOARD

Single-page executive view:

**Top KPI Cards:**

- Total Students in System
- Students by Funnel Stage (mini chart)
- Total Leads This Month
- Conversion Rate
- Pending Bonuses (₹)
- Active Staff Today
- Today's Check-ins

**Office-wise Comparison:**

- Kolhapur vs Sambhajinagar vs Georgia metrics

**Staff Leaderboard:**

- Top performers by admissions
- Top by lead conversion

**Quick Actions:**

- Add new staff
- View pending leave requests
- Approve pending bonuses
- Send broadcast notification

**Reports Section:**

- Monthly admission report (downloadable PDF)
- Staff productivity report
- Financial summary
- B2B partner performance

---

## 🗄️ DATABASE SCHEMA (Supabase / PostgreSQL)

Create migrations for these tables (use UUID primary keys, snake_case column names, timestamps on every table):

1. `offices` — office_id, name, city, country, geo_latitude, geo_longitude, geo_radius_meters, created_at
2. `users` — id (links to auth.users), email, full_name, phone, role, designation, office_id, is_bonus_eligible, joining_date, base_salary, status, invite_token, invite_sent_at, password_set_at, created_by, created_at
3. `attendance` — id, user_id, check_in_time, check_in_lat, check_in_lng, check_in_address, check_in_selfie_url, is_within_geofence, check_out_time, check_out_lat, check_out_lng, daily_summary, work_hours, date, created_at
4. `goals` — id, user_id, parent_goal_id, title, description, goal_type, priority, priority_score, start_date, due_date, reminder_time, status, completion_notes, completed_at, created_by, assigned_by, created_at
5. `students` — id, student_code (auto: ABHA-YYYY-NNNN), full_name, father_name, mother_name, dob, gender, photo_url, email, phone, parent_phone, whatsapp, address, city, state, reference_source, reference_details, reference_partner_id, assigned_staff_id, office_id, funnel_stage, current_stage_updated_at, neet_score, neet_year, twelfth_percentage, board, school_name, selected_university, selected_country, intake_year, intake_month, created_at, created_by
6. `student_funnel_history` — id, student_id, stage, stage_status, stage_notes, documents_url (jsonb), updated_by, updated_at
7. `fee_schedule` — id, student_id, fee_type, year_number, total_amount, paid_amount, pending_amount, due_date, paid_date, payment_mode, receipt_url, status, updated_by
8. `agest_disbursement` — id, student_id, year_number, amount_usd, amount_inr, conversion_rate, status, scheduled_date, disbursed_date, proof_url, approved_by, notes
9. `leads` — id, full_name, phone, parent_phone, email, city, neet_score, interest, lead_source, lead_status, follow_up_date, notes, assigned_staff_id, office_id, b2b_partner_id, uploaded_via, converted_to_student_id, created_at, created_by
10. `b2b_partners` — id, partner_name, partner_type, contact_person, contact_phone, contact_email, city, address, commission_percent, agreement_url, status, added_by, office_id, created_at
11. `leave_applications` — id, user_id, leave_type, from_date, to_date, days_count, reason, status, approved_by, approved_at, rejection_reason, created_at
12. `admission_bonus` — id, staff_id, student_id, bonus_amount, trigger_event, eligible_date, status, disbursed_date, approved_by, notes
13. `achievement_slabs` — id, slab_name, admissions_min, admissions_max, base_bonus, extra_bonus, perks (jsonb)
14. `staff_achievements` — id, staff_id, current_admissions_count, current_slab, total_bonus_earned, total_bonus_pending
15. `hostel_rooms` — id, room_number, capacity, current_occupancy, status, created_at
16. `hostel_room_assignments` — id, student_id, room_id, check_in_date, check_out_date, status
17. `hostel_complaints` — id, student_id, room_id, complaint_title, complaint_description, status, resolution_notes, raised_at, resolved_at, handled_by
18. `hostel_daily_log` — id, log_date, students_present, issues, notes, created_by
19. `notifications` — id, user_id, title, message, type, link, is_read, created_at
20. `audit_logs` — id, user_id, action, table_name, record_id, old_data, new_data, ip_address, created_at

**Row-Level Security (RLS) Policies:**

- Enable RLS on every table
- Staff: read/write only their own records (where assigned_staff_id = auth.uid() or user_id = auth.uid())
- Admin & Directors: full access
- Hostel Manager: access only hostel tables + students with funnel_stage >= 11

**Seed Data (in `supabase/seed.sql`):**

- Insert 3 offices: Kolhapur, Sambhajinagar, Georgia (with approximate lat/lng)
- Insert 3 director users (mark them as needing password setup via invite)
- Insert achievement slabs (Bronze, Silver, Gold, Platinum)
- Insert 4 partner universities as constants

---

## 🎨 UI/UX REQUIREMENTS

- **Mobile-first responsive** — works perfectly on 360px width phones
- **Dark mode + Light mode** toggle (save preference per user)
- **Sidebar navigation** on desktop, **bottom tab bar** on mobile
- **Loading states** for every async operation (use skeletons, not just spinners)
- **Empty states** with helpful messages and CTAs
- **Toast notifications** for all actions (use Sonner)
- **Confirmation modals** before destructive actions
- **Form validation messages** clear and helpful
- **Big tap targets** on mobile (minimum 44×44px)
- **Color-coded priorities and statuses** consistently across the app
- **Accessibility:** proper aria-labels, keyboard navigation, focus states

---

## 📦 DELIVERABLES & DEVELOPMENT PHASES

### **PHASE 1 — Foundation (start here)**

1. Initialize Next.js 14 project with TypeScript
2. Install all dependencies
3. Configure Tailwind + shadcn/ui
4. Create folder structure (as defined above)
5. Configure ESLint, Prettier, Husky
6. Set up Supabase client (lib/supabase/)
7. Create `.env.example` with all required variables
8. Create PWA manifest + service worker basic setup
9. Create README.md with setup instructions
10. Commit Phase 1, give me terminal commands to run, **wait for my confirmation**

### **PHASE 2 — Database & Auth**

1. Write all SQL migrations for 20 tables
2. Write seed.sql with offices, directors, achievement slabs
3. Write RLS policies for every table
4. Build login page UI
5. Build forgot-password flow
6. Build invite acceptance page (`/invite/[token]`)
7. Build Next.js middleware for route protection + role-based redirects
8. Test full auth flow
9. **Wait for my confirmation**

### **PHASE 3 — Staff Management & Invite System**

1. Admin "Add New Staff" form
2. Invite token generation + email sending (Resend integration)
3. Staff list page (admin)
4. Staff profile page (self + admin views)
5. Edit staff page (admin)
6. **Wait for confirmation**

### **PHASE 4 — Geo-Attendance**

1. Check-in component with geolocation + Haversine
2. Selfie capture (camera API)
3. Check-out with daily summary modal
4. Attendance history (staff view)
5. Attendance admin dashboard with filters
6. **Wait for confirmation**

### **PHASE 5 — Student Funnel (Most Critical — Take Time)**

1. Add Student form (multi-step wizard)
2. Student list (staff view — assigned only)
3. Student list (admin view — all + filters)
4. Student detail page with all stages, fees, AGEST, history
5. Stage progression UI
6. Fee management UI
7. AGEST disbursement UI
8. Document upload to Supabase Storage
9. Audit log on every edit
10. **Wait for confirmation**

### **PHASE 6 — Lead Management**

1. Manual add lead form
2. Excel template download
3. Excel bulk upload with validation + preview
4. Lead list (staff + admin views)
5. Convert lead → student flow
6. **Wait for confirmation**

### **PHASE 7 — Goal Management**

1. Add goal form (with parent goal selection)
2. Goal list with tabs (today/week/month/quarter/year)
3. Goal completion flow with mandatory notes
4. Priority popup system (Supabase Realtime)
5. Browser push notifications
6. Admin assign goal to staff
7. **Wait for confirmation**

### **PHASE 8 — B2B Partners**

1. Add partner form
2. Partner list
3. Partner detail page with linked students
4. Auto-linking logic on lead conversion
5. Commission tracking
6. **Wait for confirmation**

### **PHASE 9 — HR (Leave, Salary, Bonus)**

1. Leave application form + history
2. Admin approve/reject leave
3. Salary page (staff view)
4. Bonus auto-trigger on Stage 12
5. Admin bonus approval + disbursement
6. Achievement slab UI on dashboard
7. **Wait for confirmation**

### **PHASE 10 — Hostel Manager Portal**

1. Hostel dashboard
2. Room management
3. Student hostel records
4. Hostel fee tracking
5. Complaint management
6. Daily operations log
7. Parent communication log
8. **Wait for confirmation**

### **PHASE 11 — Admin Master Dashboard & Reports**

1. KPI cards
2. Office-wise comparison charts
3. Staff leaderboard
4. Downloadable PDF/Excel reports
5. **Wait for confirmation**

### **PHASE 12 — Polish & Deploy**

1. Mobile responsiveness audit
2. Accessibility audit
3. Performance optimization (image optimization, code splitting)
4. SEO meta tags
5. Sentry integration
6. Vercel deployment config
7. README with full setup + deployment instructions
8. **Done!**

---

## 🔐 ENVIRONMENT VARIABLES (.env.example)

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Email (Resend)
RESEND_API_KEY=
EMAIL_FROM=noreply@abhaglobaleducare.com

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=ABHA Global Educare

# Admin Bootstrap
ADMIN_EMAIL=abhaglobaleducare@gmail.com
ADMIN_PHONE=+917249409376

# Future: WhatsApp Cloud API
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_ACCESS_TOKEN=

# Sentry (optional)
SENTRY_DSN=
```

---

## ✅ NOW START EXECUTION

**Begin with PHASE 1.** Before writing any code, please:

1. **Confirm** you have understood the project scope.
2. **List** any clarifying questions you have for me (e.g., logo file? exact brand colors? Supabase project already created?).
3. **Tell me** what you'll create in Phase 1.
4. **Then** start executing Phase 1 step-by-step.

After Phase 1 is complete:

- Show me the terminal commands to run (`npm install`, `npm run dev`, etc.)
- Tell me how to verify it's working
- **Wait for me to say "Continue to Phase 2"** before proceeding.

**REMEMBER:**

- Production-grade code only
- No mock/placeholder data unless explicitly told
- Ask questions when unsure
- One phase at a time
- Pause for my confirmation after each phase

Let's build the best CRM for Indian education sector. 🚀

---

**END OF MASTER PROMPT**
