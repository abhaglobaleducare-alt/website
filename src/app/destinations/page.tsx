import Header from '@/components/Header';
import Destinations from '@/components/Destinations';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Destinations',
  description: 'Explore top MBBS abroad destinations - Georgia & Kyrgyzstan. NMC guidelines Eligible universities, own accommodation, and Indian food services.',
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
