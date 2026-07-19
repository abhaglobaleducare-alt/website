import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NeetAnalyzer from '@/components/neet-analyzer/NeetAnalyzer';

export const metadata: Metadata = {
  title: {
    absolute: 'NEET Score Calculator — Score to Rank, Percentile & MBBS Options | ABHA Global Educare',
  },
  description:
    'Free NEET score calculator: turn your NEET marks into an estimated rank, percentile and a complete admission decision — government, private and abroad MBBS chances with cost comparison and roadmap.',
  keywords: [
    'NEET score calculator', 'NEET marks calculator', 'NEET score to rank calculator',
    'NEET percentile', 'NEET result analysis', 'NEET score analysis', 'ABHA Global Educare',
  ],
  openGraph: {
    title: 'NEET Score Calculator — Score to Rank, Percentile & MBBS Options',
    description: 'Turn your NEET marks into an estimated rank, percentile and a complete admission decision with cost comparison and roadmap.',
    url: '/neet-score-calculator',
    type: 'website',
  },
  alternates: { canonical: '/neet-score-calculator' },
};

export default function NeetScoreCalculatorPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <NeetAnalyzer
          heroTitle="NEET Score Calculator"
          heroSubtitle="Turn your NEET marks into an estimated rank and percentile, then get a complete admission decision — government, private and abroad MBBS chances, cost comparison and a personalised roadmap."
          h1="NEET Score Calculator — Score to Rank, Percentile & MBBS Options"
        />
      </main>
      <Footer />
    </>
  );
}
