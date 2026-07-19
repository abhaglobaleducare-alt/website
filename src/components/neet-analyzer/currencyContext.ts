'use client';

import { createContext, useContext } from 'react';

export type Currency = 'INR' | 'USD';

/** Selected display currency for all cost figures in the analyzer. */
export const CurrencyContext = createContext<Currency>('INR');

export const useCurrency = () => useContext(CurrencyContext);
