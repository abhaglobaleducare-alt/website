import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { ThemeRegistry } from '../components/shared/theme-registry';
import { PwaRegister } from '../components/shared/pwa-register';
import { PwaInstallPrompt } from '../components/shared/pwa-install-prompt';

export const metadata: Metadata = {
  title: 'ABHA Global Educare',
  description: 'Staff CRM & productivity system for ABHA Global Educare LLP',
  manifest: '/manifest.json',
  applicationName: 'ABHA CRM',
  appleWebApp: {
    capable: true,
    title: 'ABHA CRM',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#F5A623',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <PwaRegister />
          {children}
          <PwaInstallPrompt />
        </ThemeRegistry>
      </body>
    </html>
  );
}
