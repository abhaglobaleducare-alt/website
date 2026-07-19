'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { runFullAnalysis, formatRank, type PredictorInputs, type FullAnalysis } from '@/lib/neetPredictor';
import { CATEGORIES, STATES, type Category, type StateName } from '@/data/neetPredictorData';

import Hero from './Hero';
import InputForm from './InputForm';
import ScoreMeter from './ScoreMeter';
import GovernmentCard from './GovernmentCard';
import StateQuotaCard from './StateQuotaCard';
import PrivateCard from './PrivateCard';
import GeorgiaCard from './GeorgiaCard';
import TimorCard from './TimorCard';
import ComparisonTable from './ComparisonTable';
import CostBreakdown from './CostBreakdown';
import RecommendationRoadmap from './RecommendationRoadmap';
import ConfidenceScore from './ConfidenceScore';
import SeatAvailability from './SeatAvailability';
import ExplanationCard from './ExplanationCard';
import ActionButtons from './ActionButtons';
import Disclaimer from './Disclaimer';
import IpadOfferCard from '@/components/IpadOfferCard';

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
  const resultsRef = useRef<HTMLDivElement>(null);

  const summary = useMemo(() => {
    if (!analysis) return undefined;
    return `My NEET score is ${analysis.inputs.score} (${analysis.inputs.category}, ${analysis.inputs.state}), estimated AIR ~${formatRank(analysis.rank)}.`;
  }, [analysis]);

  const runWith = (next: PredictorInputs, scroll = true) => {
    if (!Number.isFinite(next.score)) return;
    setAnalysis(runFullAnalysis(next));
    if (scroll) {
      requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };

  const handleSubmit = () => runWith(inputs);

  // Optional deep-link: /neet-analyzer?score=550&category=OBC&state=Uttar%20Pradesh&budget=20&auto=1
  // Prefills the form and (with auto=1) runs the analysis on mount — shareable results links.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('score')) return;

    const score = Number(params.get('score'));
    if (!Number.isFinite(score)) return;

    const catParam = params.get('category');
    const stateParam = params.get('state');
    const budgetLakh = Number(params.get('budget'));

    const next: PredictorInputs = {
      score,
      category: CATEGORIES.includes(catParam as Category) ? (catParam as Category) : 'General',
      state: STATES.includes(stateParam as StateName) ? (stateParam as StateName) : 'Maharashtra',
      budget: Number.isFinite(budgetLakh) && budgetLakh > 0 ? budgetLakh * 100_000 : undefined,
    };

    setInputs(next);
    if (params.get('auto') === '1') runWith(next, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = () => {
    setAnalysis(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-light-gray pb-24">
      <Hero title={heroTitle} subtitle={heroSubtitle} />

      {/* SEO H1 — visually part of the hero flow but a real heading for crawlers */}
      {h1 && <h1 className="sr-only">{h1}</h1>}

      <div className="mx-auto -mt-10 max-w-5xl px-4">
        <Section>
          <InputForm value={inputs} onChange={setInputs} onSubmit={handleSubmit} />
        </Section>

        <AnimatePresence>
          {analysis && (
            <div ref={resultsRef} className="scroll-mt-24 space-y-8 pt-10">
              {/* 1. Score meter */}
              <Section>
                <ScoreMeter score={analysis.inputs.score} rank={analysis.rank} percentile={analysis.percentile} />
              </Section>

              {/* 2. The verdict + roadmap — lead with the decision */}
              <Section delay={0.05}>
                <RecommendationRoadmap recommendation={analysis.recommendation} roadmap={analysis.roadmap} />
              </Section>

              {/* 2b. iPad Early Bird — PRIMARY placement for scores under 550 */}
              {analysis.inputs.score < 550 && (
                <Section delay={0.05}>
                  <IpadOfferCard score={analysis.inputs.score} />
                </Section>
              )}

              {/* 3. Route-by-route chances */}
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

              {/* 4. Flagship abroad cards — Georgia + Timor-Leste */}
              <Section delay={0.05}>
                <div className="grid gap-6">
                  <GeorgiaCard result={analysis.abroad} />
                  <TimorCard result={analysis.abroad} />
                </div>
              </Section>

              {/* 4b. iPad Early Bird — secondary "Special Offer" placement for 550+ */}
              {analysis.inputs.score >= 550 && (
                <Section delay={0.05}>
                  <IpadOfferCard score={analysis.inputs.score} variant="compact" />
                </Section>
              )}

              {/* 5. Cost comparison + breakdown */}
              <Section delay={0.05}>
                <ComparisonTable comparison={analysis.costComparison} />
              </Section>
              <Section delay={0.05}>
                <CostBreakdown breakdowns={analysis.costBreakdowns} />
              </Section>

              {/* 6. Confidence + seat reality */}
              <Section delay={0.05}>
                <div className="grid gap-6 lg:grid-cols-2">
                  <ConfidenceScore confidence={analysis.confidence} />
                  <SeatAvailability buckets={analysis.seatAvailability} total={analysis.totalSeats} />
                </div>
              </Section>

              {/* 7. Explanation */}
              <Section delay={0.05}>
                <ExplanationCard />
              </Section>

              {/* 8. CTA + disclaimer */}
              <Section delay={0.05}>
                <ActionButtons onReset={handleReset} summary={summary} />
              </Section>
              <Section delay={0.05}>
                <Disclaimer />
              </Section>
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
  );
}
