'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Brain, PlayCircle, FileText, CheckCircle2, ArrowRight, Loader2, Phone, Mail } from 'lucide-react';

const features = [
  { icon: BookOpen, title: 'Revision Zone', desc: 'Full NCERT chapter-wise revision — Physics, Chemistry, Botany & Zoology (Class 11 + 12)' },
  { icon: PlayCircle, title: 'Animated PPTs', desc: 'AI-voiced animated presentations for every chapter — explained visually, step by step' },
  { icon: FileText, title: 'Quick Notes', desc: 'Concise, exam-ready notes for every chapter — ideal for last-minute revision' },
  { icon: Brain, title: 'Chapter MCQs', desc: 'NEET-pattern MCQs (+4/−1) with instant explanations, chapter by chapter' },
];

const subjects = [
  { name: 'Physics', color: '#3B82F6', icon: '⚛️', chapters: '25 chapters' },
  { name: 'Chemistry', color: '#8B5CF6', icon: '🧪', chapters: '30 chapters' },
  { name: 'Botany', color: '#16A34A', icon: '🌿', chapters: '24 chapters' },
  { name: 'Zoology', color: '#F59E0B', icon: '🦠', chapters: '15 chapters' },
];

const steps = [
  { n: '01', t: 'Fill the registration form', d: 'Enter your details below. Takes under 2 minutes.' },
  { n: '02', t: 'Pay ₹999 via UPI', d: 'Send payment to the UPI ID shown. Screenshot your transaction.' },
  { n: '03', t: 'Enter your UTR number', d: 'Add your UPI Transaction ID in the form so our team can verify payment.' },
  { n: '04', t: 'Admin verifies & activates', d: 'We verify your payment and set up your account within 24 hours.' },
  { n: '05', t: 'Start learning immediately', d: 'Receive login credentials via WhatsApp/Email. Unlimited access starts.' },
];

export default function NeetPreparation() {
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
          course: 'NEET Preparation Portal — ₹999/year',
          message: `NEET Preparation Portal Registration. UPI Transaction ID (UTR): ${fd.get('utr') || 'Not provided'}`,
          source: 'neet-preparation-registration',
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFormState('success');
        setStatusMsg('Registration received! Our team will verify your payment and activate your account within 24 hours.');
        (e.target as HTMLFormElement).reset();
      } else {
        setFormState('error');
        setStatusMsg(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setFormState('error');
      setStatusMsg('Network error. Please WhatsApp us at +91 74475 52878.');
    }
  }

  return (
    <div style={{ background: '#F5F6FA' }}>

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
            NEET Preparation Portal
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
            className="text-slate-300 text-lg max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Chapterwise revision with animated PPTs, quick notes, and MCQ practice — Physics, Chemistry, Botany & Zoology (Class 11 + 12).
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="inline-flex items-center gap-3 rounded-2xl px-6 py-3"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(198,150,46,0.25)' }}
          >
            <span className="font-playfair font-black text-3xl" style={{ color: '#C6962E' }}>₹999</span>
            <span className="text-slate-400 text-sm">/ year · All 4 Subjects · Unlimited Access</span>
          </motion.div>
        </div>
      </section>

      {/* SUBJECTS */}
      <section className="py-10 px-4 sm:px-8 bg-white">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          {subjects.map((s) => (
            <div key={s.name} className="rounded-2xl p-5 text-center"
              style={{ background: `${s.color}08`, border: `1px solid ${s.color}20` }}>
              <div className="text-3xl mb-2">{s.icon}</div>
              <p className="font-bold text-sm" style={{ color: '#0B1A35' }}>{s.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.chapters}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-14 px-4 sm:px-8 bg-[#F5F6FA]">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-center mb-8" style={{ color: '#C6962E' }}>
            What&apos;s Inside the Portal
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
                style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(198,150,46,0.1)' }}>
                  <Icon className="w-5 h-5" style={{ color: '#C6962E' }} />
                </div>
                <h3 className="font-bold text-sm mb-1.5" style={{ color: '#0B1A35' }}>{title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
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
              <p className="font-bold text-sm mb-4" style={{ color: '#C6962E' }}>💳 Pay ₹999 via UPI</p>
              <div className="space-y-2">
                {[
                  { label: 'UPI ID', value: 'connect@abhaglobaleducare' },
                  { label: 'Amount', value: '₹999 / year' },
                  { label: 'WhatsApp', value: '+91 74475 52878' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
                    <span className="text-white/50 text-xs">{label}</span>
                    <span className="text-white font-bold text-sm">{value}</span>
                  </div>
                ))}
              </div>
              <p className="text-white/40 text-xs mt-4 leading-relaxed">
                After payment, share your screenshot on WhatsApp and enter your UTR in the form.
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
                  <CheckCircle2 className="w-14 h-14 mx-auto mb-5" style={{ color: '#16A34A' }} />
                  <h3 className="font-playfair font-bold text-2xl mb-3" style={{ color: '#0B1A35' }}>
                    Registration Received!
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">{statusMsg}</p>
                  <a href="https://wa.me/917447552878?text=Hi%2C+I+just+registered+for+NEET+Preparation+Portal"
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
                  <p className="text-gray-400 text-xs mb-6">NEET Preparation Portal · ₹999/year · All 4 subjects</p>
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
                          <option>Preparing — NEET 2025</option>
                          <option>Dropper — NEET 2026</option>
                          <option>Appeared, awaiting result</option>
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
                      <input name="utr" type="text" required placeholder="Enter UTR after paying ₹999" disabled={formState === 'loading'}
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
        <p className="text-white/50 text-sm mb-4">Questions? We&apos;re here to help.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a href="tel:+917447552878"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white border border-white/20 hover:border-[#C6962E]/60 transition-colors">
            <Phone className="w-4 h-4" /> +91 74475 52878
          </a>
          <a href="mailto:connect@abhaglobaleducare.com"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white border border-white/20 hover:border-[#C6962E]/60 transition-colors">
            <Mail className="w-4 h-4" /> connect@abhaglobaleducare.com
          </a>
        </div>
      </section>
    </div>
  );
}
