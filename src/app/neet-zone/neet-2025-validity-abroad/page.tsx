import Header from '@/components/Header';
import NeetValidityAbroad2025 from '@/components/NeetValidityAbroad2025';
import Footer from '@/components/Footer';

export const metadata = {
  title: {
    absolute:
      'NEET 2025 Validity for Abroad MBBS — Repeater Students Guide | ABHA Global Educare',
  },
  description:
    'NEET 2025 qualified पण 2026 मध्ये not qualified? तुमचं 2025 scorecard जून 2028 पर्यंत abroad MBBS admission साठी वैध राहतं. NMC/MoHFW नियमांवर आधारित legal basis, validity timeline, checklist आणि cautions — repeater students साठी ABHA Global Educare चा संपूर्ण wall chart.',
  keywords: [
    'NEET 2025 validity abroad MBBS', 'NEET score validity 3 years', 'NEET repeater abroad MBBS',
    'NEET 2025 qualified 2026 not qualified', 'NMC NEET validity abroad', 'MBBS abroad after NEET repeat',
    'NEET eligibility certificate abroad', 'MBBS Georgia NEET 2025', 'NEET validity Maharashtra',
    'ABHA Global Educare', 'FMGL Regulations 2021 NEET',
  ],
  openGraph: {
    title: 'NEET 2025 Validity for Abroad MBBS — Repeater Students Guide',
    description:
      'NEET 2025 qualified → 2026 not qualified → तरीही Abroad MBBS वैध. NMC/MoHFW legal basis, validity timeline (जून 2028 पर्यंत), checklist व cautions — ABHA counselling wall chart.',
    url: '/neet-zone/neet-2025-validity-abroad',
    type: 'article',
  },
  alternates: {
    canonical: '/neet-zone/neet-2025-validity-abroad',
  },
};

export default function NeetValidityAbroadPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <NeetValidityAbroad2025 />
      </main>
      <Footer />
    </>
  );
}
