# Fee Update Notes — Phase A Discovery

> **PHASE B STATUS: APPLIED** (2026-07-15). EEU MBBS corrected ($6,000/$36,000, $3,000/sem, $500/yr scholarship → after $5,500/$33,000 via existing `feePerYearAfterUSD`/`totalTuitionAfterUSD` pattern). Added: EEU BSc Nursing; Caucasus BBA, Economics (3yr/$16,500, code comment re 4yr header), Dual BBA, Dual Hospital Management (business-management); Caucasus Computer Science, Dual CompSci, Dual Cyber Security (it-data-science-ai). New stream **`humanities-design`** ("Humanities, Design & Social Sciences") created (streams.ts + streamExtras.ts + context STREAM_LABELS) with Caucasus Architecture, Psychology, International Relations. New stream appears as the **7th item inside the existing "Courses" nav dropdown** (Header maps STREAMS → dropdown children, so no top-level nav cap issue). `npm run build` passed 26/26; `/courses/humanities-design` prerendered. Images/videos deferred to Phase C/D. Stream card image temporarily reuses course-masters-mba-phd.svg (TODO Phase C: dedicated svg).


> Source: PDFs from `public/images/university info pdf and videos ` (trailing space in folder name), copied to scratchpad `/fees/`.
> **Scope is STRICT.** Only the following are recorded here: tuition (total + per-semester/per-year), scholarships (amount/criteria if stated), and course-specific lab/academic fees ONLY when explicitly described.
> **EXCLUDED everywhere (do NOT add anywhere on site):** accommodation, food/mess, visa fees, application fees, documentation fees, administrative/administration fees, registration fees, TRC/residence-card fees, professional service fees, bank transaction charges, flight tickets.
> Currency mechanism on site: `EXCHANGE_RATE_INR = 90`. Do not invent a new one.
> Primary data file: `src/data/courses.ts`.

---

## East European University (EEU) — Tbilisi, Georgia

### MBBS (medicine) — ⚠️ CONFLICT with site
| Field | Current on site | New value from PDF |
|---|---|---|
| feePerYearUSD | 4,900 | 6,000 |
| totalTuitionUSD | 29,400 | 36,000 |
| Per-semester | $2,450 / semester (12 semesters) | $3,000 / semester × 2 = $6,000/yr |
| Scholarship | — | $500 / academic year for international students → net $5,500/yr, $33,000 total |
| source | 'ABHA fee card' | EEU fee PDF |

- **DECISION NEEDED:** which figure is authoritative — site's $4,900/$29,400 (ABHA fee card) vs PDF's $6,000/$36,000 (with $500/yr scholarship → net $5,500/$33,000).

### BSc Nursing (nursing-health-sciences) — ❌ MISSING on site
- 4 years.
- $1,650 / semester × 2 = $3,300 / year (Year 1 shown as $2,000 + $1,300 = $3,300).
- Total tuition: **$13,200** (4 years).
- No EEU Nursing row currently exists in `nursing-health-sciences` stream.

**Excluded from EEU PDFs (not added):** administration fee ($2,250 MBBS / $1,500 Nursing), registration $100, TRC $350, Professional Service Fee ₹1,45,000 + GST, accommodation/mess $250–370/mo, +$25 bank charge, flight tickets.

---

## Caucasus University — Tbilisi, Georgia

Caucasus University already exists on site under the **medicine** stream (MBBS $6,000/yr, $36,000 total — confirmed match, no change). The following non-medical programs are NEW additions.

> **OPEN QUESTION before Phase B:** Does "Caucasus University" already appear as a university under the business-management / computer-science / other non-medical streams on the site? If adding a non-medical row would create a brand-new university page for a stream, ASK the user first per the rules. If the stream/university shell already exists, it's a permitted data addition.

### MBBS (medicine) — ✅ MATCH, no change
- $6,000/yr, $36,000 total. Already on site.

### Business Administration (BBA) — new
- 3 years.
- $5,500 / year (Year 1 $5,500; Year 2 $2,750 + $2,750; Year 3 $2,750 + $2,750).
- Total tuition: **$16,500**.

### Computer Science — new
- 4 years.
- $5,500 / year.
- Total tuition: **$22,000**.

### Economics (Bachelor Degree) — new  [nm-economics.pdf]
- Tuition $5,500 / year (Year 1 $5,500; Year 2 $2,750 + $2,750; Year 3 $2,750 + $2,750).
- ⚠️ **Year-count ambiguity:** header states "PROGRAM DURATION 4 YEARS" but the fee table lists only First/Second/Third year. Listed total = **$16,500** (3 years shown). If truly 4 years, Year-4 breakdown is not given. Flag for user.

### Architecture (Bachelor Degree) — new  [nm-architecture.pdf]
- 4 years. Year 1 tuition **$5,000**; Years 2–4 $2,500 + $2,500 = $5,000/yr each.
- Total tuition: **$20,000** (Year-1 $5,000 is lower than the $5,500 of most other programs).

### Psychology (Bachelor Degree) — new  [nm-psychology.pdf]
- 4 years. Year 1 tuition **$5,000**; Years 2–4 $2,500 + $2,500 = $5,000/yr each.
- Total tuition: **$20,000**.

### International Relations (Bachelor Degree) — new  [nm-ir.pdf]
- 4 years. Year 1 tuition **$5,000**; Years 2–4 $2,500 + $2,500 = $5,000/yr each.
- Total tuition: **$20,000**.

### Dual Degree BBA (Bachelor) — new  [dd-bba.pdf]
- 3 years. Year 1 tuition **$10,000**; Years 2–3 $5,000 + $5,000 = $10,000/yr each.
- Total tuition: **$30,000**. (Dual-degree track — priced ~2× the standard BBA $16,500.)

### Dual Degree Computer Science (Bachelor) — new  [dd-compsci.pdf]
- 3 years. Year 1 tuition **$10,000**; Years 2–3 $5,000 + $5,000 = $10,000/yr each.
- Total tuition: **$30,000**. (Dual-degree track, distinct from standard CompSci $22,000.)

### Dual Degree Cyber Security (Bachelor) — new  [dd-cyber.pdf]
- 3 years. Year 1 tuition **$10,000**; Years 2–3 $5,000 + $5,000 = $10,000/yr each.
- Total tuition: **$30,000**.

### Dual Degree Hospital Management (Bachelor) — new  [dd-hospital.pdf]
- 3 years. Year 1 tuition **$7,500**; Years 2–3 $3,750 + $3,750 = $7,500/yr each.
- Total tuition: **$22,500**.

**Excluded from Caucasus non-medical PDFs (not added):** administrative fee $1,500, registration $100, TRC $350, Professional Service Fee, accommodation/mess ($250–370/mo), bank charges.

---

## ABHA Master Brochure — authoritative fee card  [abha-brochure.pdf]
Page 4 "GEORGIA UNIVERSITY OPTIONS" is ABHA's own master medicine fee card (per-semester × sem count). Used to cross-check the medicine stream. **All match the site EXCEPT EEU.**

| University | Per sem | Sems | Total | Site value | Verdict |
|---|---|---|---|---|---|
| SEU (Georgian National) | $2,950 | 10 | $29,500 | $5,900/$29,500 | ✅ match |
| Avicenna (Batumi) | $2,450 | 10 | $24,500 | $4,900/$24,500 | ✅ match |
| IBSU–SEU | $2,650 | 10 | $26,500 | $5,300/$26,500 | ✅ match |
| **East European (EEU)** | **$3,000** | **12** | **$36,000** + $500/yr scholarship | $4,900/$29,400 | ⚠️ **CONFLICT** |
| Caucasus University | $3,000 | 12 | $36,000 | $6,000/$36,000 | ✅ match |
| University of Georgia | $3,250 | 12 | $39,000 | $6,500/$39,000 | ✅ match |
| CIU | $3,000 | 12 | $36,000 | $6,000/$36,000 | ✅ match |
| Alte University | $2,975 | 12 | $35,700 | $5,950/$35,700 | ✅ match |
| East West University | $1,950 after-schol / $2,750 std | 12 | $23,400 / $33,000 | $5,500/$33,000 → $3,900/$23,400 after | ✅ match |
| Nalanda (Dili, Timor-Leste) | $1,600 | — | $20,400 total | Yr1 $6,200 + Yr2–4 $3,200/yr = $20,400 | ✅ match (total) |

- **EEU conflict now confirmed by TWO independent sources** (standalone eeu-mbbs.pdf AND this master brochure): both give $3,000/sem, $6,000/yr, $36,000 total, with $500/academic-year international scholarship. The site's $4,900/$29,400 is the outlier and should be corrected.
- **Excluded from brochure (ABHA service package, not university tuition — do NOT add):** Application & Registration $300, Onboarding Documentation $750, Consultancy $700, Admission+1st-sem coordination $2,000, Visa & Pre-Travel $700, Travel Insurance & Air Ticket $450, AGDRP (coaching) $899, On-Arrival Setup/TRC $350 (services sub-total $6,199); Accommodation $350/mo. All excluded per strict scope.
- Brochure page 2 India-vs-abroad comparison (₹6L–₹1.25Cr–₹2.5Cr India vs "Under ₹22–35 Lakhs" abroad) is marketing context already reflected on the MBBS page — not a data field.

---

## Confirmed MATCH — no change required
| University | Course | Site value | PDF value |
|---|---|---|---|
| Alte University | MBBS | $5,950/yr, $35,700 total | matches |
| University of Georgia (UG) | MBBS | $6,500/yr, $39,000 total | matches |
| Caucasus University | MBBS | $6,000/yr, $36,000 total | matches |

## Not in PDFs (leave as-is)
- **East West University** (medicine, distinct from EEU): $5,500/yr, $33,000 total, after-scholarship $3,900/yr, $23,400 total (source: eastwest.edu.ge official). No PDF supplied — do not change.

---

## Stream-mapping analysis (for Phase B placement)
Site streams: `medicine`, `dentistry`, `nursing-health-sciences`, `business-management`, `it-data-science-ai`, `masters-phd`.
Caucasus University currently appears **only** under `medicine`. "Caucasus International University (CIU)" is a **different** university (see courses.ts note). So adding non-medical Caucasus rows = existing university into additional streams (data addition, not a new university page).

| Caucasus program | Fits stream? | Proposed placement |
|---|---|---|
| Business Administration (BBA) $16,500 | ✅ | business-management |
| Economics $16,500 (yr ambiguity) | ✅ | business-management |
| Computer Science $22,000 | ✅ | it-data-science-ai |
| Dual Degree BBA $30,000 | ✅ | business-management |
| Dual Degree CompSci $30,000 | ✅ | it-data-science-ai |
| Dual Degree Cyber Security $30,000 | ✅ | it-data-science-ai |
| Dual Degree Hospital Management $22,500 | ⚠️ closest = business-management | business-management (health mgmt) |
| Architecture $20,000 | ❌ no matching stream | DECISION NEEDED |
| Psychology $20,000 | ❌ no matching stream | DECISION NEEDED |
| International Relations $20,000 | ❌ no matching stream | DECISION NEEDED (business-management? new stream?) |

**Fee-tier note:** two pricing patterns in the Caucasus non-medical PDFs — Business/Economics/CompSci start at $5,500 Year-1; Architecture/Psychology/IR start at $5,000 Year-1. Recorded as-read per PDF.

## Privacy note
- `numbers14-07-2026.csv` (116 KB) in source folder is likely leads/contact data — do NOT process or commit.
