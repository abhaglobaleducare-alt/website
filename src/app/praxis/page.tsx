import Header from '@/components/Header';
import Praxis from '@/components/Praxis';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Clinical Workshops',
  description: 'Hands-on clinical workshops powered by our own skill-tech platform — standardized medical training, expert faculty, and digital workspace for MBBS students abroad.',
};

export default function PraxisPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Praxis />
      </main>
      <Footer />
    </>
  );
}
