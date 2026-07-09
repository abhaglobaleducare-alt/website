import Header from '@/components/Header';
import Scholarship from '@/components/Scholarship';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'NEET Excellence Pathway — AGEST 2026 Grant for MBBS in Georgia',
  description:
    'ABHA NEET Excellence Pathway — AGEST 2026. Assured $3,000+ (up to $6,000 for top rankers) education grant for MBBS in Tbilisi, Georgia via the Bapusaheb Patil (Sagaon) Global Education Support Grant. Just ₹111. NEET pattern. Register by 10 July 2026.',
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
