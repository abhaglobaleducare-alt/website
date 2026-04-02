'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, Loader2, Shield, GraduationCap, Globe, Utensils, Home as HomeIcon, BookOpen } from 'lucide-react';

const highlights = [
  { icon: HomeIcon, text: 'Own Accommodation in Georgia & Kyrgyzstan' },
  { icon: Utensils, text: 'Authentic Indian Food Services Daily' },
  { icon: BookOpen, text: 'Praxis Clinical Experience Workshop' },
  { icon: Shield, text: 'NMC & WHO Recognized Degrees' },
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

      <div className="relative z-10 max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20 items-center px-4 sm:px-8 py-16 lg:py-0">
        {/* Left Content */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-[#C6962E]/10 border border-[#C6962E]/20 px-4 py-2 rounded-full mb-8"
          >
            <GraduationCap size={16} className="text-[#C6962E]" />
            <span className="text-[#C6962E] font-semibold text-sm tracking-wide">MBBS Abroad Consultancy — Est. 2020</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-playfair text-[2.5rem] sm:text-5xl lg:text-[3.75rem] xl:text-[4.25rem] text-white leading-[1.15] mb-6"
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
            className="text-white/80 text-lg sm:text-xl leading-relaxed mb-10 max-w-[600px]"
          >
            ABHA Global Educare helps Indian students get admitted to NMC-approved 
            medical universities in Georgia & Kyrgyzstan — with our own hostels, 
            Indian meals, and exclusive hands on experience.
          </motion.p>

          {/* Highlight Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10"
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
            className="flex flex-wrap gap-4"
          >
            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#C6962E] to-[#d4a73a] text-[#0B1A35] px-7 py-3.5 rounded-xl font-bold text-base transition-all duration-300 hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(198,150,46,0.3)] hover:shadow-[0_8px_30px_rgba(198,150,46,0.45)]"
            >
              Book Free Counselling <ArrowRight size={18} />
            </Link>
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2.5 text-white border border-white/25 px-7 py-3.5 rounded-xl font-semibold text-base transition-all duration-300 hover:bg-white/10 hover:border-white/40"
            >
              <Globe size={18} /> Explore Destinations
            </Link>
          </motion.div>
        </div>

        {/* Right — Eligibility Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="bg-white rounded-2xl p-7 sm:p-9 shadow-[0_25px_60px_rgba(0,0,0,0.4)]"
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
              className="w-full bg-[#0B1A35] text-white py-3.5 rounded-xl font-bold text-base transition-all duration-300 hover:bg-[#152d54] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {formState === 'loading' ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Submitting…
                </>
              ) : (
                <>Get Free Counselling <ArrowRight size={18} /></>
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
