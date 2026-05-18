import Header from '@/components/Header';
import Scholarship from '@/components/Scholarship';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'NEET Excellence Pathway 2026 — Scholarship for MBBS Abroad',
  description:
    'Win up to $6,000 scholarship for MBBS abroad! ABHA NEET Excellence Pathway — Bapusaheb Patil (Sagaon) Abroad Educational Grant. Just ₹111 entry. NEET pattern. Top 300 win.',
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
