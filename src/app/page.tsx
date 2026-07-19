import Header from '@/components/Header';
import Hero from '@/components/Hero';
import StreamCards from '@/components/StreamCards';
import MbbsIntro from '@/components/MbbsIntro';
import Stats from '@/components/Stats';
import WhyAbha from '@/components/WhyAbha';
import IpadOfferCard from '@/components/IpadOfferCard';
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
        <section className="bg-light-gray px-4 py-16 sm:px-8">
          <div className="mx-auto max-w-5xl">
            <IpadOfferCard />
          </div>
        </section>
        <HomeCta />
      </main>
      <Footer />
    </>
  );
}
