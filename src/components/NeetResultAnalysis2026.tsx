'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Phone,
  Globe,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Users,
  Trophy,
  BarChart3,
} from 'lucide-react';
import { WHATSAPP, KOLHAPUR, waLinkEncoded } from '@/data/contacts';

/* ---------- Report data ---------- */

const keyStats = [
  { label: 'परीक्षार्थी', value: '~20 लाख', note: '5,440 केंद्रे · 13 भाषा' },
  { label: 'Qualified', value: '11.21 लाख', note: 'NTA अधिकृत आकडा' },
  { label: 'Toppers (715/720)', value: 'Aryan Gupta — Punjab', note: 'Panshul Bansal — Haryana' },
  { label: '690+ गुण', value: 'फक्त 138 विद्यार्थी', note: 'Top-scorer pool अत्यंत लहान' },
  { label: 'Qualified पैकी मुली', value: '58%+ 👩‍⚕️', note: '' },
];

const qualifyingScores = [
  { category: 'General / EWS', percentile: '50th', marks: '715 – 213' },
  { category: 'OBC / SC / ST', percentile: '40th', marks: '212 – 177' },
  { category: 'PwD (Gen/EWS)', percentile: '45th', marks: '212 – 194' },
  { category: 'PwD (Reserved)', percentile: '40th', marks: '193 – 177' },
];

const safeScores = [
  { category: 'General (UR)', score: '~650–680+', air: '8,000–12,000' },
  { category: 'EWS', score: '~640–670+', air: '10,000–15,000' },
  { category: 'OBC', score: '~630–660+', air: '12,000–20,000' },
  { category: 'SC', score: '~560–610', air: '45,000–75,000' },
  { category: 'ST', score: '~500–560', air: '90,000–1,40,000' },
];

const abhaAdvantages = [
  'पहिल्या दिवसापासून FMGE/NEXT तयारी — खास कोचिंग पोर्टल',
  'Doctors Hands-On Programme — जॉर्जियात क्लिनिकल वर्कशॉप्स',
  'जॉर्जियात ABHA ची स्वतःची टीम — hostels, Indian जेवण, संपूर्ण काळजी',
];

/* ---------- Shared table styles (UniversityExplorer pattern) ---------- */

const thClass = 'px-4 py-3.5 font-semibold';
const tdClass = 'px-4 py-3.5 align-top text-sm';

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-playfair font-bold text-2xl sm:text-3xl mb-2" style={{ color: '#0B1A35' }}>
      {children}
    </h2>
  );
}

export default function NeetResultAnalysis2026() {
  return (
    <div style={{ background: '#F5F6FA' }}>
      {/* HERO */}
      <section
        className="py-20 sm:py-28 px-4 sm:px-8"
        style={{ background: 'linear-gradient(135deg, #0B1A35 0%, #1a3160 100%)' }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-xs font-bold uppercase tracking-widest mb-5 px-4 py-1.5 rounded-full"
            style={{ color: '#C6962E', border: '1px solid rgba(198,150,46,0.3)' }}
          >
            ABHA Global Educare — Expert Analysis Report
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-playfair text-white mb-4 leading-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)' }}
          >
            NEET UG 2026 निकाल — संपूर्ण विश्लेषण व महाराष्ट्र Cutoff मार्गदर्शन
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            16 जुलै 2026 रोजी NTA ने NEET UG 2026 चा निकाल जाहीर केला. सुमारे 20 लाख
            परीक्षार्थींपैकी 11.21 लाख विद्यार्थी qualified — पण qualified होणं आणि admission
            मिळणं यात मोठं अंतर आहे. हा report तुम्हाला तुमची खरी स्थिती समजण्यास मदत करेल.
          </motion.p>
        </div>
      </section>

      {/* KEY STATS */}
      <section className="py-14 px-4 sm:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-6 h-6" style={{ color: '#C6962E' }} />
            <SectionHeading>📊 ठळक आकडे</SectionHeading>
          </div>
          <p className="text-gray-500 text-sm mb-6">NEET UG 2026 — एका नजरेत महत्त्वाची आकडेवारी</p>

          <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-card">
            <table className="w-full min-w-[560px] border-collapse text-left">
              <thead>
                <tr className="bg-[#0B1A35] text-xs uppercase tracking-wide text-white/85">
                  <th className={thClass}>आकडा</th>
                  <th className={thClass}>Value</th>
                  <th className={thClass}>तपशील</th>
                </tr>
              </thead>
              <tbody>
                {keyStats.map((s, i) => (
                  <tr key={s.label} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FA]'}>
                    <td className={tdClass}>
                      <span className="font-semibold text-[#0B1A35]">{s.label}</span>
                    </td>
                    <td className={tdClass}>
                      <span className="font-bold" style={{ color: '#C6962E' }}>
                        {s.value}
                      </span>
                    </td>
                    <td className={`${tdClass} text-gray-600`}>{s.note || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* QUALIFYING SCORES */}
      <section className="py-14 px-4 sm:px-8 bg-[#F5F6FA]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-6 h-6" style={{ color: '#C6962E' }} />
            <SectionHeading>🎯 Official Qualifying Scores 2026</SectionHeading>
          </div>
          <p className="text-gray-500 text-sm mb-6">
            NTA ने जाहीर केलेले category-wise qualifying percentile व marks range
          </p>

          <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-card bg-white">
            <table className="w-full min-w-[560px] border-collapse text-left">
              <thead>
                <tr className="bg-[#0B1A35] text-xs uppercase tracking-wide text-white/85">
                  <th className={thClass}>Category</th>
                  <th className={thClass}>Percentile</th>
                  <th className={thClass}>Marks Range</th>
                </tr>
              </thead>
              <tbody>
                {qualifyingScores.map((q, i) => (
                  <tr key={q.category} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FA]'}>
                    <td className={tdClass}>
                      <span className="font-semibold text-[#0B1A35]">{q.category}</span>
                    </td>
                    <td className={`${tdClass} text-gray-600`}>{q.percentile}</td>
                    <td className={tdClass}>
                      <span className="font-semibold text-[#0B1A35]">{q.marks}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* MAHARASHTRA SAFE SCORES */}
      <section className="py-14 px-4 sm:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6" style={{ color: '#C6962E' }} />
            <SectionHeading>🏛️ महाराष्ट्र सरकारी MBBS जागा — Safe Score अंदाज (2026)</SectionHeading>
          </div>
          <p className="text-gray-500 text-sm mb-6">
            AIR-1 यंदा 715 वर असल्याने top 10,000 ranks मध्ये स्पर्धा अधिक compressed आहे:
          </p>

          <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-card">
            <table className="w-full min-w-[560px] border-collapse text-left">
              <thead>
                <tr className="bg-[#0B1A35] text-xs uppercase tracking-wide text-white/85">
                  <th className={thClass}>Category</th>
                  <th className={thClass}>Safe Score</th>
                  <th className={thClass}>अंदाजे AIR</th>
                </tr>
              </thead>
              <tbody>
                {safeScores.map((s, i) => (
                  <tr key={s.category} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FA]'}>
                    <td className={tdClass}>
                      <span className="font-semibold text-[#0B1A35]">{s.category}</span>
                    </td>
                    <td className={tdClass}>
                      <span className="font-bold" style={{ color: '#C6962E' }}>
                        {s.score}
                      </span>
                    </td>
                    <td className={`${tdClass} text-gray-600`}>{s.air}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-gray-400">
            &ldquo;Safe Score&rdquo; = सुरुवातीच्या rounds मध्ये जागा मिळण्याची उच्च शक्यता.
            Borderline scores ना Mop-up/Stray rounds मधली expert counseling लागते. अंतिम
            cutoffs seat matrix नुसार बदलतील.
          </p>
        </div>
      </section>

      {/* VOLATILITY ZONE */}
      <section className="py-14 px-4 sm:px-8 bg-[#F5F6FA]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6" style={{ color: '#C6962E' }} />
            <SectionHeading>⚠️ &ldquo;Volatility Zone&rdquo; — 580–650 गुण: सर्वात धोकादायक टप्पा</SectionHeading>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-3xl">
            महाराष्ट्रातील aspirants साठी हा सर्वात गर्दीचा zone आहे. इथे फक्त गुणांशी नाही —
            विद्यार्थ्यांच्या प्रचंड संख्येशी स्पर्धा आहे. बहुतेक &ldquo;admission
            heartbreaks&rdquo; इथेच होतात.
          </p>

          {/* Gold-bordered warning card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl p-6 sm:p-8 mb-6"
            style={{
              background: 'linear-gradient(135deg, rgba(198,150,46,0.08) 0%, rgba(198,150,46,0.03) 100%)',
              border: '2px solid #C6962E',
              boxShadow: '0 4px 20px rgba(198, 150, 46, 0.18)',
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(198,150,46,0.15)' }}
              >
                <AlertTriangle className="w-6 h-6" style={{ color: '#C6962E' }} />
              </div>
              <div>
                <p className="font-bold text-base sm:text-lg mb-1.5" style={{ color: '#0B1A35' }}>
                  🚨 Rank Volatility Alert
                </p>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  580–650 range मध्ये फक्त <strong>5 गुणांच्या</strong> फरकाने AIR मध्ये{' '}
                  <strong style={{ color: '#C6962E' }}>5,000–8,000 positions</strong> चा धक्का
                  बसू शकतो!
                </p>
              </div>
            </div>
          </motion.div>

          <p className="text-gray-600 text-sm leading-relaxed max-w-3xl">
            या zone मध्ये असाल तर: तुमचं &ldquo;Government Seat&rdquo; स्वप्न razor&apos;s edge
            वर आहे. शेवटच्या counseling rounds ची वाट बघत बसणं = सर्वात मोठी चूक.
          </p>
        </div>
      </section>

      {/* B PLAN — GEORGIA */}
      <section className="py-16 px-4 sm:px-8" style={{ background: '#0B1A35' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Globe className="w-6 h-6" style={{ color: '#C6962E' }} />
            <h2 className="font-playfair font-bold text-2xl sm:text-3xl text-white">
              🌍 म्हणूनच — तुमचा B Plan आजच तयार करा
            </h2>
          </div>
          <p className="text-slate-300 text-base leading-relaxed mb-8 max-w-3xl">
            Georgia मध्ये NMC व WHO मान्यताप्राप्त MBBS —{' '}
            <span className="font-bold" style={{ color: '#C6962E' }}>
              $5,000–6,000/वर्ष
            </span>{' '}
            (scholarships सह), आणि फक्त ABHA कडून:
          </p>

          <div className="space-y-4 mb-4">
            {abhaAdvantages.map((adv) => (
              <div
                key={adv}
                className="flex items-start gap-3 rounded-2xl px-5 py-4"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(198,150,46,0.25)' }}
              >
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#C6962E' }} />
                <p className="text-white text-sm sm:text-base leading-relaxed">{adv}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-4 sm:px-8 text-center bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-playfair font-bold text-2xl sm:text-3xl mb-3" style={{ color: '#0B1A35' }}>
            Counseling rounds सुरू होण्याआधी तुमची स्थिती तपासा
          </h2>
          <p className="text-gray-500 text-sm mb-8">मोफत expert consultation — आजच संपर्क करा</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-gold to-gold-400 px-7 py-3.5 text-base font-bold text-primary-navy shadow-gold transition-transform duration-300 hover:-translate-y-0.5"
            >
              Book Counselling →
            </Link>
            <a
              href={waLinkEncoded("Hi%2C+NEET+2026+result+analysis+%E0%A4%B5%E0%A4%BE%E0%A4%9A%E0%A4%B2%E0%A4%BE.+%E0%A4%AE%E0%A4%B2%E0%A4%BE+%E0%A4%AE%E0%A5%8B%E0%A4%AB%E0%A4%A4+expert+consultation+%E0%A4%B9%E0%A4%B5%E0%A5%80+%E0%A4%86%E0%A4%B9%E0%A5%87.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:opacity-90"
              style={{ background: '#25D366' }}
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
              WhatsApp: {WHATSAPP.display}
            </a>
            <a
              href={KOLHAPUR.tel}
              className="inline-flex items-center gap-2 rounded-xl border px-6 py-3.5 text-base font-semibold transition-colors hover:bg-primary-gold/5"
              style={{ borderColor: 'rgba(198,150,46,0.4)', color: '#0B1A35' }}
            >
              <Phone className="w-4 h-4" style={{ color: '#C6962E' }} /> {KOLHAPUR.phoneDisplay}
            </a>
          </div>
          <p className="text-gray-400 text-xs mt-6">🌐 abhaglobaleducare.com</p>
        </div>
      </section>
    </div>
  );
}
