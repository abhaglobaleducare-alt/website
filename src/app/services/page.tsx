import Header from '@/components/Header';
import Services from '@/components/Services';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'MBBS Abroad Services — Counselling, Admission, Visa & Support',
  description:
    'ABHA Global Educare provides end-to-end MBBS abroad services — free counselling, university selection, admission processing, visa assistance, travel arrangement, own accommodation, Indian food, and post-arrival support for Indian students.',
  keywords: [
    'MBBS abroad admission guidance India', 'MBBS abroad visa assistance',
    'overseas MBBS consultancy services', 'free MBBS counselling India',
    'MBBS abroad documentation India', 'study abroad support Indian students',
  ],
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
