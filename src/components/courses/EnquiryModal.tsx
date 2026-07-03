'use client';

import { useEffect, useState } from 'react';
import { X, MessageCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useEnquiry } from './context';

const NEET_OPTIONS = [
  'Appearing 2026',
  'Qualified',
  'Not Appeared',
  'Parent Enquiry',
] as const;

const WHATSAPP_NUMBER = '917447552878';

function buildWhatsAppLink(fields: {
  course: string;
  university: string;
  stream: string;
  neetStatus: string;
  name: string;
}): string {
  const parts = [
    `Namaste ABHA! I want details about ${fields.course} at ${fields.university} (${fields.stream}).`,
  ];
  if (fields.neetStatus) parts.push(`My NEET status: ${fields.neetStatus}.`);
  if (fields.name) parts.push(`Name: ${fields.name}`);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(parts.join(' '))}`;
}

export default function EnquiryModal() {
  const { isOpen, data, closeEnquiry } = useEnquiry();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [neetStatus, setNeetStatus] = useState<string>(NEET_OPTIONS[0]);
  const [errors, setErrors] = useState<{ name?: string; mobile?: string; email?: string }>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  // Reset form each time the modal opens.
  useEffect(() => {
    if (isOpen) {
      setName('');
      setMobile('');
      setEmail('');
      setNeetStatus(NEET_OPTIONS[0]);
      setErrors({});
      setStatus('idle');
    }
  }, [isOpen]);

  // Escape-to-close + body scroll lock.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeEnquiry();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, closeEnquiry]);

  if (!isOpen) return null;

  const whatsappLink = buildWhatsAppLink({
    course: data.course,
    university: data.university,
    stream: data.stream,
    neetStatus,
    name,
  });

  function validate(): boolean {
    const next: typeof errors = {};
    if (name.trim().length < 2) next.name = 'Please enter your full name.';
    if (!/^\d{10}$/.test(mobile.trim())) next.mobile = 'Enter a valid 10-digit mobile number.';
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.email = 'Enter a valid email address.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: mobile.trim(),
          email: email.trim() || undefined,
          neetStatus,
          course: data.course,
          stream: data.stream,
          university: data.university,
          source: 'enquiry-modal',
        }),
      });
      const json = await res.json();
      if (json.success) {
        setStatus('success');
      } else {
        setStatus('idle');
        setErrors({ mobile: 'Something went wrong. Please try WhatsApp instead.' });
      }
    } catch {
      setStatus('idle');
      setErrors({ mobile: 'Network error. Please try WhatsApp instead.' });
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-title"
      onClick={closeEnquiry}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 bg-[#0B1A35] px-6 py-5">
          <div>
            <h2 id="enquiry-title" className="font-playfair text-xl font-bold text-white">
              Book Free Counselling
            </h2>
            <p className="mt-1 text-sm text-white/70">
              {data.stream}
              {data.university !== 'Any / Not decided' ? ` · ${data.university}` : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={closeEnquiry}
            aria-label="Close enquiry form"
            className="rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={22} />
          </button>
        </div>

        {status === 'success' ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#C6962E]/15 text-[#C6962E]">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="font-playfair text-2xl font-bold text-[#0B1A35]">Thank you!</h3>
            <p className="mx-auto mt-3 max-w-sm text-gray-600">
              Our counselor will call you within <strong>2 hours</strong>.
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
            >
              <MessageCircle size={18} /> Continue on WhatsApp
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-6">
            <div className="space-y-4">
              {/* Read-only context */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="label">Stream</label>
                  <input className="input bg-gray-50 text-gray-600" value={data.stream} readOnly />
                </div>
                <div>
                  <label className="label">University</label>
                  <input
                    className="input bg-gray-50 text-gray-600"
                    value={data.university}
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="label" htmlFor="enq-name">
                  Full Name *
                </label>
                <input
                  id="enq-name"
                  className={`input ${errors.name ? 'input-error' : ''}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                />
                {errors.name && <p className="error-message">{errors.name}</p>}
              </div>

              <div>
                <label className="label" htmlFor="enq-mobile">
                  Mobile (10-digit) *
                </label>
                <input
                  id="enq-mobile"
                  inputMode="numeric"
                  className={`input ${errors.mobile ? 'input-error' : ''}`}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10-digit mobile number"
                />
                {errors.mobile && <p className="error-message">{errors.mobile}</p>}
              </div>

              <div>
                <label className="label" htmlFor="enq-email">
                  Email
                </label>
                <input
                  id="enq-email"
                  type="email"
                  className={`input ${errors.email ? 'input-error' : ''}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com (optional)"
                />
                {errors.email && <p className="error-message">{errors.email}</p>}
              </div>

              <div>
                <label className="label" htmlFor="enq-neet">
                  NEET Status
                </label>
                <select
                  id="enq-neet"
                  className="input"
                  value={neetStatus}
                  onChange={(e) => setNeetStatus(e.target.value)}
                >
                  {NEET_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-gold to-gold-400 px-6 py-3.5 font-bold text-primary-navy shadow-gold transition-transform hover:-translate-y-0.5 disabled:opacity-70"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Submitting…
                </>
              ) : (
                'Request a Callback'
              )}
            </button>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 font-bold text-white transition-transform hover:-translate-y-0.5"
            >
              <MessageCircle size={18} /> WhatsApp Us Instead
            </a>

            <p className="mt-4 text-center text-xs leading-relaxed text-gray-500">
              By submitting, you agree to be contacted by ABHA Global Educare. No spam, ever.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
