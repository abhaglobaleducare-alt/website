'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function stageColor(stage: string) {
  if (/Lead|Initial|Counselling/.test(stage)) return '#f59e0b';
  if (/Registration|Documentation|Admission|Fee|Visa/.test(stage)) return '#3b82f6';
  return '#10b981';
}

export default function FunnelChart({ data }: { data: { stage: string; count: number }[] }) {
  return (
    <div className="mt-4 h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ bottom: 60 }}>
          <XAxis
            dataKey="stage"
            angle={-35}
            textAnchor="end"
            interval={0}
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            height={70}
          />
          <YAxis allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <Tooltip
            contentStyle={{ background: '#0f172a', border: '1px solid #1e293b' }}
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
          />
          <Bar
            dataKey="count"
            radius={[4, 4, 0, 0]}
            cursor="pointer"
            onClick={(entry) => {
              const e = entry as unknown as { stage?: string; payload?: { stage?: string } };
              const stage = e.stage ?? e.payload?.stage;
              if (stage) {
                window.location.href = `/admin/students?stage=${encodeURIComponent(stage)}`;
              }
            }}
          >
            {data.map((entry) => (
              <Cell key={entry.stage} fill={stageColor(entry.stage)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
