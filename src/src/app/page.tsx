import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import WhyAbha from '@/components/WhyAbha';
import HomeCta from '@/components/HomeCta';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <Stats />
        <WhyAbha />
        <HomeCta />
      </main>
      <Footer />
    </>
  );
}
