'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2, Shield } from 'lucide-react';
import { COURSE_OPTIONS } from '@/data/streams';

/**
 * "Check Your Eligibility" lead-capture form. Extracted from the hero so it can
 * be placed anywhere on the page; submits to the existing contact API.
 */
export default function EligibilityForm() {
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
      course: formData.get('course') as string,
      neetStatus: formData.get('neetStatus') as string,
      source: 'home-eligibility-form',
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
    <div className="rounded-2xl bg-white p-5 shadow-[0_20px_60px_rgba(11,26,53,0.15)] ring-1 ring-black/5 sm:p-7 lg:p-8">
      <div className="mb-6">
        <h3 className="font-playfair text-2xl font-bold text-[#0B1A35]">Check Your Eligibility</h3>
        <p className="mt-1 text-[0.95rem] text-gray-500">
          Fill in your details and our counselor will call you within 2 hours
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#0B1A35]">Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="e.g. Aarav Sharma"
            required
            disabled={formState === 'loading'}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-[0.95rem] text-[#0B1A35] placeholder:text-gray-400 transition-all duration-200 focus:border-[#C6962E] focus:outline-none focus:ring-2 focus:ring-[#C6962E]/10 disabled:opacity-50"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#0B1A35]">Mobile Number</label>
          <input
            type="tel"
            name="phone"
            placeholder="10-digit mobile number"
            required
            disabled={formState === 'loading'}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-[0.95rem] text-[#0B1A35] placeholder:text-gray-400 transition-all duration-200 focus:border-[#C6962E] focus:outline-none focus:ring-2 focus:ring-[#C6962E]/10 disabled:opacity-50"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#0B1A35]">Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="e.g. student@email.com"
            disabled={formState === 'loading'}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-[0.95rem] text-[#0B1A35] placeholder:text-gray-400 transition-all duration-200 focus:border-[#C6962E] focus:outline-none focus:ring-2 focus:ring-[#C6962E]/10 disabled:opacity-50"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#0B1A35]">Field of Interest</label>
          <select
            name="course"
            disabled={formState === 'loading'}
            className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-[0.95rem] text-[#0B1A35] transition-all duration-200 focus:border-[#C6962E] focus:outline-none focus:ring-2 focus:ring-[#C6962E]/10 disabled:opacity-50"
          >
            <option value="">Select a course</option>
            {COURSE_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
            <option value="Not sure yet">Not sure yet</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#0B1A35]">NEET Status</label>
          <select
            name="neetStatus"
            disabled={formState === 'loading'}
            className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-[0.95rem] text-[#0B1A35] transition-all duration-200 focus:border-[#C6962E] focus:outline-none focus:ring-2 focus:ring-[#C6962E]/10 disabled:opacity-50"
          >
            <option value="">Select your NEET status (optional)</option>
            <option value="appeared">Appeared in NEET 2026</option>
            <option value="preparing">Preparing for NEET 2026</option>
            <option value="qualified">NEET Qualified (Previous year)</option>
            <option value="not-applicable">Not applicable / Non-medical course</option>
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
                  ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border border-red-200 bg-red-50 text-red-700'
              }`}
            >
              {statusMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={formState === 'loading'}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C6962E] to-[#d4a73a] py-3.5 text-sm font-bold text-[#0B1A35] shadow-[0_4px_20px_rgba(198,150,46,0.3)] transition-all duration-300 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
        >
          {formState === 'loading' ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Submitting…
            </>
          ) : (
            <>
              Book ONLINE / OFFLINE FREE Counselling <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <div className="mt-5 flex items-center justify-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <Shield size={12} /> 100% Secure
        </span>
        <span className="h-1 w-1 rounded-full bg-gray-300" />
        <span>No spam, ever</span>
        <span className="h-1 w-1 rounded-full bg-gray-300" />
        <span>Free consultation</span>
      </div>
    </div>
  );
}
