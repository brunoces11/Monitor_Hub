import { PIcon, PText } from '@porsche-design-system/components-react';
import { SparklineChart } from './SparklineChart';

const sparklineData: Record<string, number[]> = {
  'Active Users': [12, 14, 15, 13, 17, 16, 18],
  'Flows in Progress': [4, 5, 6, 5, 7, 6, 7],
  'Total Leads Today': [320, 340, 370, 360, 390, 410, 427],
  'Conversion Rate': [16.2, 15.8, 15.1, 14.3, 15.0, 14.8, 14.8],
  'Revenue Today': [6200, 6800, 7100, 6900, 7500, 8200, 8812],
  'Tasks Completed': [28, 30, 33, 36, 38, 40, 42],
};

interface KpiCardProps {
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: string;
}

function KpiCard({ label, value, trend, trendUp, icon }: KpiCardProps) {
  const data = sparklineData[label] ?? [];

  return (
    <div
      className="flex flex-col rounded-2xl p-4 transition-all duration-200 group"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        minWidth: 0,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(34,211,238,0.2)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 32px rgba(34,211,238,0.08), 0 4px 24px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(255,255,255,0.07)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)';
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <div
          className="flex items-center justify-center rounded-lg flex-shrink-0"
          style={{
            width: 34,
            height: 34,
            background: 'rgba(34,211,238,0.1)',
            border: '1px solid rgba(34,211,238,0.15)',
          }}
        >
          <PIcon name={icon as any} size="x-small" color="inherit" theme="dark" aria={{ 'aria-label': label }} style={{ color: '#22d3ee' }} />
        </div>
        <div
          className="flex items-center gap-1 rounded-full px-2 py-0.5"
          style={{
            background: trendUp ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)',
            border: `1px solid ${trendUp ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)'}`,
          }}
        >
          <PIcon
            name={trendUp ? 'arrow-up' : 'arrow-down'}
            size="x-small"
            color="inherit"
            theme="dark"
            aria={{ 'aria-label': 'trend' }}
            style={{ color: trendUp ? '#4ade80' : '#f87171', width: 10, height: 10 }}
          />
          <span style={{ fontSize: 11, fontWeight: 700, color: trendUp ? '#4ade80' : '#f87171' }}>
            {trend}
          </span>
        </div>
      </div>

      <div className="mt-1 mb-3">
        <span style={{ fontSize: 26, fontWeight: 700, color: '#f1f5f9', lineHeight: 1 }}>
          {value}
        </span>
      </div>

      <PText size="xx-small" theme="dark" color="contrast-medium" style={{ marginBottom: 8 }}>
        {label}
      </PText>

      {data.length > 0 && (
        <div style={{ height: 36 }}>
          <SparklineChart data={data} up={trendUp} />
        </div>
      )}
    </div>
  );
}

interface KpiRowProps {
  cards: KpiCardProps[];
}

export default function KpiRow({ cards }: KpiRowProps) {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
      {cards.map((c) => (
        <KpiCard key={c.label} {...c} />
      ))}
    </div>
  );
}
