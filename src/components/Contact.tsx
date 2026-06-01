'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LeadGate from '@/components/LeadGate';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  Loader2,
  Building2,
  Globe,
} from 'lucide-react';

const offices = [
  {
    icon: Building2,
    title: 'Kolhapur — Head Office',
    address: '203, Lotus Plaza, Venus Corner, Shahupuri, Kolhapur — 416001, Maharashtra',
    phone: '+91 74475 52878',
    phoneHref: 'tel:+917447552878',
    hours: 'Mon–Sat, 10 AM – 7 PM',
  },
  {
    icon: Building2,
    title: 'Chatrapati Sambhajinagar — Branch Office',
    address: 'Office No. 01, Plot B-1, Aliza Mazil, Osmanpura, CSN, Maharashtra',
    phone: '+91 76207 07088',
    phoneHref: 'tel:+917620707088',
    hours: 'Mon–Sat, 10 AM – 7 PM',
  },
  {
    icon: Building2,
    title: 'Boisar — Branch Office',
    address: 'Mahavir Nischay, A6, Flat no 201, Mahavir Nagar, Boisar, pin 401501, Maharashtra',
    phone: '+91 72494 09376',
    phoneHref: 'tel:+917249409376',
    hours: 'Mon–Sat, 10 AM – 7 PM',
  },
  {
    icon: Globe,
    title: 'Tbilisi, Georgia — Abroad Office',
    address: 'ABHA Global Services LLC, 37 Raphael Agladze Street, Tbilisi',
    phone: '+995 57 910 4926 / +995 591 717122',
    phoneHref: 'tel:+995579104926',
    note: 'On-ground support + OneWindow Services hostel',
  },
];

export default function Contact() {
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState('loading');
    setStatusMessage('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      message: formData.get('message') as string,
      preferredCountry: formData.get('country') as string,
      source: 'contact-page-form',
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
        setStatusMessage('Thank you! Our counselor will reach out within 24 hours.');
        form.reset();
        setTimeout(() => { setFormState('idle'); setStatusMessage(''); }, 5000);
      } else {
        setFormState('error');
        setStatusMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setFormState('error');
      setStatusMessage('Network error. Please check your connection.');
    }
  }

  return (
    <section id="contact" className="bg-[#F8F9FA] py-16 sm:py-20 lg:py-28 px-4 sm:px-8">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
          <div className="text-center mb-10 sm:mb-14 lg:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-[#C6962E] font-semibold text-sm uppercase tracking-[0.2em] mb-4"
          >
            Get in Touch
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="font-playfair text-3xl sm:text-4xl lg:text-[2.75rem] text-[#0B1A35] mb-5 leading-tight"
          >
            Start Your <span className="text-[#C6962E]">MBBS Journey</span> Today
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-lg max-w-[580px] mx-auto"
          >
            Drop us a message or visit any of our three offices. 
            We respond to every enquiry within 24 hours.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left — Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 bg-white p-7 sm:p-9 rounded-2xl border border-gray-100 shadow-sm"
          >
            <h3 className="font-bold text-[#0B1A35] text-xl mb-1">Send an Enquiry</h3>
            <p className="text-gray-400 text-sm mb-7">All fields marked with * are required</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[#0B1A35] font-medium text-sm mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Priya Deshmukh"
                    disabled={formState === 'loading'}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[0.9rem] bg-gray-50/50 text-[#0B1A35] placeholder:text-gray-400 focus:outline-none focus:border-[#C6962E] focus:ring-2 focus:ring-[#C6962E]/10 transition-all duration-200 disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-[#0B1A35] font-medium text-sm mb-1.5">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="10-digit mobile number"
                    disabled={formState === 'loading'}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[0.9rem] bg-gray-50/50 text-[#0B1A35] placeholder:text-gray-400 focus:outline-none focus:border-[#C6962E] focus:ring-2 focus:ring-[#C6962E]/10 transition-all duration-200 disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#0B1A35] font-medium text-sm mb-1.5">Preferred Country</label>
                <select
                  name="country"
                  disabled={formState === 'loading'}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[0.9rem] bg-gray-50/50 text-[#0B1A35] focus:outline-none focus:border-[#C6962E] focus:ring-2 focus:ring-[#C6962E]/10 transition-all duration-200 appearance-none disabled:opacity-50"
                >
                  <option value="">Not sure yet</option>
                  <option value="georgia">Georgia</option>
                  <option value="kyrgyzstan">Kyrgyzstan</option>
                </select>
              </div>

              <div>
                <label className="block text-[#0B1A35] font-medium text-sm mb-1.5">Your Message</label>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Tell us about your requirements, NEET status, preferred intake…"
                  disabled={formState === 'loading'}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[0.9rem] bg-gray-50/50 text-[#0B1A35] placeholder:text-gray-400 focus:outline-none focus:border-[#C6962E] focus:ring-2 focus:ring-[#C6962E]/10 transition-all duration-200 resize-none disabled:opacity-50"
                />
              </div>

              <AnimatePresence mode="wait">
                {statusMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className={`rounded-xl px-4 py-3 text-sm font-medium ${
                      formState === 'success'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {statusMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={formState === 'loading'}
                className="inline-flex items-center justify-center gap-2 bg-[#0B1A35] text-white px-7 py-3.5 rounded-xl font-bold text-[0.9rem] transition-all duration-300 hover:bg-[#152d54] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {formState === 'loading' ? (
                  <><Loader2 size={18} className="animate-spin" /> Sending…</>
                ) : (
                  <>Send Enquiry <ArrowRight size={16} /></>
                )}
              </button>
            </form>
          </motion.div>

          {/* Right — Office Cards */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-5"
          >
            {offices.map((office) => (
              <div
                key={office.title}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0B1A35] flex items-center justify-center flex-shrink-0">
                    <office.icon size={18} className="text-[#C6962E]" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-[#0B1A35] text-[0.95rem] mb-1.5">{office.title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed mb-3">{office.address}</p>
                    {office.phone && (
                      <a
                        href={office.phoneHref}
                        className="inline-flex items-center gap-1.5 text-[#C6962E] font-semibold text-sm hover:underline"
                      >
                        <Phone size={14} /> {office.phone}
                      </a>
                    )}
                    {office.hours && (
                      <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-2">
                        <Clock size={12} /> {office.hours}
                      </div>
                    )}
                    {office.note && (
                      <p className="text-gray-400 text-xs mt-2 italic">{office.note}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Quick contact box */}
            <div className="bg-[#0B1A35] p-6 rounded-2xl text-white">
              <h4 className="font-bold text-[0.95rem] mb-3">Prefer a direct call?</h4>
              <p className="text-white/60 text-sm mb-4 leading-relaxed">
                Our counselors are available Monday to Saturday, 10 AM – 7 PM IST. 
                WhatsApp messages are answered even on Sundays.
              </p>
              <div className="flex flex-col gap-2">
                <a href="tel:+917447552878" className="inline-flex items-center gap-2 text-[#C6962E] font-semibold text-sm hover:underline">
                  <Phone size={14} /> +91 74475 52878
                </a>
                <LeadGate action="whatsapp_appointment" mode="newTab">
                <a
                  href="https://wa.me/917447552878?text=Hi%2C+I'm+interested+in+a+counseling+appointment+for+MBBS+Abroad."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:bg-[#1ebe5d] w-fit"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                  WhatsApp Us
                </a>
                </LeadGate>
                <a href="mailto:connect@abhaglobaleducare.com" className="inline-flex items-center gap-2 text-white/70 text-sm hover:text-white transition-colors">
                  <Mail size={14} /> connect@abhaglobaleducare.com
                </a>
                <a href="mailto:abhaglobaleducare@gmail.com" className="inline-flex items-center gap-2 text-white/70 text-sm hover:text-white transition-colors">
                  <Mail size={14} /> abhaglobaleducare@gmail.com
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
