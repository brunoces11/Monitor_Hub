import { PText } from '@porsche-design-system/components-react';
import { BLUE_PRIMARY, BLUE_SECONDARY, TREND_UP, TREND_DOWN, SURFACE_CARD, SURFACE_RAISED, BORDER_SUBTLE, BORDER_DEFAULT, BAR_STRONG, BAR_SOFT } from '../theme';

interface ChartPoint {
  day: string;
  leads: number;
  sales: number;
}

interface CampaignCardProps {
  platform: 'instagram' | 'facebook';
  title: string;
  reach: string;
  newLeads24h: number;
  leadConvRate: string;
  salesConvRate: string;
  productSales: string;
  trend: string;
  trendUp: boolean;
  status: string;
  chartData: ChartPoint[];
  funnelData: { name: string; value: number }[];
}

const platformConfig = {
  instagram: { icon: 'logo-instagram', accent: BLUE_PRIMARY },
  facebook: { icon: 'logo-facebook', accent: BLUE_SECONDARY },
};

function PlatformLogo({ platform }: { platform: 'instagram' | 'facebook' }) {
  if (platform === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true" focusable="false">
        <rect x="5" y="5" width="14" height="14" rx="4" fill="none" stroke="#FFFFFF" strokeWidth="1.7" />
        <circle cx="12" cy="12" r="3.2" fill="none" stroke="#FFFFFF" strokeWidth="1.7" />
        <circle cx="16.4" cy="7.6" r="1" fill="#FFFFFF" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true" focusable="false">
      <path
        d="M14.5 4.5h2.7V8h-2.7c-.8 0-1.1.3-1.1 1.1V10h3.8l-.5 3.1h-3.3V20h-3.2v-6.9H8.1V10h2.1v-1.6c0-2.2 1.4-3.9 4.3-3.9Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

function SvgGroupedBars({ data }: { data: ChartPoint[] }) {
  const w = 300, h = 80;
  const maxVal = Math.max(...data.flatMap(d => [d.leads, d.sales]));
  const barW = 12, gap = 3, groupGap = 10;
  const totalGroupW = barW * 2 + gap + groupGap;
  const offsetX = 2;

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      {data.map((d, i) => {
        const x = offsetX + i * totalGroupW;
        const lH = (d.leads / maxVal) * (h - 14);
        const sH = (d.sales / maxVal) * (h - 14);
        return (
          <g key={d.day}>
            <rect x={x} y={h - 12 - lH} width={barW} height={lH} rx={2} fill={BAR_STRONG} />
            <rect x={x + barW + gap} y={h - 12 - sH} width={barW} height={sH} rx={2} fill={BAR_SOFT} />
            <text x={x + barW + gap / 2} y={h - 1} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize={8}>{d.day}</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function CampaignCard({
  platform, title, reach, newLeads24h, leadConvRate, salesConvRate,
  productSales, trend, trendUp, chartData,
}: CampaignCardProps) {
  const cfg = platformConfig[platform];

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{ background: SURFACE_CARD, border: `1px solid ${BORDER_DEFAULT}` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ width: 36, height: 36, background: SURFACE_RAISED, border: `1px solid ${BORDER_DEFAULT}` }}
          >
            <PlatformLogo platform={platform} />
          </div>
          <PText size="medium" weight="semi-bold" theme="dark" color="primary">{title}</PText>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="rounded-full px-2 py-0.5"
            style={{ background: trendUp ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.08)', border: `1px solid ${trendUp ? 'rgba(74,222,128,0.18)' : 'rgba(248,113,113,0.18)'}` }}
          >
            <span style={{ fontSize: 11, fontWeight: 700, color: trendUp ? TREND_UP : TREND_DOWN }}>{trend}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl p-3 col-span-2" style={{ background: SURFACE_RAISED, border: `1px solid ${BORDER_SUBTLE}` }}>
          <div className="flex items-end justify-between">
            <div>
              <PText size="xx-small" theme="dark" color="contrast-medium">Reach</PText>
              <span style={{ fontSize: 22, fontWeight: 700, color: cfg.accent }}>{reach}</span>
            </div>
            <div className="text-right">
              <PText size="xx-small" theme="dark" color="contrast-medium">New Leads (24h)</PText>
              <span style={{ fontSize: 22, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>{newLeads24h}</span>
            </div>
          </div>
        </div>

        {[
          { label: 'Lead Conv. Rate', value: leadConvRate },
          { label: 'Sales Conv. Rate', value: salesConvRate },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl p-3" style={{ background: SURFACE_RAISED, border: `1px solid ${BORDER_SUBTLE}` }}>
            <PText size="xx-small" theme="dark" color="contrast-medium" style={{ marginBottom: 2 }}>{label}</PText>
            <span style={{ fontSize: 20, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>{value}</span>
          </div>
        ))}

        <div className="rounded-xl p-3 col-span-2" style={{ background: SURFACE_RAISED, border: `1px solid ${BORDER_SUBTLE}` }}>
          <PText size="xx-small" theme="dark" color="contrast-medium" style={{ marginBottom: 2 }}>Product XYZ Sales</PText>
          <span style={{ fontSize: 20, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>{productSales}</span>
        </div>
      </div>

      <div>
        <PText size="xx-small" theme="dark" color="contrast-medium" style={{ marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          7-Day Performance
        </PText>
        <div style={{ height: 80 }}>
          <SvgGroupedBars data={chartData} />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex items-center gap-1.5">
          <div className="rounded-full" style={{ width: 7, height: 7, background: BAR_STRONG }} />
          <PText size="xx-small" theme="dark" color="contrast-medium">Leads</PText>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="rounded-full" style={{ width: 7, height: 7, background: BAR_SOFT }} />
          <PText size="xx-small" theme="dark" color="contrast-medium">Sales</PText>
        </div>
      </div>
    </div>
  );
}
