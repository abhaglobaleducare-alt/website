import Header from '@/components/Header';
import Scholarship from '@/components/Scholarship';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'AGEST 2026 — ABHA Global Educare Scholarship Test',
  description:
    'Win up to $6,000 scholarship for MBBS abroad! Register for AGEST 2026 — Bapusaheb Patil (Sagaon) Abroad Educational Grant. Just ₹111 entry. NEET pattern. Top 300 win.',
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
