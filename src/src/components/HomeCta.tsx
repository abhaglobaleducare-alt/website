'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';

export default function HomeCta() {
  return (
    <section className="bg-[#0B1A35] py-20 sm:py-24 px-4 sm:px-8">
      <div className="max-w-[900px] mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-playfair text-3xl sm:text-4xl lg:text-[2.5rem] text-white mb-5 leading-tight"
        >
          Ready to start your{' '}
          <span className="text-[#C6962E]">medical career abroad?</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="text-white/60 text-lg mb-10 max-w-[520px] mx-auto leading-relaxed"
        >
          Get a free, no-obligation counselling session with our experts. 
          We&apos;ll assess your profile and recommend the best path forward.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#C6962E] text-[#0B1A35] px-7 py-3.5 rounded-xl font-bold text-base transition-all duration-300 hover:bg-[#d4a73a]"
          >
            Book Free Consultation <ArrowRight size={18} />
          </Link>
          <a
            href="tel:+917447552878"
            className="inline-flex items-center gap-2 text-white/70 font-semibold text-base hover:text-white transition-colors"
          >
            <Phone size={18} /> or call +91 74475 52878
          </a>
        </motion.div>
      </div>
    </section>
  );
}
