import Header from '@/components/Header';
import Gallery from '@/components/Gallery';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Gallery & Reviews | ABHA Global Educare',
  description: 'See real photos from our hostel, campuses, and clinical workshops, plus testimonials from 500+ students who chose ABHA Global Educare for MBBS abroad.',
};

export default function GalleryPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Gallery />
      </main>
      <Footer />
    </>
  );
}
