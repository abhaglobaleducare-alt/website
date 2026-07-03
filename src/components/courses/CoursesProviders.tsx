'use client';

import type { ReactNode } from 'react';
import { CurrencyProvider, CompareProvider, EnquiryProvider } from './context';
import EnquiryModal from './EnquiryModal';
import CompareBar from './CompareBar';
import ComparisonView from './ComparisonView';

/**
 * Wraps every /courses page in the shared Currency / Compare / Enquiry state and
 * renders the floating comparison bar, full-screen comparison view and enquiry
 * modal so they are available from any course page CTA.
 */
export default function CoursesProviders({ children }: { children: ReactNode }) {
  return (
    <CurrencyProvider>
      <CompareProvider>
        <EnquiryProvider>
          {children}
          <CompareBar />
          <ComparisonView />
          <EnquiryModal />
        </EnquiryProvider>
      </CompareProvider>
    </CurrencyProvider>
  );
}
