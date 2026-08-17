/**
 * EARLY BIRD OFFER — "Confirm early. Fly out with your study tablet in hand."
 * Page 03 of the Early Bird brochure, transcribed for the web.
 *
 * The offer is a CHOICE of one device from three, awarded on successful
 * admission to Georgia and visa approval — not simply "a free iPad". The older
 * IpadOfferCard still says iPad only; keep that in mind if the two ever need to
 * agree.
 *
 * Costs are quoted in USD only, matching the rest of the abroad material.
 */

export interface TabletOption {
  id: string;
  name: string;
  kicker: string;
  image: string;
  /** short, factual alt — these are photos of the device in study use */
  alt: string;
  points: string[];
}

export const TABLET_OPTIONS: TabletOption[] = [
  {
    id: 'ipad',
    name: 'iPad 11',
    kicker: 'Apple · with Apple Pencil',
    image: '/images/early-bird/ipad-11.jpg',
    alt: 'iPad 11 held in hand showing an annotated human-skull anatomy study page',
    points: [
      '11-inch Liquid Retina display for full-page anatomy plates.',
      'Apple Pencil support for handwritten annotation over lecture slides.',
      'All-day battery — a full clinical day without a charger.',
      'Split-view study: Lecturio video on one half, notes on the other.',
    ],
  },
  {
    id: 'lenovo',
    name: 'Lenovo Idea Tab',
    kicker: 'Folio keyboard + Tab Pen',
    image: '/images/early-bird/lenovo-idea-tab.jpg',
    alt: 'Lenovo Idea Tab with detachable folio keyboard and Tab Pen, showing an ABHA brain-regions study module',
    points: [
      'Detachable folio keyboard — laptop-style note-taking in lectures.',
      'Tab Pen included for diagrams, flowcharts and margin notes.',
      'Expandable storage for the complete offline video library.',
      'Folds flat into a tablet for ward rounds and bedside reference.',
    ],
  },
  {
    id: 'samsung',
    name: 'Samsung Galaxy Tab S10 Lite',
    kicker: 'With Galaxy AI & S Pen',
    image: '/images/early-bird/samsung-galaxy-tab-s10-lite.jpg',
    alt: 'Samsung Galaxy Tab S10 Lite being used with the S Pen to study human anatomy diagrams',
    points: [
      'Galaxy AI note summarisation and instant transcription.',
      'S Pen in the box — low-latency writing on PDFs and scans.',
      'Samsung DeX for a desk-style study setup in the hostel.',
      'Long-life battery with fast charging between lectures.',
    ],
  },
];

/** What the device gives access to from day one. */
export const DEVICE_UNLOCKS = [
  {
    title: 'ABHA Portal',
    detail:
      'The full MBBS coaching portal with FMGE / NExT structured coaching for the entire course, plus the hands-on clinical workshop programme.',
  },
  {
    title: 'Lecturio USA',
    detail:
      'High-yield video lectures, Qbank and concept pages trusted worldwide — downloadable for offline study.',
  },
  {
    title: 'MIT Medical AI',
    detail:
      'AI tools for clinical reasoning, diagnostics and precision learning, integrated into the curriculum.',
  },
  {
    title: 'Digital Library',
    detail:
      'Medical books in digital edition with explainers — study materials worth USD 4,500, complimentary.',
  },
];

export const TABLET_OFFER_COPY = {
  eyebrow: 'Early Bird Offer · limited to early confirmations',
  titleLead: 'Confirm early. Fly out with your',
  titleAccent: 'study tablet',
  titleTail: 'in hand.',
  asideTitle: 'Choose one',
  asideNote: 'Awarded on successful admission to Georgia',
  intro:
    'Every early-confirmed ABHA student receives a study tablet with keyboard and pen — the device the entire digital curriculum runs on, from annotated 3D anatomy to Lecturio question banks on the ward. Pick the one you prefer; we hand it over before departure.',
  unlocksHeading: 'What the device unlocks — from day one',
  termsLabel: 'Offer terms',
  /** Reproduced in full: this is the part that protects both sides. */
  terms:
    'One device per student, awarded on successful admission to Georgia and visa approval. Choice of model is subject to availability at the time of handover; ABHA may substitute an equivalent model. The offer is non-transferable, cannot be exchanged for cash or a fee adjustment, and applies only while the early-bird window is open. Ask your counsellor for the current cut-off date.',
} as const;
