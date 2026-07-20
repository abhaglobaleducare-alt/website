'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LeadGate from '@/components/LeadGate';
import { Target, BarChart3, Clock, Trophy, CheckCircle2, ArrowRight, Loader2, Phone, Mail, Zap } from 'lucide-react';
import { WHATSAPP, KOLHAPUR, waLink, waLinkEncoded } from '@/data/contacts';

const features = [
  { icon: Target, title: 'Full NEET Mock Tests', desc: '180 questions · 3 hours · Physics, Chemistry & Biology — exact NEET exam pattern every time' },
  { icon: Clock, title: 'Weekly Tests', desc: 'Admin-published topic-wise weekly tests with immediate results and subject-level breakdown' },
  { icon: Zap, title: 'Daily MCQ Practice', desc: 'Quick 10-question daily sessions with +4/−1 NEET scoring and instant explanation for every answer' },
  { icon: BarChart3, title: 'Performance Analytics', desc: 'Track your score history, accuracy, and improvement across every subject over time' },
];

const included = [
  'Unlimited NEET Pattern Mock Tests',
  'Weekly Tests published by admin',
  'Daily MCQ Practice (10 questions/day)',
  'Performance dashboard & score history',
  'Physics, Chemistry, Botany, Zoology',
  '+4 Correct / −1 Wrong NEET marking',
  'Detailed explanations for every question',
  'Admin support & progress tracking',
];

const steps = [
  { n: '01', t: 'Fill the registration form', d: 'Enter your details below. Takes under 2 minutes.' },
  { n: '02', t: 'Pay ₹2,110 via UPI', d: 'Send ₹2,110 to the UPI ID shown. Screenshot your transaction.' },
  { n: '03', t: 'Enter your UTR number', d: 'Add your UPI Transaction ID in the form so our team can verify payment.' },
  { n: '04', t: 'Admin verifies & activates', d: 'We verify your payment and set up your account within 24 hours.' },
  { n: '05', t: 'Start practising immediately', d: 'Receive login credentials via WhatsApp/Email. Full portal access begins.' },
];

export default function NeetPracticeHub() {
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState('loading');
    const fd = new FormData(e.currentTarget);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fd.get('name'),
          phone: fd.get('phone'),
          email: fd.get('email'),
          city: fd.get('city'),
          neetStatus: fd.get('neetStatus'),
          neetScore: fd.get('neetScore'),
          course: 'NEET Coaching Package — ₹2,110/year',
          message: `NEET Coaching Package (Preparation Portal + Practice Hub) Registration — ₹2,110/year. UPI Transaction ID (UTR): ${fd.get('utr') || 'Not provided'}`,
          source: 'neet-practice-hub-registration',
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFormState('success');
        setStatusMsg('Registration received! Our team will verify your payment and activate your NEET Coaching Package account within 24 hours.');
        (e.target as HTMLFormElement).reset();
      } else {
        setFormState('error');
        setStatusMsg(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setFormState('error');
      setStatusMsg(`Network error. Please WhatsApp us at ${WHATSAPP.display}.`);
    }
  }

  return (
    <div style={{ background: '#F5F6FA' }}>

      {/* INTRODUCTORY OFFER BANNER */}
      <div className="py-3 px-4 text-center" style={{ background: 'linear-gradient(90deg, #5B21B6, #7C3AED, #6D28D9)' }}>
        <p className="text-white text-sm font-bold">
          NEET Coaching Package — Preparation Portal + Practice Hub ·{' '}
          <span className="text-yellow-300 text-base">₹2,110 / year</span>
          {' '}·{' '}
          <span className="text-purple-200">NEET 2026 Aspirants</span>
          {' '}·{' '}
          <LeadGate action="register_practice_hub" mode="newTab">
          <a
            href={waLink('I want to register for the NEET Coaching Package (Preparation Portal + Practice Hub)')}
            target="_blank" rel="noopener noreferrer"
            className="underline text-yellow-300 hover:text-yellow-100 transition-colors"
          >
            Register via WhatsApp →
          </a>
          </LeadGate>
        </p>
      </div>

      {/* HERO */}
      <section className="py-20 sm:py-28 px-4 sm:px-8" style={{ background: 'linear-gradient(135deg, #0B1A35 0%, #1a3160 100%)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="inline-block text-xs font-bold uppercase tracking-widest mb-5 px-4 py-1.5 rounded-full"
            style={{ color: '#C6962E', border: '1px solid rgba(198,150,46,0.3)' }}
          >
            ABHA NEET Excellence Pathway
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-playfair text-white mb-4 leading-tight"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)' }}
          >
            NEET Coaching Package
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
            className="text-slate-300 text-lg max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Preparation Portal + Practice Hub in one plan — quick notes, chapter-wise questions, weekly &amp; monthly tests, plus full-length 180-question NEET mock tests and performance tracking.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="inline-flex flex-col items-center gap-2 rounded-2xl px-8 py-5"
            style={{ background: 'rgba(124,58,237,0.2)', border: '2px solid rgba(124,58,237,0.5)' }}
          >
            <div className="flex items-baseline gap-2">
              <span className="font-playfair font-black text-5xl" style={{ color: '#C6962E' }}>₹2,110</span>
              <span className="text-purple-200 text-sm font-semibold">/ year</span>
            </div>
            <span className="text-purple-300 text-xs font-semibold uppercase tracking-widest">Preparation Portal + Practice Hub</span>
            <span className="text-slate-400 text-xs">Full Portal Access · 1 Year · NEET 2026 Aspirants</span>
          </motion.div>
        </div>
      </section>

      {/* CHOOSE YOUR PLAN */}
      <section id="plans" className="py-16 px-4 sm:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-center mb-2" style={{ color: '#C6962E' }}>
            Choose Your Plan
          </p>
          <h2 className="font-playfair font-bold text-2xl sm:text-3xl text-center mb-3" style={{ color: '#0B1A35' }}>
            Full package, or pick one
          </h2>
          <p className="text-gray-500 text-sm text-center max-w-2xl mx-auto mb-10">
            Get both portals together as the NEET Coaching Package, or choose a single portal — pay securely via UPI.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

            {/* Card 1 — NEET Coaching Package (Recommended) */}
            <div className="relative rounded-2xl p-6 flex flex-col" style={{ background: '#0B1A35', border: '2px solid #7C3AED' }}>
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white whitespace-nowrap" style={{ background: '#7C3AED' }}>
                Recommended · Best Value
              </span>
              <h3 className="font-bold text-lg mt-2" style={{ color: '#C6962E' }}>NEET Coaching Package</h3>
              <p className="text-purple-200 text-xs font-semibold mb-3">Preparation Portal + Practice Hub</p>
              <div className="flex items-baseline gap-1.5 mb-3">
                <span className="font-playfair font-black text-4xl text-white">₹2,110</span>
                <span className="text-white/50 text-sm">/ year</span>
              </div>
              <p className="text-white/70 text-xs leading-relaxed mb-5">
                <span className="font-bold text-white">Includes:</span> Preparation Portal (quick notes, chapter-wise questions, weekly &amp; monthly tests) + Practice Hub (full-length 180-Q NEET mock tests).
              </p>
              <div className="mt-auto flex flex-col items-center">
                <div className="bg-white p-2.5 rounded-xl">
                  <img
                    src="/images/qr-neet-hub-2110.jpeg"
                    alt="Pay ₹2,110 — NEET Coaching Package annual access"
                    width={150}
                    height={150}
                    style={{ display: 'block' }}
                  />
                </div>
                <p className="text-white/50 text-[11px] text-center mt-3">Scan &amp; pay ₹2,110 with any UPI app, then register below ↓</p>
              </div>
            </div>

            {/* Card 2 — Preparation Portal only */}
            <div className="rounded-2xl p-6 flex flex-col bg-[#F5F6FA]" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
              <h3 className="font-bold text-lg" style={{ color: '#0B1A35' }}>Preparation Portal only</h3>
              <p className="text-gray-500 text-xs font-semibold mb-3">Notes &amp; practice questions</p>
              <div className="flex items-baseline gap-1.5 mb-3">
                <span className="font-playfair font-black text-4xl" style={{ color: '#0B1A35' }}>₹999</span>
                <span className="text-gray-400 text-sm">/ year</span>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed mb-5">
                Quick notes, chapter-wise questions, and weekly &amp; monthly tests across Physics, Chemistry, Botany &amp; Zoology.
              </p>
              <div className="mt-auto flex flex-col items-center">
                <div className="bg-white p-2.5 rounded-xl" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
                  <img
                    src="/images/qr-neet-prep-999.jpeg"
                    alt="Pay ₹999 — NEET Preparation Portal annual access"
                    width={150}
                    height={150}
                    style={{ display: 'block' }}
                  />
                </div>
                <p className="text-gray-400 text-[11px] text-center mt-3">Scan &amp; pay ₹999 · <a href="/neet-preparation" className="underline" style={{ color: '#7C3AED' }}>full details &amp; register →</a></p>
              </div>
            </div>

            {/* Card 3 — Practice Hub only */}
            <div className="rounded-2xl p-6 flex flex-col bg-[#F5F6FA]" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
              <h3 className="font-bold text-lg" style={{ color: '#0B1A35' }}>Practice Hub only</h3>
              <p className="text-gray-500 text-xs font-semibold mb-3">Full mock tests</p>
              <div className="flex items-baseline gap-1.5 mb-3">
                <span className="font-playfair font-black text-4xl" style={{ color: '#0B1A35' }}>₹1,111</span>
                <span className="text-gray-400 text-sm">/ year</span>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed mb-5">
                Full-length 180-question NEET mock tests with +4/−1 marking and subject-wise performance analysis.
              </p>
              <div className="mt-auto flex flex-col items-center justify-center text-center w-full">
                <a
                  href={waLink('I want to register for the Practice Hub only plan (₹1,111/year).')}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 font-bold text-sm text-white transition-opacity hover:opacity-90"
                  style={{ background: '#25D366' }}
                >
                  Pay via WhatsApp
                </a>
                <p className="text-gray-400 text-[11px] mt-3">Payment QR coming soon — pay &amp; confirm on WhatsApp for now.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-14 px-4 sm:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-center mb-8" style={{ color: '#C6962E' }}>
            What You Get
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-[#F5F6FA] rounded-2xl p-6"
                style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: '#0B1A35' }}>
                  <Icon className="w-5 h-5" style={{ color: '#C6962E' }} />
                </div>
                <h3 className="font-bold text-sm mb-1.5" style={{ color: '#0B1A35' }}>{title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="py-12 px-4 sm:px-8 bg-[#F5F6FA]">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl p-8 bg-white shadow-sm" style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-2 text-center" style={{ color: '#C6962E' }}>
              Everything Included
            </p>
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="font-black text-lg" style={{ color: '#7C3AED' }}>₹2,110</span>
              <span className="text-gray-500 text-sm">/ year</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {included.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#16A34A' }} />
                  <span className="text-sm" style={{ color: '#0B1A35' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NEET SCORING BANNER */}
      <section className="py-10 px-4 sm:px-8" style={{ background: '#0B1A35' }}>
        <div className="max-w-3xl mx-auto flex flex-wrap gap-8 justify-center text-center">
          {[
            { value: '180', label: 'Questions per Test' },
            { value: '3 hrs', label: 'Duration' },
            { value: '+4 / −1', label: 'NEET Marking' },
            { value: '720', label: 'Max Score' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="font-playfair font-black text-3xl" style={{ color: '#C6962E' }}>{value}</p>
              <p className="text-white/50 text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* REGISTRATION + PAYMENT */}
      <section className="py-16 px-4 sm:px-8 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

          {/* How it works + Payment */}
          <div>
            <h2 className="font-playfair font-bold text-2xl sm:text-3xl mb-8" style={{ color: '#0B1A35' }}>
              How to Get Access
            </h2>
            <div className="space-y-5 mb-8">
              {steps.map(({ n, t, d }) => (
                <div key={n} className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black"
                    style={{ background: 'rgba(198,150,46,0.12)', color: '#C6962E' }}>{n}</div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#0B1A35' }}>{t}</p>
                    <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{d}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl p-6" style={{ background: '#0B1A35' }}>
              <div className="mb-4">
                <p className="font-bold text-sm" style={{ color: '#C6962E' }}>💳 Scan & Pay via UPI</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-yellow-300 font-black text-lg">₹2,110</span>
                  <span className="text-white/50 text-xs">/ year</span>
                </div>
              </div>
              <div className="flex justify-center mb-4">
                <div className="bg-white p-3 rounded-xl">
                  <img
                    src="/images/qr-neet-hub-2110.jpeg"
                    alt="Pay ₹2,110 — NEET Coaching Package annual access"
                    width={180}
                    height={180}
                    style={{ display: 'block' }}
                  />
                </div>
              </div>
              <p className="text-white/50 text-xs text-center mb-4">Scan &amp; pay ₹2,110 with any UPI app — Google Pay, PhonePe, Paytm, BHIM</p>
              <div className="space-y-2">
                {[
                  { label: 'UPI ID', value: 'yespay.bizsbiz175213@yesbankltd' },
                  { label: 'Account', value: 'ABHA GLOBAL EDUCARE LLP' },
                  { label: 'Amount', value: '₹2,110 / year' },
                  { label: 'WhatsApp', value: WHATSAPP.display },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
                    <span className="text-white/50 text-xs">{label}</span>
                    <span className="text-white font-bold text-xs">{value}</span>
                  </div>
                ))}
              </div>
              <p className="text-white/40 text-xs mt-4 leading-relaxed">
                After payment, enter your UTR (transaction ID) in the form below and share your screenshot on WhatsApp.
              </p>
            </div>
          </div>

          {/* Registration Form */}
          <div>
            <AnimatePresence mode="wait">
              {formState === 'success' ? (
                <motion.div key="success"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl p-10 text-center"
                  style={{ background: '#F0FDF4', border: '1px solid #86EFAC' }}>
                  <Trophy className="w-14 h-14 mx-auto mb-5" style={{ color: '#16A34A' }} />
                  <h3 className="font-playfair font-bold text-2xl mb-3" style={{ color: '#0B1A35' }}>
                    Registration Received!
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">{statusMsg}</p>
                  <a href={waLinkEncoded("Hi%2C+I+just+registered+for+the+NEET+Coaching+Package")}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white"
                    style={{ background: '#25D366' }}>
                    Track Status on WhatsApp
                  </a>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="rounded-2xl p-7 bg-white shadow-sm"
                  style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
                  <h3 className="font-playfair font-bold text-2xl mb-1" style={{ color: '#0B1A35' }}>
                    Register Now
                  </h3>
                  <p className="text-gray-400 text-xs mb-6">NEET Coaching Package · <span className="font-bold" style={{ color: '#7C3AED' }}>₹2,110 / year</span> · Preparation Portal + Practice Hub</p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#0B1A35' }}>Full Name *</label>
                        <input name="name" type="text" required placeholder="Your name" disabled={formState === 'loading'}
                          className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#C6962E] transition-colors"
                          style={{ borderColor: '#E2E8F0', color: '#0B1A35' }} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#0B1A35' }}>Phone *</label>
                        <input name="phone" type="tel" required placeholder="+91 XXXXX XXXXX" disabled={formState === 'loading'}
                          className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#C6962E] transition-colors"
                          style={{ borderColor: '#E2E8F0', color: '#0B1A35' }} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#0B1A35' }}>Email Address *</label>
                      <input name="email" type="email" required placeholder="your@email.com" disabled={formState === 'loading'}
                        className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#C6962E] transition-colors"
                        style={{ borderColor: '#E2E8F0', color: '#0B1A35' }} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#0B1A35' }}>City</label>
                        <input name="city" type="text" placeholder="Your city" disabled={formState === 'loading'}
                          className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#C6962E] transition-colors"
                          style={{ borderColor: '#E2E8F0', color: '#0B1A35' }} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#0B1A35' }}>NEET Status</label>
                        <select name="neetStatus" disabled={formState === 'loading'}
                          className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#C6962E] transition-colors"
                          style={{ borderColor: '#E2E8F0', color: '#0B1A35' }}>
                          <option value="">Select</option>
                          <option>Re-NEET Attempt</option>
                          <option>Appearing Re-NEET 2026</option>
                          <option>Appearing NEET 2027</option>
                          <option>Appearing NEET 2028</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#0B1A35' }}>
                        NEET Score <span className="text-gray-400 font-normal">(if appeared)</span>
                      </label>
                      <input name="neetScore" type="text" placeholder="e.g. 480 or Not appeared" disabled={formState === 'loading'}
                        className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#C6962E] transition-colors"
                        style={{ borderColor: '#E2E8F0', color: '#0B1A35' }} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#0B1A35' }}>
                        UPI Transaction ID (UTR) *
                      </label>
                      <input name="utr" type="text" required placeholder="Enter UTR after paying ₹2,110" disabled={formState === 'loading'}
                        className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#C6962E] transition-colors"
                        style={{ borderColor: '#E2E8F0', color: '#0B1A35' }} />
                      <p className="text-gray-400 text-xs mt-1">Found in your UPI app under transaction history</p>
                    </div>
                    <AnimatePresence>
                      {statusMsg && formState === 'error' && (
                        <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className="text-red-600 text-sm bg-red-50 rounded-xl px-4 py-3">{statusMsg}</motion.p>
                      )}
                    </AnimatePresence>
                    <button type="submit" disabled={formState === 'loading'}
                      className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-bold text-white text-sm transition-opacity disabled:opacity-60"
                      style={{ background: '#0B1A35' }}>
                      {formState === 'loading'
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
                        : <>Submit Registration <ArrowRight className="w-4 h-4" /></>}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-10 px-4 sm:px-8 text-center" style={{ background: '#0B1A35' }}>
        <div className="mb-6">
          <p className="text-white/70 text-sm mb-3">Already registered? Access your portal here.</p>
          <a
            href="https://neet.abhaglobaleducare.com/login"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90"
            style={{ background: '#C6962E', color: '#0B1A35' }}
          >
            🎓 Login to NEET Portal
          </a>
        </div>
        <p className="text-white/50 text-sm mb-4">Questions? We&apos;re here to help.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a href={KOLHAPUR.tel}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white border border-white/20 hover:border-[#C6962E]/60 transition-colors">
            <Phone className="w-4 h-4" /> {KOLHAPUR.phoneDisplay}
          </a>
          <a href="mailto:connect@abhaglobaleducare.com"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white border border-white/20 hover:border-[#C6962E]/60 transition-colors">
            <Mail className="w-4 h-4" /> connect@abhaglobaleducare.com
          </a>
          <a href="mailto:abhaglobaleducare@gmail.com"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white border border-white/20 hover:border-[#C6962E]/60 transition-colors">
            <Mail className="w-4 h-4" /> abhaglobaleducare@gmail.com
          </a>
        </div>
      </section>
    </div>
  );
}
