'use client';

import { X, GitCompare } from 'lucide-react';
import { useCompare } from './context';
import { courseId } from '@/data/courses';

/** Sticky bottom bar shown once ≥2 courses are selected for comparison. */
export default function CompareBar() {
  const { selected, remove, clear, openComparison, isOpen } = useCompare();

  if (selected.length === 0 || isOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] border-t-2 border-[#C6962E] bg-[#0B1A35] px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.35)]">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-sm font-semibold text-white/70">
            Compare ({selected.length}/3):
          </span>
          {selected.map((c) => (
            <span
              key={courseId(c)}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white"
            >
              <span className="max-w-[160px] truncate">
                {c.name} — {c.university}
              </span>
              <button
                type="button"
                onClick={() => remove(c)}
                aria-label={`Remove ${c.name}`}
                className="text-white/60 hover:text-white"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={clear}
            className="text-xs font-semibold text-white/60 hover:text-white"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={openComparison}
            disabled={selected.length < 2}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-gold to-gold-400 px-5 py-2.5 text-sm font-bold text-primary-navy transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <GitCompare size={16} /> Compare Now
          </button>
        </div>
      </div>
    </div>
  );
}
