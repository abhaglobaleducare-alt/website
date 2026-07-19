'use client';

import { BookOpen } from 'lucide-react';

interface Props {
  title?: string;
  points?: { q: string; a: string }[];
}

const defaultPoints = [
  {
    q: 'How is my rank estimated?',
    a: 'We map your score to an All India Rank using piecewise interpolation between last year’s NEET score-vs-rank anchor points — more accurate than a single straight line, especially in the crowded middle band.',
  },
  {
    q: 'AIQ (15%) vs State Quota (85%) — what’s the difference?',
    a: '15% of government seats are filled nationally through MCC counselling (any state can apply). The other 85% are reserved for your home-state domicile through your state authority. You must register for both — one does not cover the other.',
  },
  {
    q: 'Why does category change everything?',
    a: 'Reserved-category cutoffs are lower, but they also depend on valid caste-validity and domicile certificates. Our estimate uses category cutoffs; your documents decide final eligibility.',
  },
  {
    q: 'Why is MBBS abroad a "safety net"?',
    a: 'NMC & WHO eligible universities abroad have no rank race and transparent fees far below Indian private/deemed colleges. You still need to qualify NEET, and you return to practise in India after clearing FMGE/NExT.',
  },
];

export default function ExplanationCard({ title = 'How to read these results', points = defaultPoints }: Props) {
  return (
    <div className="rounded-3xl border border-navy-100 bg-light-gray p-6 shadow-card sm:p-8">
      <h3 className="flex items-center gap-2 font-playfair text-2xl font-bold text-primary-navy">
        <BookOpen className="h-6 w-6 text-primary-gold" /> {title}
      </h3>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {points.map((p) => (
          <div key={p.q} className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="font-semibold text-primary-navy">{p.q}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-navy-500">{p.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
