'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Phone,
  Download,
  CheckCircle2,
  AlertTriangle,
  Scale,
  CalendarClock,
  ArrowRight,
} from 'lucide-react';
import { WHATSAPP, waLinkEncoded } from '@/data/contacts';

/* ---------- Chart data (faithful to ABHA_Chart_NEET2025_Validity_Abroad.pdf) ---------- */

const flowSteps = [
  {
    n: '1',
    title: 'NEET 2025 — Qualified',
    lines: ['Result: 14 June 2025', 'Cutoff पार (Gen 144 / Res 113)'],
    accent: '#16A34A',
  },
  {
    n: '2',
    title: 'NEET 2026 — Repeat, Not Qualified',
    lines: ['2026 चा attempt स्वतंत्र आहे — तो 2025 च्या result ला स्पर्श करत नाही'],
    accent: '#C0392B',
  },
  {
    n: '3',
    title: '2025 Scorecard वर Abroad Admission',
    lines: ['3 वर्षांच्या validity मध्ये (June 2028 पर्यंत) offer letter मिळाल्यास पूर्ण वैध'],
    accent: '#C6962E',
  },
];

const legalBasis = [
  {
    rule: '3 वर्षे validity',
    meaning:
      'NEET result हा result declaration च्या तारखेपासून 3 वर्षे abroad MBBS admission साठी वैध — "entitling a candidate to pursue MBBS or equivalent course."',
    source: 'MoHFW Gazette (Mar 2018) • NMC official website — "For Students to Study Abroad"',
  },
  {
    rule: 'Scorecard = Eligibility Certificate',
    meaning:
      'NEET चा qualified result हाच Eligibility Certificate मानला जातो (May 2019 पासून वेगळे certificate नाही) — GME Regulations 1997 च्या अटी पूर्ण असल्यास.',
    source: 'NMC — nmc.org.in (Information Desk)',
  },
  {
    rule: 'Admission पूर्वी qualify',
    meaning:
      'FMGL Regulations 2021 नुसार foreign university त admission घेण्यापूर्वी NEET qualified असणे आवश्यक — कोणत्याही वैध (valid) attempt मधील qualification चालते.',
    source: 'NMC FMGL Regulations 2021',
  },
  {
    rule: 'प्रत्येक attempt स्वतंत्र',
    meaning:
      'नंतरच्या attempt मध्ये not qualified झाल्याने आधीची qualification रद्द होते असा कोणताही नियम अस्तित्वात नाही. "Latest attempt च" ग्राह्य धरावा अशीही अट नाही.',
    source: 'NMC / NTA अधिसूचनांमध्ये असा प्रतिबंध नाही — verified 17 July 2026',
  },
];

const timeline = [
  { date: '14 June 2025', label: 'NEET 2025 Result — Qualified', color: '#16A34A' },
  { date: 'Intake 2025-26', label: 'वैध', color: '#1B7C9E' },
  { date: 'Intake 2026-27', label: 'वैध ✔ (सध्याचा batch)', color: '#1B7C9E' },
  { date: 'Intake 2027-28', label: 'वैध (June 2028 पूर्वी offer letter)', color: '#1B7C9E' },
  { date: '13 June 2028', label: 'Validity समाप्त', color: '#C0392B' },
];

const checklist = [
  'NEET 2025 चे QUALIFIED scorecard (हेच eligibility document — जपून ठेवा, हरवू देऊ नका)',
  '12वी PCB मध्ये किमान 50% गुण (राखीव प्रवर्ग 40%) — GME Regulations 1997',
  'Admission वर्षाच्या 31 December पर्यंत वय किमान 17 वर्षे',
  'University WDOMS-listed असावी (universities where ABHA assists admissions — NMC & WHO Eligible)',
  'पदवीनंतर India त practice साठी FMGE / NExT pass करावी लागेल — 2025 ची NEET qualification त्यासाठीही ग्राह्य',
];

const cautions = [
  'India admission साठी मात्र 2025 score चालत नाही — Indian MBBS counselling ला फक्त चालू वर्षाची (2026) NEET लागतो (validity फक्त 1 वर्ष).',
  'Application मध्ये 2025 चे qualified scorecard द्या; 2026 चा not-qualified result eligibility वर परिणाम करत नाही — पण कोणतेही document लपवू/खोटे देऊ नका.',
  'नियम बदलू शकतात — मोठा आर्थिक निर्णय घेण्यापूर्वी NMC कडून written confirmation घेणे सुरक्षित (nmc.org.in).',
  'Admission ची हमी university कडे, visa ची हमी Embassy कडे — कोणीही guarantee देऊ शकत नाही.',
];

const thClass = 'px-4 py-3.5 font-semibold';
const tdClass = 'px-4 py-3.5 align-top text-sm';

const WA_HREF = waLinkEncoded(
  '%E0%A4%A8%E0%A4%AE%E0%A4%B8%E0%A5%8D%E0%A4%95%E0%A4%BE%E0%A4%B0%2C%20NEET%202025%20validity%20%E0%A4%AC%E0%A4%A6%E0%A5%8D%E0%A4%A6%E0%A4%B2%20%E0%A4%AE%E0%A4%BE%E0%A4%B9%E0%A4%BF%E0%A4%A4%E0%A5%80%20%E0%A4%B9%E0%A4%B5%E0%A5%80%20%E0%A4%86%E0%A4%B9%E0%A5%87',
);

function WhatsAppIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

export default function NeetValidityAbroad2025() {
  return (
    <div style={{ background: '#F5F6FA' }}>
      {/* HERO */}
      <section
        className="py-20 sm:py-24 px-4 sm:px-8"
        style={{ background: 'linear-gradient(135deg, #0B1A35 0%, #1a3160 100%)' }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-xs font-bold uppercase tracking-widest mb-5 px-4 py-1.5 rounded-full"
            style={{ color: '#C6962E', border: '1px solid rgba(198,150,46,0.3)' }}
          >
            ABHA Counselling Wall Chart
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-playfair text-white mb-8 leading-tight"
            style={{ fontSize: 'clamp(1.9rem, 4.6vw, 3.2rem)' }}
          >
            NEET 2025 Qualified → 2026 Not Qualified → Abroad MBBS वैध आहे का?
          </motion.h1>

          {/* होय ✔ answer card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl p-6 sm:p-8 text-left"
            style={{
              background: 'linear-gradient(135deg, rgba(22,163,74,0.16) 0%, rgba(22,163,74,0.06) 100%)',
              border: '2px solid #16A34A',
            }}
          >
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="font-playfair font-black text-4xl sm:text-5xl text-white">होय</span>
                <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11" style={{ color: '#4ADE80' }} />
              </div>
              <p className="text-slate-100 text-sm sm:text-base leading-relaxed">
                <strong className="text-white">
                  NEET 2025 ची qualification स्वतंत्रपणे वैध राहते.
                </strong>{' '}
                2026 मध्ये पुन्हा NEET देऊन qualify न झाल्याने आधीची (2025) qualification{' '}
                <strong style={{ color: '#4ADE80' }}>रद्द होत नाही</strong> — असा कोणताही नियम
                NMC/MoHFW च्या अधिसूचनांमध्ये नाही. 2025 चे{' '}
                <strong style={{ color: '#C6962E' }}>QUALIFIED scorecard</strong> हेच abroad
                admission साठी eligibility document म्हणून वापरायचे.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3-STEP FLOW */}
      <section className="py-14 px-4 sm:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-4 md:items-stretch">
            {flowSteps.map((s, i) => (
              <div key={s.n} className="relative flex">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="w-full rounded-2xl bg-white p-6 shadow-card"
                  style={{ border: '1px solid rgba(0,0,0,0.06)', borderTopWidth: '4px', borderTopColor: s.accent }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-white mb-3"
                    style={{ background: s.accent }}
                  >
                    {s.n}
                  </div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#0B1A35' }}>
                    {s.title}
                  </h3>
                  {s.lines.map((l) => (
                    <p key={l} className="text-gray-600 text-sm leading-relaxed mt-1">
                      {l}
                    </p>
                  ))}
                </motion.div>
                {i < flowSteps.length - 1 && (
                  <span className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-[#C6962E]">
                    <ArrowRight size={22} />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEGAL BASIS TABLE */}
      <section className="py-14 px-4 sm:px-8 bg-[#F5F6FA]">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Scale className="w-6 h-6" style={{ color: '#C6962E' }} />
            <h2 className="font-playfair font-bold text-2xl sm:text-3xl" style={{ color: '#0B1A35' }}>
              कायदेशीर आधार — Legal Basis
            </h2>
          </div>
          <p className="text-gray-500 text-sm mb-6">Deep-checked — NMC / MoHFW नियमांवर आधारित</p>

          <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-card bg-white">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="bg-[#0B1A35] text-xs uppercase tracking-wide text-white/85">
                  <th className={thClass}>नियम</th>
                  <th className={thClass}>अर्थ</th>
                  <th className={thClass}>Source</th>
                </tr>
              </thead>
              <tbody>
                {legalBasis.map((r, i) => (
                  <tr key={r.rule} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FA]'}>
                    <td className={`${tdClass} w-[22%]`}>
                      <span className="font-semibold text-[#0B1A35]">{r.rule}</span>
                    </td>
                    <td className={`${tdClass} text-gray-700`}>{r.meaning}</td>
                    <td className={`${tdClass} w-[22%] text-xs text-gray-500`}>{r.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* VALIDITY TIMELINE */}
      <section className="py-14 px-4 sm:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <CalendarClock className="w-6 h-6" style={{ color: '#C6962E' }} />
            <h2 className="font-playfair font-bold text-2xl sm:text-3xl" style={{ color: '#0B1A35' }}>
              NEET 2025 Validity Timeline (Abroad Admission साठी)
            </h2>
          </div>

          {/* Horizontal stepper (stacks on mobile) */}
          <div className="relative">
            {/* connecting line — desktop only */}
            <div
              className="hidden md:block absolute top-[10px] left-0 right-0 h-0.5"
              style={{ background: 'linear-gradient(to right, #16A34A, #1B7C9E, #C0392B)' }}
            />
            <ol className="flex flex-col md:flex-row md:justify-between gap-6 md:gap-2">
              {timeline.map((t, i) => (
                <motion.li
                  key={t.date}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="relative flex md:flex-col md:items-center md:text-center gap-3 md:gap-2 md:flex-1"
                >
                  <span
                    className="mt-0.5 md:mt-0 h-5 w-5 rounded-full border-4 border-white flex-shrink-0 z-10"
                    style={{ background: t.color, boxShadow: '0 0 0 1px rgba(0,0,0,0.08)' }}
                  />
                  <div className="md:px-1">
                    <p className="font-bold text-sm" style={{ color: '#0B1A35' }}>
                      {t.date}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{t.label}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>

          <p className="mt-8 text-xs leading-relaxed text-gray-500 rounded-xl bg-[#F5F6FA] px-4 py-3">
            ☝ महत्त्वाचे: University चे <strong>admission / offer letter validity window मध्येच
            issue</strong> झालेले असावे. उशीर करू नये — 2026-27 intake हा सर्वात सुरक्षित मार्ग.
          </p>
        </div>
      </section>

      {/* CHECKLIST + CAUTION */}
      <section className="py-14 px-4 sm:px-8 bg-[#F5F6FA]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Checklist */}
          <div className="rounded-2xl bg-white p-6 sm:p-7 shadow-card" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
            <h2 className="font-playfair font-bold text-xl sm:text-2xl mb-5" style={{ color: '#0B1A35' }}>
              ✔ आवश्यक अटी — Checklist
            </h2>
            <ul className="space-y-4">
              {checklist.map((c) => (
                <li key={c} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#16A34A' }} />
                  <span className="text-gray-700 text-sm leading-relaxed">{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Caution — gold-bordered */}
          <div
            className="rounded-2xl p-6 sm:p-7"
            style={{
              background: 'linear-gradient(135deg, rgba(198,150,46,0.08) 0%, rgba(198,150,46,0.03) 100%)',
              border: '2px solid #C6962E',
              boxShadow: '0 4px 20px rgba(198, 150, 46, 0.15)',
            }}
          >
            <h2 className="font-playfair font-bold text-xl sm:text-2xl mb-5" style={{ color: '#0B1A35' }}>
              ⚠ हे लक्षात ठेवा
            </h2>
            <ul className="space-y-4">
              {cautions.map((c) => (
                <li key={c} className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#C6962E' }} />
                  <span className="text-gray-700 text-sm leading-relaxed">{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* COUNSELLOR NOTE */}
      <section className="py-8 px-4 sm:px-8 bg-[#F5F6FA]">
        <div className="max-w-5xl mx-auto">
          <div
            className="rounded-2xl p-5 sm:p-6"
            style={{ background: '#FEF9EE', border: '1px solid rgba(198,150,46,0.3)', borderLeftWidth: '5px', borderLeftColor: '#C6962E' }}
          >
            <p className="text-sm sm:text-base leading-relaxed text-[#0B1A35]">
              <strong style={{ color: '#A67B25' }}>⚠ Counsellor Note:</strong> हा chart फक्त
              &ldquo;NEET 2025 <strong>qualified</strong>&rdquo; students साठी आहे. जो student 2025
              मध्येही qualify झालेला <strong>नाही</strong> आणि 2026 मध्येही नाही — त्याला abroad
              MBBS ला admission घेता येणार <strong>नाही</strong>; NEET qualify केल्याशिवाय गेल्यास
              FMGE/NExT ची दारे कायमची बंद होतात. अशा students ना पुढील NEET attempt किंवा
              NEET-based पर्याय (BAMS/BHMS/allied) यांचे मार्गदर्शन करा.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-4 sm:px-8 text-center bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-playfair font-bold text-2xl sm:text-3xl mb-3" style={{ color: '#0B1A35' }}>
            तुमच्या NEET 2025 scorecard ची validity तपासा — मोफत
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Scorecard verification &amp; validity check — free · ABHA Global Educare
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="/docs/ABHA_Chart_NEET2025_Validity_Abroad.pdf"
              download
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-gold to-gold-400 px-7 py-3.5 text-base font-bold text-primary-navy shadow-gold transition-transform duration-300 hover:-translate-y-0.5"
            >
              <Download className="w-4 h-4" /> Download Wall Chart (PDF)
            </a>
            <a
              href={WA_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:opacity-90"
              style={{ background: '#25D366' }}
            >
              <WhatsAppIcon /> WhatsApp: {WHATSAPP.display}
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border px-6 py-3.5 text-base font-semibold transition-colors hover:bg-primary-gold/5"
              style={{ borderColor: 'rgba(198,150,46,0.4)', color: '#0B1A35' }}
            >
              <Phone className="w-4 h-4" style={{ color: '#C6962E' }} /> Book Counselling
            </Link>
          </div>

          <p className="text-gray-400 text-xs mt-8 leading-relaxed max-w-2xl mx-auto">
            Disclaimer: माहिती 17 July 2026 रोजी NMC (nmc.org.in), MoHFW Gazette व सार्वजनिक
            स्रोतांवरून संकलित. ही माहिती मार्गदर्शनासाठी आहे — कायदेशीर सल्ला नाही. नियम बदलू शकतात;
            अंतिम निर्णयापूर्वी NMC ची अधिकृत पुष्टी घ्यावी. Admission, visa, scholarship यांची कोणतीही
            हमी नाही. © 2026 ABHA Global Educare LLP — Transparent Pricing · Ethical Admissions
          </p>
        </div>
      </section>
    </div>
  );
}
