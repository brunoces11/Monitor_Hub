import { useState } from 'react';
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
  title?: string;
}

// All statuses use neutral grey except error (red) — color appears only in small dots
const statusStyles: Record<string, { dot: string; iconColor: string }> = {
  info: { dot: BLUE_PRIMARY, iconColor: BLUE_PRIMARY },
  success: { dot: 'rgba(255,255,255,0.35)', iconColor: 'rgba(255,255,255,0.4)' },
  warning: { dot: 'rgba(255,255,255,0.25)', iconColor: 'rgba(255,255,255,0.35)' },
  error: { dot: '#f87171', iconColor: '#f87171' },
};

const loggedUsers = [
  { name: 'Joao', loggedAt: '07:08 AM' },
  { name: 'Ana', loggedAt: '07:14 AM' },
  { name: 'Marina', loggedAt: '07:19 AM' },
];

export default function ActivityFeed({ items, title = 'Recent Activity' }: ActivityFeedProps) {
  const [showLoggedUsers, setShowLoggedUsers] = useState(false);

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{ background: SURFACE_CARD, border: `1px solid ${BORDER_DEFAULT}` }}
    >
      <div className="flex items-center justify-between gap-3">
        <PText size="medium" weight="semi-bold" theme="dark" color="primary">
          {title}
        </PText>
        <div className="relative">
          <button
            className="flex items-center gap-1.5 rounded-full px-2 py-0.5"
            style={{ background: SURFACE_RAISED, border: `1px solid ${BORDER_SUBTLE}`, cursor: 'pointer' }}
            onClick={() => setShowLoggedUsers((value) => !value)}
            aria-expanded={showLoggedUsers}
            aria-label="Logged users"
          >
            <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.48)' }}>
              Logged users: 3
            </span>
            <PIcon name="arrow-compact-down" size="x-small" color="contrast-medium" theme="dark" aria={{ 'aria-label': 'expand' }} />
          </button>

          {showLoggedUsers && (
            <div
              className="absolute right-0 top-full mt-2 rounded-xl p-2 flex flex-col gap-1"
              style={{
                width: 190,
                background: SURFACE_RAISED,
                border: `1px solid ${BORDER_DEFAULT}`,
                boxShadow: '0 16px 34px rgba(0,0,0,0.32)',
                zIndex: 20,
              }}
            >
              {loggedUsers.map((user) => (
                <div
                  key={user.name}
                  className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                >
                  <PText size="xx-small" weight="semi-bold" theme="dark" color="primary">
                    {user.name}
                  </PText>
                  <PText size="xx-small" theme="dark" color="contrast-medium">
                    {user.loggedAt}
                  </PText>
                </div>
              ))}
            </div>
          )}
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
