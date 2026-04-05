'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, Loader2, Shield, GraduationCap, Globe, Utensils, Home as HomeIcon, BookOpen } from 'lucide-react';

const highlights = [
  { icon: HomeIcon, text: 'Own Accommodation in Georgia & Kyrgyzstan' },
  { icon: Utensils, text: 'Authentic Indian Food Services Daily' },
  { icon: BookOpen, text: "Abha's Clinical Experience Workshop" },
  { icon: Shield, text: 'NMC & WHO Eligible Degrees' },
];

export default function Hero() {
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState('loading');
    setStatusMessage('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      neetStatus: formData.get('neetStatus') as string,
      source: 'hero-eligibility-form',
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setFormState('success');
        setStatusMessage(data.message || 'Thank you! Our counselor will contact you within 24 hours.');
        form.reset();
        setTimeout(() => {
          setFormState('idle');
          setStatusMessage('');
        }, 5000);
      } else {
        setFormState('error');
        setStatusMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setFormState('error');
      setStatusMessage('Network error. Please check your connection and try again.');
    }
  }

  return (
    <section
      className="relative min-h-[92vh] overflow-hidden flex items-center"
      id="home"
    >
      {/* Layered Background */}
      <div className="absolute inset-0 bg-[#0B1A35]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23C6962E%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
      <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-[#C6962E]/[0.07] to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[40%] bg-gradient-to-t from-[#0B1A35] to-transparent" />

          className="relative z-10 max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-20 items-center px-4 sm:px-8 py-12 sm:py-16 lg:py-0"
        {/* Left Content */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-[#C6962E]/10 border border-[#C6962E]/20 px-4 py-2 rounded-full mb-8"
          >
            <GraduationCap size={16} className="text-[#C6962E]" />
            <span className="text-[#C6962E] font-semibold text-sm tracking-wide">MBBS Abroad Consultancy</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-playfair text-[1.75rem] sm:text-[2.5rem] lg:text-[3.75rem] xl:text-[4.25rem] text-white leading-[1.15] mb-6"
          >
            Study MBBS Abroad with{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-[#C6962E] to-[#e2b960] bg-clip-text text-transparent">
                Complete Support
              </span>
              <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-gradient-to-r from-[#C6962E] to-[#e2b960] rounded-full" />
            </span>{' '}
            Admission to Graduation
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-white/80 text-base sm:text-lg lg:text-xl leading-relaxed mb-8 sm:mb-10 max-w-[600px]"
          >
            ABHA Global Educare helps Indian students get admitted to NMC guidelines Eligible
            medical universities in Georgia & Kyrgyzstan — with our own hostels,
            Indian meals, and exclusive hands on experience.
          </motion.p>

          {/* Highlight Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-10"
          >
            {highlights.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-0.5 w-9 h-9 rounded-lg bg-[#C6962E]/10 flex items-center justify-center flex-shrink-0">
                  <item.icon size={18} className="text-[#C6962E]" />
                </div>
                <span className="text-white/90 text-[0.95rem] leading-snug font-medium">{item.text}</span>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="flex flex-col gap-3"
          >
            <div className="flex flex-wrap gap-4">
              <Link
                href="/destinations"
                className="inline-flex items-center gap-2.5 text-white border border-white/25 px-7 py-3.5 rounded-xl font-semibold text-base transition-all duration-300 hover:bg-white/10 hover:border-white/40"
              >
                <Globe size={18} /> Explore Destinations
              </Link>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://wa.me/917447552878?text=Hi%2C+I'm+interested+in+booking+a+FREE+counseling+appointment+for+MBBS+Abroad."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:bg-[#1ebe5d]"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                WhatsApp for Appointment
              </a>
            </div>
          </motion.div>
        </div>

        {/* Right — Eligibility Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="bg-white rounded-2xl p-5 sm:p-7 lg:p-9 shadow-[0_25px_60px_rgba(0,0,0,0.4)]"
        >
          <div className="mb-6">
            <h3 className="font-playfair text-[#0B1A35] text-2xl font-bold mb-1.5">
              Check Your Eligibility
            </h3>
            <p className="text-gray-500 text-[0.95rem]">
              Fill in your details and our counselor will call you within 2 hours
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#0B1A35] font-medium mb-1.5 text-sm">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Aarav Sharma"
                required
                disabled={formState === 'loading'}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[0.95rem] bg-gray-50/50 text-[#0B1A35] placeholder:text-gray-400 focus:outline-none focus:border-[#C6962E] focus:ring-2 focus:ring-[#C6962E]/10 transition-all duration-200 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-[#0B1A35] font-medium mb-1.5 text-sm">Mobile Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="10-digit mobile number"
                required
                disabled={formState === 'loading'}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[0.95rem] bg-gray-50/50 text-[#0B1A35] placeholder:text-gray-400 focus:outline-none focus:border-[#C6962E] focus:ring-2 focus:ring-[#C6962E]/10 transition-all duration-200 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-[#0B1A35] font-medium mb-1.5 text-sm">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="e.g. student@email.com"
                disabled={formState === 'loading'}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[0.95rem] bg-gray-50/50 text-[#0B1A35] placeholder:text-gray-400 focus:outline-none focus:border-[#C6962E] focus:ring-2 focus:ring-[#C6962E]/10 transition-all duration-200 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-[#0B1A35] font-medium mb-1.5 text-sm">NEET Status</label>
              <select
                name="neetStatus"
                required
                disabled={formState === 'loading'}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[0.95rem] bg-gray-50/50 text-[#0B1A35] focus:outline-none focus:border-[#C6962E] focus:ring-2 focus:ring-[#C6962E]/10 transition-all duration-200 appearance-none disabled:opacity-50"
              >
                <option value="">Select your NEET status</option>
                <option value="appeared">Appeared in NEET 2026</option>
                <option value="preparing">Preparing for NEET 2026</option>
                <option value="qualified">NEET Qualified (Previous year)</option>
              </select>
            </div>

            <AnimatePresence mode="wait">
              {statusMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`rounded-xl px-4 py-3 text-sm font-medium ${
                    formState === 'success'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {statusMessage}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={formState === 'loading'}
              className="w-full bg-gradient-to-r from-[#C6962E] to-[#d4a73a] text-[#0B1A35] py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 hover:brightness-105 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(198,150,46,0.3)]"
            >
              {formState === 'loading' ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Submitting…
                </>
              ) : (
                <>Book ONLINE / OFFLINE FREE Counselling <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="mt-5 flex items-center justify-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Shield size={12} /> 100% Secure</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span>No spam, ever</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span>Free consultation</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
