import Header from '@/components/Header';
import Destinations from '@/components/Destinations';
import Services from '@/components/Services';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'MBBS Abroad Destinations — Georgia, Timor-Leste & Russian Countries',
  description:
    'Explore top MBBS abroad destinations for Indian students — Georgia, Timor-Leste, the Russian countries, Philippines & Bangladesh. NMC & WHO Eligible universities. Affordable fees, English medium, Indian food. ABHA Global Educare, Kolhapur.',
  keywords: [
    'MBBS in Georgia', 'MBBS in Timor-Leste', 'MBBS in Russia', 'MBBS in Russian countries',
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
        <Services />
      </main>
      <Footer />
    </>
  );
}
