import { PText } from '@porsche-design-system/components-react';
import { SURFACE_CARD, BORDER_DEFAULT, BLUE_PRIMARY, BLUE_SECONDARY } from '../theme';

interface WorkflowStatusData {
  name: string;
  value: number;
  color: string;
}

interface WorkflowStatusChartProps {
  data: WorkflowStatusData[];
}

// Neutral greyscale colors for donut — one accent blue for active, rest grey
const DONUT_COLORS = [
  BLUE_PRIMARY,
  BLUE_SECONDARY,
  'rgba(255,255,255,0.18)',
  'rgba(248,113,113,0.7)',
];

function SvgDonut({ data }: { data: WorkflowStatusData[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const cx = 80, cy = 80, r = 55, ir = 38;
  let angle = -90;

  const slices = data.map((d, idx) => {
    const pct = d.value / total;
    const startAngle = angle;
    angle += pct * 360;
    const endAngle = angle;
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const xi1 = cx + ir * Math.cos(startRad);
    const yi1 = cy + ir * Math.sin(startRad);
    const xi2 = cx + ir * Math.cos(endRad);
    const yi2 = cy + ir * Math.sin(endRad);
    const large = pct > 0.5 ? 1 : 0;
    return {
      ...d,
      color: DONUT_COLORS[idx] ?? 'rgba(255,255,255,0.15)',
      path: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${ir} ${ir} 0 ${large} 0 ${xi1} ${yi1} Z`,
    };
  });

  return (
    <svg width={160} height={160} viewBox="0 0 160 160">
      {slices.map((s) => (
        <path key={s.name} d={s.path} fill={s.color} />
      ))}
      <text x={cx} y={cy - 4} textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize={18} fontWeight={700}>
        {total}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize={10}>
        total
      </text>
    </svg>
  );
}

export default function WorkflowStatusChart({ data }: WorkflowStatusChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const colors = data.map((_, idx) => DONUT_COLORS[idx] ?? 'rgba(255,255,255,0.15)');

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{ background: SURFACE_CARD, border: `1px solid ${BORDER_DEFAULT}` }}
    >
      <div className="flex items-center justify-between">
        <PText size="medium" weight="semi-bold" theme="dark" color="primary">Workflow Status</PText>
        <PText size="xx-small" theme="dark" color="contrast-medium">{total} total</PText>
      </div>

      <div className="flex items-center justify-center">
        <SvgDonut data={data} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {data.map((d, idx) => (
          <div key={d.name} className="flex items-center gap-2">
            <div className="rounded-full flex-shrink-0" style={{ width: 7, height: 7, background: colors[idx] }} />
            <PText size="xx-small" theme="dark" color="contrast-medium">{d.name}</PText>
            <span style={{ fontWeight: 700, fontSize: 13, color: 'rgba(255,255,255,0.7)', marginLeft: 'auto' }}>{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
