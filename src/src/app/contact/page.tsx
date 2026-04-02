import Header from '@/components/Header';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Contact Us',
  description: 'Get in touch with ABHA Global Educare - Kolhapur Head Office, Chhatrapati Sambhajinagar Branch, and Georgia International Office.',
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Contact />
      </main>
      <Footer />
    </>
  );
}
