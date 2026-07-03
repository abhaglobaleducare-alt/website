import Header from '@/components/Header';
import Hero from '@/components/Hero';
import StreamCards from '@/components/StreamCards';
import MbbsIntro from '@/components/MbbsIntro';
import Stats from '@/components/Stats';
import WhyAbha from '@/components/WhyAbha';
import AgestOfferBanner from '@/components/AgestOfferBanner';
import HomeCta from '@/components/HomeCta';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <StreamCards />
        <MbbsIntro />
        <Stats />
        <WhyAbha />
        <AgestOfferBanner />
        <HomeCta />
      </main>
      <Footer />
    </>
  );
}
