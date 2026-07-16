'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { getActiveAnnouncement, type Announcement } from '@/data/announcements';

/**
 * Placement switch: false → banner renders on the HOMEPAGE only (below the
 * header, above the hero); true → renders on every page, since the banner is
 * mounted inside <Header /> which every page includes.
 */
const SITE_WIDE = false;

/** localStorage key holding the ids of dismissed announcements. */
const DISMISS_KEY = 'abha-dismissed-announcements';

function readDismissed(): string[] {
  try {
    const raw = window.localStorage.getItem(DISMISS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveDismissed(ids: string[]) {
  try {
    // Keep only the most recent handful so the list never grows unbounded.
    window.localStorage.setItem(DISMISS_KEY, JSON.stringify(ids.slice(-10)));
  } catch {
    /* private mode / storage full — banner just reappears next visit */
  }
}

type ThemeConfig = {
  band: React.CSSProperties;
  iconGlow: string;
  cta: React.CSSProperties;
  pulse: boolean;
};

const THEMES: Record<NonNullable<Announcement['theme']>, ThemeConfig> = {
  gold: {
    band: {
      background: 'linear-gradient(135deg, #0B1A35 0%, #1a3160 100%)',
      borderTop: '2px solid #C6962E',
      borderBottom: '2px solid #C6962E',
    },
    iconGlow: 'rgba(198,150,46,0.15)',
    cta: {
      background: 'linear-gradient(to right, #C6962E, #DFB761)',
      color: '#0B1A35',
    },
    pulse: false,
  },
  festive: {
    band: {
      background: 'linear-gradient(135deg, #0B1A35 0%, #2a2050 55%, #4a2410 100%)',
      borderTop: '2px solid #E8801A',
      borderBottom: '2px solid #E8801A',
    },
    iconGlow: 'rgba(232,128,26,0.2)',
    cta: {
      background: 'linear-gradient(to right, #E8801A, #DFB761)',
      color: '#0B1A35',
    },
    pulse: false,
  },
  urgent: {
    band: {
      background: 'linear-gradient(135deg, #0B1A35 0%, #1a3160 100%)',
      borderTop: '2px solid #C6962E',
      borderBottom: '2px solid #C6962E',
    },
    iconGlow: 'rgba(198,150,46,0.15)',
    cta: {
      background: 'linear-gradient(to right, #C6962E, #DFB761)',
      color: '#0B1A35',
    },
    pulse: true,
  },
};

export default function AnnouncementBanner() {
  const pathname = usePathname();
  // null = not yet hydrated → render the banner server-side (no layout shift
  // for the common case); a dismissed banner collapses right after mount.
  const [dismissed, setDismissed] = useState<string[] | null>(null);

  useEffect(() => {
    setDismissed(readDismissed());
  }, []);

  const announcement = getActiveAnnouncement();
  if (!announcement) return null;
  if (!SITE_WIDE && pathname !== '/') return null;

  const theme = THEMES[announcement.theme ?? 'gold'];
  const isVisible = dismissed === null || !dismissed.includes(announcement.id);
  const isExternal = announcement.ctaHref.startsWith('http');

  const handleDismiss = () => {
    const next = [...(dismissed ?? readDismissed()), announcement.id];
    setDismissed(next);
    saveDismissed(next);
  };

  const ctaClass =
    'inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-bold shadow-gold transition-transform duration-300 hover:-translate-y-0.5 sm:w-auto';

  const ctaInner = (
    <>
      {announcement.ctaLabel} <ArrowRight size={15} />
    </>
  );

  return (
    <AnimatePresence initial={false}>
      {isVisible && (
        <motion.div
          key={announcement.id}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden"
          style={theme.band}
          role="region"
          aria-label="Announcement"
        >
          {/* Gold border pulse for the 'urgent' theme */}
          {theme.pulse && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              animate={{
                boxShadow: [
                  'inset 0 0 0 rgba(198,150,46,0)',
                  'inset 0 0 28px rgba(198,150,46,0.45)',
                  'inset 0 0 0 rgba(198,150,46,0)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}

          <div className="relative mx-auto flex max-w-[1400px] flex-col gap-3 px-4 py-4 pr-12 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 text-left sm:gap-4"
            >
              {announcement.icon && (
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-2xl"
                  style={{ background: theme.iconGlow }}
                >
                  {announcement.icon}
                </span>
              )}
              <div>
                <p className="font-playfair text-base font-bold leading-snug text-white sm:text-lg">
                  {announcement.headline}
                </p>
                {announcement.subtext && (
                  <p className="mt-0.5 text-xs leading-relaxed text-white/70 sm:text-sm">
                    {announcement.subtext}
                  </p>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex-shrink-0"
            >
              {isExternal ? (
                <a
                  href={announcement.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={ctaClass}
                  style={theme.cta}
                >
                  {ctaInner}
                </a>
              ) : (
                <Link href={announcement.ctaHref} className={ctaClass} style={theme.cta}>
                  {ctaInner}
                </Link>
              )}
            </motion.div>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss announcement"
            className="absolute right-2 top-2 rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white sm:right-3 sm:top-1/2 sm:-translate-y-1/2"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
