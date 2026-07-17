import Header from '@/components/Header';
import NeetMaharashtraCounselling2026 from '@/components/NeetMaharashtraCounselling2026';
import Footer from '@/components/Footer';

export const metadata = {
  title: {
    absolute:
      'NEET 2026 Score → AIR → College Chart — Maharashtra MBBS Counselling Reference | ABHA Global Educare',
  },
  description:
    'NEET UG 2026 (Re-NEET) Maharashtra counselling reference — marks-to-AIR chart, MCC vs MH CET Cell registration, Maharashtra Govt. medical college closing marks (2025 indicative) आणि score-band route guide. Data compiled 17 July 2026 — indicative, no admission guarantee.',
  keywords: [
    'NEET 2026 marks vs rank', 'NEET 2026 AIR predictor', 'Maharashtra MBBS cutoff 2026',
    'MH CET Cell counselling 2026', 'MCC counselling NEET 2026', 'Maharashtra GMC closing marks',
    'NEET 2026 Maharashtra college chart', 'NEET score to college Maharashtra', 'ABHA Global Educare',
  ],
  openGraph: {
    title: 'NEET 2026 Score → AIR → College Chart — Maharashtra MBBS Counselling Reference',
    description:
      'Marks→AIR chart, MCC vs MH CET Cell registration, Maharashtra GMC closing marks व score-band route guide — ABHA counselling wall chart (indicative).',
    url: '/neet-zone/neet-2026-maharashtra-counselling',
    type: 'article',
  },
  alternates: {
    canonical: '/neet-zone/neet-2026-maharashtra-counselling',
  },
};

export default function NeetMaharashtraCounsellingPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <NeetMaharashtraCounselling2026 />
      </main>
      <Footer />
    </>
  );
}
