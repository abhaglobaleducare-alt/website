import Header from '@/components/Header';
import NeetPracticeHub from '@/components/NeetPracticeHub';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'ABHA NEET Practice Hub 2026 — Full NEET Mock Tests & Score Analysis',
  description:
    'ABHA NEET Practice Hub — full-length 180-question NEET mock tests with +4/−1 marking, personalised subject-wise score analysis, and MCQ practice sets for NEET 2026 aspirants.',
  keywords: [
    'NEET full mock test online 2026', 'NEET practice test 180 questions', 'NEET score analysis',
    'AGEST NEET mock test', 'NEET practice hub India', 'NEET MCQ practice online',
    'full length NEET mock test free', 'NEET 2026 practice test',
  ],
};

export default function NeetPracticeHubPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <NeetPracticeHub />
      </main>
      <Footer />
    </>
  );
}
