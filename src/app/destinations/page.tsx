import Header from '@/components/Header';
import Destinations from '@/components/Destinations';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'MBBS Abroad Destinations — Georgia',
  description:
    'Explore top MBBS abroad destinations for Indian students — Georgia, Philippines, Bangladesh. NMC & WHO Eligible universities. Affordable fees, English medium, Indian food. ABHA Global Educare, Kolhapur.',
  keywords: [
    'MBBS in Georgia',
    'MBBS abroad destinations India', 'NMC WHO eligible MBBS', 'affordable MBBS abroad',
    'MBBS without donation', 'MBBS Europe Indian students',
  ],
};

export default function DestinationsPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Destinations />
      </main>
      <Footer />
    </>
  );
}
