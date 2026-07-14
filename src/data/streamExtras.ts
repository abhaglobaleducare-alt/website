/**
 * Per-stream "extra" content for each /courses/[stream] page — mirrors the
 * Business & Management page: a "Why …" grid, an honest India-vs-Georgia
 * comparison, and an FAQ. Kept factual and compliant with the brand rules.
 */
import {
  Globe2,
  GraduationCap,
  FileCheck,
  Clock,
  Wallet,
  ShieldCheck,
  Handshake,
  Home as HomeIcon,
  Stethoscope,
  MapPin,
  Cpu,
  Brain,
  HeartPulse,
  type LucideIcon,
} from 'lucide-react';
import type { StreamSlug } from './courses';

export interface WhyCard {
  icon: LucideIcon;
  title: string;
  text: string;
}

export interface ComparisonRow {
  path: string;
  left: string;
  right: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface StreamExtra {
  why: {
    kicker: string;
    title: string;
    titleAccent: string;
    cards: WhyCard[];
  };
  comparison: {
    kicker: string;
    title: string;
    intro: string;
    leftLabel: string;
    rightLabel: string;
    rows: ComparisonRow[];
  };
  faq: {
    kicker: string;
    title: string;
    items: Faq[];
  };
}

export const STREAM_EXTRAS: Record<StreamSlug, StreamExtra> = {
  /* ── MEDICINE ─────────────────────────────────────────────────── */
  medicine: {
    why: {
      kicker: 'Why Study Abroad',
      title: 'Why MBBS in',
      titleAccent: 'Georgia & Timor-Leste',
      cards: [
        { icon: Globe2, title: '100% English-Medium', text: 'MBBS / M.D. is taught fully in English at our partner universities — no local-language barrier to study.' },
        { icon: ShieldCheck, title: 'NMC & WHO Eligible', text: 'Partner medical universities are NMC & WHO Eligible, so graduates are eligible for FMGE / NExT.' },
        { icon: Wallet, title: 'Transparent, Verified Fees', text: 'Year-wise tuition published on this page — no donation and no capitation fees.' },
        { icon: HomeIcon, title: 'Own Hostel & Indian Food', text: "ABHA's own 200+ bed hostel in Tbilisi with daily Indian veg & non-veg meals by Indian cooks." },
        { icon: Stethoscope, title: 'Hands-On Clinical Workshops', text: "ABHA's own INCREDOC workshops build clinical skills that support FMGE / NExT preparation." },
        { icon: MapPin, title: 'On-Ground Support', text: 'ABHA Global Services LLC office in Tbilisi — from airport pickup to settling in.' },
      ],
    },
    comparison: {
      kicker: 'An Honest Comparison',
      title: 'India vs Abroad — Duration & Path',
      intro: 'Both routes lead to a valid medical degree. This is neutral information to help you and your family decide what fits best.',
      leftLabel: 'India (private)',
      rightLabel: 'Georgia / Timor-Leste (via ABHA)',
      rows: [
        { path: 'MBBS Duration', left: '4.5 years + 1 year internship', right: 'Georgia 5–6 yrs (incl. internship); Timor-Leste 4.5 yrs + 1 yr internship' },
        { path: 'Entrance', left: 'NEET + very high cut-offs for limited seats', right: 'NEET qualified (no high cut-off)' },
        { path: 'Admission basis', left: '12th + NEET rank', right: '12th + NEET + documents' },
        { path: 'Tuition Cost', left: '₹80 lakh – ₹2.5 crore (private / management / NRI quota)', right: '≈ ₹18–35 lakh total tuition (see fee chart above)' },
        { path: 'Medium', left: 'English', right: 'English' },
        { path: 'To practise in India', left: 'Must clear NExT — the NMC’s common MBBS exit & licence exam for all graduates (being phased in)', right: 'Must clear FMGE / NExT as per NMC norms (mandatory for foreign medical graduates)' },
      ],
    },
    faq: {
      kicker: 'Questions & Answers',
      title: 'Frequently Asked Questions',
      items: [
        { q: 'Is an MBBS from Georgia or Timor-Leste valid in India?', a: 'The programmes are offered by NMC & WHO Eligible universities. To practise in India, foreign medical graduates must clear the FMGE / NExT screening exam as per NMC norms.' },
        { q: 'Will Indian MBBS graduates also have to clear NExT?', a: 'Yes. Under the National Medical Commission (NMC), the National Exit Test (NExT) is planned as a single common exam for all MBBS graduates in India — it will serve as the final-year exit / licence exam required to practise in India and as the PG-entrance test, replacing FMGE (for foreign medical graduates) and NEET-PG. So Indian college graduates and foreign medical graduates alike will need to appear for and clear NExT. NMC has deferred the rollout (currently by around 3–4 years), and FMGE continues to apply to foreign medical graduates in the interim.' },
        { q: 'Is NEET required?', a: 'Yes. As per NMC guidelines, a valid NEET score is mandatory for Indian students who wish to study medicine abroad and later practise in India. There is no minimum cut-off — you must appear and qualify.' },
        { q: 'What is the total cost of the MBBS?', a: 'Verified year-wise tuition is shown in the fee chart above. Tuition varies by university; hostel, food, insurance and living costs are extra unless stated.' },
        { q: 'Do you provide hostel and Indian food?', a: 'Yes. ABHA operates its own 200+ bed hostel in Tbilisi with daily Indian veg & non-veg meals cooked by Indian chefs.' },
        { q: 'How does ABHA help with FMGE / NExT?', a: "ABHA's own INCREDOC clinical workshops run each semester to build hands-on clinical skills that support FMGE / NExT preparation." },
      ],
    },
  },

  /* ── DENTISTRY ────────────────────────────────────────────────── */
  dentistry: {
    why: {
      kicker: 'Why Study Abroad',
      title: 'Why Dentistry (DMD) in',
      titleAccent: 'Georgia',
      cards: [
        { icon: Globe2, title: '100% English-Medium', text: 'The Doctor of Dental Medicine (DMD) programme is taught fully in English at our partner universities.' },
        { icon: FileCheck, title: 'Accredited Universities', text: 'Partner universities are accredited by the Ministry of Education and Science of Georgia.' },
        { icon: Wallet, title: 'Affordable, Verified Fees', text: 'Year-wise tuition published on this page — clear, with no donation.' },
        { icon: Clock, title: '4–5 Year DMD Pathway', text: 'Complete the DMD in 4–5 years, plus internship where applicable.' },
        { icon: HomeIcon, title: 'Own Hostel & Indian Food', text: "ABHA's own hostel in Tbilisi with daily Indian meals." },
        { icon: Handshake, title: 'ABHA Partner Universities', text: 'Admission guidance through ABHA at SEU, European University and the University of Georgia.' },
      ],
    },
    comparison: {
      kicker: 'An Honest Comparison',
      title: 'India vs Georgia — Dentistry Path',
      intro: 'Both routes lead to a recognised dental qualification. This is neutral information to help you decide.',
      leftLabel: 'India (BDS, private)',
      rightLabel: 'Georgia (DMD)',
      rows: [
        { path: 'Duration', left: '4 years + 1 year internship (BDS)', right: '4–5 years + internship (DMD)' },
        { path: 'Entrance', left: 'NEET + cut-offs', right: 'NEET qualified' },
        { path: 'Admission basis', left: '12th (PCB) + NEET rank', right: '12th (PCB) + NEET + documents' },
        { path: 'Medium', left: 'English', right: 'English' },
        { path: 'To practise in India', left: 'Direct (BDS)', right: 'NDC rules — qualify NExT (Dental)' },
      ],
    },
    faq: {
      kicker: 'Questions & Answers',
      title: 'Frequently Asked Questions',
      items: [
        { q: 'Can I practise dentistry in India after a foreign DMD?', a: 'For practice in India, National Dental Commission (NDC) rules apply — qualifying NExT (Dental) is mandatory for foreign dental graduates.' },
        { q: 'Is NEET required for dentistry abroad?', a: 'NEET qualification as per NMC / NDC norms is required for Indian students who intend to practise dentistry in India.' },
        { q: 'What is the eligibility?', a: '10+2 with Physics, Chemistry and Biology. Final eligibility is confirmed by the university at the time of admission.' },
        { q: 'What are the fees?', a: 'Verified year-wise tuition is shown in the fee chart above. Hostel, food and living costs are extra unless stated.' },
        { q: 'Is the medium of instruction English?', a: 'Yes, the DMD programme at our partner universities is delivered in English.' },
      ],
    },
  },

  /* ── NURSING & HEALTH SCIENCES ────────────────────────────────── */
  'nursing-health-sciences': {
    why: {
      kicker: 'Why Study Abroad',
      title: 'Why Nursing & Health Sciences in',
      titleAccent: 'Georgia',
      cards: [
        { icon: Globe2, title: '100% English-Medium', text: 'BSc Nursing and Pharmacy programmes are taught in English at our partner universities.' },
        { icon: FileCheck, title: 'Accredited Universities', text: 'Universities are accredited by the Ministry of Education and Science of Georgia.' },
        { icon: HeartPulse, title: 'Clinical Exposure', text: 'Structured clinical and laboratory training as part of the health-sciences curriculum.' },
        { icon: Wallet, title: 'Affordable Tuition', text: 'Verified year-wise fees published on this page — clear and transparent.' },
        { icon: HomeIcon, title: 'Own Hostel & Indian Food', text: "ABHA's own hostel in Tbilisi with daily Indian meals." },
        { icon: Globe2, title: 'International Exposure', text: 'European (ECTS-based) academic environment with a growing Indian student community.' },
      ],
    },
    comparison: {
      kicker: 'An Honest Comparison',
      title: 'India vs Georgia — Nursing & Health Sciences',
      intro: 'Both routes lead to a valid degree. This is neutral information to help you decide what fits best.',
      leftLabel: 'India (typical)',
      rightLabel: 'Georgia (Tbilisi)',
      rows: [
        { path: 'BSc Nursing Duration', left: '4 years', right: '4 years' },
        { path: 'Admission basis', left: 'Merit / state entrance', right: '12th (PCB) + documents + interview' },
        { path: 'Medium', left: 'English', right: 'English' },
        { path: 'Recognition', left: 'INC / State nursing council', right: 'Accredited by the Ministry of Education and Science of Georgia; recognition for a specific role depends on the requirements of that body' },
      ],
    },
    faq: {
      kicker: 'Questions & Answers',
      title: 'Frequently Asked Questions',
      items: [
        { q: 'What is the eligibility for BSc Nursing?', a: '10+2 with Physics, Chemistry and Biology (typically a minimum of 50%). Final eligibility is confirmed by the university at admission.' },
        { q: 'Are these degrees recognised?', a: 'The programmes are offered by universities accredited by the Ministry of Education and Science of Georgia. Recognition for a specific job, licence or further study depends on the requirements of the country or body concerned.' },
        { q: 'What are the fees?', a: 'Verified year-wise tuition is shown in the fee chart above. Hostel, food and living costs are extra unless stated.' },
        { q: 'Is the course in English?', a: 'Yes, the programmes at our partner universities are delivered in English.' },
        { q: 'Do you provide accommodation?', a: "Yes, ABHA's own hostel in Tbilisi provides accommodation with Indian meals." },
      ],
    },
  },

  /* ── BUSINESS & MANAGEMENT (migrated from the old page) ────────── */
  'business-management': {
    why: {
      kicker: 'Why Georgia',
      title: 'Why Study Business in',
      titleAccent: 'Tbilisi',
      cards: [
        { icon: Globe2, title: '100% English-Medium', text: 'Every programme listed is taught fully in English — no local-language requirement to study.' },
        { icon: GraduationCap, title: 'European ECTS Credits', text: 'Degrees use the European ECTS system (60 ECTS/year), with credits transferable across Europe.' },
        { icon: FileCheck, title: 'No CAT/CUET-Style Exam', text: 'Admission is via documents plus an interview/English test — not a competitive entrance percentile.' },
        { icon: Clock, title: 'Faster Degree Options', text: '3-year BBA and Executive MBA options are available for students who want to finish sooner.' },
        { icon: Wallet, title: 'Lower Tuition', text: 'Tuition is far lower than Western Europe or the USA for comparable European degrees.' },
        { icon: ShieldCheck, title: 'Safe, Student-Friendly Tbilisi', text: 'A welcoming capital city with a growing international student community.' },
      ],
    },
    comparison: {
      kicker: 'An Honest Comparison',
      title: 'India vs Georgia — Duration & Path',
      intro: 'Both routes lead to a valid degree. This is neutral information to help you and your family decide what fits best.',
      leftLabel: 'India (typical)',
      rightLabel: 'Georgia (Tbilisi)',
      rows: [
        { path: 'BBA', left: '3 years (4-year options under NEP)', right: '3 years (SEU/IBSU) or 4 years (UG)' },
        { path: 'MBA', left: '2 years, after competitive entrance (CAT/XAT/CUET)', right: '2 years, no CAT-style entrance' },
        { path: 'Executive MBA', left: '1–2 years', right: '2 years (SEU EMBA)' },
        { path: 'Admission basis', left: 'Entrance exam percentile + cut-offs', right: '12th/degree documents + interview + English proficiency (B1/B2)' },
        { path: 'Medium', left: 'English', right: 'English' },
      ],
    },
    faq: {
      kicker: 'Questions & Answers',
      title: 'Frequently Asked Questions',
      items: [
        { q: 'Am I eligible for a business/management programme after 12th?', a: 'Yes. Students from any stream (Commerce, Science or Arts) who have completed 12th can apply for a Bachelor-level (BBA) programme. Final eligibility is confirmed by the university at admission.' },
        { q: 'What English proficiency do I need?', a: 'At SEU, Bachelor programmes generally require B1-level English and Master programmes require B2-level English. Requirements are assessed through the university’s interview/English test.' },
        { q: 'When are the intakes?', a: 'Georgian universities typically run intakes around the autumn and spring semesters. Exact windows vary by university and programme each year — ask an ABHA counsellor for the current dates.' },
        { q: 'Are these degrees valid?', a: 'The programmes are offered by universities accredited by the Ministry of Education and Science of Georgia and are internationally accredited. Recognition for a specific purpose depends on the requirements of the country or body concerned.' },
        { q: 'Are partner scholarships available for master’s programmes?', a: 'Partner scholarships are available on several master’s programmes, subject to eligibility. Amounts and conditions are set by the university and confirmed at admission.' },
      ],
    },
  },

  /* ── IT, DATA SCIENCE & AI ────────────────────────────────────── */
  'it-data-science-ai': {
    why: {
      kicker: 'Why Georgia',
      title: 'Why Study IT, Data Science & AI in',
      titleAccent: 'Tbilisi',
      cards: [
        { icon: Globe2, title: '100% English-Medium', text: 'BSc and MSc programmes in IT, Data Science, AI and Cybersecurity are taught fully in English.' },
        { icon: GraduationCap, title: 'European ECTS Credits', text: 'Degrees use the European ECTS system, with credits transferable across Europe.' },
        { icon: FileCheck, title: 'No JEE/CUET-Style Exam', text: 'Admission is via documents plus an interview/English test — not a competitive entrance percentile.' },
        { icon: Cpu, title: 'Future-Ready Specializations', text: 'Data Science, Artificial Intelligence, Computer Science and Cybersecurity Engineering.' },
        { icon: Wallet, title: 'Lower Tuition', text: 'Verified year-wise fees, far lower than comparable degrees in Western Europe or the USA.' },
        { icon: Handshake, title: 'International Partnerships', text: 'Exchange and international-partnership opportunities at partner universities.' },
      ],
    },
    comparison: {
      kicker: 'An Honest Comparison',
      title: 'India vs Georgia — Duration & Path',
      intro: 'Both routes lead to a valid degree. This is neutral information to help you decide what fits best.',
      leftLabel: 'India (typical)',
      rightLabel: 'Georgia (Tbilisi)',
      rows: [
        { path: 'Bachelor (BSc)', left: '3–4 years', right: '3 years (SEU/IBSU) or 4 years (UG)' },
        { path: 'Master (MSc)', left: '2 years', right: '2 years' },
        { path: 'Admission basis', left: 'JEE / CUET / entrance percentile', right: '12th/degree documents + interview + English proficiency' },
        { path: 'Medium', left: 'English', right: 'English' },
      ],
    },
    faq: {
      kicker: 'Questions & Answers',
      title: 'Frequently Asked Questions',
      items: [
        { q: 'What is the eligibility?', a: '10+2 for Bachelor programmes (a background in Mathematics is preferred). MSc requires a recognised Bachelor’s degree in a relevant discipline.' },
        { q: 'Are these degrees valid abroad?', a: 'They are internationally accredited European (ECTS-based) degrees. Recognition for a specific job or higher-study programme depends on the requirements of that employer or institution.' },
        { q: 'What specializations are offered?', a: 'IT, Data Science, Artificial Intelligence, Computer Science, Economics and Cybersecurity Engineering — see the fee chart above for the full list.' },
        { q: 'What are the fees?', a: 'Verified year-wise tuition is shown in the fee chart above. Hostel, food and living costs are extra unless stated.' },
        { q: 'Is the course in English?', a: 'Yes, the programmes at our partner universities are delivered in English.' },
      ],
    },
  },

  /* ── MASTERS, MBA & PhD ───────────────────────────────────────── */
  'masters-phd': {
    why: {
      kicker: 'Why Georgia',
      title: 'Why Study Masters, MBA & PhD in',
      titleAccent: 'Tbilisi',
      cards: [
        { icon: Globe2, title: '100% English-Medium', text: 'Master’s, MA, MS, MBA and PhD programmes across disciplines are taught fully in English.' },
        { icon: GraduationCap, title: 'European ECTS Credits', text: 'Degrees use the European ECTS system, with credits transferable across Europe.' },
        { icon: FileCheck, title: 'No CAT-Style Exam', text: 'Admission is via documents plus an interview/English test — not a competitive entrance percentile.' },
        { icon: Clock, title: 'Faster, Flexible Options', text: '2-year master’s and Executive MBA options for students who want to finish sooner.' },
        { icon: Brain, title: 'Research & PhD Pathways', text: 'PhD programmes in Education Sciences, Business Administration, Computer Science and more.' },
        { icon: Wallet, title: 'Lower Tuition', text: 'Verified year-wise fees, far lower than comparable European or US programmes.' },
      ],
    },
    comparison: {
      kicker: 'An Honest Comparison',
      title: 'India vs Georgia — Duration & Path',
      intro: 'Both routes lead to a valid degree. This is neutral information to help you and your family decide what fits best.',
      leftLabel: 'India (typical)',
      rightLabel: 'Georgia (Tbilisi)',
      rows: [
        { path: 'MBA', left: '2 years, after competitive entrance (CAT/XAT/CUET)', right: '2 years, no CAT-style entrance' },
        { path: "Master's (MA / MS)", left: '2 years', right: '2 years' },
        { path: 'PhD', left: '3+ years, entrance + interview', right: '3 years, as per university' },
        { path: 'Admission basis', left: 'Entrance percentile + cut-offs', right: 'Degree documents + interview + English proficiency (B2)' },
        { path: 'Medium', left: 'English', right: 'English' },
      ],
    },
    faq: {
      kicker: 'Questions & Answers',
      title: 'Frequently Asked Questions',
      items: [
        { q: 'What is the eligibility?', a: "Master's / MA / MS require a recognised Bachelor's degree in a relevant field; PhD requires a recognised Master's degree in a relevant field." },
        { q: 'Are these degrees valid?', a: 'They are internationally accredited European (ECTS-based) degrees. Recognition for a specific job, licence or further study depends on the requirements of the country or body concerned.' },
        { q: 'What English proficiency do I need?', a: 'Master’s and PhD programmes generally require B2-level English, assessed through the university’s interview/English test.' },
        { q: 'Are scholarships available?', a: 'Partner scholarships are available on several programmes, subject to eligibility. Amounts and conditions are set by the university and confirmed at admission.' },
        { q: 'What are the fees?', a: 'Verified year-wise tuition is shown in the fee chart above. Hostel, food and living costs are extra unless stated.' },
      ],
    },
  },

  /* ── HUMANITIES, DESIGN & SOCIAL SCIENCES ─────────────────────── */
  'humanities-design': {
    why: {
      kicker: 'Why Georgia',
      title: 'Why Study Humanities & Design in',
      titleAccent: 'Tbilisi',
      cards: [
        { icon: Globe2, title: '100% English-Medium', text: 'Architecture, Psychology and International Relations are taught fully in English at Caucasus University.' },
        { icon: GraduationCap, title: 'European ECTS Credits', text: 'Degrees use the European ECTS system, with credits transferable across Europe.' },
        { icon: FileCheck, title: 'No CUET-Style Exam', text: 'Admission is via documents plus an interview/English test — not a competitive entrance percentile.' },
        { icon: Brain, title: 'Diverse Specializations', text: 'Design (Architecture), behavioural science (Psychology) and global affairs (International Relations).' },
        { icon: Wallet, title: 'Lower Tuition', text: 'Verified year-wise fees, far lower than comparable degrees in Western Europe or the USA.' },
        { icon: ShieldCheck, title: 'Safe, Student-Friendly Tbilisi', text: 'A welcoming capital city with a growing international student community.' },
      ],
    },
    comparison: {
      kicker: 'An Honest Comparison',
      title: 'India vs Georgia — Duration & Path',
      intro: 'Both routes lead to a valid degree. This is neutral information to help you decide what fits best.',
      leftLabel: 'India (typical)',
      rightLabel: 'Georgia (Tbilisi)',
      rows: [
        { path: 'Bachelor', left: '3–5 years (Architecture 5 yrs; Psychology/IR 3 yrs)', right: '4 years (Caucasus University)' },
        { path: 'Admission basis', left: 'CUET / entrance percentile + cut-offs', right: '12th documents + interview + English proficiency' },
        { path: 'Medium', left: 'English', right: 'English' },
        { path: 'Recognition', left: 'UGC / council as applicable', right: 'Accredited by the Ministry of Education and Science of Georgia; recognition for a specific role depends on the requirements of that body' },
      ],
    },
    faq: {
      kicker: 'Questions & Answers',
      title: 'Frequently Asked Questions',
      items: [
        { q: 'What is the eligibility?', a: '10+2 (Higher Secondary) from any stream for the Bachelor programmes. Final eligibility is confirmed by the university at admission.' },
        { q: 'Are these degrees valid?', a: 'The programmes are offered by Caucasus University, accredited by the Ministry of Education and Science of Georgia, and are internationally accredited European (ECTS-based) degrees. Recognition for a specific job, licence or further study depends on the requirements of the country or body concerned.' },
        { q: 'What English proficiency do I need?', a: 'Bachelor programmes generally require B1-level English, assessed through the university’s interview/English test.' },
        { q: 'Which programmes are offered?', a: 'Architecture, Psychology and International Relations at Caucasus University — see the fee chart above for verified year-wise tuition.' },
        { q: 'What are the fees?', a: 'Verified year-wise tuition is shown in the fee chart above. Hostel, food and living costs are extra unless stated.' },
      ],
    },
  },
};
