'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Newspaper, Phone } from 'lucide-react';
import { currentUpdates } from '@/data/currentUpdates';
import { KOLHAPUR } from '@/data/contacts';

export default function CurrentUpdates() {
  const updates = [...currentUpdates].sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1));

  return (
    <div style={{ background: '#F5F6FA' }}>
      {/* HERO */}
      <section
        className="py-20 sm:py-24 px-4 sm:px-8"
        style={{ background: 'linear-gradient(135deg, #0B1A35 0%, #1a3160 100%)' }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-5 px-4 py-1.5 rounded-full"
            style={{ color: '#C6962E', border: '1px solid rgba(198,150,46,0.3)' }}
          >
            <Newspaper className="w-3.5 h-3.5" /> ABHA Current Updates
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-playfair text-white mb-4 leading-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)' }}
          >
            Current Updates
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            NEET निकाल विश्लेषण, cutoff मार्गदर्शन, validity charts आणि वेळोवेळी महत्त्वाच्या
            घडामोडी — ABHA Global Educare कडून एका ठिकाणी.
          </motion.p>
        </div>
      </section>

      {/* UPDATE CARDS */}
      <section className="py-14 sm:py-16 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {updates.map((u, i) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                href={u.href}
                className="group flex h-full flex-col rounded-2xl bg-white p-6 sm:p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                style={{ border: '1px solid rgba(0,0,0,0.06)' }}
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl text-2xl"
                    style={{ background: 'rgba(198,150,46,0.1)' }}
                  >
                    {u.icon}
                  </span>
                  {u.tag && (
                    <span
                      className="rounded-full px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wide"
                      style={{ background: 'rgba(198,150,46,0.12)', color: '#A67B25' }}
                    >
                      {u.tag}
                    </span>
                  )}
                </div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {u.date}
                </p>
                <h2 className="font-playfair text-xl font-bold leading-snug text-[#0B1A35] sm:text-2xl">
                  {u.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">{u.summary}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[#C6962E]">
                  संपूर्ण माहिती वाचा
                  <ArrowRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 sm:px-8 text-center bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-playfair font-bold text-2xl sm:text-3xl mb-3" style={{ color: '#0B1A35' }}>
            प्रश्न आहेत? मोफत expert consultation
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            तुमच्या NEET score व पुढील मार्गासाठी ABHA चा सल्ला — नि:शुल्क.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-gold to-gold-400 px-7 py-3.5 text-base font-bold text-primary-navy shadow-gold transition-transform duration-300 hover:-translate-y-0.5"
            >
              Book Counselling →
            </Link>
            <a
              href={KOLHAPUR.tel}
              className="inline-flex items-center gap-2 rounded-xl border px-6 py-3.5 text-base font-semibold transition-colors hover:bg-primary-gold/5"
              style={{ borderColor: 'rgba(198,150,46,0.4)', color: '#0B1A35' }}
            >
              <Phone className="w-4 h-4" style={{ color: '#C6962E' }} /> {KOLHAPUR.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
