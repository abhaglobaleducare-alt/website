'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { runFullAnalysis, formatRank, previewLine, type PredictorInputs, type FullAnalysis } from '@/lib/neetPredictor';
import { CATEGORIES, STATES, type Category, type StateName } from '@/data/neetPredictorData';
import { trackEvent } from '@/lib/analytics';

import Hero from './Hero';
import InputForm from './InputForm';
import ScoreMeter from './ScoreMeter';
import GovernmentCard from './GovernmentCard';
import StateQuotaCard from './StateQuotaCard';
import PrivateCard from './PrivateCard';
import GeorgiaCard from './GeorgiaCard';
import TimorCard from './TimorCard';
import BdsBamsCard from './BdsBamsCard';
import ComparisonTable from './ComparisonTable';
import CostBreakdown from './CostBreakdown';
import RecommendationRoadmap from './RecommendationRoadmap';
import ConfidenceScore from './ConfidenceScore';
import SeatAvailability from './SeatAvailability';
import ExplanationCard from './ExplanationCard';
import ActionButtons from './ActionButtons';
import Disclaimer from './Disclaimer';
import IpadOfferCard from '@/components/IpadOfferCard';
import RegistrationWall from './RegistrationWall';
import RoadmapPromise from './RoadmapPromise';
import DynamicCta from './DynamicCta';
import EngagementCards from './EngagementCards';
import SmartDisclaimer from './SmartDisclaimer';
import Confetti from './Confetti';
import RankCardExplainer from './RankCardExplainer';
import { CurrencyContext, type Currency } from './currencyContext';

interface Props {
  heroTitle?: string;
  heroSubtitle?: string;
  /** visible H1 for SEO — defaults to heroTitle */
  h1?: string;
}

const DEFAULT_INPUTS: PredictorInputs = {
  score: 585,
  category: 'General',
  state: 'Maharashtra',
  budget: undefined,
};

function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}

export default function NeetAnalyzer({ heroTitle, heroSubtitle, h1 }: Props) {
  const [inputs, setInputs] = useState<PredictorInputs>(DEFAULT_INPUTS);
  const [analysis, setAnalysis] = useState<FullAnalysis | null>(null);
  const [registered, setRegistered] = useState(false);
  const [registeredName, setRegisteredName] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [currency, setCurrency] = useState<Currency>('INR');
  const resultsRef = useRef<HTMLDivElement>(null);

  const summary = useMemo(() => {
    if (!analysis) return undefined;
    return `My NEET score is ${analysis.inputs.score} (${analysis.inputs.category}, ${analysis.inputs.state}), estimated AIR ~${formatRank(analysis.rank)}.`;
  }, [analysis]);

  const runWith = (next: PredictorInputs, scroll = true, unlocked = false) => {
    if (!Number.isFinite(next.score)) return;
    setAnalysis(runFullAnalysis(next));
    setRegistered(unlocked);
    setShowConfetti(false);
    if (scroll) {
      requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };

  const handleSubmit = () => {
    trackEvent('analyze_clicked', { score: inputs.score, category: inputs.category, state: inputs.state });
    runWith(inputs);
  };

  const handleUnlock = (name: string) => {
    setRegisteredName(name);
    setRegistered(true);
    if ((analysis?.inputs.score ?? 0) >= 600) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3200);
    }
    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  // Restore results on browser Back (e.g. after visiting a linked page) via
  // sessionStorage, OR from a ?score deep-link. Deep-link wins if present.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('score')) {
      try {
        const saved = sessionStorage.getItem('neet-analysis-v1');
        if (saved) {
          const s = JSON.parse(saved) as { inputs: PredictorInputs; registered: boolean; registeredName: string };
          if (s.inputs && Number.isFinite(s.inputs.score)) {
            setInputs(s.inputs);
            setAnalysis(runFullAnalysis(s.inputs));
            setRegistered(!!s.registered);
            setRegisteredName(s.registeredName || '');
          }
        }
      } catch {
        /* ignore malformed storage */
      }
      return;
    }
    const score = Number(params.get('score'));
    if (!Number.isFinite(score)) return;

    const catParam = params.get('category');
    const stateParam = params.get('state');
    const budgetLakh = Number(params.get('budget'));
    const airParam = Number(params.get('air'));

    const next: PredictorInputs = {
      score,
      category: CATEGORIES.includes(catParam as Category) ? (catParam as Category) : 'General',
      state: STATES.includes(stateParam as StateName) ? (stateParam as StateName) : 'Maharashtra',
      budget: Number.isFinite(budgetLakh) && budgetLakh > 0 ? budgetLakh * 100_000 : undefined,
      allIndiaRank: Number.isFinite(airParam) && airParam > 0 ? airParam : undefined,
    };

    setInputs(next);
    if (params.get('auto') === '1') runWith(next, false, params.get('unlock') === '1');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist analysis state so browser Back can restore it.
  useEffect(() => {
    if (!analysis) return;
    try {
      sessionStorage.setItem(
        'neet-analysis-v1',
        JSON.stringify({ inputs: analysis.inputs, registered, registeredName }),
      );
    } catch {
      /* storage may be unavailable */
    }
  }, [analysis, registered, registeredName]);

  // Scroll-depth analytics (fires each threshold once).
  useEffect(() => {
    if (!analysis) return;
    const fired = new Set<number>();
    const onScroll = () => {
      const el = document.documentElement;
      const pct = (el.scrollTop + window.innerHeight) / el.scrollHeight;
      for (const t of [0.25, 0.5, 0.75, 1]) {
        if (pct >= t && !fired.has(t)) {
          fired.add(t);
          trackEvent('page_scroll_depth', { depth: Math.round(t * 100), score: analysis.inputs.score });
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [analysis]);

  const handleReset = () => {
    setAnalysis(null);
    setRegistered(false);
    setShowConfetti(false);
    try {
      sessionStorage.removeItem('neet-analysis-v1');
    } catch {
      /* ignore */
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const score = analysis?.inputs.score ?? 0;

  return (
    <CurrencyContext.Provider value={currency}>
    <div className="bg-light-gray pb-24">
      {showConfetti && <Confetti />}
      <Hero title={heroTitle} subtitle={heroSubtitle} />
      {h1 && <h1 className="sr-only">{h1}</h1>}

      <div className="relative z-10 mx-auto -mt-10 max-w-5xl px-4">
        <Section>
          <InputForm value={inputs} onChange={setInputs} onSubmit={handleSubmit} />
        </Section>

        <Section delay={0.05}>
          <div className="mt-4">
            <RankCardExplainer />
          </div>
        </Section>

        <AnimatePresence>
          {analysis && (
            <div ref={resultsRef} className="scroll-mt-24 space-y-8 pt-10">
              {/* Smart disclaimer + score meter — always shown */}
              <Section>
                <SmartDisclaimer />
              </Section>
              <Section delay={0.05}>
                <ScoreMeter
                  score={analysis.inputs.score}
                  rank={analysis.rank}
                  rankRange={analysis.rankRange}
                  airSource={analysis.airSource}
                  calibrationLabel={analysis.calibrationLabel}
                  percentile={analysis.percentile}
                />
              </Section>

              {!registered ? (
                /* ---------------- PREVIEW + REGISTRATION WALL ---------------- */
                <>
                  <Section delay={0.05}>
                    <div className="rounded-2xl border border-navy-100 bg-white p-5 text-center shadow-card">
                      <p className="text-xs font-bold uppercase tracking-wider text-navy-400">Preview</p>
                      <p className="mx-auto mt-1 max-w-2xl text-lg font-semibold text-primary-navy">{previewLine(analysis)}</p>
                      <p className="mt-1 text-sm text-navy-500">
                        {analysis.qualified
                          ? 'You have cleared the NEET qualifying line for your category ✓'
                          : 'You are below the qualifying line for your category'}
                      </p>
                    </div>
                  </Section>

                  <div className="relative">
                    {/* blurred teaser of locked sections */}
                    <div
                      aria-hidden
                      className="pointer-events-none max-h-[560px] select-none space-y-5 overflow-hidden opacity-50 blur-[7px]"
                    >
                      <div className="grid gap-5 md:grid-cols-2">
                        <GovernmentCard result={analysis.government} />
                        <StateQuotaCard result={analysis.state} />
                      </div>
                      <GeorgiaCard result={analysis.abroad} />
                    </div>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-light-gray to-transparent" />
                    <div className="relative z-10 -mt-28 px-1 sm:-mt-24">
                      <RegistrationWall analysis={analysis} onUnlock={handleUnlock} />
                    </div>
                  </div>
                </>
              ) : (
                /* -------------------- UNLOCKED FULL RESULTS -------------------- */
                <>
                  {/* Currency toggle — applies to every cost figure below */}
                  <div className="flex items-center justify-end gap-2 text-sm">
                    <span className="font-semibold text-navy-500">Show fees in:</span>
                    <div className="inline-flex overflow-hidden rounded-full border border-navy-200 bg-white p-0.5">
                      {(['INR', 'USD'] as const).map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setCurrency(c)}
                          className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                            currency === c ? 'bg-primary-navy text-white' : 'text-navy-500 hover:text-primary-navy'
                          }`}
                        >
                          {c === 'INR' ? '₹ INR' : '$ USD'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Section>
                    <RoadmapPromise
                      name={registeredName}
                      score={analysis.inputs.score}
                      rank={analysis.rank}
                      rankIsEstimate={!analysis.inputs.allIndiaRank}
                    />
                  </Section>

                  <Section delay={0.05}>
                    <DynamicCta score={score} />
                  </Section>

                  <Section delay={0.05}>
                    <RecommendationRoadmap recommendation={analysis.recommendation} roadmap={analysis.roadmap} />
                  </Section>

                  {score < 550 && (
                    <Section delay={0.05}>
                      <IpadOfferCard score={score} />
                    </Section>
                  )}

                  <Section delay={0.05}>
                    <div>
                      <h2 className="mb-4 font-playfair text-3xl font-bold text-primary-navy">Your chances, route by route</h2>
                      <div className="grid gap-5 md:grid-cols-2">
                        <GovernmentCard result={analysis.government} />
                        <StateQuotaCard result={analysis.state} />
                        <PrivateCard result={analysis.private} variant="private" />
                        <PrivateCard result={analysis.deemed} variant="deemed" />
                      </div>
                    </div>
                  </Section>

                  <Section delay={0.05}>
                    <div className="grid gap-6">
                      <GeorgiaCard result={analysis.abroad} />
                      <TimorCard result={analysis.abroad} />
                    </div>
                  </Section>

                  {/* Alternative courses (BDS/BAMS/nursing) — lower score bands only */}
                  {score <= 480 && (
                    <Section delay={0.05}>
                      <BdsBamsCard />
                    </Section>
                  )}

                  {score >= 550 && (
                    <Section delay={0.05}>
                      <IpadOfferCard score={score} variant="compact" />
                    </Section>
                  )}

                  <Section delay={0.05}>
                    <ComparisonTable comparison={analysis.costComparison} />
                  </Section>
                  <Section delay={0.05}>
                    <CostBreakdown breakdowns={analysis.costBreakdowns} />
                  </Section>

                  <Section delay={0.05}>
                    <div className="grid gap-6 lg:grid-cols-2">
                      <ConfidenceScore confidence={analysis.confidence} />
                      <SeatAvailability
                        buckets={analysis.seatAvailability}
                        total={analysis.totalSeats}
                        seatReality={analysis.seatReality}
                      />
                    </div>
                  </Section>

                  <Section delay={0.05}>
                    <ExplanationCard />
                  </Section>

                  {/* Post-result engagement cards */}
                  <Section delay={0.05}>
                    <div>
                      <h2 className="mb-4 font-playfair text-2xl font-bold text-primary-navy">Keep going — next steps</h2>
                      <EngagementCards score={score} />
                    </div>
                  </Section>

                  <Section delay={0.05}>
                    <ActionButtons onReset={handleReset} summary={summary} />
                  </Section>
                  <Section delay={0.05}>
                    <Disclaimer />
                  </Section>
                </>
              )}
            </div>
          )}
        </AnimatePresence>

        {/* Always-visible context before first run */}
        {!analysis && (
          <div className="mt-10 space-y-8">
            <Section>
              <ExplanationCard />
            </Section>
            <Section delay={0.05}>
              <Disclaimer />
            </Section>
          </div>
        )}
      </div>
    </div>
    </CurrencyContext.Provider>
  );
}
