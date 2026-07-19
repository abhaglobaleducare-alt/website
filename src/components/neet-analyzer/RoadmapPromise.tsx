'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, MessageCircle, PhoneCall, Clock } from 'lucide-react';
import { waLink, KOLHAPUR, WHATSAPP } from '@/data/contacts';
import { formatRank } from '@/lib/neetPredictor';
import { trackEvent } from '@/lib/analytics';

interface Props {
  name: string;
  score: number;
  rank: number;
  rankIsEstimate: boolean;
}

const INCLUDES = [
  'Top 10 colleges for your score',
  'Round-wise counselling strategy',
  'Fee comparison: Govt vs Private vs Abroad',
  'Scholarship opportunities',
  'Complete document checklist',
  'Month-wise timeline',
  'Expert recommendation',
];

export default function RoadmapPromise({ name, score, rank, rankIsEstimate }: Props) {
  const firstName = name.trim().split(/\s+/)[0] || 'there';
  const rankStr = `${rankIsEstimate ? 'AIR ~' : 'AIR '}${formatRank(rank)}`;

  const roadmapMsg = `Hi! I scored ${score} in NEET 2026 (${rankStr}). Please send my personalized MBBS roadmap. Name: ${name}`;
  const callbackMsg = `Please call me about my NEET score ${score} (${rankStr}). Name: ${name}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden rounded-3xl border border-gold-200 bg-gradient-to-br from-primary-navy to-navy-700 p-6 text-white shadow-navy sm:p-8"
    >
      <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gold-200">
        📋 Your Personalized MBBS Roadmap
      </span>
      <h3 className="mt-3 font-playfair text-2xl font-bold text-white sm:text-3xl">Thank you, {firstName}!</h3>
      <p className="mt-2 text-sm leading-relaxed text-navy-100">
        Based on your NEET score of <strong className="text-white">{score}</strong> ({rankStr}), our expert counsellor is
        preparing a personalised roadmap for you.
      </p>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {INCLUDES.map((i) => (
          <div key={i} className="flex items-start gap-2 text-sm text-navy-100">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            <span>{i}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-navy-100">
        <span className="inline-flex items-center gap-1.5">
          <MessageCircle className="h-4 w-4 text-primary-gold" /> Delivery: WhatsApp within 24 hours
        </span>
        <span className="inline-flex items-center gap-1.5">
          <PhoneCall className="h-4 w-4 text-primary-gold" /> Our counsellor will also call you
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-primary-gold" /> Helpline: {KOLHAPUR.phoneDisplay}
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a
          href={waLink(roadmapMsg)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('whatsapp_cta_clicked', { score, section: 'roadmap' })}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5"
        >
          <MessageCircle className="h-5 w-5" /> Chat on WhatsApp Now
        </a>
        <a
          href={waLink(callbackMsg)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('callback_requested', { score })}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
        >
          <PhoneCall className="h-5 w-5 text-primary-gold" /> Request Immediate Callback
        </a>
      </div>
      <p className="mt-3 text-[11px] text-navy-300">Prefer to talk now? WhatsApp us on {WHATSAPP.display}.</p>
    </motion.div>
  );
}
