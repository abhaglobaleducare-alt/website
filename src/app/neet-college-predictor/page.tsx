import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NeetAnalyzer from '@/components/neet-analyzer/NeetAnalyzer';

export const metadata: Metadata = {
  title: {
    absolute: 'NEET College Predictor 2026 — Govt, Private & Abroad MBBS Chances | ABHA Global Educare',
  },
  description:
    'Free NEET college predictor: enter your score & category to see your realistic chances of a government, state-quota, private, deemed or NMC-eligible abroad MBBS seat — with a full cost comparison.',
  keywords: [
    'NEET college predictor', 'NEET college predictor 2026', 'MBBS college predictor',
    'government MBBS chances', 'state quota MBBS predictor', 'private MBBS predictor',
    'MBBS admission predictor Maharashtra', 'ABHA Global Educare',
  ],
  openGraph: {
    title: 'NEET College Predictor 2026 — Govt, Private & Abroad MBBS Chances',
    description: 'See your realistic chances of a government, private, deemed or NMC-eligible abroad MBBS seat, with a full cost comparison.',
    url: '/neet-college-predictor',
    type: 'website',
  },
  alternates: { canonical: '/neet-college-predictor' },
};

export default function NeetCollegePredictorPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <NeetAnalyzer
          heroTitle="NEET College Predictor 2026"
          heroSubtitle="Enter your score and category to see your realistic chances across every MBBS route — government AIQ, state quota, private, deemed and NMC-eligible abroad — each with a clear cost comparison."
          h1="NEET College Predictor 2026 — Government, Private & Abroad MBBS Chances"
        />
      </main>
      <Footer />
    </>
  );
}
