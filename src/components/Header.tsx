'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Phone, Mail, ChevronDown, ArrowLeft, Home as HomeIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { STREAMS } from '@/data/streams';
import { KOLHAPUR, WHATSAPP, GEORGIA_OFFICE, CONTACT_EMAIL } from '@/data/contacts';
import AnnouncementBanner from '@/components/AnnouncementBanner';

type NavChild = { label: string; href: string; external?: boolean };
type NavItem = { label: string; href?: string; children?: NavChild[]; external?: boolean };

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Courses',
    children: STREAMS.map((s) => ({ label: s.navLabel, href: `/courses/${s.slug}` })),
  },
  {
    label: 'Destinations',
    children: [
      { label: 'Georgia', href: '/destinations/georgia' },
      { label: 'Timor-Leste', href: '/destinations/timor-leste' },
      { label: 'Russian Countries', href: '/destinations/russian-countries' },
      { label: 'Services', href: '/destinations#services' },
    ],
  },
  {
    label: 'Doctor Readiness',
    children: [
      { label: 'Clinical Workshops', href: '/clinical-workshops' },
      { label: 'MBBS Coaching', href: 'https://mbbsportal.abhaglobaleducare.com', external: true },
    ],
  },
  {
    label: 'NEET Zone',
    children: [
      { label: 'NEET Admission Analyzer 🎯', href: '/neet-analyzer' },
      { label: 'Offers & Scholarships', href: '/scholarship' },
      { label: 'NEET Portal', href: 'https://neet.abhaglobaleducare.com', external: true },
    ],
  },
  {
    label: 'Current Updates',
    children: [
      { label: 'All Updates', href: '/current-updates' },
      { label: 'NEET 2026 Score → College Chart 📊', href: '/neet-zone/neet-2026-maharashtra-counselling' },
      { label: 'NEET 2026 Result Analysis 🆕', href: '/neet-zone/neet-2026-result-analysis' },
      { label: 'NEET 2025 Validity — Abroad MBBS ✅', href: '/neet-zone/neet-2025-validity-abroad' },
    ],
  },
  { label: 'Gallery & Reviews', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
];

function DesktopDropdown({
  item,
  isOpen,
  onOpen,
  onClose,
  pathname,
}: {
  item: NavItem;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  pathname: string;
}) {
  const active = item.children?.some((c) => !c.external && pathname.startsWith(c.href));

  return (
    <li className="relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => (isOpen ? onClose() : onOpen())}
        className={cn(
          'flex items-center gap-1 text-[1rem] font-bold tracking-tight text-primary-navy transition-colors duration-300 hover:text-primary-gold',
          active && 'text-primary-gold',
        )}
      >
        {item.label}
        <ChevronDown
          size={15}
          className={cn('transition-transform duration-200', isOpen && 'rotate-180')}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            role="menu"
            className="absolute left-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-gray-100 bg-white py-2 shadow-glass-lg"
          >
            {item.children!.map((child) =>
              child.external ? (
                <li key={child.href} role="none">
                  <a
                    role="menuitem"
                    href={child.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    className="block px-5 py-2.5 text-sm font-medium text-primary-navy transition-colors hover:bg-primary-gold/5 hover:text-primary-gold"
                  >
                    {child.label} ↗
                  </a>
                </li>
              ) : (
                <li key={child.href} role="none">
                  <Link
                    role="menuitem"
                    href={child.href}
                    onClick={onClose}
                    className={cn(
                      'block px-5 py-2.5 text-sm font-medium text-primary-navy transition-colors hover:bg-primary-gold/5 hover:text-primary-gold',
                      pathname === child.href && 'text-primary-gold',
                    )}
                  >
                    {child.label}
                  </Link>
                </li>
              ),
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change.
  useEffect(() => {
    setOpenDropdown(null);
    setIsMobileMenuOpen(false);
    setMobileExpanded(null);
  }, [pathname]);

  // Escape closes the desktop dropdown.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenDropdown(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-primary-gold to-gold-400 text-primary-navy py-2.5 px-4 text-center font-bold text-sm tracking-wide">
        <motion.span
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-block"
        >
          <span className="sm:hidden">🎓 NEET Excellence Pathway — WhatsApp {WHATSAPP.display} · Georgia: {GEORGIA_OFFICE.phoneDisplay}</span>
          <span className="hidden sm:inline">🎓 NEET Excellence Pathway — Scholarships / Gifts / Rewards + NEET Practice Tests | WhatsApp {WHATSAPP.display} · Georgia: {GEORGIA_OFFICE.phoneDisplay} · UNIQUE Hands-On Clinical Workshops</span>
        </motion.span>
      </div>

      {/* Top Contact Bar */}
      <div className="bg-primary-navy text-white py-2.5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 flex flex-wrap justify-between items-center gap-1.5 sm:gap-2 text-sm">
          <div className="flex flex-wrap gap-4 lg:gap-8 items-center">
            <a
              href={KOLHAPUR.tel}
              className="flex items-center gap-1.5 text-white hover:text-primary-gold transition-all duration-300 hover:-translate-y-0.5"
            >
              <Phone size={14} /> Kolhapur: {KOLHAPUR.phoneDisplay}
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="hidden sm:flex items-center gap-1.5 text-white hover:text-primary-gold transition-all duration-300 hover:-translate-y-0.5"
            >
              <Mail size={14} /> {CONTACT_EMAIL}
            </a>
            <a
              href="mailto:abhaglobaleducare@gmail.com"
              className="hidden lg:flex items-center gap-1.5 text-white hover:text-primary-gold transition-all duration-300 hover:-translate-y-0.5"
            >
              <Mail size={14} /> abhaglobaleducare@gmail.com
            </a>
          </div>
          <div className="hidden md:block">
            <strong className="text-xs lg:text-sm">Reg No: ACO-8092 </strong>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header
        className={cn(
          'bg-white/98 backdrop-blur-md sticky top-0 z-50 transition-all duration-300',
          isScrolled ? 'shadow-lg' : 'shadow-soft',
        )}
      >
        <nav className="max-w-[1400px] mx-auto px-4 sm:px-8 py-4 flex justify-between items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/images/logo.png"
              alt="ABHA Global Educare"
              width={200}
              height={200}
              className="h-14 lg:h-16 w-auto"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden xl:flex items-center gap-4">
            {navItems.map((item) =>
              item.children ? (
                <DesktopDropdown
                  key={item.label}
                  item={item}
                  isOpen={openDropdown === item.label}
                  onOpen={() => setOpenDropdown(item.label)}
                  onClose={() => setOpenDropdown(null)}
                  pathname={pathname}
                />
              ) : item.external ? (
                <li key={item.href}>
                  <a
                    href={item.href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg border border-primary-gold/40 bg-primary-gold/10 px-3 py-1.5 text-[1rem] font-bold tracking-tight text-primary-navy transition-all duration-300 hover:border-primary-gold hover:bg-primary-gold/20 hover:text-primary-gold"
                  >
                    {item.label}
                    <span aria-hidden="true" className="text-primary-gold">
                      ↗
                    </span>
                  </a>
                </li>
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href!}
                    className={cn(
                      'relative text-[1rem] font-bold tracking-tight text-primary-navy transition-colors duration-300 hover:text-primary-gold group',
                      pathname === item.href && 'text-primary-gold',
                    )}
                  >
                    {item.label}
                    <span
                      className={cn(
                        'absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary-gold to-gold-400 transition-all duration-300',
                        pathname === item.href ? 'w-full' : 'w-0 group-hover:w-full',
                      )}
                    />
                  </Link>
                </li>
              ),
            )}
            <li>
              <Link
                href="/contact"
                className="rounded-xl bg-gradient-to-r from-primary-gold to-gold-400 px-5 py-2.5 text-[1.02rem] font-bold text-primary-navy shadow-gold transition-transform duration-300 hover:-translate-y-0.5"
              >
                Book Counselling
              </Link>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-2 text-primary-navy hover:text-primary-gold transition-colors"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="xl:hidden overflow-hidden bg-white border-t border-gray-100"
            >
              <div className="px-6 py-4 space-y-1 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {navItems.map((item) =>
                  item.children ? (
                    <div key={item.label} className="border-b border-gray-50 last:border-0">
                      <button
                        type="button"
                        onClick={() =>
                          setMobileExpanded(mobileExpanded === item.label ? null : item.label)
                        }
                        aria-expanded={mobileExpanded === item.label}
                        className="flex w-full items-center justify-between py-3 px-4 text-base font-bold text-primary-navy"
                      >
                        {item.label}
                        <ChevronDown
                          size={18}
                          className={cn(
                            'transition-transform duration-200',
                            mobileExpanded === item.label && 'rotate-180',
                          )}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {mobileExpanded === item.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden pb-2"
                          >
                            {item.children.map((child) =>
                              child.external ? (
                                <a
                                  key={child.href}
                                  href={child.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="block py-2.5 pl-8 pr-4 text-sm font-medium text-primary-navy hover:text-primary-gold"
                                >
                                  {child.label} ↗
                                </a>
                              ) : (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className={cn(
                                    'block py-2.5 pl-8 pr-4 text-sm font-medium text-primary-navy hover:text-primary-gold',
                                    pathname === child.href && 'text-primary-gold',
                                  )}
                                >
                                  {child.label}
                                </Link>
                              ),
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : item.external ? (
                    <a
                      key={item.href}
                      href={item.href!}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-1 rounded-xl border border-primary-gold/40 bg-primary-gold/10 py-3 px-4 text-base font-bold text-primary-navy transition-all duration-200 hover:bg-primary-gold/20 hover:text-primary-gold"
                    >
                      {item.label}
                      <span aria-hidden="true" className="text-primary-gold">
                        ↗
                      </span>
                    </a>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href!}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'block py-3 px-4 text-base font-bold text-primary-navy hover:text-primary-gold hover:bg-primary-gold/5 rounded-xl transition-all duration-200',
                        pathname === item.href && 'text-primary-gold bg-primary-gold/5',
                      )}
                    >
                      {item.label}
                    </Link>
                  ),
                )}
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-2 block rounded-xl bg-gradient-to-r from-primary-gold to-gold-400 py-3 px-4 text-center font-bold text-primary-navy"
                >
                  Book Counselling
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Data-driven announcement banner — edit src/data/announcements.ts to publish */}
      <AnnouncementBanner />

      {/* Back / Home bar — shown on every page except the homepage */}
      {pathname !== '/' && (
        <div className="border-b border-gray-100 bg-white/95">
          <div className="max-w-[1400px] mx-auto flex items-center gap-2 px-4 sm:px-8 py-2">
            <button
              type="button"
              onClick={() => {
                // Go to the previous page if we have in-app history; otherwise Home.
                if (typeof window !== 'undefined' && window.history.length > 1) {
                  router.back();
                } else {
                  router.push('/');
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-primary-navy transition-colors hover:bg-primary-gold/10 hover:text-primary-gold"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-primary-navy transition-colors hover:bg-primary-gold/10 hover:text-primary-gold"
            >
              <HomeIcon size={16} /> Home
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
