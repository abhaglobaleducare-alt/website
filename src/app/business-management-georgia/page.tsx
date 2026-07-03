import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Content from './Content';
import { faqs } from './faqData';

export const metadata: Metadata = {
  title: 'Business Management Studies in Georgia | BBA, MBA in Tbilisi | ABHA Global Educare',
  description:
    'English-medium BBA, MBA & Executive MBA in Tbilisi, Georgia at SEU & University of Georgia. Verified tuition, no CAT-style entrance. ABHA guides your admission.',
  alternates: {
    canonical: '/business-management-georgia',
  },
  openGraph: {
    type: 'website',
    url: 'https://abhaglobaleducare.com/business-management-georgia',
    title: 'Business Management Studies in Tbilisi, Georgia | ABHA Global Educare',
    description:
      'English-medium BBA, MBA & Executive MBA in Tbilisi at SEU & University of Georgia. Verified tuition, no CAT-style entrance. ABHA guides your admission.',
    siteName: 'ABHA Global Educare',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Business Management Studies in Tbilisi, Georgia | ABHA Global Educare',
    description:
      'English-medium BBA, MBA & Executive MBA in Tbilisi at SEU & University of Georgia. ABHA guides your admission.',
  },
};

export default function BusinessManagementGeorgiaPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <Header />
      <main id="main-content">
        <Content />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
