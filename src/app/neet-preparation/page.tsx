import Header from '@/components/Header';
import NeetPreparation from '@/components/NeetPreparation';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'ABHA NEET Preparation Portal 2026 — Animated PPTs, Quick Notes, MCQ Practice',
  description:
    'Join ABHA NEET Preparation Portal for NEET 2026 — chapter-wise animated PPT revision, quick notes with memory joggers, daily MCQ practice, and weekly assessment tests for Physics, Chemistry, Botany & Zoology. Part of the ABHA NEET Coaching Package — ₹2,110/year. Register now.',
  keywords: [
    'NEET 2026 preparation portal', 'NEET preparation online India', 'NEET study material online',
    'NCERT notes NEET', 'NEET MCQ practice', 'NEET animated PPT revision',
    'NEET preparation Kolhapur', 'NEET coaching Maharashtra', 'ABHA NEET portal',
  ],
};

export default function NeetPreparationPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <NeetPreparation />
      </main>
      <Footer />
    </>
  );
}
