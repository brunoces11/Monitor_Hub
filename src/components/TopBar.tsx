import { PIcon, PButton, PText } from '@porsche-design-system/components-react';
import { BLUE_PRIMARY, BLUE_SECONDARY, SURFACE_RAISED, BORDER_DEFAULT } from '../theme';

export default function TopBar() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <header
      className="flex items-center gap-4 px-6 flex-shrink-0"
      style={{
        background: '#0d0d12',
        borderBottom: `1px solid ${BORDER_DEFAULT}`,
        height: 64,
      }}
    >
      {/* Title intentionally hidden to avoid duplicate branding; keep block here for easy restoration.
      <div className="flex flex-col mr-2">
        <div className="flex items-center gap-2">
          <PText size="small" weight="semi-bold" theme="dark" color="primary">
            Monitor Hub
          </PText>
          <div
            className="flex items-center gap-1 rounded-full px-2 py-0.5"
            style={{ background: 'rgba(44,194,238,0.08)', border: `1px solid rgba(44,194,238,0.18)` }}
          >
            <div className="rounded-full" style={{ width: 4, height: 4, background: BLUE_PRIMARY }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: BLUE_PRIMARY, letterSpacing: '0.06em' }}>
              LIVE
            </span>
          </div>
        </div>
        <PText size="xx-small" theme="dark" color="contrast-medium">
          AI Orchestration &amp; Marketing Operations Control Center
        </PText>
      </div>
      */}

      {/* Search intentionally hidden for this demo; keep block here for easy restoration.
      <div
        className="flex items-center gap-2 rounded-xl"
        style={{
          background: SURFACE_RAISED,
          border: `1px solid ${BORDER_DEFAULT}`,
          padding: '8px 14px',
          flex: '1 1 0',
          maxWidth: 320,
        }}
      >
        <PIcon name="search" size="x-small" color="contrast-medium" theme="dark" aria={{ 'aria-label': 'search' }} />
        <input
          placeholder="Search flows, agents, campaigns..."
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'rgba(255,255,255,0.5)',
            fontSize: 13,
            width: '100%',
          }}
        />
      </div>
      */}

      <div className="flex-1" />

      {/* Date */}
      <div
        className="flex items-center gap-1.5 rounded-lg px-3 py-2"
        style={{ background: SURFACE_RAISED, border: `1px solid ${BORDER_DEFAULT}` }}
      >
        <PIcon name="clock" size="x-small" color="contrast-medium" theme="dark" aria={{ 'aria-label': 'time' }} />
        <PText size="xx-small" theme="dark" color="contrast-medium">
          {dateStr} · {timeStr}
        </PText>
      </div>

      {/* Actions */}
      <PButton variant="secondary" icon="add" compact theme="dark">
        New Workflow
      </PButton>
      <PButton variant="primary" icon="ai-spark" compact theme="dark">
        Run Automation
      </PButton>

      {/* Notifications */}
      <button
        className="relative flex items-center justify-center rounded-xl"
        style={{
          width: 38,
          height: 38,
          background: SURFACE_RAISED,
          border: `1px solid ${BORDER_DEFAULT}`,
          cursor: 'pointer',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.14)')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.borderColor = BORDER_DEFAULT)}
        aria-label="Notifications"
      >
        <PIcon name="bell" size="small" color="primary" theme="dark" aria={{ 'aria-label': 'notifications' }} />
        <span
          className="absolute top-1.5 right-1.5 rounded-full flex items-center justify-center"
          style={{ width: 12, height: 12, background: BLUE_SECONDARY, fontSize: 8, fontWeight: 700, color: '#fff' }}
        >
          2
        </span>
      </button>

      {/* Avatar */}
      <button
        className="flex items-center gap-2 rounded-xl"
        style={{
          background: SURFACE_RAISED,
          border: `1px solid ${BORDER_DEFAULT}`,
          cursor: 'pointer',
          padding: '6px 10px',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.14)')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.borderColor = BORDER_DEFAULT)}
        aria-label="User menu"
      >
        <div
          className="rounded-full flex items-center justify-center flex-shrink-0"
          style={{ width: 26, height: 26, background: `linear-gradient(135deg, ${BLUE_PRIMARY}, ${BLUE_SECONDARY})`, fontSize: 10, fontWeight: 700, color: '#fff' }}
        >
          JO
        </div>
        <PText size="xx-small" weight="semi-bold" theme="dark" color="primary">João</PText>
        <PIcon name="arrow-compact-down" size="x-small" color="contrast-medium" theme="dark" aria={{ 'aria-label': 'expand' }} />
      </button>
    </header>
  );
}
