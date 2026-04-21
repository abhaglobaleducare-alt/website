import Script from 'next/script';
import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { Inter, Playfair_Display } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Providers } from '@/providers';
import { SITE_CONFIG } from '@/lib/constants';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
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
    default: 'ABHA Global Educare - Your Gateway to MBBS Abroad',
    template: '%s | ABHA Global Educare',
  },
  description: SITE_CONFIG.description,
  keywords: [
    'MBBS abroad',
    'study MBBS in Russia',
    'MBBS in Georgia',
    'MBBS in Kazakhstan',
    'MBBS in Kyrgyzstan',
    'medical education abroad',
    'NMC approved universities',
    'NEET counseling',
    'overseas education consultancy',
    'ABHA Global Educare',
    'MBBS abroad consultancy Kolhapur',
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
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'EducationalOrganization',
              name: 'ABHA Global Educare LLP',
              alternateName: 'ABHA Educare',
              description: SITE_CONFIG.description,
              url: SITE_CONFIG.url,
              logo: `${SITE_CONFIG.url}/images/logo.png`,
              email: SITE_CONFIG.email,
              telephone: '+91-74475-52878',
              address: [
                {
                  '@type': 'PostalAddress',
                  streetAddress: '203, Lotus Plaza, Shahupuri',
                  addressLocality: 'Kolhapur',
                  addressRegion: 'Maharashtra',
                  postalCode: '416001',
                  addressCountry: 'IN',
                },
                {
                  '@type': 'PostalAddress',
                  streetAddress: 'Office No. 01, Plot No. B-1, Aliza Mazil, Osmanpura',
                  addressLocality: 'Chatrapati Sambhajinagar',
                  addressRegion: 'Maharashtra',
                  addressCountry: 'IN',
                },
              ],
              sameAs: [
                'https://facebook.com/abhaglobaleducare',
                'https://instagram.com/abhaglobaleducare',
                'https://linkedin.com/company/abhaglobaleducare',
                'https://youtube.com/@abhaglobaleducare',
              ],
              areaServed: {
                '@type': 'Country',
                name: 'India',
              },
              serviceType: ['Educational Consulting', 'MBBS Abroad Admission', 'Visa Assistance'],
            }),
          }}
        />
      </body>
    </html>
  );
}
