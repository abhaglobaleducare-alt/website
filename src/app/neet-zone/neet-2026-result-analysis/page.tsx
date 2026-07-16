import Header from '@/components/Header';
import NeetResultAnalysis2026 from '@/components/NeetResultAnalysis2026';
import Footer from '@/components/Footer';

export const metadata = {
  title: {
    absolute:
      'NEET UG 2026 Result Analysis — Cutoffs, Maharashtra Safe Scores & Next Steps | ABHA Global Educare',
  },
  description:
    'NEET UG 2026 निकाल — संपूर्ण विश्लेषण: official qualifying scores, महाराष्ट्र सरकारी MBBS safe score अंदाज, 580–650 volatility zone alert आणि पुढील मार्गदर्शन. Expert analysis by ABHA Global Educare — free counselling for Maharashtra NEET aspirants.',
  keywords: [
    'NEET 2026 result analysis', 'NEET UG 2026 cutoff', 'NEET 2026 qualifying scores',
    'Maharashtra MBBS cutoff 2026', 'NEET 2026 safe score Maharashtra', 'NEET 2026 निकाल',
    'महाराष्ट्र MBBS cutoff', 'NEET counselling Maharashtra 2026', 'MBBS abroad after NEET 2026',
    'MBBS Georgia NEET 2026', 'ABHA Global Educare',
  ],
  openGraph: {
    title: 'NEET UG 2026 Result Analysis — Cutoffs, Maharashtra Safe Scores & Next Steps',
    description:
      'NEET UG 2026 निकाल — संपूर्ण विश्लेषण व महाराष्ट्र cutoff मार्गदर्शन. Qualifying scores, safe score अंदाज, volatility zone alert — ABHA Global Educare expert report.',
    url: '/neet-zone/neet-2026-result-analysis',
    type: 'article',
  },
  alternates: {
    canonical: '/neet-zone/neet-2026-result-analysis',
  },
};

export default function NeetResultAnalysisPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <NeetResultAnalysis2026 />
      </main>
      <Footer />
    </>
  );
}
