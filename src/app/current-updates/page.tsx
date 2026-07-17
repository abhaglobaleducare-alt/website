import Header from '@/components/Header';
import CurrentUpdates from '@/components/CurrentUpdates';
import Footer from '@/components/Footer';

export const metadata = {
  title: {
    absolute: 'Current Updates — NEET Analysis, Cutoffs & Abroad MBBS Guidance | ABHA Global Educare',
  },
  description:
    'ABHA Global Educare Current Updates — NEET निकाल विश्लेषण, महाराष्ट्र cutoff मार्गदर्शन, NEET validity charts आणि abroad MBBS संबंधित महत्त्वाच्या घडामोडी एका ठिकाणी.',
  keywords: [
    'NEET updates 2026', 'NEET result analysis', 'NEET cutoff Maharashtra',
    'MBBS abroad news', 'NEET validity abroad', 'ABHA Global Educare updates',
  ],
  openGraph: {
    title: 'Current Updates — NEET Analysis, Cutoffs & Abroad MBBS Guidance',
    description:
      'NEET निकाल विश्लेषण, cutoff मार्गदर्शन, validity charts आणि महत्त्वाच्या घडामोडी — ABHA Global Educare.',
    url: '/current-updates',
    type: 'website',
  },
  alternates: {
    canonical: '/current-updates',
  },
};

export default function CurrentUpdatesPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <CurrentUpdates />
      </main>
      <Footer />
    </>
  );
}
