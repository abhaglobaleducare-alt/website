'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
// ArrowRight kept for the inline link hint on each banner tile.
import { getActiveAnnouncements, type Announcement } from '@/data/announcements';

/**
 * Placement switch: false → banners render on the HOMEPAGE only (below the
 * header, above the hero); true → on every page (the banner is mounted inside
 * <Header />, which every page includes).
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
    window.localStorage.setItem(DISMISS_KEY, JSON.stringify(ids.slice(-20)));
  } catch {
    /* private mode / storage full — banner just reappears next visit */
  }
}

type ThemeConfig = {
  card: React.CSSProperties;
  iconGlow: string;
  cta: React.CSSProperties;
  pulse: boolean;
};

const THEMES: Record<NonNullable<Announcement['theme']>, ThemeConfig> = {
  gold: {
    card: {
      background: 'linear-gradient(135deg, #0B1A35 0%, #1a3160 100%)',
      border: '2px solid #C6962E',
    },
    iconGlow: 'rgba(198,150,46,0.15)',
    cta: { background: 'linear-gradient(to right, #C6962E, #DFB761)', color: '#0B1A35' },
    pulse: false,
  },
  festive: {
    card: {
      background: 'linear-gradient(135deg, #0B1A35 0%, #2a2050 55%, #4a2410 100%)',
      border: '2px solid #E8801A',
    },
    iconGlow: 'rgba(232,128,26,0.2)',
    cta: { background: 'linear-gradient(to right, #E8801A, #DFB761)', color: '#0B1A35' },
    pulse: false,
  },
  urgent: {
    card: {
      background: 'linear-gradient(135deg, #0B1A35 0%, #1a3160 100%)',
      border: '2px solid #C6962E',
    },
    iconGlow: 'rgba(198,150,46,0.15)',
    cta: { background: 'linear-gradient(to right, #C6962E, #DFB761)', color: '#0B1A35' },
    pulse: true,
  },
};

function BannerCard({
  a,
  onDismiss,
}: {
  a: Announcement;
  onDismiss: (id: string) => void;
}) {
  const theme = THEMES[a.theme ?? 'gold'];
  const isExternal = a.ctaHref.startsWith('http');

  // The whole tile is the link (a stretched overlay). The dismiss button sits
  // above it (higher z-index) so it stays independently clickable. The visible
  // CTA is a non-interactive affordance — clicks anywhere on the tile navigate.
  const overlayClass =
    'absolute inset-0 z-10 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C6962E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1A35]';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3 }}
      className="group relative cursor-pointer overflow-hidden rounded-2xl p-4 pr-10 shadow-card transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-card-hover"
      style={theme.card}
    >
      {/* Gold border pulse for the 'urgent' theme */}
      {theme.pulse && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 rounded-2xl"
          animate={{
            boxShadow: [
              'inset 0 0 0 rgba(198,150,46,0)',
              'inset 0 0 24px rgba(198,150,46,0.45)',
              'inset 0 0 0 rgba(198,150,46,0)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Whole-tile clickable overlay */}
      {isExternal ? (
        <a
          href={a.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={a.headline}
          className={overlayClass}
        />
      ) : (
        <Link href={a.ctaHref} aria-label={a.headline} className={overlayClass} />
      )}

      <div className="relative flex items-start gap-3.5">
        {a.icon && (
          <span
            aria-hidden="true"
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-2xl"
            style={{ background: theme.iconGlow }}
          >
            {a.icon}
          </span>
        )}
        <div className="min-w-0">
          <p className="font-playfair text-base font-bold leading-snug text-white sm:text-[1.05rem]">
            {a.headline}
            {/* Inline arrow hints the whole tile is clickable (no separate button) */}
            <ArrowRight
              size={15}
              aria-hidden="true"
              className="ml-1.5 inline-block flex-shrink-0 align-[-2px] transition-transform duration-300 group-hover:translate-x-1"
              style={{ color: '#C6962E' }}
            />
          </p>
          {a.subtext && (
            <p className="mt-1 text-xs leading-relaxed text-white/70 sm:text-sm">{a.subtext}</p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onDismiss(a.id)}
        aria-label="Dismiss announcement"
        className="absolute right-2 top-2 z-20 rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}

export default function AnnouncementBanner() {
  const pathname = usePathname();
  // null = not yet hydrated → render all active banners server-side (no layout
  // shift for the common case); dismissed ones collapse right after mount.
  const [dismissed, setDismissed] = useState<string[] | null>(null);

  useEffect(() => {
    setDismissed(readDismissed());
  }, []);

  const active = getActiveAnnouncements();
  if (!active.length) return null;
  if (!SITE_WIDE && pathname !== '/') return null;

  const visible =
    dismissed === null ? active : active.filter((a) => !dismissed.includes(a.id));
  if (!visible.length) return null;

  const handleDismiss = (id: string) => {
    const next = [...(dismissed ?? readDismissed()), id];
    setDismissed(next);
    saveDismissed(next);
  };

  // One banner → full width; two or more → two-per-row grid (wraps to new rows).
  const gridCols = visible.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2';

  return (
    <div className="border-b border-gray-100 bg-[#F5F6FA]">
      <div className={`mx-auto grid max-w-[1400px] gap-3 px-4 py-4 sm:gap-4 sm:px-8 ${gridCols}`}>
        <AnimatePresence initial={false}>
          {visible.map((a) => (
            <BannerCard key={a.id} a={a} onDismiss={handleDismiss} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
