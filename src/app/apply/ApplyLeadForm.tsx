'use client';

import { useState } from 'react';
import { ArrowRight, Loader2, Shield, CheckCircle2, MessageCircle } from 'lucide-react';
import { waLink } from '@/data/contacts';

/**
 * Google Ads landing-page lead form (/apply). Minimal fields — Name, Mobile,
 * City, optional NEET status. Submits to the shared /api/contact endpoint with
 * source = 'google_ads_apply' (→ CRM trigger_action / web_lead_source), then
 * shows an INLINE thank-you + WhatsApp deep link. Never redirects — the page
 * stays put so the ads conversion pixel fires reliably.
 */

// Kept out of render so the reference is stable.
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const WA_SUCCESS_MSG =
  'नमस्कार ABHA! मी /apply page वरून MBBS Abroad + AGDRP साठी अर्ज केला आहे. कृपया मला अधिक माहिती द्या.';

export default function ApplyLeadForm() {
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatusMessage('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = (formData.get('name') as string)?.trim();
    const phone = (formData.get('phone') as string)?.replace(/\D/g, '');
    const city = (formData.get('city') as string)?.trim();
    const neetStatus = (formData.get('neetStatus') as string) || '';

    // 10-digit Indian mobile validation (client-side, before the network call).
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setFormState('error');
      setStatusMessage('कृपया वैध 10-अंकी मोबाइल नंबर टाका.');
      return;
    }

    setFormState('loading');

    const payload = {
      name,
      phone,
      city,
      // CRM auto-routes district → nearest office; city is our best signal here.
      district: city,
      neetStatus,
      // web_lead_source discriminator for the ABHA CRM.
      source: 'google_ads_apply',
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
        // Fire the Meta Pixel Lead event for ads conversion tracking.
        if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
          window.fbq('track', 'Lead', { source: 'google_ads_apply' });
        }
        form.reset();
      } else {
        setFormState('error');
        setStatusMessage(data.message || 'काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.');
      }
    } catch {
      setFormState('error');
      setStatusMessage('नेटवर्क त्रुटी. कृपया तुमचं कनेक्शन तपासा आणि पुन्हा प्रयत्न करा.');
    }
  }

  if (formState === 'success') {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-[0_20px_60px_rgba(11,26,53,0.18)] ring-1 ring-black/5 sm:p-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 size={30} />
        </div>
        <h3 className="text-center font-playfair text-2xl font-bold text-[#0B1A35]">
          धन्यवाद! तुमचा अर्ज मिळाला.
        </h3>
        <p className="mt-2 text-center text-[0.95rem] leading-relaxed text-gray-600">
          आमचे counsellor 24 तासांच्या आत तुम्हाला कॉल करतील. लगेच बोलायचं असेल तर
          खालील WhatsApp बटणावर क्लिक करा.
        </p>
        <a
          href={waLink(WA_SUCCESS_MSG)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 text-base font-bold text-white shadow-[0_4px_20px_rgba(37,211,102,0.35)] transition-transform duration-200 hover:-translate-y-0.5"
        >
          <MessageCircle size={20} /> WhatsApp वर बोला
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0_20px_60px_rgba(11,26,53,0.18)] ring-1 ring-black/5 sm:p-7">
      <div className="mb-5">
        <h3 className="font-playfair text-2xl font-bold text-[#0B1A35]">मोफत Counselling बुक करा</h3>
        <p className="mt-1 text-[0.9rem] text-gray-500">
          तुमची माहिती भरा — counsellor 24 तासांच्या आत कॉल करतील
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="apply-name" className="mb-1.5 block text-sm font-medium text-[#0B1A35]">
            पूर्ण नाव <span className="text-[#C6962E]">*</span>
          </label>
          <input
            id="apply-name"
            type="text"
            name="name"
            placeholder="उदा. आरव शर्मा"
            required
            minLength={2}
            disabled={formState === 'loading'}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-[0.95rem] text-[#0B1A35] placeholder:text-gray-400 transition-all duration-200 focus:border-[#C6962E] focus:outline-none focus:ring-2 focus:ring-[#C6962E]/10 disabled:opacity-50"
          />
        </div>
        <div>
          <label htmlFor="apply-phone" className="mb-1.5 block text-sm font-medium text-[#0B1A35]">
            मोबाइल नंबर <span className="text-[#C6962E]">*</span>
          </label>
          <input
            id="apply-phone"
            type="tel"
            name="phone"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="10-अंकी मोबाइल नंबर"
            required
            disabled={formState === 'loading'}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-[0.95rem] text-[#0B1A35] placeholder:text-gray-400 transition-all duration-200 focus:border-[#C6962E] focus:outline-none focus:ring-2 focus:ring-[#C6962E]/10 disabled:opacity-50"
          />
        </div>
        <div>
          <label htmlFor="apply-city" className="mb-1.5 block text-sm font-medium text-[#0B1A35]">
            शहर / जिल्हा <span className="text-[#C6962E]">*</span>
          </label>
          <input
            id="apply-city"
            type="text"
            name="city"
            placeholder="उदा. कोल्हापूर"
            required
            disabled={formState === 'loading'}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-[0.95rem] text-[#0B1A35] placeholder:text-gray-400 transition-all duration-200 focus:border-[#C6962E] focus:outline-none focus:ring-2 focus:ring-[#C6962E]/10 disabled:opacity-50"
          />
        </div>
        <div>
          <label htmlFor="apply-neet" className="mb-1.5 block text-sm font-medium text-[#0B1A35]">
            NEET स्थिती <span className="text-gray-400">(optional)</span>
          </label>
          <select
            id="apply-neet"
            name="neetStatus"
            disabled={formState === 'loading'}
            className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-[0.95rem] text-[#0B1A35] transition-all duration-200 focus:border-[#C6962E] focus:outline-none focus:ring-2 focus:ring-[#C6962E]/10 disabled:opacity-50"
          >
            <option value="">तुमची NEET स्थिती निवडा</option>
            <option value="appeared">NEET 2026 दिली</option>
            <option value="preparing">NEET 2026 ची तयारी सुरू</option>
            <option value="qualified">NEET Qualified (मागील वर्ष)</option>
            <option value="not-applicable">लागू नाही</option>
          </select>
        </div>

        {statusMessage && formState === 'error' && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {statusMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={formState === 'loading'}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C6962E] to-[#d4a73a] py-3.5 text-sm font-bold text-[#0B1A35] shadow-[0_4px_20px_rgba(198,150,46,0.3)] transition-all duration-300 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
        >
          {formState === 'loading' ? (
            <>
              <Loader2 size={18} className="animate-spin" /> पाठवत आहे…
            </>
          ) : (
            <>
              मोफत Counselling बुक करा <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <div className="mt-5 flex items-center justify-center gap-3 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <Shield size={12} /> 100% Secure
        </span>
        <span className="h-1 w-1 rounded-full bg-gray-300" />
        <span>No spam, ever</span>
        <span className="h-1 w-1 rounded-full bg-gray-300" />
        <span>मोफत सल्ला</span>
      </div>
    </div>
  );
}
