'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { EXCHANGE_RATE_INR } from '@/data/config';
import type { Course, StreamSlug } from '@/data/courses';
import { courseId } from '@/data/courses';

/* ─────────────────────────── Currency ─────────────────────────── */

export type Currency = 'USD' | 'INR';
const CURRENCY_KEY = 'abha-currency';

export function usdToInr(usd: number): number {
  return Math.round(usd * EXCHANGE_RATE_INR);
}

function formatUSD(n: number): string {
  return '$' + new Intl.NumberFormat('en-US').format(n);
}

function formatINR(n: number): string {
  return '₹' + new Intl.NumberFormat('en-IN').format(n);
}

/** Format a pure numeric USD amount in the active currency. */
export function formatMoney(usd: number, currency: Currency): string {
  return currency === 'INR' ? formatINR(usdToInr(usd)) : formatUSD(usd);
}

/**
 * Convert any `$1,950` style amounts embedded in a free-text string. Text with
 * no dollar figure ("As per university schedule") is returned unchanged.
 */
function convertEmbedded(str: string, currency: Currency): string {
  if (currency === 'USD') return str;
  return str.replace(/\$\s?([\d,]+(?:\.\d+)?)/g, (match, num: string) => {
    const val = parseFloat(num.replace(/,/g, ''));
    if (Number.isNaN(val)) return match;
    return formatINR(usdToInr(val));
  });
}

/** Format a fee cell that may be a number or a descriptive string. */
export function formatFee(value: number | string, currency: Currency): string {
  if (typeof value === 'number') return formatMoney(value, currency);
  return convertEmbedded(value, currency);
}

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  toggle: () => void;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('USD');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(CURRENCY_KEY);
      if (saved === 'USD' || saved === 'INR') setCurrencyState(saved);
    } catch {
      /* localStorage unavailable — keep default */
    }
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    try {
      window.localStorage.setItem(CURRENCY_KEY, c);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => {
    setCurrencyState((prev) => {
      const next = prev === 'USD' ? 'INR' : 'USD';
      try {
        window.localStorage.setItem(CURRENCY_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ currency, setCurrency, toggle }),
    [currency, setCurrency, toggle],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within a CurrencyProvider');
  return ctx;
}

/* ─────────────────────────── Compare ──────────────────────────── */

export const MAX_COMPARE = 3;

interface CompareContextValue {
  selected: Course[];
  isSelected: (c: Course) => boolean;
  toggle: (c: Course) => void;
  remove: (c: Course) => void;
  clear: () => void;
  canAdd: boolean;
  isOpen: boolean;
  openComparison: () => void;
  closeComparison: () => void;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<Course[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const isSelected = useCallback(
    (c: Course) => selected.some((s) => courseId(s) === courseId(c)),
    [selected],
  );

  const toggle = useCallback((c: Course) => {
    setSelected((prev) => {
      const exists = prev.some((s) => courseId(s) === courseId(c));
      if (exists) return prev.filter((s) => courseId(s) !== courseId(c));
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, c];
    });
  }, []);

  const remove = useCallback((c: Course) => {
    setSelected((prev) => prev.filter((s) => courseId(s) !== courseId(c)));
  }, []);

  const clear = useCallback(() => setSelected([]), []);
  const openComparison = useCallback(() => setIsOpen(true), []);
  const closeComparison = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({
      selected,
      isSelected,
      toggle,
      remove,
      clear,
      canAdd: selected.length < MAX_COMPARE,
      isOpen,
      openComparison,
      closeComparison,
    }),
    [selected, isSelected, toggle, remove, clear, isOpen, openComparison, closeComparison],
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare(): CompareContextValue {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within a CompareProvider');
  return ctx;
}

/* ─────────────────────────── Enquiry ──────────────────────────── */

export interface EnquiryContextData {
  stream: string;
  university: string;
  course: string;
}

interface EnquiryContextValue {
  isOpen: boolean;
  data: EnquiryContextData;
  openEnquiry: (data: Partial<EnquiryContextData>) => void;
  closeEnquiry: () => void;
}

const DEFAULT_ENQUIRY: EnquiryContextData = {
  stream: 'Any / Not decided',
  university: 'Any / Not decided',
  course: 'Any / Not decided',
};

const EnquiryContext = createContext<EnquiryContextValue | null>(null);

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<EnquiryContextData>(DEFAULT_ENQUIRY);

  const openEnquiry = useCallback((next: Partial<EnquiryContextData>) => {
    setData({ ...DEFAULT_ENQUIRY, ...next });
    setIsOpen(true);
  }, []);

  const closeEnquiry = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, data, openEnquiry, closeEnquiry }),
    [isOpen, data, openEnquiry, closeEnquiry],
  );

  return <EnquiryContext.Provider value={value}>{children}</EnquiryContext.Provider>;
}

export function useEnquiry(): EnquiryContextValue {
  const ctx = useContext(EnquiryContext);
  if (!ctx) throw new Error('useEnquiry must be used within an EnquiryProvider');
  return ctx;
}

/** Convenience: derive a friendly stream label from a slug. */
export const STREAM_LABELS: Record<StreamSlug, string> = {
  medicine: 'Medicine (MBBS / MD)',
  dentistry: 'Dentistry (DMD)',
  'nursing-health-sciences': 'Nursing & Health Sciences',
  'business-management': 'Business & Management',
  'it-data-science-ai': 'IT, Data Science & AI',
  'masters-phd': 'Masters, MBA & PhD',
  'humanities-design': 'Humanities, Design & Social Sciences',
};
