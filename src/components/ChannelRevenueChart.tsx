import { PText } from '@porsche-design-system/components-react';
import { BLUE_PRIMARY, SURFACE_CARD, SURFACE_RAISED, BORDER_SUBTLE, BORDER_DEFAULT, BAR_STRONG, BAR_SOFT } from '../theme';

interface ChannelData {
  channel: string;
  revenue: number;
  color: string;
}

interface ChannelRevenueChartProps {
  data: ChannelData[];
}

// Duotone grey gradient steps for bars — ignore data.color
const BAR_FILLS = [BAR_STRONG, BAR_STRONG, BAR_SOFT, BAR_SOFT, 'rgba(255,255,255,0.07)'];

export default function ChannelRevenueChart({ data }: ChannelRevenueChartProps) {
  const total = data.reduce((s, d) => s + d.revenue, 0);
  const maxRevenue = Math.max(...data.map(d => d.revenue));

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{ background: SURFACE_CARD, border: `1px solid ${BORDER_DEFAULT}` }}
    >
      <div className="flex items-center justify-between">
        <PText size="medium" weight="semi-bold" theme="dark" color="primary">Channel Revenue</PText>
        <span style={{ fontSize: 12, fontWeight: 700, color: BLUE_PRIMARY }}>
          ${total.toLocaleString()} total
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {data.map((d, idx) => {
          const pct = (d.revenue / maxRevenue) * 100;
          const fill = BAR_FILLS[idx] ?? BAR_SOFT;
          return (
            <div key={d.channel}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="rounded-full" style={{ width: 6, height: 6, background: fill }} />
                  <PText size="xx-small" theme="dark" color="contrast-medium">{d.channel}</PText>
                </div>
                <PText size="xx-small" weight="semi-bold" theme="dark" color="primary">
                  ${d.revenue.toLocaleString()}
                </PText>
              </div>
              <div className="rounded-full overflow-hidden" style={{ height: 3, background: SURFACE_RAISED }}>
                <div
                  style={{
                    width: `${pct}%`,
                    height: '100%',
                    background: fill,
                    borderRadius: 4,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 flex-wrap pt-1">
        {data.map((d, idx) => (
          <div
            key={d.channel}
            className="rounded-full px-2.5 py-1 flex items-center gap-1.5"
            style={{ background: SURFACE_RAISED, border: `1px solid ${BORDER_SUBTLE}` }}
          >
            <div className="rounded-full" style={{ width: 5, height: 5, background: BAR_FILLS[idx] ?? BAR_SOFT }} />
            <PText size="xx-small" theme="dark" color="contrast-medium">
              {Math.round((d.revenue / total) * 100)}%
            </PText>
          </div>
        ))}
      </div>
    </div>
  );
}
