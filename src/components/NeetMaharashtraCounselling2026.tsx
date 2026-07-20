'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, Download, AlertTriangle, Compass, ListChecks, Building2, Calculator } from 'lucide-react';
import { WHATSAPP, waLink } from '@/data/contacts';

/* ---------- Chart data (faithful to ABHA_Wall_Chart_NEET2026_Maharashtra.pdf) ---------- */

const stats = [
  { label: 'Qualified Candidates', value: '11.21 Lakh', note: 'out of ~20 lakh appeared' },
  { label: 'Highest Score', value: '715 / 720', note: '19 candidates scored 700+' },
  { label: 'Qualifying Cutoff — UR / EWS', value: '715 – 213', note: '50th percentile • highest ever' },
  { label: 'Qualifying Cutoff — OBC / SC / ST', value: '212 – 177', note: '40th percentile' },
  { label: 'Counselling', value: 'Awaited', note: 'MCC (AIQ 15%) & MH CET Cell (85%) schedules to follow' },
];

const scoreToRank = [
  { marks: '700+', air: '~1 – 150', outlook: 'Top colleges assured' },
  { marks: '690 – 699', air: '~150 – 800', outlook: 'Top GMCs, AIQ strong' },
  { marks: '660 – 689', air: '~800 – 7,000', outlook: 'Strong Govt. chance' },
  { marks: '650 – 659', air: '~7,000 – 11,000', outlook: 'Govt. possible' },
  { marks: '630 – 649', air: '~11,000 – 22,000', outlook: 'Govt. in later rounds / reserved cat.' },
];

const counsellingTracks = [
  {
    track: 'MCC (National)',
    covers: '15% All India Quota of Govt. seats + Deemed & Central universities + AIIMS / JIPMER + ESIC',
    portal: 'mcc.nic.in',
  },
  {
    track: 'MH CET Cell (State)',
    covers: '85% State Quota Govt. seats + Maharashtra private colleges',
    portal: 'cetcell.mahacet.org',
  },
];

const counsellingNotes = [
  'Register on both portals separately — one does not cover the other.',
  'State merit list (not AIR alone) decides Maharashtra state-quota allotment; category, domicile & documents matter.',
  'Never exit counselling after Round 1 — cutoffs typically relax in later & stray rounds.',
  'NEET-based alternatives with lower cutoffs: BDS, BAMS, BHMS, BUMS, BVSc — legitimate careers, same counselling ecosystem.',
];

const colleges = [
  { name: 'Grant GMC & Sir JJ Hospital, Mumbai', gen: '685 – 695', obc: 'TBC*', ews: '685', sc: '625 – 645', st: '610' },
  { name: 'B. J. Government Medical College, Pune', gen: '675 – 685', obc: 'TBC*', ews: '670 – 680', sc: '615 – 635', st: '580 – 600' },
  {
    name: 'Other GMCs — Nagpur, Chh. Sambhajinagar, Miraj, Kolhapur, Solapur, Latur, Akola, Jalgaon, Chandrapur, Gondia, Baramati & others',
    gen: '625 – 640',
    obc: '615 – 630',
    ews: '620 – 635',
    sc: '580 – 595',
    st: 'TBC*',
  },
];

const collegeNotes = [
  '*TBC = figures under office verification — pencil in after confirming from MH CET Cell 2025 allotment PDFs.',
  "Ranges are the 2025 state-quota closing marks compiled by the ABHA office — individual college & round-wise variation applies.",
];

const routeGuide = [
  {
    band: '650+',
    guidance:
      'Government MBBS is the goal — fill MCC + CET Cell choices fully, attend every round. Abroad not needed.',
  },
  {
    band: '550 – 650',
    guidance:
      'Govt. possible via later rounds, home-state & category seats. Simultaneously compare state private / deemed on verified fees. Keep BDS / BAMS as backups.',
  },
  {
    band: '450 – 550',
    guidance:
      'Govt. MBBS unlikely (Gen.). Honest comparison: Indian private / deemed / management (high fees) vs BDS / BAMS / BHMS vs MBBS abroad — decide on total cost + family budget.',
  },
  {
    band: 'Qualified, <450',
    guidance:
      'NEET alternatives (BAMS / BHMS / allied health) or MBBS abroad. ABHA partner universities in Tbilisi, Georgia are NMC & WHO Eligible; graduates must clear FMGE / NExT to practise in India — families must know this clearly before deciding.',
  },
];

const thClass = 'px-4 py-3.5 font-semibold';
const tdClass = 'px-4 py-3.5 align-top text-sm';

function SectionTitle({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-2">
      <Icon className="w-6 h-6 flex-shrink-0" style={{ color: '#C6962E' }} />
      <h2 className="font-playfair font-bold text-2xl sm:text-3xl" style={{ color: '#0B1A35' }}>
        {children}
      </h2>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

const WA_HREF = waLink(
  'नमस्कार, NEET 2026 Maharashtra counselling व माझ्या score नुसार मार्गदर्शन हवं आहे.',
);

export default function NeetMaharashtraCounselling2026() {
  return (
    <div style={{ background: '#F5F6FA' }}>
      {/* HERO */}
      <section
        className="py-16 sm:py-20 px-4 sm:px-8"
        style={{ background: 'linear-gradient(135deg, #0B1A35 0%, #1a3160 100%)' }}
      >
        <div className="max-w-5xl mx-auto text-center">
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
            className="font-playfair text-white mb-3 leading-tight"
            style={{ fontSize: 'clamp(1.9rem, 4.6vw, 3.2rem)' }}
          >
            NEET UG 2026 (Re-NEET) — Score → AIR → College Chart
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Maharashtra MBBS Counselling Reference • Result declared 16 July 2026 (Re-NEET held 21 June 2026)
          </motion.p>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 text-left">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24 + i * 0.06 }}
                className="rounded-2xl p-4 text-center"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(198,150,46,0.22)' }}
              >
                <p className="text-[0.62rem] font-bold uppercase tracking-wide text-white/60 leading-tight mb-1.5">
                  {s.label}
                </p>
                <p className="font-playfair font-black text-xl sm:text-2xl" style={{ color: '#C6962E' }}>
                  {s.value}
                </p>
                <p className="text-[0.68rem] text-white/55 mt-1 leading-snug">{s.note}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 1. SCORE → AIR */}
      <section className="py-14 px-4 sm:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <SectionTitle icon={Compass}>1. NEET 2026 Marks → Approx. All India Rank</SectionTitle>
            <span
              className="rounded-full px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wide"
              style={{ background: 'rgba(198,150,46,0.12)', color: '#A67B25' }}
            >
              Indicative
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-card mt-4">
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead>
                <tr className="bg-[#0B1A35] text-xs uppercase tracking-wide text-white/85">
                  <th className={thClass}>Marks (out of 720)</th>
                  <th className={thClass}>Approx. AIR Range</th>
                  <th className={thClass}>Govt. MBBS Outlook (Gen.)</th>
                </tr>
              </thead>
              <tbody>
                {scoreToRank.map((r, i) => (
                  <tr key={r.marks} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FA]'}>
                    <td className={tdClass}>
                      <span className="font-bold text-[#0B1A35]">{r.marks}</span>
                    </td>
                    <td className={`${tdClass} text-gray-700`}>{r.air}</td>
                    <td className={`${tdClass} text-gray-700`}>{r.outlook}</td>
                  </tr>
                ))}
                <tr className="bg-[#F8F9FA]">
                  <td className={tdClass}>
                    <span className="font-bold text-[#0B1A35]">Below 630</span>
                  </td>
                  <td className={`${tdClass} text-gray-700`} colSpan={2}>
                    Use scorecard percentile + formula below; confirm with counsellor
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            className="mt-4 flex items-start gap-3 rounded-xl px-4 py-3.5"
            style={{ background: 'rgba(27,124,158,0.06)', border: '1px dashed rgba(27,124,158,0.4)' }}
          >
            <Calculator className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#1B7C9E' }} />
            <p className="text-xs sm:text-sm leading-relaxed text-gray-700">
              <strong className="text-[#0B1A35]">
                AIR ≈ Candidates Appeared × (1 − Percentile ÷ 100)
              </strong>{' '}
              — e.g. at ~20 lakh appeared, 97 percentile ≈ AIR 60,000. Use the exact percentile
              printed on the student&apos;s scorecard.
            </p>
          </div>
        </div>
      </section>

      {/* 2. COUNSELLING REGISTRATIONS */}
      <section className="py-14 px-4 sm:px-8 bg-[#F5F6FA]">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <SectionTitle icon={ListChecks}>2. Two Separate Counselling Registrations</SectionTitle>
            <span
              className="rounded-full px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wide"
              style={{ background: 'rgba(22,163,74,0.12)', color: '#15803D' }}
            >
              Verified Structure
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-card bg-white mt-4">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="bg-[#0B1A35] text-xs uppercase tracking-wide text-white/85">
                  <th className={thClass}>Track</th>
                  <th className={thClass}>Covers</th>
                  <th className={thClass}>Portal</th>
                </tr>
              </thead>
              <tbody>
                {counsellingTracks.map((t, i) => (
                  <tr key={t.track} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FA]'}>
                    <td className={tdClass}>
                      <span className="font-semibold text-[#0B1A35]">{t.track}</span>
                    </td>
                    <td className={`${tdClass} text-gray-700`}>{t.covers}</td>
                    <td className={`${tdClass}`}>
                      <span className="font-semibold text-[#1B7C9E]">{t.portal}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="mt-5 space-y-2.5">
            {counsellingNotes.map((n) => (
              <li key={n} className="flex items-start gap-2.5 text-sm leading-relaxed text-gray-700">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: '#C6962E' }} />
                {n}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. MAHARASHTRA COLLEGES */}
      <section className="py-14 px-4 sm:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <SectionTitle icon={Building2}>
              3. Maharashtra Govt. Medical Colleges — Closing Marks by Category
            </SectionTitle>
            <span
              className="rounded-full px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wide"
              style={{ background: 'rgba(192,57,43,0.1)', color: '#C0392B' }}
            >
              2025 Indicative — Not 2026 Actuals
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-card mt-4">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="bg-[#0B1A35] text-xs uppercase tracking-wide text-white/85">
                  <th className={thClass}>College (State Quota)</th>
                  <th className={thClass}>General</th>
                  <th className={thClass}>OBC</th>
                  <th className={thClass}>EWS</th>
                  <th className={thClass}>SC</th>
                  <th className={thClass}>ST</th>
                </tr>
              </thead>
              <tbody>
                {colleges.map((c, i) => (
                  <tr key={c.name} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FA]'}>
                    <td className={`${tdClass} min-w-[220px]`}>
                      <span className="font-semibold text-[#0B1A35]">{c.name}</span>
                    </td>
                    <td className={`${tdClass} text-gray-700`}>{c.gen}</td>
                    <td className={`${tdClass} text-gray-700`}>{c.obc}</td>
                    <td className={`${tdClass} text-gray-700`}>{c.ews}</td>
                    <td className={`${tdClass} text-gray-700`}>{c.sc}</td>
                    <td className={`${tdClass} text-gray-700`}>{c.st}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="mt-4 space-y-1.5">
            {collegeNotes.map((n) => (
              <li key={n} className="text-xs leading-relaxed text-gray-500">
                ▸ {n}
              </li>
            ))}
          </ul>

          {/* 2026 ALERT — gold warning card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 rounded-2xl p-6 sm:p-7"
            style={{
              background: 'linear-gradient(135deg, rgba(198,150,46,0.09) 0%, rgba(198,150,46,0.03) 100%)',
              border: '2px solid #C6962E',
              boxShadow: '0 4px 20px rgba(198, 150, 46, 0.16)',
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
                <p className="font-bold text-base sm:text-lg mb-2" style={{ color: '#0B1A35' }}>
                  ⚠ 2026 ALERT — read before quoting any number above
                </p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  The 2026 qualifying cutoff (UR 213) is the{' '}
                  <strong style={{ color: '#A67B25' }}>highest in NEET history</strong> — a huge jump
                  from 144 in 2025. Scores are inflated this year, so{' '}
                  <strong>2026 closing marks will very likely be HIGHER</strong> than the 2025 figures
                  in Table 3. Treat every college figure as a <strong>floor, not a promise</strong>.
                  Final 2026 cutoffs exist only after MCC / CET Cell allotment rounds.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mt-3">
                  टीप: वरील बंद गुण मागील वर्षाचे (2025) अंदाजे आकडे आहेत. 2026 चे प्रत्यक्ष cutoff समुपदेशन
                  फेऱ्यांनंतरच निश्चित होतील — यंदा गुण जास्त असल्याने cutoff वाढण्याची शक्यता आहे. प्रवेशाची
                  हमी कोणतेही आकडे देत नाहीत.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. ROUTE GUIDE */}
      <section className="py-14 px-4 sm:px-8 bg-[#F5F6FA]">
        <div className="max-w-5xl mx-auto">
          <SectionTitle icon={Compass}>4. Honest Route Guide by Score Band</SectionTitle>
          <p className="text-gray-500 text-sm mb-6">General category, indicative</p>

          <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-card bg-white">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="bg-[#0B1A35] text-xs uppercase tracking-wide text-white/85">
                  <th className={`${thClass} w-[22%]`}>Score Band</th>
                  <th className={thClass}>India-First Guidance</th>
                </tr>
              </thead>
              <tbody>
                {routeGuide.map((r, i) => (
                  <tr key={r.band} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FA]'}>
                    <td className={tdClass}>
                      <span className="font-bold text-[#0B1A35]">{r.band}</span>
                    </td>
                    <td className={`${tdClass} text-gray-700`}>{r.guidance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FREE COUNSELLING NOTE */}
      <section className="py-12 px-4 sm:px-8" style={{ background: '#0B1A35' }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-playfair text-xl sm:text-2xl font-bold text-white mb-2">
            Govt. seat first, always.
          </p>
          <p className="text-slate-300 text-sm leading-relaxed max-w-2xl mx-auto mb-1">
            Abroad only when India is genuinely unviable — with full fee transparency.
          </p>
          <p className="text-white/50 text-xs mb-6">
            Free Counselling — ABHA Global Educare LLP (LLP No. ACO-8092) · Kolhapur (HQ) · Chhatrapati
            Sambhajinagar · Boisar (Palghar) · Tbilisi, Georgia
          </p>
          <p
            className="inline-block rounded-full px-4 py-2 text-xs sm:text-sm font-semibold"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            AGEST 2026 Scholarship Test — नोंदणी 10 जुलै 2026 रोजी संपली · Registration Ended
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-4 sm:px-8 text-center bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-playfair font-bold text-2xl sm:text-3xl mb-3" style={{ color: '#0B1A35' }}>
            तुमच्या score नुसार honest मार्गदर्शन — मोफत
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            MCC व MH CET Cell counselling साठी expert support · ABHA Global Educare
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="/docs/ABHA_Wall_Chart_NEET2026_Maharashtra.pdf"
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

          <p className="text-gray-400 text-xs mt-8 leading-relaxed max-w-3xl mx-auto">
            Disclaimer: Data compiled 17 July 2026 from NTA result statistics and public counselling
            analyses; AIR ranges are expert estimates, not NTA-official rank tables. Closing marks in
            Table 3 are previous-year indicative figures. No guarantee of admission, visa, scholarship
            or any outcome is given or implied; admission rests solely with colleges/universities and
            counselling authorities. ही माहिती केवळ मार्गदर्शनासाठी आहे; कोणतीही हमी नाही. · © 2026 ABHA
            Global Educare LLP — Transparent Pricing · Ethical Admissions
          </p>
        </div>
      </section>
    </div>
  );
}
