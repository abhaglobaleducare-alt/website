'use client';

import { useEffect, useState } from 'react';
import type { FullAnalysis } from '@/lib/neetPredictor';
import { formatRank } from '@/lib/neetPredictor';

/**
 * Cover block for the downloaded/printed copy. Hidden on screen.
 *
 * The generated-on date is set in an effect, never during render — stamping a
 * date while rendering would differ between the server and client HTML and
 * trip a hydration mismatch.
 *
 * The assumption note is the point of this block: once the analysis leaves the
 * site as a PDF it can be forwarded, printed and read months later with no
 * surrounding context, so the basis and the limits have to travel on the
 * document itself rather than only on the page it came from.
 */
export default function PrintHeader({ analysis, name }: { analysis: FullAnalysis; name?: string }) {
  const [generatedOn, setGeneratedOn] = useState('');

  useEffect(() => {
    setGeneratedOn(
      new Date().toLocaleString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    );
  }, []);

  const { inputs, rank, rankRange, airSource, percentile } = analysis;

  return (
    <div className="print-only print-avoid-break">
      <div style={{ borderBottom: '2px solid #0B1A35', paddingBottom: 10, marginBottom: 14 }}>
        <p style={{ fontSize: 11, letterSpacing: 1, color: '#C6962E', fontWeight: 700, textTransform: 'uppercase' }}>
          ABHA Global Educare
        </p>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0B1A35', margin: '2px 0 0' }}>
          NEET Admission Decision Engine — Personal Analysis
        </h1>
        <p style={{ fontSize: 11, color: '#555', marginTop: 3 }}>
          {name ? `Prepared for ${name} · ` : ''}
          {generatedOn ? `Generated on ${generatedOn}` : ''}
        </p>
      </div>

      {/* Inputs this report rests on — so a reader months later knows what was assumed */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginBottom: 14 }}>
        <tbody>
          <tr>
            <td style={{ padding: '4px 8px 4px 0', color: '#555' }}>NEET score</td>
            <td style={{ padding: '4px 0', fontWeight: 700, color: '#0B1A35' }}>{inputs.score} / 720</td>
            <td style={{ padding: '4px 8px 4px 16px', color: '#555' }}>Category</td>
            <td style={{ padding: '4px 0', fontWeight: 700, color: '#0B1A35' }}>{inputs.category}</td>
          </tr>
          <tr>
            <td style={{ padding: '4px 8px 4px 0', color: '#555' }}>Home state</td>
            <td style={{ padding: '4px 0', fontWeight: 700, color: '#0B1A35' }}>{inputs.state}</td>
            <td style={{ padding: '4px 8px 4px 16px', color: '#555' }}>
              {airSource === 'actual' ? 'Your AIR' : 'Estimated AIR'}
            </td>
            <td style={{ padding: '4px 0', fontWeight: 700, color: '#0B1A35' }}>
              {airSource === 'actual'
                ? formatRank(rank)
                : `${formatRank(rankRange.from)} – ${formatRank(rankRange.to)}`}
            </td>
          </tr>
          <tr>
            <td style={{ padding: '4px 8px 4px 0', color: '#555' }}>Percentile (approx.)</td>
            <td style={{ padding: '4px 0', fontWeight: 700, color: '#0B1A35' }}>{percentile}</td>
            <td style={{ padding: '4px 8px 4px 16px', color: '#555' }}>Confidence</td>
            <td style={{ padding: '4px 0', fontWeight: 700, color: '#0B1A35' }}>
              {analysis.confidence.level} ({analysis.confidence.score}/100)
            </td>
          </tr>
        </tbody>
      </table>

      {/* The assumption note — travels with the document, in both languages */}
      <div style={{ border: '1.5px solid #C6962E', background: '#FDF8EC', padding: 12, marginBottom: 18 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#0B1A35', margin: 0 }}>
          Important — this is an assumption, not an official prediction
        </p>
        <p style={{ fontSize: 11, lineHeight: 1.55, color: '#3C4657', margin: '6px 0 0' }}>
          Every figure in this report is an <strong>estimate</strong> arrived at by studying past seat allotments —
          NEET 2026 (NTA) results together with the last completed counselling rounds of MCC and the state
          authorities, adjusted for the NMC 2026 seat matrix. It is <strong>not</strong> an official allotment, an
          offer, or a guarantee of admission. Actual cutoffs move every year with paper difficulty, candidate
          numbers, the seat matrix, reservation rules, domicile and document verification, and round-wise movement.
          Verify against <strong>neet.nta.nic.in</strong>, <strong>mcc.nic.in</strong> and your state counselling
          authority before acting on anything here. ABHA Global Educare LLP is not liable for admission outcomes
          based on this report.
        </p>
        <p style={{ fontSize: 11, lineHeight: 1.55, color: '#3C4657', margin: '8px 0 0' }}>
          हा अहवाल म्हणजे <strong>अंदाज</strong> आहे — मागील वर्षांच्या seat allotment व counselling cutoffs चा अभ्यास
          करून काढलेला. हे अधिकृत allotment नाही आणि प्रवेशाची हमी नाही. प्रत्यक्ष cutoff दरवर्षी बदलतो. अंतिम
          निर्णयापूर्वी अधिकृत संकेतस्थळांवर खात्री करा.
        </p>
      </div>
    </div>
  );
}
