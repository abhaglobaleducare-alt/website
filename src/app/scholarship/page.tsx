import Header from '@/components/Header';
import Scholarship from '@/components/Scholarship';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Offers & Scholarships — Free iPad Early Bird Offer & AGEST 2026 | ABHA Global Educare',
  description:
    'Register for MBBS Abroad with ABHA Global Educare and get a FREE iPad delivered after visa approval (limited-period Early Bird offer). Plus AGEST 2026 — successfully conducted: India’s first consistency-based scholarship test, top 300 scholars selected, offering the Bapusaheb Patil (Sagaon) Global Education Support Grant ($3,000–$6,000) for NMC & WHO Eligible MBBS in Tbilisi, Georgia.',
};

export default function ScholarshipPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Scholarship />
      </main>
      <Footer />
    </>
  );
}
