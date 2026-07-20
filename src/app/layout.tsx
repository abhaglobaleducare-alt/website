import Script from 'next/script';
import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { Manrope, Cormorant_Garamond } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Providers } from '@/providers';
import { SITE_CONFIG } from '@/lib/constants';
import { KOLHAPUR, ALL_OFFICES } from '@/data/contacts';
import './globals.css';

const inter = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const playfair = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-playfair',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0B1A35' },
    { media: '(prefers-color-scheme: dark)', color: '#0B1A35' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: 'ABHA Global Educare — Dreams Have No Borders',
    template: '%s | ABHA Global Educare',
  },
  description: SITE_CONFIG.description,
  keywords: [
    'MBBS abroad',
    'MBBS in Georgia',
    'MBBS in Tbilisi Georgia',
    'MBBS in Timor-Leste',
    'MBBS Timor-Leste for Indian students',
    'Nalanda College of Medicine',
    'MBBS in Russia',
    'MBBS in Russian countries for Indian students',
    'MBBS in CIS countries',
    'medical education abroad for Indian students',
    'NMC and WHO eligible universities',
    'affordable MBBS abroad',
    'MBBS without donation India',
    'NEET 2026 preparation',
    'NEET mock test online',
    'NEET practice hub',
    'NEET coaching Maharashtra',
    'NEET preparation Kolhapur',
    'AGEST exam NEET',
    'NEET Excellence Pathway',
    'overseas education consultancy India',
    'study abroad consultancy India',
    'MBBS abroad consultancy Kolhapur',
    'MBBS abroad consultancy Maharashtra',
    'ABHA Global Educare',
    'ABHA NEET Prep Portal',
    'Bapusaheb Patil Sagaon education grant',
    'best MBBS countries for Indians',
    'MBBS Europe for Indian students',
    'hostel accommodation MBBS abroad',
  ],
  authors: [{ name: 'ABHA Global Educare LLP' }],
  creator: 'ABHA Global Educare LLP',
  publisher: 'ABHA Global Educare LLP',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: 'ABHA Global Educare - Your Gateway to MBBS Abroad',
    description: SITE_CONFIG.description,
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: 'ABHA Global Educare - MBBS Abroad Consultancy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ABHA Global Educare - Your Gateway to MBBS Abroad',
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.ogImage],
    creator: '@abhaeducare',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add verification codes when available
    // google: 'your-google-verification-code',
  },
  alternates: {
    canonical: SITE_CONFIG.url,
    languages: {
      'en-IN': '/en',
      'hi-IN': '/hi',
    },
  },
  category: 'education',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#0B1A35',
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />

        {/* 🔥 META PIXEL */}
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '985465224054639');
            fbq('track', 'PageView');
          `}
        </Script>
      </head>
      <body className="font-sans antialiased bg-white text-primary-navy min-h-screen">
        <NextIntlClientProvider messages={messages}>
          <Providers>
            {/* Skip to main content link for accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-gold focus:text-white focus:rounded-lg"
            >
              Skip to main content
            </a>
            
            {children}

            <div className="fixed left-4 bottom-6 z-50">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-gold to-gold-400 px-4 py-3 text-sm font-bold text-primary-navy shadow-[0_12px_40px_rgba(198,150,46,0.35)] transition-transform duration-300 hover:-translate-y-0.5"
              >
                Book Counselling →
              </Link>
            </div>
          </Providers>
        </NextIntlClientProvider>
        
        {/* Structured Data — Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'EducationalOrganization',
              name: 'ABHA Global Educare LLP',
              alternateName: ['ABHA Educare', 'ABHA NEET Prep Portal'],
              description: SITE_CONFIG.description,
              url: SITE_CONFIG.url,
              logo: `${SITE_CONFIG.url}/images/logo.png`,
              email: SITE_CONFIG.email,
              // Org-level phone = Kolhapur Head Office (from single source of truth).
              telephone: `+${KOLHAPUR.phoneRaw}`,
              address: ALL_OFFICES.map((o) => ({
                '@type': 'PostalAddress',
                streetAddress: o.streetAddress,
                addressLocality: o.addressLocality,
                ...(o.addressRegion ? { addressRegion: o.addressRegion } : {}),
                ...(o.postalCode ? { postalCode: o.postalCode } : {}),
                addressCountry: o.addressCountry,
              })),
              contactPoint: ALL_OFFICES.map((o) => ({
                '@type': 'ContactPoint',
                telephone: `+${o.phoneRaw}`,
                contactType: o.isHeadOffice ? 'customer service' : 'office',
                name: o.label,
                areaServed: o.addressCountry,
              })),
              sameAs: [
                'https://facebook.com/abhaglobaleducare',
                'https://instagram.com/abhaglobaleducare',
                'https://linkedin.com/company/abhaglobaleducare',
                'https://youtube.com/@abhaglobaleducare',
                'https://neet.abhaglobaleducare.com',
              ],
              areaServed: [
                { '@type': 'Country', name: 'India' },
                { '@type': 'Country', name: 'Georgia' },
                { '@type': 'Country', name: 'Timor-Leste' },
                { '@type': 'Country', name: 'Russia' },
              ],
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'ABHA Education Services',
                itemListElement: [
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'MBBS Abroad Admission Guidance',
                      description: 'End-to-end MBBS abroad admission support for NMC & WHO Eligible universities in Georgia, Timor-Leste & the Russian countries.',
                    },
                  },
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Course',
                      name: 'ABHA NEET Preparation Portal',
                      description: 'Online NEET preparation portal with chapter-wise animated PPTs, quick notes, MCQ practice, and weekly tests.',
                      url: 'https://neet.abhaglobaleducare.com',
                      provider: { '@type': 'Organization', name: 'ABHA Global Educare LLP' },
                    },
                  },
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Course',
                      name: 'ABHA NEET Practice Hub — AGEST Mock Tests',
                      description: 'Full 180-question NEET mock tests with +4/−1 marking and personalised score analysis.',
                      url: 'https://neet.abhaglobaleducare.com',
                      provider: { '@type': 'Organization', name: 'ABHA Global Educare LLP' },
                    },
                  },
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Scholarship',
                      name: 'Bapusaheb Patil (Sagaon) Global Education Support Grant',
                      description: 'Merit-based education support grant for NEET aspirants pursuing MBBS abroad through ABHA Global Educare.',
                      provider: { '@type': 'Organization', name: 'ABHA Global Educare LLP' },
                    },
                  },
                ],
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
