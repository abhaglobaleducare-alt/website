'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, Mail, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'AGEST Scholarship', href: '/scholarship' },
  { label: 'Educate Yourself', href: '/educate' },
  { label: 'Clinical Workshops', href: '/praxis' },
  { label: 'Destinations', href: '/destinations' },
  { label: 'Services', href: '/services' },
  { label: 'Gallery & Reviews', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
          <span className="sm:hidden">🎓 AGEST 2026 Scholarship — WhatsApp +91 7447552878</span>
          <span className="hidden sm:inline">🎓 NEW! Hands-On Clinical Workshops — Our Own Training Platform | AGEST 2026 - send AGEST to WhatsApp +91 7447552878</span>
        </motion.span>
      </div>

      {/* Top Contact Bar */}
      <div className="bg-primary-navy text-white py-2.5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 flex flex-wrap justify-between items-center gap-1.5 sm:gap-2 text-sm">
          <div className="flex flex-wrap gap-4 lg:gap-8 items-center">
            <a
              href="tel:+917447552878"
              className="flex items-center gap-1.5 text-white hover:text-primary-gold transition-all duration-300 hover:-translate-y-0.5"
            >
              <Phone size={14} /> Kolhapur: +91 74475 52878
            </a>
            <a
              href="tel:+917620707088"
              className="flex items-center gap-1.5 text-white hover:text-primary-gold transition-all duration-300 hover:-translate-y-0.5"
            >
              <Phone size={14} /> CSN: +91 76207 07088
            </a>
            <a
              href="mailto:connect@abhaglobaleducare.com"
              className="hidden sm:flex items-center gap-1.5 text-white hover:text-primary-gold transition-all duration-300 hover:-translate-y-0.5"
            >
              <Mail size={14} /> connect@abhaglobaleducare.com
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
          isScrolled ? 'shadow-lg' : 'shadow-soft'
        )}
      >
        <nav className="max-w-[1400px] mx-auto px-4 sm:px-8 py-4 flex justify-between items-center">
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
          <ul className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'text-primary-navy font-semibold text-[0.95rem] relative hover:text-primary-gold transition-colors duration-300 group',
                    pathname === link.href && 'text-primary-gold'
                  )}
                >
                  {link.label}
                  <span className={cn(
                    'absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary-gold to-gold-400 transition-all duration-300',
                    pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                  )} />
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contact"
                className="bg-gradient-to-r from-primary-gold to-gold-400 text-primary-navy px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(198,150,46,0.5)] shadow-[0_5px_20px_rgba(198,150,46,0.3)]"
              >
                Book Counselling →
              </Link>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-primary-navy hover:text-primary-gold transition-colors"
            aria-label="Toggle mobile menu"
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
              className="lg:hidden overflow-hidden bg-white border-t border-gray-100"
            >
              <div className="px-6 py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'block py-3 px-4 text-primary-navy font-semibold hover:text-primary-gold hover:bg-primary-gold/5 rounded-xl transition-all duration-200',
                      pathname === link.href && 'text-primary-gold bg-primary-gold/5'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block mt-4 text-center bg-gradient-to-r from-primary-gold to-gold-400 text-primary-navy px-6 py-3 rounded-full font-bold transition-all duration-300"
                >
                  Book Counselling →
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
