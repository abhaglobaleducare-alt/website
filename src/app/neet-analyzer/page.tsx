import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NeetAnalyzer from '@/components/neet-analyzer/NeetAnalyzer';

export const metadata: Metadata = {
  title: {
    absolute: 'NEET Admission Decision Engine — Rank, College & Cost Analyzer | ABHA Global Educare',
  },
  description:
    'Free NEET admission decision engine: enter your score to get estimated AIR, government & private MBBS chances, a full cost comparison, confidence score and a personalised roadmap. Built by ABHA Global Educare for NEET aspirants.',
  keywords: [
    'NEET admission predictor', 'NEET decision engine', 'NEET college predictor',
    'NEET rank predictor 2026', 'MBBS admission chances', 'government MBBS predictor',
    'MBBS abroad after NEET', 'NEET counselling Maharashtra', 'ABHA Global Educare',
  ],
  openGraph: {
    title: 'NEET Admission Decision Engine — Rank, College & Cost Analyzer',
    description:
      'Enter your NEET score → estimated rank, Govt/Private/Abroad chances, cost comparison, confidence score and a personalised roadmap.',
    url: '/neet-analyzer',
    type: 'website',
  },
  alternates: { canonical: '/neet-analyzer' },
};

export default function NeetAnalyzerPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <NeetAnalyzer
          heroTitle="NEET Admission Decision Engine"
          heroSubtitle="Not just a rank calculator — a complete decision system. Enter your NEET score and get your estimated rank, government & private chances, an honest cost comparison, a confidence score and a personalised roadmap."
          h1="NEET Admission Decision Engine — Rank, College & Cost Analyzer"
        />
      </main>
      <Footer />
    </>
  );
}
