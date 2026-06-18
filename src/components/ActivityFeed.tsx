import { PText, PIcon } from '@porsche-design-system/components-react';
import { BLUE_PRIMARY, SURFACE_CARD, SURFACE_RAISED, BORDER_SUBTLE, BORDER_DEFAULT } from '../theme';

interface ActivityItem {
  id: number;
  user: string;
  action: string;
  target: string;
  time: string;
  status: 'info' | 'success' | 'warning' | 'error';
  icon: string;
}

interface ActivityFeedProps {
  items: ActivityItem[];
}

// All statuses use neutral grey except error (red) — color appears only in small dots
const statusStyles: Record<string, { dot: string; iconColor: string }> = {
  info: { dot: BLUE_PRIMARY, iconColor: BLUE_PRIMARY },
  success: { dot: 'rgba(255,255,255,0.35)', iconColor: 'rgba(255,255,255,0.4)' },
  warning: { dot: 'rgba(255,255,255,0.25)', iconColor: 'rgba(255,255,255,0.35)' },
  error: { dot: '#f87171', iconColor: '#f87171' },
};

export default function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{ background: SURFACE_CARD, border: `1px solid ${BORDER_DEFAULT}` }}
    >
      <div className="flex items-center justify-between">
        <PText size="medium" weight="semi-bold" theme="dark" color="primary">
          Recent Activity
        </PText>
        <div className="rounded-full px-2 py-0.5" style={{ background: SURFACE_RAISED, border: `1px solid ${BORDER_SUBTLE}` }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: BLUE_PRIMARY, letterSpacing: '0.06em' }}>LIVE</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {items.map((item) => {
          const s = statusStyles[item.status];
          return (
            <div
              key={item.id}
              className="rounded-xl p-3 flex gap-3 items-start"
              style={{ background: SURFACE_RAISED, border: `1px solid ${BORDER_SUBTLE}` }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.12)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = BORDER_SUBTLE)}
            >
              <div
                className="rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER_SUBTLE}` }}
              >
                <PIcon name={item.icon as any} size="x-small" color="inherit" theme="dark" aria={{ 'aria-label': item.status }} style={{ color: s.iconColor }} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <PText size="xx-small" weight="semi-bold" theme="dark" color="primary">
                    {item.user}
                  </PText>
                  <PText size="xx-small" theme="dark" color="contrast-medium">
                    {item.action}
                  </PText>
                </div>
                <PText size="xx-small" theme="dark" color="contrast-medium" style={{ marginTop: 2 }}>
                  {item.target}
                </PText>
              </div>

              <PText size="xx-small" theme="dark" color="contrast-medium" style={{ flexShrink: 0 }}>
                {item.time}
              </PText>

              <div
                className="rounded-full flex-shrink-0 mt-1.5"
                style={{ width: 5, height: 5, background: s.dot }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
