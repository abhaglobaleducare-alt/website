'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { waLink, KOLHAPUR } from '@/data/contacts';
import { trackEvent } from '@/lib/analytics';

type Btn = { label: string; kind: 'link' | 'wa' | 'tel'; href: string; ipad?: boolean };

function band(score: number): { emoji: string; headline: string; tone: string; buttons: Btn[] } {
  const wa = (msg: string) => waLink(msg);
  if (score >= 650)
    return {
      emoji: '🎉',
      headline: 'Excellent! Get expert AIQ choice-filling guidance.',
      tone: 'from-emerald-500 to-emerald-600',
      buttons: [
        { label: 'Free Counselling', kind: 'link', href: '/contact' },
        { label: 'Compare India vs Abroad', kind: 'wa', href: wa(`My NEET score is ${score}. Please help me compare India vs Abroad MBBS options.`) },
      ],
    };
  if (score >= 550)
    return {
      emoji: '👍',
      headline: 'Good score! Weigh AIQ, State Quota — or save up to ₹55L with Georgia.',
      tone: 'from-accent-blue to-blue-600',
      buttons: [
        { label: 'Free Counselling', kind: 'link', href: '/contact' },
        { label: 'India vs Georgia', kind: 'wa', href: wa(`My NEET score is ${score}. Please compare Indian Govt/private vs MBBS Georgia for me.`) },
      ],
    };
  if (score >= 450)
    return {
      emoji: '💡',
      headline: 'Indian private MBBS ₹80L+ vs Georgia tuition from ₹21L — the value is clear.',
      tone: 'from-primary-gold to-gold-600',
      buttons: [
        { label: 'WhatsApp Guidance', kind: 'wa', href: wa(`My NEET score is ${score}. I want guidance on MBBS Abroad vs Indian private.`) },
        { label: 'FREE Tablet Offer', kind: 'wa', href: wa(`Hi! I am interested in MBBS Abroad with the Early Bird study-tablet offer. My NEET Score: ${score}`), ipad: true },
        { label: 'MBBS Georgia', kind: 'link', href: '/destinations/georgia' },
      ],
    };
  if (score >= 350)
    return {
      emoji: '🌍',
      headline: 'MBBS Abroad is your strongest pathway — NMC & WHO Eligible, transparent fees.',
      tone: 'from-primary-gold to-gold-600',
      buttons: [
        { label: 'Start Georgia Application', kind: 'link', href: '/contact' },
        { label: 'FREE Tablet Offer', kind: 'wa', href: wa(`Hi! I am interested in MBBS Abroad with the Early Bird study-tablet offer. My NEET Score: ${score}`), ipad: true },
      ],
    };
  return {
    emoji: '🎯',
    headline: 'Your MBBS dream is alive — Georgia tuition from ₹21L, no rank race.',
    tone: 'from-primary-navy to-navy-600',
    buttons: [
      { label: 'WhatsApp Now', kind: 'wa', href: waLink(`My NEET score is ${score}. Please guide me on my MBBS options.`) },
      { label: 'FREE Tablet Offer', kind: 'wa', href: waLink(`Hi! I am interested in MBBS Abroad with the Early Bird study-tablet offer. My NEET Score: ${score}`), ipad: true },
      { label: 'Call Counsellor', kind: 'tel', href: KOLHAPUR.tel },
    ],
  };
}

export default function DynamicCta({ score }: { score: number }) {
  const b = band(score);

  const onClick = (btn: Btn) => {
    if (btn.ipad) trackEvent('ipad_offer_clicked', { score });
    else if (btn.kind === 'wa') trackEvent('whatsapp_cta_clicked', { score, section: 'dynamic-cta' });
    else if (btn.kind === 'tel') trackEvent('callback_requested', { score });
  };

  return (
    <div className={`rounded-3xl bg-gradient-to-br ${b.tone} p-6 text-white shadow-lg sm:p-8`}>
      <h3 className="font-playfair text-2xl font-bold text-white sm:text-3xl">
        {b.emoji} {b.headline}
      </h3>
      <div className="mt-5 flex flex-wrap gap-3">
        {b.buttons.map((btn) =>
          btn.kind === 'link' ? (
            <Link
              key={btn.label}
              href={btn.href}
              onClick={() => onClick(btn)}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-primary-navy transition-transform hover:-translate-y-0.5"
            >
              {btn.label} <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <a
              key={btn.label}
              href={btn.href}
              target={btn.kind === 'wa' ? '_blank' : undefined}
              rel={btn.kind === 'wa' ? 'noopener noreferrer' : undefined}
              onClick={() => onClick(btn)}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-transform hover:-translate-y-0.5 ${
                btn.ipad ? 'bg-emerald-500 text-white' : 'border border-white/30 text-white hover:bg-white/10'
              }`}
            >
              {btn.label}
            </a>
          ),
        )}
      </div>
    </div>
  );
}
