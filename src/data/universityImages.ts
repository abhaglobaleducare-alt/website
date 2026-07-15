/**
 * University campus image manifest for the destination "University Explorer".
 *
 * HOW TO ADD IMAGES (no code change needed beyond this file):
 *   1. Drop 2–4 clean campus/building photos into
 *        public/images/universities/<slug>/
 *      where <slug> is the value returned by universitySlug(university)
 *      (kebab-case, no spaces, no parentheses). The folders already exist.
 *   2. List the file paths under that slug below.
 *   3. Optimise each photo first: max width 1920px, compress < 300 KB.
 *
 * Any university NOT listed here (or with an empty array) simply shows no
 * gallery — the courses table renders directly (graceful fallback).
 *
 * NOTE: The 2026 source material contained only marketing brochure PDFs with
 * fee/marketing text baked into the page rasters — no clean, text-free campus
 * photographs — so every entry is intentionally empty for now. Galleries will
 * appear automatically as soon as real photos are dropped in.
 */
import { universitySlug } from './courses';

/** Keyed by university slug → ordered list of public image paths. */
export const UNIVERSITY_IMAGES: Record<string, string[]> = {
  // 'caucasus-university': [
  //   '/images/universities/caucasus-university/campus-1.jpg',
  //   '/images/universities/caucasus-university/campus-2.jpg',
  // ],
};

/** Campus images for a university (empty array → no gallery, show table directly). */
export function getUniversityImages(university: string): string[] {
  return UNIVERSITY_IMAGES[universitySlug(university)] ?? [];
}
