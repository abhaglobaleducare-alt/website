import Header from '@/components/Header';
import Hero from '@/components/Hero';
import StreamCards from '@/components/StreamCards';
import MbbsIntro from '@/components/MbbsIntro';
import Stats from '@/components/Stats';
import WhyAbha from '@/components/WhyAbha';
import IpadOfferCard from '@/components/IpadOfferCard';
import SeatSplitExplainer from '@/components/SeatSplitExplainer';
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
        {/* Seat-split explainer — derived from the NMC 2026 matrix via the
            decision engine, so it can never drift from the analyzer. */}
        <section className="px-4 py-16 sm:px-8">
          <div className="mx-auto max-w-4xl">
            <SeatSplitExplainer state="Maharashtra" />
          </div>
        </section>
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
