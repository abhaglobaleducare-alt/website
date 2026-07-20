'use client';

import { useState } from 'react';
import { Lock, Loader2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import type { FullAnalysis } from '@/lib/neetPredictor';
import { formatRank } from '@/lib/neetPredictor';
import { trackEvent } from '@/lib/analytics';

interface Props {
  analysis: FullAnalysis;
  onUnlock: (name: string) => void;
}

const STATUS_OPTIONS = [
  'NEET 2026 appeared',
  'NEET 2026 result awaited',
  'Previous year NEET qualified',
  'Dropper / Repeater',
];

const BUDGET_OPTIONS = [
  'Under ₹10 Lakhs',
  '₹10–25 Lakhs',
  '₹25–50 Lakhs',
  '₹50 Lakhs – ₹1 Crore',
  'Above ₹1 Crore',
  'Need scholarship / financial aid',
];

const INTEREST_GROUPS: { group: string; options: string[] }[] = [
  {
    group: 'MBBS in India',
    options: [
      'Government MBBS (AIQ — 15%)',
      'Government MBBS (State Quota — 85%)',
      'Private MBBS',
      'Deemed University MBBS',
    ],
  },
  {
    group: 'MBBS Abroad',
    options: ['MBBS Abroad — Georgia 🇬🇪', 'MBBS Abroad — Timor-Leste 🇹🇱', 'MBBS Abroad — Other Country'],
  },
  {
    group: 'Other Courses',
    options: [
      'BDS (Dental)',
      'BAMS (Ayurveda)',
      'BHMS (Homeopathy)',
      'BUMS (Unani)',
      'BSc Nursing',
      'BPT (Physiotherapy)',
      'Other Course',
    ],
  },
  { group: 'Guidance', options: ['Not sure — need expert guidance'] },
];

const OTHER_COUNTRY = 'MBBS Abroad — Other Country';
const OTHER_COURSE = 'Other Course';

function getUtm() {
  if (typeof window === 'undefined') return { utmSource: '', utmMedium: '', utmCampaign: '' };
  const p = new URLSearchParams(window.location.search);
  return {
    utmSource: p.get('utm_source') || '',
    utmMedium: p.get('utm_medium') || '',
    utmCampaign: p.get('utm_campaign') || '',
  };
}

const inputCls =
  'w-full rounded-xl border border-navy-200 bg-light-gray px-3.5 py-2.5 text-sm font-medium text-primary-navy outline-none transition focus:border-primary-gold focus:ring-2 focus:ring-gold-200';

export default function RegistrationWall({ analysis, onUnlock }: Props) {
  const { inputs } = analysis;
  const [f, setF] = useState({
    fullName: '',
    parentName: '',
    mobile: '',
    whatsapp: '',
    email: '',
    city: '',
    currentStatus: '',
    budgetRange: '',
    preferredCountry: '',
    otherCourse: '',
    ipadOfferInterested: false,
    consentGiven: false,
  });
  const [interestedIn, setInterestedIn] = useState<string[]>([]);
  const [whatsappTouched, setWhatsappTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((p) => ({ ...p, [k]: v }));

  const toggleInterest = (opt: string) =>
    setInterestedIn((p) => (p.includes(opt) ? p.filter((x) => x !== opt) : [...p, opt]));

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    if (!f.consentGiven) {
      setError('Please tick the consent box so our counsellor can contact you.');
      return;
    }
    setSubmitting(true);

    const payload = {
      fullName: f.fullName,
      parentName: f.parentName,
      mobile: f.mobile.startsWith('+') ? f.mobile : `+91${f.mobile.replace(/\D/g, '')}`,
      whatsapp: (whatsappTouched ? f.whatsapp : f.mobile) || f.mobile,
      email: f.email,
      city: f.city,
      state: inputs.state,
      neetScore: inputs.score,
      allIndiaRank: inputs.allIndiaRank ?? undefined,
      category: inputs.category,
      currentStatus: f.currentStatus,
      interestedIn,
      preferredCountry: interestedIn.includes(OTHER_COUNTRY) ? f.preferredCountry : '',
      otherCourse: interestedIn.includes(OTHER_COURSE) ? f.otherCourse : '',
      budgetRange: f.budgetRange,
      // exact ₹-Lakh figure typed on the analyzer form (counsellors want the number)
      budgetLakh: inputs.budget ? Math.round(inputs.budget / 100_000) : undefined,
      consentGiven: true as const,
      ipadOfferInterested: f.ipadOfferInterested,
      estimatedRank: analysis.rank,
      governmentChance: analysis.government.chance,
      stateQuotaChance: analysis.state.chance,
      privateChance: analysis.private.chance,
      abroadRecommended: analysis.recommendation.primaryKey === 'abroad',
      topRecommendation: analysis.recommendation.verdict,
      ...getUtm(),
    };

    // Fail-safe UX: the student ALWAYS unlocks. If delivery isn't confirmed we
    // still trace the lead (Meta Pixel event + client console) so it is never
    // silently lost — the server also logs the full lead on its side.
    trackEvent('registration_completed', { score: inputs.score, category: inputs.category });
    try {
      const res = await fetch('/api/neet-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data: { delivered?: boolean } = await res.json().catch(() => ({}));
      if (!res.ok || data.delivered === false) {
        trackEvent('lead_delivery_failed', { score: inputs.score });
        console.error('[neet-lead] delivery not confirmed — lead (trace, not lost):', payload);
      }
    } catch (err) {
      trackEvent('lead_delivery_failed', { score: inputs.score });
      console.error('[neet-lead] submit failed — lead (trace, not lost):', payload, err);
    } finally {
      onUnlock(f.fullName);
    }
  }

  const rankLabel = inputs.allIndiaRank ? `AIR ${formatRank(inputs.allIndiaRank)}` : `Est. AIR ${formatRank(analysis.rank)}`;

  return (
    <div className="mx-auto w-full max-w-2xl rounded-3xl border-2 border-primary-gold bg-white p-6 shadow-glass-lg sm:p-8">
      <div className="text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold-50 text-primary-gold">
          <Lock className="h-6 w-6" />
        </span>
        <h3 className="mt-3 font-playfair text-2xl font-bold text-primary-navy sm:text-3xl">
          🔓 Unlock Your Complete Admission Analysis
        </h3>
        <p className="mt-2 text-sm text-navy-500">
          One quick step to see your rank, all routes, cost comparison, confidence score and a personalised roadmap.
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-semibold text-emerald-700">
          <span className="inline-flex items-center gap-1"><ShieldCheck className="h-4 w-4" /> 100% Free</span>
          <span className="inline-flex items-center gap-1"><ShieldCheck className="h-4 w-4" /> No Spam</span>
          <span className="inline-flex items-center gap-1"><ShieldCheck className="h-4 w-4" /> No Obligation</span>
        </div>
      </div>

      {/* Captured-from-analyzer summary */}
      <div className="mt-5 flex flex-wrap justify-center gap-2 rounded-xl bg-light-gray p-3 text-xs font-semibold text-navy-600">
        <span className="rounded-md bg-white px-2.5 py-1 shadow-sm">Score: {inputs.score}</span>
        <span className="rounded-md bg-white px-2.5 py-1 shadow-sm">{rankLabel}</span>
        <span className="rounded-md bg-white px-2.5 py-1 shadow-sm">{inputs.category}</span>
        <span className="rounded-md bg-white px-2.5 py-1 shadow-sm">{inputs.state}</span>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-primary-navy">Full Name *</label>
            <input required value={f.fullName} onChange={(e) => set('fullName', e.target.value)} placeholder="Your name" className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-primary-navy">Parent / Guardian Name *</label>
            <input required value={f.parentName} onChange={(e) => set('parentName', e.target.value)} placeholder="Parent / guardian" className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-primary-navy">Mobile Number *</label>
            <div className="flex">
              <span className="inline-flex items-center rounded-l-xl border border-r-0 border-navy-200 bg-navy-50 px-3 text-sm font-semibold text-navy-500">+91</span>
              <input
                required
                type="tel"
                value={f.mobile}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^\d]/g, '').slice(0, 10);
                  set('mobile', v);
                  if (!whatsappTouched) set('whatsapp', v);
                }}
                placeholder="10-digit mobile"
                className={`${inputCls} rounded-l-none`}
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-primary-navy">WhatsApp Number <span className="text-navy-300">(auto-filled)</span></label>
            <div className="flex">
              <span className="inline-flex items-center rounded-l-xl border border-r-0 border-navy-200 bg-navy-50 px-3 text-sm font-semibold text-navy-500">+91</span>
              <input
                type="tel"
                value={f.whatsapp}
                onChange={(e) => {
                  setWhatsappTouched(true);
                  set('whatsapp', e.target.value.replace(/[^\d]/g, '').slice(0, 10));
                }}
                placeholder="Same as mobile"
                className={`${inputCls} rounded-l-none`}
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-primary-navy">Email Address *</label>
            <input required type="email" value={f.email} onChange={(e) => set('email', e.target.value)} placeholder="you@email.com" className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-primary-navy">City *</label>
            <input required value={f.city} onChange={(e) => set('city', e.target.value)} placeholder="Your city" className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-primary-navy">Current Status</label>
            <select value={f.currentStatus} onChange={(e) => set('currentStatus', e.target.value)} className={inputCls}>
              <option value="">Select</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-primary-navy">Budget Range</label>
            <select value={f.budgetRange} onChange={(e) => set('budgetRange', e.target.value)} className={inputCls}>
              <option value="">Select</option>
              {BUDGET_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Interested In */}
        <div>
          <p className="mb-2 text-xs font-semibold text-primary-navy">Interested In <span className="text-navy-300">(select all that apply)</span></p>
          <div className="space-y-3">
            {INTEREST_GROUPS.map((g) => (
              <div key={g.group}>
                <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-navy-400">{g.group}</p>
                <div className="flex flex-wrap gap-2">
                  {g.options.map((opt) => {
                    const active = interestedIn.includes(opt);
                    return (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => toggleInterest(opt)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                          active
                            ? 'border-primary-gold bg-gold-50 text-gold-700'
                            : 'border-navy-200 bg-white text-navy-500 hover:border-navy-300'
                        }`}
                      >
                        {active && <CheckCircle2 className="mr-1 inline h-3.5 w-3.5" />}
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          {interestedIn.includes(OTHER_COUNTRY) && (
            <input
              value={f.preferredCountry}
              onChange={(e) => set('preferredCountry', e.target.value)}
              placeholder="Which country?"
              className={`${inputCls} mt-2`}
            />
          )}
          {interestedIn.includes(OTHER_COURSE) && (
            <input
              value={f.otherCourse}
              onChange={(e) => set('otherCourse', e.target.value)}
              placeholder="Which course?"
              className={`${inputCls} mt-2`}
            />
          )}
        </div>

        {/* iPad offer opt-in */}
        <label className="flex items-start gap-2.5 rounded-xl border border-gold-200 bg-gold-50 p-3 text-sm text-navy-600">
          <input
            type="checkbox"
            checked={f.ipadOfferInterested}
            onChange={(e) => set('ipadOfferInterested', e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-primary-gold"
          />
          <span>🎁 I want to know about the <strong>FREE iPad Early Bird Offer</strong> for MBBS Abroad registration.</span>
        </label>

        {/* Mandatory consent */}
        <label className="flex items-start gap-2.5 text-xs leading-relaxed text-navy-500">
          <input
            type="checkbox"
            checked={f.consentGiven}
            onChange={(e) => set('consentGiven', e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-primary-gold"
          />
          <span>
            I agree to be contacted by ABHA Global Educare LLP via WhatsApp, call, or email for FREE guidance regarding my
            MBBS admission journey. I understand this is a free service with no obligation.
          </span>
        </label>

        {error && <p className="text-sm font-semibold text-rose-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-gold to-gold-600 px-6 py-4 text-base font-bold text-primary-navy shadow-gold transition-transform hover:-translate-y-0.5 disabled:opacity-70"
        >
          {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lock className="h-5 w-5" />}
          {submitting ? 'Unlocking…' : 'Unlock My Full Analysis →'}
        </button>
      </form>
    </div>
  );
}
