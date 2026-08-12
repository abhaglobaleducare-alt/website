/**
 * Announcement Banner data — the single place to publish a new site banner.
 *
 * HOW TO PUBLISH A NEW BANNER (no code changes needed):
 *   1. Copy one of the commented examples below (or an old entry).
 *   2. Give it a NEW unique `id` — dismissal is remembered per id, so a new id
 *      shows the banner again even for visitors who dismissed an older one.
 *   3. Set `active: true` (and set the old entry to `active: false` or delete it).
 *   4. Optionally set `startDate` / `endDate` (ISO, IST) for an auto show/hide
 *      window — e.g. '2026-11-06'. If omitted, the banner stays on while active.
 *
 * Only ONE banner renders at a time: the FIRST entry that is `active` and
 * inside its date window wins. Order matters.
 */

export type Announcement = {
  id: string; // unique, used for dismiss-memory
  active: boolean;
  icon?: string; // emoji e.g. "🩺" "🪔" "🎓"
  headline: string; // Marathi/English mix
  subtext?: string; // 1 line supporting info
  ctaLabel: string; // e.g. "संपूर्ण विश्लेषण वाचा"
  ctaHref: string; // internal or external link
  theme?: 'gold' | 'festive' | 'urgent'; // color variants (default 'gold')
  startDate?: string; // ISO date (IST) — banner hidden before this day
  endDate?: string; // ISO date (IST) — banner hidden after this day
};

// NOTE: EVERY active entry inside its date window renders — the banner lays them
// out two-per-row (wrapping to a new row for a 3rd/4th). The three Current Updates
// banners below each carry a 3-month validity window (17 Jul → 17 Oct 2026) so they
// auto-hide. Array order = display order (left-to-right, top-to-bottom).
export const announcements: Announcement[] = [
  {
    id: 'mh-2026-cap-rule-change',
    active: true,
    icon: '⚠️',
    headline: 'Maharashtra 2026 — private colleges चा institutional round बंद!',
    subtext:
      '100% जागा आता CET Cell च्या CAP मधूनच · शेवटच्या round मध्ये जागा नाकारली तर 2 वर्षं बंदी — पण "management quota बंद झाला" हे मात्र खरं नाही',
    ctaLabel: 'नेमकं काय बदललं वाचा',
    ctaHref: '/neet-zone/neet-2026-maharashtra-counselling',
    theme: 'urgent',
    startDate: '2026-08-12',
    endDate: '2026-11-12',
  },
  {
    id: 'nmc-seat-matrix-2026',
    active: true,
    icon: '🪑',
    headline: 'NMC 2026 Seat Matrix — 1,36,939 MBBS जागा, 9,911 नव्या!',
    subtext:
      'Government 63,296 · तुमच्या category ला प्रत्यक्ष किती जागा उपलब्ध — analyzer मध्ये तपासा',
    ctaLabel: 'तुमच्या जागा बघा',
    ctaHref: '/neet-analyzer',
    theme: 'gold',
    startDate: '2026-08-12',
    endDate: '2026-11-12',
  },
  {
    id: 'neet-2026-maharashtra-counselling',
    active: true,
    icon: '📊',
    headline: 'NEET 2026 Score → College Chart तयार! — तुमचा rank व Maharashtra cutoff बघा',
    subtext:
      'Marks→AIR, MCC vs MH CET Cell registration आणि GMC closing marks — संपूर्ण counselling chart',
    ctaLabel: 'संपूर्ण chart वाचा',
    ctaHref: '/neet-zone/neet-2026-maharashtra-counselling',
    theme: 'gold',
    startDate: '2026-07-17',
    endDate: '2026-10-17',
  },
  {
    id: 'neet-2025-validity-abroad',
    active: true,
    icon: '✅',
    headline: 'NEET 2025 Qualified? 2026 मध्ये नाही? — तरीही Abroad MBBS शक्य!',
    subtext:
      'तुमचं 2025 qualification जून 2028 पर्यंत वैध — कायदेशीर आधारासह संपूर्ण chart वाचा',
    ctaLabel: 'संपूर्ण माहिती वाचा',
    ctaHref: '/neet-zone/neet-2025-validity-abroad',
    theme: 'gold',
    startDate: '2026-07-17',
    endDate: '2026-10-17',
  },
  {
    id: 'neet-2026-result',
    active: true,
    icon: '🩺',
    headline: 'NEET UG 2026 निकाल जाहीर — 11.21 लाख qualified!',
    subtext: 'तुमचा score कुठे उभा आहे? महाराष्ट्र cutoff विश्लेषण वाचा',
    ctaLabel: 'संपूर्ण विश्लेषण वाचा',
    ctaHref: '/neet-zone/neet-2026-result-analysis',
    theme: 'gold',
    startDate: '2026-07-17',
    endDate: '2026-10-17',
  },
  {
    // Evergreen tool — no date window, so it stays live while active:true.
    id: 'neet-admission-analyzer',
    active: true,
    icon: '🎯',
    headline: 'NEET Admission Decision Engine — Ready! तुमच्या Score व AIR नुसार तपासा',
    subtext:
      'Achieved NEET score व All India Rank टाका — Govt / Private / Abroad admission ची शक्यता instant, data-driven विश्लेषणासह पाहा.',
    ctaLabel: 'Check My Admission Chances',
    ctaHref: '/neet-analyzer',
    theme: 'urgent',
  },

  // ── EXAMPLE: festival greeting (copy → edit → set active: true) ──────────
  // {
  //   id: 'diwali-2026',
  //   active: false,
  //   icon: '🪔',
  //   headline: 'ABHA परिवारातर्फे दिवाळीच्या हार्दिक शुभेच्छा!',
  //   subtext: 'तुमच्या वैद्यकीय स्वप्नांना यशाची रोषणाई लाभो ✨',
  //   ctaLabel: 'Book Counselling',
  //   ctaHref: '/contact',
  //   theme: 'festive',
  //   startDate: '2026-11-06',
  //   endDate: '2026-11-12',
  // },

  // ── EXAMPLE: deadline reminder (copy → edit → set active: true) ──────────
  // {
  //   id: 'agest-2027-deadline',
  //   active: false,
  //   icon: '⏳',
  //   headline: 'AGEST 2027 नोंदणी — शेवटची तारीख जवळ आली आहे!',
  //   subtext: 'Scholarships · Gifts · Rewards — आजच नोंदणी करा',
  //   ctaLabel: 'Register Now',
  //   ctaHref: '/scholarship',
  //   theme: 'urgent',
  //   endDate: '2027-07-10',
  // },
];

/** Parse an ISO date string as an IST instant (date-only strings span the full IST day). */
function istInstant(iso: string, endOfDay: boolean): Date {
  if (iso.includes('T')) return new Date(iso);
  return new Date(`${iso}T${endOfDay ? '23:59:59' : '00:00:00'}+05:30`);
}

/** True when an announcement is active and inside its (optional) date window. */
function isLive(a: Announcement, now: Date): boolean {
  if (!a.active) return false;
  if (a.startDate && now < istInstant(a.startDate, false)) return false;
  if (a.endDate && now > istInstant(a.endDate, true)) return false;
  return true;
}

/** All announcements to render — every active entry inside its date window,
 *  in array order. The banner lays these out two-per-row (wrapping). */
export function getActiveAnnouncements(now: Date = new Date()): Announcement[] {
  return announcements.filter((a) => isLive(a, now));
}

/** The first announcement to render (kept for convenience). */
export function getActiveAnnouncement(now: Date = new Date()): Announcement | null {
  return getActiveAnnouncements(now)[0] ?? null;
}
