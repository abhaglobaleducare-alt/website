'use client';

import { useEffect } from 'react';
import type { ReactNode } from 'react';

export function ThemeRegistry({ children }: { children: ReactNode }) {
  useEffect(() => {
    const stored = window.localStorage.getItem('theme');
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme = stored ?? system;
    document.documentElement.dataset.theme = theme;
  }, []);

  return <>{children}</>;
}
