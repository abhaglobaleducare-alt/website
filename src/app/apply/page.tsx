import type { Metadata } from 'next';
import Image from 'next/image';
import {
  Microscope,
  BookOpen,
  MonitorPlay,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Wallet,
  Activity,
  GraduationCap,
  Sparkles,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { KOLHAPUR, waLink } from '@/data/contacts';
import ApplyLeadForm from './ApplyLeadForm';
import ApplyFaq from './ApplyFaq';

export const metadata: Metadata = {
  title: { absolute: 'MBBS Abroad with AGDRP — ABHA Global Educare' },
  description:
    'AGDRP — hands-on clinical workshops + MBBS coaching portal, included in the ABHA package.',
  alternates: { canonical: 'https://abhaglobaleducare.com/apply' },
  robots: { index: true, follow: true },
};

/* ── Organ specimens (reused from the Clinical Workshops page) ──────── */
const specimens = [
  { emoji: '🫀', name: 'Pig Heart', note: 'मानवी हृदयाच्या रचनेचा अभ्यास', en: 'Human-like cardiac structure' },
  { emoji: '🧠', name: 'Sheep Brain', note: 'मेंदूची मूलभूत रचना', en: 'Basic brain structure' },
  { emoji: '🫘', name: 'Goat Kidney', note: 'मूत्रपिंडाची रचना व कार्य', en: 'Kidney structure & function' },
  { emoji: '👁', name: 'Goat Eye', note: 'डोळ्याची अंतर्गत रचना', en: 'Internal structure of the eye' },
  { emoji: '🫁', name: 'Sheep Lungs', note: 'श्वसनसंस्थेचा अभ्यास', en: 'The respiratory system' },
  { emoji: '🟤', name: 'Pig Liver', note: 'यकृताची रचना व कार्य', en: 'Liver structure & function' },
];

const proceduralSkills = [
  'Injection & venipuncture technique',
  'Surgical incision (कापणे)',
  'Suturing (टाके घालणे) व knot-tying',
  'Aseptic (sterile) handling',
];

const coachingPoints = [
  'संपूर्ण FMGE syllabus coverage',
  'सर्व 5 वर्षांसाठी उपलब्ध',
  'Notes + Test Series + Doubt Solving',
  'ABHA चे स्वतःचे MBBS-qualified faculty',
];

const galleryPhotos = ['image-25', 'image-27', 'image-29', 'image-40'];

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-[#C6962E]">
      {children}
    </span>
  );
}

export default function ApplyPage() {
  return (
    <main id="main-content" className="bg-white">
      {/* ── Minimal top bar (logo only — no nav, no exit links) ──────── */}
      <header className="border-b border-white/10 bg-[#0B1A35]">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-3 sm:px-8">
          <Image
            src="/images/logo.png"
            alt="ABHA Global Educare"
            width={150}
            height={44}
            priority
            className="h-10 w-auto"
          />
          <span className="hidden text-sm font-medium text-white/70 sm:block">
            Reg No: ACO-8092
          </span>
        </div>
      </header>

      {/* ── SECTION 1 — HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0B1A35] px-4 py-12 sm:px-8 sm:py-16">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #C6962E 0%, transparent 70%)' }}
        />
        <div className="relative mx-auto grid max-w-[1200px] items-start gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Left — headline + image */}
          <div>
            <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#C6962E]/40 bg-[#C6962E]/10 px-4 py-1.5 text-xs font-semibold text-[#E0B85C] sm:text-sm">
              <Sparkles size={14} className="flex-shrink-0" />
              <span className="min-w-0">MBBS Coaching — ABHA package मध्येच included</span>
            </span>
            <h1 className="mt-5 font-playfair text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-[2.75rem]">
              MBBS Abroad — फक्त प्रवेश नाही,{' '}
              <span className="text-[#C6962E]">डॉक्टर बनवण्याची संपूर्ण तयारी</span>
            </h1>
            <p className="mt-5 max-w-[560px] text-base leading-relaxed text-white/75 sm:text-lg">
              AGDRP — ABHA Global Doctor Readiness Program: Hands-on Clinical Workshops + MBBS
              Coaching Portal — दोन्ही ABHA package मध्येच.
            </p>

            <div className="relative mt-8 aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10">
              <Image
                src="/images/workshops/image-3.jpg"
                alt="ABHA hands-on clinical workshop — MBBS students training on organ specimens"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Right — lead form */}
          <div className="lg:pt-2">
            <ApplyLeadForm />
          </div>
        </div>
      </section>

      {/* ── SECTION 2 — AGDRP: दोन स्तंभ ─────────────────────────────── */}
      <section className="bg-white px-4 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-12 text-center">
            <Kicker>AGDRP — दोन स्तंभ</Kicker>
            <h2 className="font-playfair text-3xl leading-tight text-[#0B1A35] sm:text-4xl">
              डॉक्टर बनवण्याची संपूर्ण तयारी
            </h2>
          </div>

          {/* Two pillars, side-by-side with equal visual weight */}
          <div className="grid items-stretch gap-6 lg:grid-cols-2">
            {/* स्तंभ 1 — Hands-On Clinical Workshops */}
            <div className="flex h-full flex-col rounded-3xl border border-gray-100 bg-[#F8F9FA] p-6 shadow-card sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#1B7C9E]/12 text-[#1B7C9E]">
                  <Microscope size={24} />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#C6962E]">स्तंभ 1 · 🫀</p>
                  <h3 className="font-playfair text-2xl font-bold text-[#0B1A35]">
                    Hands-On Clinical Workshops
                  </h3>
                </div>
              </div>

              <span className="mb-5 inline-flex w-fit items-center rounded-full bg-[#0B1A35] px-4 py-1.5 text-sm font-semibold text-white">
                10 Clinical Workshops Conducted
              </span>

              <div className="grid grid-cols-2 gap-3">
                {specimens.map((s) => (
                  <div
                    key={s.name}
                    className="rounded-2xl border border-gray-100 bg-white p-4 shadow-card"
                  >
                    <div className="mb-1.5 text-2xl">{s.emoji}</div>
                    <h4 className="text-sm font-bold text-[#0B1A35]">{s.name}</h4>
                    <p className="mt-0.5 text-xs text-gray-600">{s.en}</p>
                    <p className="mt-0.5 text-xs text-[#85611C]">{s.note}</p>
                  </div>
                ))}
              </div>

              <p className="mt-5 text-center text-sm font-semibold text-[#0B1A35]">
                One Organ Specimen per Student — expert faculty च्या देखरेखीखाली
              </p>

              <div className="mt-5 rounded-2xl border border-[#C6962E]/25 bg-[#C6962E]/5 p-5">
                <div className="flex items-start gap-3">
                  <Activity size={20} className="mt-0.5 flex-shrink-0 text-[#C6962E]" />
                  <div>
                    <p className="mb-2 font-semibold text-[#0B1A35]">Procedural Skills</p>
                    <div className="grid gap-2">
                      {proceduralSkills.map((p) => (
                        <p key={p} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-[#C6962E]" />
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-auto pt-6 text-center font-playfair text-lg font-bold italic text-[#85611C]">
                ABHA × Praxis | “Practice. Master. Excel.”
              </p>
            </div>

            {/* स्तंभ 2 — MBBS Coaching Portal (HERO USP) */}
            <div className="flex h-full flex-col overflow-hidden rounded-3xl border-2 border-[#C6962E]/40 bg-gradient-to-br from-[#0B1A35] to-[#112545] p-6 shadow-navy sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#C6962E]/15 text-[#C6962E]">
                  <BookOpen size={24} />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#E0B85C]">
                    स्तंभ 2 · 📚 ⭐ मुख्य USP
                  </p>
                  <h3 className="font-playfair text-2xl font-bold text-white">MBBS Coaching Portal</h3>
                </div>
              </div>

              <div className="mb-5 inline-flex w-fit max-w-full items-center gap-2 rounded-lg bg-[#C6962E] px-4 py-2 text-sm font-bold text-[#0B1A35]">
                ABHA package मध्येच included — वेगळी fee नाही
              </div>

              <ul className="space-y-3">
                {coachingPoints.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-[0.95rem] text-white/85">
                    <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-[#C6962E]" />
                    {p}
                  </li>
                ))}
              </ul>

              <div className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-[#C6962E]/40 bg-[#C6962E]/10 px-4 py-1.5 text-sm font-semibold text-[#E0B85C]">
                <GraduationCap size={15} /> 2026 मध्ये नव्याने सुरू — पहिली batch
              </div>

              {/* Device mockup placeholder frame */}
              <div className="mt-auto pt-8">
                <div className="rounded-[1.75rem] border-4 border-white/15 bg-[#071122] p-3 shadow-2xl">
                  <div className="flex aspect-[16/10] flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.03] text-center">
                    <MonitorPlay size={40} className="text-[#C6962E]/70" />
                    <p className="mt-3 px-6 text-sm text-white/50">
                      Coaching Portal — screenshot लवकरच
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3 — TRUST BAR ────────────────────────────────────── */}
      <section className="bg-[#0B1A35] px-4 py-14 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-[1100px]">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6">
              <Building2 size={22} className="mb-3 text-[#C6962E]" />
              <p className="font-bold text-white">Tbilisi मध्ये स्वतःचं hostel</p>
              <p className="mt-1 text-sm text-white/60">सोबत Indian mess — घरच्यासारखं जेवण</p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6">
              <MapPinIcon />
              <p className="font-bold text-white">4 Offices</p>
              <p className="mt-1 text-sm text-white/60">
                Kolhapur · Chh. Sambhajinagar · Boisar · Tbilisi
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6">
              <ShieldCheck size={22} className="mb-3 text-[#C6962E]" />
              <p className="font-bold text-white">Reg No: ACO-8092</p>
              <p className="mt-1 text-sm text-white/60">ABHA Global Educare LLP</p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6">
              <GraduationCap size={22} className="mb-3 text-[#C6962E]" />
              <p className="font-bold text-white">Authorized</p>
              <p className="mt-1 text-sm text-white/60">
                by the Ministry of Education of Georgia
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4 — FEE TRANSPARENCY ─────────────────────────────── */}
      <section className="bg-white px-4 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-[900px]">
          <div className="mb-8 text-center">
            <Kicker>पारदर्शक शुल्क</Kicker>
            <h2 className="font-playfair text-3xl leading-tight text-[#0B1A35] sm:text-4xl">
              Fee Transparency
            </h2>
          </div>
          <div className="rounded-3xl border border-gray-100 bg-[#F8F9FA] p-8 shadow-card sm:p-10">
            <div className="flex flex-col items-center text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C6962E]/15 text-[#C6962E]">
                <Wallet size={28} />
              </span>
              <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-gray-500">
                Georgia Tuition
              </p>
              <p className="mt-1 font-playfair text-4xl font-bold text-[#0B1A35] sm:text-5xl">
                ₹21 Lakhs पासून
              </p>
              <p className="mt-1 text-sm font-medium text-[#85611C]">(tuition only)</p>

              <div className="mt-6 grid w-full gap-3 text-left sm:grid-cols-2">
                <p className="flex items-start gap-2 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700">
                  <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-[#C6962E]" />
                  Hostel, food, visa व travel — हे शुल्क वेगळे आहे
                </p>
                <p className="flex items-start gap-2 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700">
                  <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-[#C6962E]" />
                  AGDRP included — यासाठी extra charge नाही
                </p>
              </div>

              <p className="mt-6 max-w-[560px] text-sm leading-relaxed text-gray-500">
                भारतातील tier-2 private medical colleges च्या तुलनेत, संपूर्ण tuition आणि सोबत
                AGDRP ची hands-on तयारी — एकाच package मध्ये.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5 — WORKSHOP GALLERY (lazy-load) ─────────────────── */}
      <section className="bg-[#F8F9FA] px-4 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-10 text-center">
            <Kicker>From Our Labs</Kicker>
            <h2 className="font-playfair text-3xl leading-tight text-[#0B1A35] sm:text-4xl">
              Workshop Gallery
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {galleryPhotos.map((img) => (
              <div
                key={img}
                className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-gray-100 shadow-card"
              >
                <Image
                  src={`/images/workshops/${img}.jpg`}
                  alt="ABHA hands-on clinical workshop"
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6 — FAQ ──────────────────────────────────────────── */}
      <section className="bg-white px-4 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-10 text-center">
            <Kicker>तुमचे प्रश्न</Kicker>
            <h2 className="font-playfair text-3xl leading-tight text-[#0B1A35] sm:text-4xl">
              वारंवार विचारले जाणारे प्रश्न
            </h2>
          </div>
          <ApplyFaq />
        </div>
      </section>

      {/* ── SECTION 7 — Mobile sticky CTA (WhatsApp + Call) ──────────── */}
      <div className="sticky bottom-0 z-40 grid grid-cols-2 gap-px border-t border-black/5 bg-white shadow-[0_-8px_24px_rgba(11,26,53,0.1)] sm:hidden">
        <a
          href={waLink('नमस्कार ABHA! मला MBBS Abroad + AGDRP बद्दल माहिती हवी आहे.')}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#25D366] py-3.5 text-sm font-bold text-white"
        >
          <MessageCircle size={18} /> WhatsApp
        </a>
        <a
          href={KOLHAPUR.tel}
          className="flex items-center justify-center gap-2 bg-[#0B1A35] py-3.5 text-sm font-bold text-white"
        >
          <Phone size={18} /> Call करा
        </a>
      </div>

      {/* Spacer so sticky CTA never overlaps footer content on mobile */}
      <div className="h-2 sm:hidden" aria-hidden="true" />
    </main>
  );
}

/* Small inline map-pin (avoids an extra lucide import name clash). */
function MapPinIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#C6962E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mb-3"
      aria-hidden="true"
    >
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
