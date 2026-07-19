/**
 * Internal presentation helpers shared across NEET analyzer cards.
 * (Not a component — pure styling/label maps so cards stay consistent.)
 */
import type { Chance } from '@/lib/neetPredictor';

export interface ChanceMeta {
  label: string;
  /** tailwind text/border/bg accent classes */
  text: string;
  bg: string;
  border: string;
  bar: string;
  dot: string;
}

export const chanceMeta: Record<Chance, ChanceMeta> = {
  high: {
    label: 'High chance',
    text: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    bar: 'bg-emerald-500',
    dot: 'bg-emerald-500',
  },
  moderate: {
    label: 'Moderate',
    text: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    bar: 'bg-amber-500',
    dot: 'bg-amber-500',
  },
  low: {
    label: 'Low chance',
    text: 'text-orange-700',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    bar: 'bg-orange-500',
    dot: 'bg-orange-500',
  },
  'very-low': {
    label: 'Very low',
    text: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    bar: 'bg-rose-500',
    dot: 'bg-rose-500',
  },
  'not-qualified': {
    label: 'Not qualified',
    text: 'text-slate-600',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    bar: 'bg-slate-400',
    dot: 'bg-slate-400',
  },
};
