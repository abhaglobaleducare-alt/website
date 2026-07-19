'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import LeadGate from '@/components/LeadGate';
import { ArrowRight, Phone } from 'lucide-react';
import { KOLHAPUR, waLinkEncoded } from '@/data/contacts';

export default function HomeCta() {
  return (
    <section className="bg-[#0B1A35] overflow-hidden relative">
      {/* Decorative glows */}
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-[#C6962E]/8 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-60 w-64 h-64 rounded-full bg-[#1B7C9E]/10 blur-[80px] pointer-events-none" />

      <div className="max-w-[900px] mx-auto">

        {/* Text + CTAs */}
        <div className="py-14 sm:py-20 lg:py-24 px-4 sm:px-8 text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-playfair font-bold tracking-tight text-4xl sm:text-5xl lg:text-[3rem] text-white mb-5 leading-[1.1]"
          >
            Ready to start your{' '}
            <span className="text-[#C6962E]">medical career abroad?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-white/60 text-lg mb-10 max-w-[560px] mx-auto leading-relaxed"
          >
            Get a free, no-obligation counselling session with our experts.
            We&apos;ll assess your profile and recommend the best path forward.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-[#C6962E] text-[#0B1A35] px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 hover:bg-[#d4a73a] w-full sm:w-auto"
              >
                Book ONLINE / OFFLINE FREE Counselling <ArrowRight size={18} />
              </Link>
              <a
                href={KOLHAPUR.tel}
                className="inline-flex items-center gap-2 text-white/70 font-semibold text-base hover:text-white transition-colors"
              >
                <Phone size={18} /> or call {KOLHAPUR.phoneDisplay}
              </a>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <LeadGate action="whatsapp_appointment" mode="newTab">
              <a
                href={waLinkEncoded("Hi%2C+I'm+interested+in+booking+a+FREE+counseling+appointment+for+MBBS+Abroad.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:bg-[#1ebe5d]"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                WhatsApp for Counselling Appointment
              </a>
              </LeadGate>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}

