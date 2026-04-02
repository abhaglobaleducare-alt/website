import Header from '@/components/Header';
import Services from '@/components/Services';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Our Services',
  description: 'Complete MBBS abroad support - Expert Counselling, Documentation, Pre-Departure, Own Accommodation, Indian Food Services, and Clinical Workshops by INCREDOC.',
};

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Services />
      </main>
      <Footer />
    </>
  );
}
