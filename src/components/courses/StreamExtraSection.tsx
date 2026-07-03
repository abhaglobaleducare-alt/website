'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { StreamExtra } from '@/data/streamExtras';

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
      className="overflow-hidden rounded-xl border border-gray-200"
    >
      <button
        className="flex w-full items-center justify-between bg-white px-5 py-4 text-left transition-colors duration-200 hover:bg-[#F8F9FA]"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="pr-4 text-sm font-semibold text-[#0B1A35] sm:text-base">{q}</span>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 text-[#C6962E] transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-200 bg-[#F8F9FA] px-5 py-4 text-sm leading-relaxed text-gray-600">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Data-driven "Why …" + "India vs Georgia" comparison + FAQ, rendered on every
 * course page. Content comes from src/data/streamExtras per stream.
 */
export default function StreamExtraSection({ extra }: { extra: StreamExtra }) {
  const { why, comparison, faq } = extra;
  return (
    <>
      {/* Why this stream */}
      <section className="bg-white px-4 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-[#C6962E]">
              {why.kicker}
            </span>
            <h2 className="font-playfair text-3xl leading-tight text-[#0B1A35] sm:text-4xl">
              {why.title} <span className="text-[#C6962E]">{why.titleAccent}</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {why.cards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.05 }}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card transition-shadow duration-300 hover:shadow-card-hover"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#C6962E]/10 text-[#C6962E]">
                  <card.icon size={24} />
                </div>
                <h3 className="mb-2 font-playfair text-xl font-semibold text-[#0B1A35]">
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">{card.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* India vs Georgia comparison */}
      <section className="bg-[#F8F9FA] px-4 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-10 text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-[#C6962E]">
              {comparison.kicker}
            </span>
            <h2 className="font-playfair text-3xl leading-tight text-[#0B1A35] sm:text-4xl">
              {comparison.title}
            </h2>
            <p className="mx-auto mt-4 max-w-[640px] leading-relaxed text-gray-500">
              {comparison.intro}
            </p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-card">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-[#0B1A35] text-white">
                  <th className="px-4 py-3.5 font-semibold">Path</th>
                  <th className="px-4 py-3.5 font-semibold">{comparison.leftLabel}</th>
                  <th className="px-4 py-3.5 font-semibold">{comparison.rightLabel}</th>
                </tr>
              </thead>
              <tbody>
                {comparison.rows.map((r, i) => (
                  <tr key={r.path} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FA]'}>
                    <td className="px-4 py-3.5 font-semibold text-[#0B1A35]">{r.path}</td>
                    <td className="px-4 py-3.5 text-gray-600">{r.left}</td>
                    <td className="px-4 py-3.5 text-gray-700">{r.right}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-white px-4 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-[820px]">
          <div className="mb-10 text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-[#C6962E]">
              {faq.kicker}
            </span>
            <h2 className="font-playfair text-3xl leading-tight text-[#0B1A35] sm:text-4xl">
              {faq.title}
            </h2>
          </div>
          <div className="space-y-3">
            {faq.items.map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
