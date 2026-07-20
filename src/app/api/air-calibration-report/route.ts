import { NextRequest, NextResponse } from "next/server";
import { estimateRank } from "@/lib/neetPredictor";

/**
 * ADMIN calibration report — the semi-automatic learning loop.
 *
 * The learning loop, with NO database and NO auto-corruption risk:
 *   1. Every actual-AIR submission logs a `[air-calibration] {...}` line
 *      (see /api/neet-lead) to Vercel → Logs.
 *   2. Export/paste those log lines into this endpoint (POST { logs }).
 *   3. It reports, per 25-mark band: sample count, median ACTUAL AIR, current
 *      anchor estimate, and drift %; plus a "proposed revised anchors" block.
 *   4. A HUMAN reviews and, if warranted, edits rankMapping in a committed PR.
 *
 * Anchors update only via a reviewed commit — student data proposes, founder
 * disposes. This endpoint NEVER writes anchors or any state.
 *
 * Store upgrade path (optional): if Vercel KV is enabled on the plan, append
 * each calibration entry to a KV list in /api/neet-lead and read it here instead
 * of pasting logs — same report, no manual export. Until then, paste-logs works
 * with zero setup.
 *
 * Protected by the CALIBRATION_KEY env var (403 without it).
 */

const OUTLIER_THRESHOLD = 0.6; // ignore AIRs deviating >60% from the anchor estimate
const CATEGORY_ACTIVATION_MIN = 30; // ≥30 actual points before a category curve may be added

interface Entry {
  score: number;
  air: number;
  categoryRank: number | null;
  category: string;
}

function median(nums: number[]): number | null {
  if (!nums.length) return null;
  const s = [...nums].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
}

function parseEntries(logs: string): Entry[] {
  const out: Entry[] = [];
  for (const line of logs.split(/\r?\n/)) {
    const i = line.indexOf("[air-calibration]");
    if (i < 0) continue;
    const braceAt = line.indexOf("{", i);
    if (braceAt < 0) continue;
    try {
      const e = JSON.parse(line.slice(braceAt));
      if (typeof e.score === "number" && typeof e.air === "number") {
        out.push({
          score: e.score,
          air: e.air,
          categoryRank: typeof e.categoryRank === "number" ? e.categoryRank : null,
          category: typeof e.category === "string" ? e.category : "General",
        });
      }
    } catch {
      /* skip malformed line */
    }
  }
  return out;
}

function buildReport(entries: Entry[]) {
  const bands: Record<number, Entry[]> = {};
  const rejected: Array<Entry & { anchor: number; deviationPct: number }> = [];

  for (const e of entries) {
    const anchor = estimateRank(e.score);
    const dev = Math.abs(e.air - anchor) / (anchor || 1);
    if (dev > OUTLIER_THRESHOLD) {
      rejected.push({ ...e, anchor, deviationPct: Math.round(dev * 100) });
      continue;
    }
    const band = Math.floor(e.score / 25) * 25;
    (bands[band] ||= []).push(e);
  }

  const bandReport = Object.keys(bands)
    .map(Number)
    .sort((a, b) => b - a)
    .map((band) => {
      const es = bands[band];
      const midScore = band + 12;
      const anchorEstimate = estimateRank(midScore);
      const medActual = median(es.map((x) => x.air));
      const driftPct = medActual != null ? Number((((medActual - anchorEstimate) / anchorEstimate) * 100).toFixed(1)) : null;
      return { band: `${band}-${band + 24}`, midScore, count: es.length, medianActualAIR: medActual, anchorEstimateAtMid: anchorEstimate, driftPct };
    });

  const byCat: Record<string, { count: number; withCategoryRank: number }> = {};
  for (const e of entries) {
    const c = e.category || "General";
    (byCat[c] ||= { count: 0, withCategoryRank: 0 }).count++;
    if (e.categoryRank) byCat[c].withCategoryRank++;
  }
  const categories = Object.entries(byCat).map(([category, v]) => ({
    category,
    actualCount: v.count,
    withCategoryRank: v.withCategoryRank,
    categoryCurveEligible: v.count >= CATEGORY_ACTIVATION_MIN, // gate for adding a per-category estimator
  }));

  // Proposed anchors: only bands with ≥5 non-outlier samples. PROPOSAL ONLY.
  const proposedAnchors = bandReport
    .filter((b) => b.count >= 5 && b.medianActualAIR != null)
    .map((b) => ({ score: b.midScore, air: b.medianActualAIR, fromSamples: b.count }));

  return {
    ok: true,
    note: "PROPOSED ONLY — anchors update via a reviewed commit. Student data proposes, founder disposes.",
    totalParsed: entries.length,
    rejectedOutliers: rejected.length,
    outlierThresholdPct: OUTLIER_THRESHOLD * 100,
    categoryActivationMin: CATEGORY_ACTIVATION_MIN,
    bands: bandReport,
    categories,
    proposedAnchors,
    rejectedSample: rejected.slice(0, 20),
  };
}

function authed(req: NextRequest): boolean {
  const key = req.nextUrl.searchParams.get("key") || req.headers.get("x-calibration-key");
  return !!process.env.CALIBRATION_KEY && key === process.env.CALIBRATION_KEY;
}

export async function POST(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ ok: false, message: "Forbidden" }, { status: 403 });
  let logs = "";
  try {
    const body = await req.json();
    logs = typeof body === "string" ? body : body?.logs || "";
  } catch {
    logs = await req.text().catch(() => "");
  }
  return NextResponse.json(buildReport(parseEntries(logs)));
}

export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ ok: false, message: "Forbidden" }, { status: 403 });
  return NextResponse.json({
    ok: true,
    usage: "POST { logs: '<pasted [air-calibration] log lines>' } to get the per-band drift report + proposed anchors.",
  });
}
