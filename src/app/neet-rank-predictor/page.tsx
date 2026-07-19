import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NeetAnalyzer from '@/components/neet-analyzer/NeetAnalyzer';

export const metadata: Metadata = {
  title: {
    absolute: 'NEET Rank Predictor 2026 — Estimate Your AIR from Your Score | ABHA Global Educare',
  },
  description:
    'Free NEET rank predictor: convert your NEET score into an estimated All India Rank and percentile using previous-year NTA data, then see which MBBS routes open up. Instant, no sign-up.',
  keywords: [
    'NEET rank predictor', 'NEET rank predictor 2026', 'NEET score to rank', 'NEET AIR predictor',
    'NEET percentile calculator', 'estimate NEET rank', 'NEET marks vs rank', 'ABHA Global Educare',
  ],
  openGraph: {
    title: 'NEET Rank Predictor 2026 — Estimate Your AIR from Your Score',
    description: 'Convert your NEET score into an estimated All India Rank and percentile, then see which MBBS routes open up.',
    url: '/neet-rank-predictor',
    type: 'website',
  },
  alternates: { canonical: '/neet-rank-predictor' },
};

export default function NeetRankPredictorPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <NeetAnalyzer
          heroTitle="NEET Rank Predictor 2026"
          heroSubtitle="Convert your NEET score into an estimated All India Rank and percentile using previous-year NTA data — then instantly see the government, private and abroad MBBS routes your rank unlocks."
          h1="NEET Rank Predictor 2026 — Estimate Your All India Rank"
        />
      </main>
      <Footer />
    </>
  );
}
