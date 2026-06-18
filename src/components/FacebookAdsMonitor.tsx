import { PText, PIcon } from '@porsche-design-system/components-react';

interface FacebookAdsMonitorProps {
  spend: string;
  ctr: string;
  cpc: string;
  leads: number;
  roas: string;
  revenue: string;
  status: string;
  chartData: { day: string; spend: number; revenue: number }[];
}

function SvgBarChart({ data }: { data: { day: string; spend: number; revenue: number }[] }) {
  const w = 300, h = 100;
  const maxVal = Math.max(...data.flatMap(d => [d.spend, d.revenue]));
  const barW = 16, gap = 4, groupGap = 8;
  const totalGroupW = barW * 2 + gap + groupGap;
  const offsetX = 4;

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      {data.map((d, i) => {
        const x = offsetX + i * totalGroupW;
        const spH = (d.spend / maxVal) * (h - 20);
        const rvH = (d.revenue / maxVal) * (h - 20);
        return (
          <g key={d.day}>
            <rect x={x} y={h - 16 - spH} width={barW} height={spH} rx={3} fill="#f87171" opacity={0.7} />
            <rect x={x + barW + gap} y={h - 16 - rvH} width={barW} height={rvH} rx={3} fill="#4ade80" opacity={0.7} />
            <text x={x + barW + gap / 2} y={h - 2} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize={9}>{d.day}</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function FacebookAdsMonitor({
  spend, ctr, cpc, leads, roas, revenue, status, chartData,
}: FacebookAdsMonitorProps) {
  const metrics = [
    { label: 'Spend', value: spend, color: '#f87171' },
    { label: 'CTR', value: ctr, color: '#22d3ee' },
    { label: 'CPC', value: cpc, color: '#fbbf24' },
    { label: 'Leads', value: String(leads), color: '#60a5fa' },
    { label: 'ROAS', value: roas, color: '#4ade80' },
    { label: 'Revenue', value: revenue, color: '#4ade80' },
  ];

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{
        background: 'linear-gradient(135deg, rgba(96,165,250,0.05), rgba(34,211,238,0.03))',
        border: '1px solid rgba(96,165,250,0.12)',
        boxShadow: '0 4px 32px rgba(0,0,0,0.3)',
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-xl flex items-center justify-center" style={{ width: 38, height: 38, background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.2)' }}>
            <PIcon name="logo-facebook" size="small" color="inherit" theme="dark" aria={{ 'aria-label': 'facebook' }} style={{ color: '#60a5fa' }} />
          </div>
          <div>
            <PText size="medium" weight="semi-bold" theme="dark" color="primary">Facebook Ads Monitor</PText>
            <PText size="xx-small" theme="dark" color="contrast-medium">Campaign performance overview</PText>
          </div>
        </div>
        <div className="rounded-full px-3 py-1 flex items-center gap-2" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)' }}>
          <div className="rounded-full" style={{ width: 6, height: 6, background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
          <PText size="xx-small" weight="semi-bold" theme="dark" color="inherit" style={{ color: '#4ade80' }}>{status}</PText>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {metrics.map(({ label, value, color }) => (
          <div key={label} className="rounded-xl p-3 flex flex-col gap-1" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <PText size="xx-small" theme="dark" color="contrast-medium">{label}</PText>
            <span style={{ fontSize: 18, fontWeight: 700, color }}>{value}</span>
          </div>
        ))}
      </div>

      <div>
        <PText size="xx-small" theme="dark" color="contrast-medium" style={{ marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Spend vs Revenue (7 days)
        </PText>
        <div style={{ height: 100 }}>
          <SvgBarChart data={chartData} />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex items-center gap-1.5">
          <div className="rounded-full" style={{ width: 8, height: 8, background: '#f87171' }} />
          <PText size="xx-small" theme="dark" color="contrast-medium">Spend</PText>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="rounded-full" style={{ width: 8, height: 8, background: '#4ade80' }} />
          <PText size="xx-small" theme="dark" color="contrast-medium">Revenue</PText>
        </div>
      </div>
    </div>
  );
}
