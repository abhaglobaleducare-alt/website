import Header from '@/components/Header';
import NeetPracticeHub from '@/components/NeetPracticeHub';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'NEET Practice Hub — Register Now',
  description:
    'Register for ABHA NEET Practice Hub. Full NEET mock tests (180 questions, 3 hours), weekly tests, daily MCQ practice, and performance analytics. ₹1,111/year.',
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
