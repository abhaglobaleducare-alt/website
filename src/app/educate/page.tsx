import Header from '@/components/Header';
import Educate from '@/components/Educate';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Educate Yourself | MBBS Abroad Guide | ABHA Global Educare',
  description: 'Complete guide to MBBS abroad — NMC guidelines, NEXT/FMGE exam, cost comparison between Georgia & Kyrgyzstan, visa process, and honest answers to all your questions.',
};

export default function EducatePage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Educate />
      </main>
      <Footer />
    </>
  );
}
