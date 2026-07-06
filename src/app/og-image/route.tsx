import { ImageResponse } from 'next/og';

// Dynamic Open Graph / social-preview image (1200×630 PNG). Replaces the old
// static og-image.jpg, which had outdated countries (Russia/Kazakhstan/Kyrgyzstan)
// baked in. Rendered at the edge so the courses & countries always match the
// live site.
export const runtime = 'edge';

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: '#0B1A35',
          padding: '60px 72px',
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Gold frame */}
        <div
          style={{
            position: 'absolute',
            top: 24,
            left: 24,
            right: 24,
            bottom: 24,
            border: '3px solid #C6962E',
            borderRadius: 16,
            display: 'flex',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', fontSize: 78, fontWeight: 800, lineHeight: 1.05 }}>
            <span style={{ color: '#ffffff' }}>ABHA&nbsp;</span>
            <span style={{ color: '#C6962E' }}>Global Educare</span>
          </div>

          <div style={{ display: 'flex', fontSize: 38, fontStyle: 'italic', color: '#E0B85C', marginTop: 16 }}>
            “Dreams Have No Borders”
          </div>

          <div style={{ display: 'flex', width: 240, height: 3, background: '#C6962E', margin: '26px 0' }} />

          <div style={{ display: 'flex', fontSize: 33, fontWeight: 700, color: '#ffffff' }}>
            MBBS · Dentistry · Nursing · Business · IT · MBA &amp; PhD
          </div>
          <div style={{ display: 'flex', fontSize: 28, color: 'rgba(255,255,255,0.85)', marginTop: 12 }}>
            Study Abroad · NMC &amp; WHO Eligible Universities
          </div>
          <div style={{ display: 'flex', fontSize: 34, fontWeight: 700, color: '#E0B85C', marginTop: 14 }}>
            Georgia · Bosnia · Timor-Leste
          </div>

          <div style={{ display: 'flex', fontSize: 30, fontWeight: 700, color: '#C6962E', marginTop: 30 }}>
            abhaglobaleducare.com
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
