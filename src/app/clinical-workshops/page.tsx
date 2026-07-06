import Header from '@/components/Header';
import ClinicalWorkshops from '@/components/ClinicalWorkshops';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Hands-On Anatomy Clinical Workshops — Exclusively with ABHA',
  description:
    'ABHA × Praxis hands-on clinical workshops for MBBS students — animal anatomical specimens (pig heart, sheep brain, goat kidney, goat eye, sheep lungs, pig liver), simulation-based training, expert-led mentorship, and the INCREDOC digital workspace. Practice. Master. Excel.',
  alternates: { canonical: '/clinical-workshops' },
};

export default function ClinicalWorkshopsPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <ClinicalWorkshops />
      </main>
      <Footer />
    </>
  );
}
