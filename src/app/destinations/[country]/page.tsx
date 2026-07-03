import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DestinationDetail from '@/components/DestinationDetail';
import { DESTINATION_DETAILS } from '@/data/destinations';

export function generateStaticParams() {
  return Object.keys(DESTINATION_DETAILS).map((country) => ({ country }));
}

export const dynamicParams = false;

export function generateMetadata({ params }: { params: { country: string } }): Metadata {
  const data = DESTINATION_DETAILS[params.country];
  if (!data) return {};
  return {
    title: data.seoTitle,
    description: data.seoDescription,
    alternates: { canonical: `/destinations/${data.slug}` },
    openGraph: {
      type: 'website',
      url: `https://abhaglobaleducare.com/destinations/${data.slug}`,
      title: data.seoTitle,
      description: data.seoDescription,
      siteName: 'ABHA Global Educare',
      locale: 'en_IN',
    },
  };
}

export default function DestinationCountryPage({ params }: { params: { country: string } }) {
  const data = DESTINATION_DETAILS[params.country];
  if (!data) notFound();
  return (
    <>
      <Header />
      <main id="main-content">
        <DestinationDetail data={data} />
      </main>
      <Footer />
    </>
  );
}
