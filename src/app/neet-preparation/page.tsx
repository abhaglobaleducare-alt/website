import Header from '@/components/Header';
import NeetPreparation from '@/components/NeetPreparation';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'NEET Preparation Portal — Register Now',
  description:
    'Register for ABHA NEET Preparation Portal. Chapterwise revision with animated PPTs, quick notes, and MCQ practice for Physics, Chemistry, Botany & Zoology. ₹999/year.',
};

export default function NeetPreparationPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <NeetPreparation />
      </main>
      <Footer />
    </>
  );
}
