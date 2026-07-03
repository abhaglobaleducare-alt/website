/**
 * Per-stream presentation metadata for the /courses/[stream] pages and the
 * homepage "Explore by Stream" cards. Course/fee data lives in ./courses.
 */
import {
  Stethoscope,
  Activity,
  HeartPulse,
  Briefcase,
  Cpu,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react';
import type { StreamSlug } from './courses';

export interface StreamMeta {
  slug: StreamSlug;
  /** Short label used in the nav dropdown. */
  navLabel: string;
  /** Card title on the homepage. */
  cardTitle: string;
  /** Full page hero title. */
  title: string;
  /** One-line value proposition (hero sub + card description). */
  valueProp: string;
  icon: LucideIcon;
  /** Illustrative course image (public/images/destinations/course-*.svg). */
  image: string;
  /** True only for MBBS/MD — gates "NMC & WHO Eligible" wording. */
  isMedical: boolean;
  eligibility: string[];
  /** India-practice / accreditation disclaimer block. */
  disclaimer: string;
  /** Accreditation line for university cards. */
  accreditation: string;
  seoTitle: string;
  seoDescription: string;
}

export const STREAMS: StreamMeta[] = [
  {
    slug: 'medicine',
    navLabel: 'Medicine – MBBS / MD',
    cardTitle: 'Medicine — MBBS / MD',
    title: 'Medicine — MBBS / MD',
    valueProp:
      'English-medium MBBS / M.D. at NMC & WHO Eligible universities in Georgia & Timor-Leste.',
    icon: Stethoscope,
    image: '/images/destinations/course-medicine-mbbs.svg',
    isMedical: true,
    eligibility: [
      '10+2 with Physics, Chemistry & Biology (minimum 50%; 40% for reserved categories).',
      'NEET qualification is mandatory for Indian students as per NMC norms.',
      'Minimum age of 17 years on or before 31 December of the admission year.',
      'Valid passport for international admission and visa processing.',
    ],
    disclaimer:
      'For practice in India, foreign medical graduates must qualify FMGE/NExT as per NMC norms. Under the NMC, the National Exit Test (NExT) is being introduced as a common exit & licence exam for all MBBS graduates — including Indian college graduates — replacing FMGE and NEET-PG; its rollout is currently deferred, with FMGE applying to foreign medical graduates in the interim.',
    accreditation: 'NMC & WHO Eligible',
    seoTitle: 'MBBS / MD Abroad — Georgia & Timor-Leste | ABHA Global Educare',
    seoDescription:
      'English-medium MBBS / M.D. at NMC & WHO Eligible universities in Tbilisi, Batumi (Georgia) and Dili (Timor-Leste). Verified year-wise fees. ABHA guides your admission.',
  },
  {
    slug: 'dentistry',
    navLabel: 'Dentistry (DMD)',
    cardTitle: 'Dentistry (DMD)',
    title: 'Dentistry — Doctor of Dental Medicine (DMD)',
    valueProp:
      'Doctor of Dental Medicine (DMD) programmes at accredited universities in Tbilisi, Georgia.',
    icon: Activity,
    image: '/images/destinations/course-dentistry-dmd.svg',
    isMedical: false,
    eligibility: [
      '10+2 with Physics, Chemistry & Biology.',
      'NEET qualification as per NMC/NDC norms for Indian students who intend to practise in India.',
      'Valid passport for international admission and visa processing.',
    ],
    disclaimer:
      'For practice in India, National Dental Commission (NDC) rules apply — qualifying NExT (Dental) is mandatory for foreign dental graduates.',
    accreditation: 'Accredited by the Ministry of Education and Science of Georgia',
    seoTitle: 'Dentistry (DMD) in Georgia | ABHA Global Educare',
    seoDescription:
      'Doctor of Dental Medicine (DMD) at accredited universities in Tbilisi, Georgia — SEU, European University and University of Georgia. Verified fees. ABHA guides your admission.',
  },
  {
    slug: 'nursing-health-sciences',
    navLabel: 'Nursing & Health Sciences',
    cardTitle: 'Nursing & Health Sciences',
    title: 'Nursing & Health Sciences',
    valueProp:
      'BSc Nursing, Pharmacy & allied health sciences at accredited Georgian universities.',
    icon: HeartPulse,
    image: '/images/destinations/course-nursing-health.svg',
    isMedical: false,
    eligibility: [
      '10+2 with Physics, Chemistry & Biology (minimum 50%).',
      'Valid passport for international admission and visa processing.',
      'English proficiency as assessed by the university at admission.',
    ],
    disclaimer:
      'Universities are accredited by the Ministry of Education and Science of Georgia. These are academic degrees; recognition for any specific job, licensing or further study depends on the requirements of the country or body concerned.',
    accreditation: 'Accredited by the Ministry of Education and Science of Georgia',
    seoTitle: 'BSc Nursing & Health Sciences in Georgia | ABHA Global Educare',
    seoDescription:
      'BSc Nursing and Pharmacy at accredited universities in Tbilisi, Georgia — SEU and University of Georgia. Verified fees. ABHA guides your admission.',
  },
  {
    slug: 'business-management',
    navLabel: 'Business & Management',
    cardTitle: 'Business & Management',
    title: 'Business & Management',
    valueProp:
      'English-medium BBA, MBA & Executive MBA in Tbilisi — no CAT-style entrance.',
    icon: Briefcase,
    image: '/images/destinations/course-business-mgmt.svg',
    isMedical: false,
    eligibility: [
      'BBA: 10+2 (Higher Secondary) from any stream — Commerce, Science or Arts.',
      "MBA / EMBA: a recognised Bachelor's degree in any discipline.",
      'English proficiency (typically B1 for Bachelor, B2 for Master) as assessed by the university.',
    ],
    disclaimer:
      'Universities are accredited by the Ministry of Education and Science of Georgia. These are internationally accredited European (ECTS-based) degrees; recognition for any specific job, licensing or further study depends on the requirements of the country or body concerned.',
    accreditation: 'Accredited by the Ministry of Education and Science of Georgia',
    seoTitle: 'BBA, MBA & Executive MBA in Georgia | ABHA Global Educare',
    seoDescription:
      'English-medium BBA, MBA, EMBA & business masters in Tbilisi at SEU, University of Georgia & IBSU. No CAT-style entrance. Verified tuition. ABHA guides your admission.',
  },
  {
    slug: 'it-data-science-ai',
    navLabel: 'IT, Data Science & AI',
    cardTitle: 'IT, Data Science & AI',
    title: 'IT, Data Science & AI',
    valueProp:
      'Future-ready BSc / MSc in IT, Data Science, AI & Cybersecurity in Georgia.',
    icon: Cpu,
    image: '/images/destinations/course-it-data-ai.svg',
    isMedical: false,
    eligibility: [
      '10+2 for Bachelor programmes (a background in Mathematics is preferred).',
      "MSc: a recognised Bachelor's degree in a relevant discipline.",
      'English proficiency as assessed by the university at admission.',
    ],
    disclaimer:
      'Universities are accredited by the Ministry of Education and Science of Georgia. These are internationally accredited European (ECTS-based) degrees; recognition for any specific job, licensing or further study depends on the requirements of the country or body concerned.',
    accreditation: 'Accredited by the Ministry of Education and Science of Georgia',
    seoTitle: 'IT, Data Science, AI & Cybersecurity in Georgia | ABHA Global Educare',
    seoDescription:
      'BSc & MSc in Information Technology, Data Science, Artificial Intelligence & Cybersecurity in Tbilisi at SEU, University of Georgia & IBSU. Verified fees.',
  },
  {
    slug: 'masters-phd',
    navLabel: 'Masters, MBA & PhD',
    cardTitle: 'Masters, MBA & PhD',
    title: 'Masters, MBA & PhD',
    valueProp:
      "Master's, MBA & PhD programmes across disciplines at Georgian universities.",
    icon: GraduationCap,
    image: '/images/destinations/course-masters-mba-phd.svg',
    isMedical: false,
    eligibility: [
      "Master's / MA / MS: a recognised Bachelor's degree in a relevant field.",
      "PhD: a recognised Master's degree in a relevant field.",
      'English proficiency (typically B2) as assessed by the university at admission.',
    ],
    disclaimer:
      'Universities are accredited by the Ministry of Education and Science of Georgia. These are internationally accredited European (ECTS-based) degrees; recognition for any specific job, licensing or further study depends on the requirements of the country or body concerned.',
    accreditation: 'Accredited by the Ministry of Education and Science of Georgia',
    seoTitle: "Master's, MBA & PhD Programmes in Georgia | ABHA Global Educare",
    seoDescription:
      "English-medium Bachelor's, Master's, MA, MS, MBA & PhD programmes across disciplines at IBSU and University of Georgia in Tbilisi. Verified fees.",
  },
];

export const STREAM_SLUGS: StreamSlug[] = STREAMS.map((s) => s.slug);

/** Options for "Field of Interest" dropdowns (home eligibility + contact form). */
export const COURSE_OPTIONS = STREAMS.map((s) => ({ value: s.navLabel, label: s.navLabel }));

export function getStreamMeta(slug: string): StreamMeta | undefined {
  return STREAMS.find((s) => s.slug === slug);
}
