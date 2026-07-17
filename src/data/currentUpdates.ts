/**
 * Current Updates — the reports/analysis cards shown on the /current-updates hub
 * and grouped under the "Current Updates" nav header.
 *
 * To add a new update: build its page, then add an entry here (newest first).
 * `date` is a display string (shown on the card). `dateISO` drives sorting only.
 */

export type CurrentUpdate = {
  id: string;
  icon: string; // emoji
  title: string; // Marathi/English mix
  summary: string; // 1–2 line supporting info
  date: string; // display date, e.g. "17 July 2026"
  dateISO: string; // ISO for ordering
  href: string; // page link (internal)
  tag?: string; // small pill label, e.g. "Result Analysis", "Wall Chart"
};

export const currentUpdates: CurrentUpdate[] = [
  {
    id: 'neet-2025-validity-abroad',
    icon: '✅',
    title: 'NEET 2025 Validity for Abroad MBBS — Repeater Students Guide',
    summary:
      'NEET 2025 qualified पण 2026 मध्ये नाही? तुमचं 2025 scorecard जून 2028 पर्यंत abroad MBBS साठी वैध — कायदेशीर आधार, timeline व checklist सह.',
    date: '17 July 2026',
    dateISO: '2026-07-17',
    href: '/neet-zone/neet-2025-validity-abroad',
    tag: 'Wall Chart',
  },
  {
    id: 'neet-2026-result-analysis',
    icon: '🩺',
    title: 'NEET UG 2026 निकाल — संपूर्ण विश्लेषण व महाराष्ट्र Cutoff मार्गदर्शन',
    summary:
      '11.21 लाख qualified — पण admission चं गणित वेगळं. Official qualifying scores, महाराष्ट्र safe scores आणि 580–650 volatility zone alert.',
    date: '16 July 2026',
    dateISO: '2026-07-16',
    href: '/neet-zone/neet-2026-result-analysis',
    tag: 'Result Analysis',
  },
];
