# ABHA CRM — Production Deployment Guide (Vercel + Supabase)

This guide deploys the ABHA Global Educare CRM (Next.js 14 App Router) to Vercel,
backed by Supabase (Mumbai / `ap-south-1`). It assumes all 28 tables and migrations
through Phase 11 are already applied in your Supabase project.

---

## 0. Prerequisites

- A GitHub repository containing this project.
- A Vercel account (Hobby or Pro).
- The Supabase project already provisioned in **Mumbai (ap-south-1)** with all
  migrations applied (see §3).
- Project keys from **Supabase → Project Settings → API**.

---

## 1. Environment variables

Set these in **Vercel → Project → Settings → Environment Variables** for the
**Production** (and Preview, if used) environments. `NEXT_PUBLIC_*` values are
exposed to the browser; everything else stays server-only.

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL, e.g. `https://xxxx.supabase.co`. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public anon key (browser client). |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | **Secret.** Service-role key used by all `/api/*` routes. Never expose client-side. |
| `NEXT_PUBLIC_APP_URL` | Yes | Public site URL, e.g. `https://abha-crm.vercel.app` (or your custom domain). Used for invite links. |
| `NEXT_PUBLIC_APP_NAME` | No | Display name. Default: `ABHA Global Educare`. |
| `ADMIN_EMAIL` | Yes | Bootstrap admin email. |
| `ADMIN_PHONE` | No | Admin contact phone. |
| `RESEND_API_KEY` | No | Resend API key for invite emails. If unset, invites are created but no email is sent. |
| `EMAIL_FROM` | No | From address for transactional email, e.g. `noreply@abhaglobaleducare.com`. |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | No | Google Maps key (geo features). |
| `WHATSAPP_PHONE_NUMBER_ID` | No | WhatsApp Cloud API phone number id (future). |
| `WHATSAPP_ACCESS_TOKEN` | No | **Secret.** WhatsApp Cloud API token (future). |

> The full list with placeholders is in `.env.example`. Copy it to `.env.local`
> for local development.

**Security:** only `NEXT_PUBLIC_*` variables reach the browser. The service-role
key and WhatsApp token are server-only and must **never** be prefixed with
`NEXT_PUBLIC_`.

---

## 2. Deploy to Vercel

1. **Import the repo:** Vercel → *Add New → Project* → import your GitHub repo.
2. **Framework preset:** Next.js (auto-detected). `vercel.json` already pins:
   - `buildCommand`: `npm run build`
   - `installCommand`: `npm install`
   - `regions`: `bom1` (Mumbai — co-located with Supabase for low latency)
   - Security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy,
     Permissions-Policy for camera/geolocation used by check-in).
3. **Add the environment variables** from §1.
4. **Deploy.** First build runs `next build`.
5. After the first deploy, copy the production URL and set `NEXT_PUBLIC_APP_URL`
   to it, then **redeploy** so invite links use the correct domain.

---

## 3. Supabase production setup

### 3.1 Migrations — confirm all are applied
Run in **Supabase → SQL Editor** if not already applied. The consolidated files in
`supabase/` make this one-shot:
- `supabase/complete_migration.sql` — full schema (fresh project), **includes** the
  Phase 10 extension tables (024 parent communication, 025 expenses + agent
  commissions, 026 infrastructure/room inventory/store/transactions).
- `supabase/phase10_extension_migration.sql` — idempotent extension-only file for an
  existing DB.
- `supabase/migrations/20260528000027_extend_notification_types.sql` — extends the
  `notifications.type` check with `expense_approval`, `low_stock_alert`,
  `infrastructure_damage` (run once).

Verify table count:
```sql
select count(*) from information_schema.tables
where table_schema = 'public';
-- expect 28
```

### 3.2 Auth redirect URLs
**Supabase → Authentication → URL Configuration:**
- **Site URL:** `https://<your-vercel-domain>`
- **Redirect URLs (add all that apply):**
  - `https://<your-vercel-domain>/**`
  - `https://*.vercel.app/**` (to cover preview deployments)
  - `http://localhost:3000/**` (local dev)

### 3.3 CORS / API
Supabase REST/Auth allow any origin by default with the anon key; no extra CORS
config is required for this app because all privileged data access is server-side
via the service role. If you later add browser-side Supabase calls, add your domain
under **Project Settings → API → CORS**.

### 3.4 Row Level Security
All 28 tables have `ENABLE ROW LEVEL SECURITY`. Privileged access is performed
**server-side** with the service-role key (which bypasses RLS) inside `/api/*`
routes; the browser never queries protected tables directly. Confirm RLS is on:
```sql
select tablename, rowsecurity from pg_tables
where schemaname = 'public' order by tablename;
-- rowsecurity should be true for all app tables
```

---

## 4. Custom domain

1. Vercel → Project → **Settings → Domains → Add** (e.g. `crm.abhaglobaleducare.com`).
2. Add the displayed `CNAME`/`A` record at your DNS provider; wait for verification.
3. Update `NEXT_PUBLIC_APP_URL` to the custom domain and **redeploy**.
4. Add the custom domain to Supabase **Auth redirect URLs** (§3.2).

---

## 5. PWA

- `public/manifest.json` is linked from the root layout; theme color `#F5A623`.
- `public/sw.js` registers on load (`components/shared/pwa-register.tsx`) and
  enables installability + network-first navigation.
- An install banner (`PwaInstallPrompt`) appears on supported browsers via the
  `beforeinstallprompt` event.
- **Recommended:** add `192x192` and `512x512` PNG icons to `/public` and list them
  in `manifest.json` for the best Android install experience (SVG works on modern
  Chrome but PNGs are safest).

**Mobile install test:** open the production URL in Chrome (Android) → menu →
*Install app*; on iOS Safari → Share → *Add to Home Screen*.

---

## 6. Post-deployment testing checklist

Smoke-test these flows after deploy:

- [ ] **Login** — `/login` authenticates and routes to the correct portal by role.
- [ ] **Add student** — staff creates a student; appears in `/admin/students`.
- [ ] **Attendance check-in** — `/staff/check-in` captures geolocation + saves.
- [ ] **Hostel expense add** — `/hostel/expenses/new` saves; shows in `/hostel/expenses`
      and as *pending* in `/admin/hostel/expenses`.
- [ ] **Store transaction** — `/hostel/store/purchase` and `/hostel/store/issue`
      adjust `current_stock`; appear in `/hostel/store/log`.
- [ ] **Admin dashboard data** — `/admin/dashboard` KPIs, funnel chart, office
      comparison, and leaderboard render with live data.

### Test URLs to verify after deploy
| URL | Expect |
| --- | --- |
| `/login` | Login screen |
| `/staff/dashboard` | Staff home (after staff login) |
| `/admin/dashboard` | Admin KPIs + charts (after admin login) |
| `/hostel/dashboard` | Hostel manager home (after hostel login) |
| `/hostel/expenses` | Expense list + totals |
| `/hostel/store` | Store stock table with low-stock alerts |
| `/hostel/infrastructure` | Infrastructure inventory |
| `/admin/hostel/expenses` | Pending expense approvals + category chart |

> Role routing: middleware restricts `/admin/*` to `director`/`admin`, `/staff/*`
> to `staff`, and `/hostel/*` to `hostel_manager`. Test each portal with a user of
> the matching role. Admins manage hostel data via `/admin/hostel*` (not `/hostel/*`).

---

## 7. Troubleshooting

- **Invite links point to localhost:** `NEXT_PUBLIC_APP_URL` is unset/incorrect —
  set it to the production domain and redeploy.
- **`next/image` error "hostname not configured":** confirm your Supabase domain
  matches `*.supabase.co` (already allowed in `next.config.mjs`). For a custom
  storage domain, add it to `images.remotePatterns`.
- **Broadcast/notifications error on new types:** run migration `...027` (§3.1).
- **Empty hostel data for admin:** ensure the hostel manager has logged data; admin
  views read the same tables via `/api/hostel/*`.
