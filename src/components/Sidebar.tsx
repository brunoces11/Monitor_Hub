import { useState } from 'react';
import { PIcon, PText } from '@porsche-design-system/components-react';
import { BLUE_PRIMARY, BLUE_SECONDARY, BLUE_GRADIENT, SURFACE_RAISED, BORDER_DEFAULT } from '../theme';

const NAV_GREY = 'rgba(255,255,255,0.56)';

const navItems = [
  { id: 'overview', label: 'System Monitor', icon: 'grid' },
  { id: 'campaign-monitor', label: 'Campaign Monitor', icon: 'chart' },
  { id: 'creative-studio', label: 'Video Publisher', icon: 'upload' },
  { id: 'leads-revenue', label: 'Leads Funnel', icon: 'funnel' },
  { id: 'agents', label: 'Agent Manager', icon: 'robot' },
  { id: 'transcriptor', label: 'Transcriptor Agent', icon: 'org-chart' },
  { id: 'knowledge-graph', label: 'Memory Graph', icon: 'brain' },
  // Hidden for now per current navigation scope:
  // { id: 'thumbnail-creator', label: 'Thumbnail Creator', icon: 'ai-image' },
  // { id: 'video-animations', label: 'Video Creator', icon: 'ai-video' },
  // { id: 'workflows', label: 'Workflows', icon: 'arrows' },
];

interface SidebarProps {
  collapsed: boolean;
  active: string;
  onToggle: () => void;
  onActiveChange: (id: string) => void;
  onOpenEmails: () => void;
}

export default function Sidebar({ collapsed, active, onToggle, onActiveChange, onOpenEmails }: SidebarProps) {
  const [sidebarTooltip, setSidebarTooltip] = useState<{ label: string; top: number; left: number } | null>(null);
  const emailActive = active === 'emails';

  const showSidebarTooltip = (label: string, target: HTMLElement) => {
    if (!collapsed) return;
    const rect = target.getBoundingClientRect();
    setSidebarTooltip({
      label,
      top: rect.top + rect.height / 2,
      left: rect.right + 9,
    });
  };

  return (
    <aside
      className="flex flex-col h-full transition-all duration-300"
      style={{
        width: collapsed ? 60 : 195,
        flexShrink: 0,
        background: '#0d0d12',
        borderRight: `1px solid ${BORDER_DEFAULT}`,
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <button
        onClick={onToggle}
        className="flex items-center gap-3 px-3 py-4 flex-shrink-0 w-full text-left"
        style={{
          borderBottom: `1px solid ${BORDER_DEFAULT}`,
          minHeight: 64,
          background: 'transparent',
          borderLeft: 'none',
          borderTop: 'none',
          borderRight: 'none',
          cursor: 'pointer',
          paddingLeft: collapsed ? 12 : 18,
          paddingRight: 12,
        }}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        onMouseEnter={(e) => showSidebarTooltip(collapsed ? 'Expand sidebar' : 'Collapse sidebar', e.currentTarget)}
        onMouseLeave={() => setSidebarTooltip(null)}
        onFocus={(e) => showSidebarTooltip(collapsed ? 'Expand sidebar' : 'Collapse sidebar', e.currentTarget)}
        onBlur={() => setSidebarTooltip(null)}
      >
        <div
          className="flex items-center justify-center rounded-lg flex-shrink-0"
          style={{ width: 32, height: 32, background: BLUE_GRADIENT }}
        >
          <PIcon name="ai-spark-filled" size="x-small" color="inherit" theme="dark" aria={{ 'aria-label': 'Operational Hub' }} style={{ color: '#fff' }} />
        </div>
        {!collapsed && (
          <span style={{ color: '#f1f5f9', fontSize: 25, fontWeight: 600, lineHeight: 1.1 }}>
            HUB
          </span>
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 py-2 px-2" style={{ overflow: 'hidden' }}>
        {navItems.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onActiveChange(item.id)}
              className="w-full flex items-center gap-3 rounded-lg mb-0.5 transition-all duration-150"
              style={{
                padding: collapsed ? '9px 0' : '9px 8px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                background: isActive ? SURFACE_RAISED : 'transparent',
                border: isActive ? `1px solid ${BORDER_DEFAULT}` : '1px solid transparent',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                showSidebarTooltip(item.label, e.currentTarget);
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)';
              }}
              onMouseLeave={(e) => {
                setSidebarTooltip(null);
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              }}
              onFocus={(e) => showSidebarTooltip(item.label, e.currentTarget)}
              onBlur={() => setSidebarTooltip(null)}
            >
              {item.icon === 'robot' ? (
                <span
                  aria-label={item.label}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 25,
                    height: 25,
                    flexShrink: 0,
                    opacity: 1,
                  }}
                >
                  <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true" focusable="false">
                    <path
                      d="M12 4.2c-1.8-1.6-4.7-1.3-6.1.8-1.1 1.7-1 4 .3 5.5-.7 1-1 2.1-.8 3.2.3 1.9 1.8 3.4 3.6 3.7.7 1.4 2.2 2.4 3.9 2.4s3.2-1 3.9-2.4c1.8-.3 3.3-1.8 3.6-3.7.2-1.1-.1-2.2-.8-3.2 1.3-1.5 1.4-3.8.3-5.5-1.4-2.1-4.3-2.4-6.1-.8Z"
                      fill="none"
                      stroke="rgba(255,255,255,0.88)"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <path d="M9 8.2c1 .2 1.8.9 2 1.8M15 8.2c-1 .2-1.8.9-2 1.8M8.8 12.2h6.4M9.3 15.1c.7.7 1.6 1.1 2.7 1.1s2-.4 2.7-1.1" fill="none" stroke="rgba(255,255,255,0.88)" strokeWidth="1.35" strokeLinecap="round" />
                  </svg>
                </span>
              ) : item.icon === 'org-chart' ? (
                <span
                  aria-label={item.label}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 23,
                    height: 23,
                    flexShrink: 0,
                    opacity: isActive ? 1 : 0.82,
                  }}
                >
                  <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true" focusable="false">
                    <rect x="9" y="3.5" width="6" height="4.2" rx="1.2" fill="none" stroke="rgba(255,255,255,0.88)" strokeWidth="1.5" />
                    <path d="M12 7.7v3.1M6.5 15.2v-1.9h11v1.9" fill="none" stroke="rgba(255,255,255,0.88)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="3.5" y="15.2" width="5" height="4.2" rx="1.2" fill="none" stroke="rgba(255,255,255,0.88)" strokeWidth="1.5" />
                    <rect x="9.5" y="15.2" width="5" height="4.2" rx="1.2" fill="none" stroke="rgba(255,255,255,0.88)" strokeWidth="1.5" />
                    <rect x="15.5" y="15.2" width="5" height="4.2" rx="1.2" fill="none" stroke="rgba(255,255,255,0.88)" strokeWidth="1.5" />
                  </svg>
                </span>
              ) : item.icon === 'knowledge-graph' ? (
                <span
                  aria-label={item.label}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 23,
                    height: 23,
                    flexShrink: 0,
                    opacity: isActive ? 1 : 0.82,
                  }}
                >
                  <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true" focusable="false">
                    <path d="M7.4 8.2 12 5.2l4.6 3M7.4 15.8 12 18.8l4.6-3M7.5 8.5v7M16.5 8.5v7M8 8.2h8M8 15.8h8" fill="none" stroke="rgba(255,255,255,0.88)" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="5" r="2" fill="none" stroke="rgba(255,255,255,0.88)" strokeWidth="1.45" />
                    <circle cx="6.5" cy="8.8" r="2" fill="none" stroke="rgba(255,255,255,0.88)" strokeWidth="1.45" />
                    <circle cx="17.5" cy="8.8" r="2" fill="none" stroke="rgba(255,255,255,0.88)" strokeWidth="1.45" />
                    <circle cx="6.5" cy="15.2" r="2" fill="none" stroke="rgba(255,255,255,0.88)" strokeWidth="1.45" />
                    <circle cx="17.5" cy="15.2" r="2" fill="none" stroke="rgba(255,255,255,0.88)" strokeWidth="1.45" />
                    <circle cx="12" cy="19" r="2" fill="none" stroke="rgba(255,255,255,0.88)" strokeWidth="1.45" />
                  </svg>
                </span>
              ) : item.icon === 'funnel' ? (
                <span
                  aria-label={item.label}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 23,
                    height: 23,
                    flexShrink: 0,
                    opacity: 1,
                  }}
                >
                  <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true" focusable="false">
                    <path d="M4.5 5.5h15L14 12.1v4.1l-4 2v-6.1L4.5 5.5Z" fill="none" stroke="rgba(255,255,255,0.88)" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M9.9 10.7h4.2" fill="none" stroke="rgba(255,255,255,0.88)" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
              ) : item.icon === 'brain' ? (
                <span
                  aria-label={item.label}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 23,
                    height: 23,
                    flexShrink: 0,
                    opacity: 1,
                  }}
                >
                  <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true" focusable="false">
                    <path
                      d="M10.3 5.1c-1.1-1-3-.9-4.1.1-1.1 1-1.4 2.8-.7 4.1-1 .8-1.5 2-1.3 3.3.2 1.8 1.5 3.2 3.3 3.6.4 1.7 1.9 2.9 3.7 2.9.4 0 .7-.1 1.1-.2V5.9c-.6-.1-1.2-.4-1.7-.8Z"
                      fill="none"
                      stroke="rgba(255,255,255,0.92)"
                      strokeWidth="1.55"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13.7 5.1c1.1-1 3-.9 4.1.1 1.1 1 1.4 2.8.7 4.1 1 .8 1.5 2 1.3 3.3-.2 1.8-1.5 3.2-3.3 3.6-.4 1.7-1.9 2.9-3.7 2.9-.4 0-.7-.1-1.1-.2V5.9c.6-.1 1.2-.4 1.7-.8Z"
                      fill="none"
                      stroke="rgba(255,255,255,0.92)"
                      strokeWidth="1.55"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.2 8.1c.8.2 1.4.9 1.4 1.8M8.5 11.9c1 .1 1.8.9 1.9 1.8M14.8 8.1c-.8.2-1.4.9-1.4 1.8M15.5 11.9c-1 .1-1.8.9-1.9 1.8M12 7.1v9.8"
                      fill="none"
                      stroke="rgba(255,255,255,0.72)"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              ) : (
                <PIcon
                  name={item.icon as never}
                  size="small"
                  color="contrast-high"
                  theme="dark"
                  aria={{ 'aria-label': item.label }}
                  style={{ flexShrink: 0, opacity: 1 }}
                />
              )}
              {!collapsed && (
                <PText
                  size="x-small"
                  theme="dark"
                  color="inherit"
                  style={{ color: NAV_GREY }}
                >
                  {item.label}
                </PText>
              )}
            </button>
          );
        })}
      </nav>

      <div className="mx-2 mb-3 flex flex-col gap-2" style={{ alignItems: collapsed ? 'center' : 'stretch' }}>
        <div
          className="flex gap-2"
          style={{
            alignItems: 'center',
            flexDirection: collapsed ? 'column' : 'row',
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}
        >
          <button
            className="relative flex items-center rounded-xl min-w-0"
            style={{
              width: collapsed ? 38 : 'auto',
              height: 38,
              background: SURFACE_RAISED,
              border: `1px solid ${BORDER_DEFAULT}`,
              cursor: 'pointer',
              flex: collapsed ? '0 0 auto' : 1,
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: 7,
              padding: collapsed ? 0 : '6px 8px',
            }}
            onMouseEnter={(e) => showSidebarTooltip('Alerts', e.currentTarget)}
            onMouseLeave={() => setSidebarTooltip(null)}
            onFocus={(e) => showSidebarTooltip('Alerts', e.currentTarget)}
            onBlur={() => setSidebarTooltip(null)}
            aria-label="Alerts"
          >
            <span className="relative flex items-center justify-center flex-shrink-0" style={{ width: 18, height: 18 }}>
              <PIcon name="bell" size="small" color="primary" theme="dark" aria={{ 'aria-label': 'notifications' }} />
              <span
                className="absolute rounded-full flex items-center justify-center"
                style={{
                  width: 12,
                  height: 12,
                  top: -3,
                  right: -3,
                  background: '#F87171',
                  fontSize: 8,
                  fontWeight: 700,
                  color: '#fff',
                }}
              >
                2
              </span>
            </span>
            {!collapsed && (
              <PText size="xx-small" weight="semi-bold" theme="dark" color="primary" style={{ minWidth: 0 }}>
                Alerts
              </PText>
            )}
          </button>

          <button
            onClick={onOpenEmails}
            className="relative flex items-center rounded-xl min-w-0"
            style={{
              width: collapsed ? 38 : 'auto',
              height: 38,
              background: emailActive ? BLUE_GRADIENT : SURFACE_RAISED,
              border: `1px solid ${emailActive ? 'rgba(255,255,255,0.2)' : BORDER_DEFAULT}`,
              cursor: 'pointer',
              flex: collapsed ? '0 0 auto' : 1,
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: 7,
              padding: collapsed ? 0 : '6px 8px',
            }}
            onMouseEnter={(e) => {
              showSidebarTooltip('Emails', e.currentTarget);
            }}
            onMouseLeave={(e) => {
              setSidebarTooltip(null);
              (e.currentTarget as HTMLButtonElement).style.borderColor = emailActive ? 'rgba(255,255,255,0.2)' : BORDER_DEFAULT;
            }}
            onFocus={(e) => showSidebarTooltip('Emails', e.currentTarget)}
            onBlur={() => setSidebarTooltip(null)}
            aria-label="Emails"
          >
            <span className="relative flex items-center justify-center flex-shrink-0" style={{ width: 18, height: 18 }}>
              <PIcon name="email" size="small" color="primary" theme="dark" aria={{ 'aria-label': 'email notifications' }} style={{ color: emailActive ? '#fff' : undefined }} />
              <span
                className="absolute rounded-full flex items-center justify-center"
                style={{
                  width: 12,
                  height: 12,
                  top: -3,
                  right: -3,
                  background: '#F87171',
                  fontSize: 8,
                  fontWeight: 700,
                  color: '#fff',
                }}
              >
                5
              </span>
            </span>
            {!collapsed && (
              <PText size="xx-small" weight="semi-bold" theme="dark" color="primary" style={{ minWidth: 0, color: emailActive ? '#fff' : undefined }}>
                Emails
              </PText>
            )}
          </button>
        </div>

        <button
          className="flex items-center gap-2 rounded-xl min-w-0"
          style={{
            width: collapsed ? 38 : '100%',
            height: 38,
            background: SURFACE_RAISED,
            border: `1px solid ${BORDER_DEFAULT}`,
            cursor: 'pointer',
            flex: collapsed ? '0 0 auto' : 1,
            padding: collapsed ? '6px 8px' : '6px',
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}
          onMouseEnter={(e) => {
            showSidebarTooltip('User profile', e.currentTarget);
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.14)';
          }}
          onMouseLeave={(e) => {
            setSidebarTooltip(null);
            (e.currentTarget as HTMLButtonElement).style.borderColor = BORDER_DEFAULT;
          }}
          onFocus={(e) => showSidebarTooltip('User profile', e.currentTarget)}
          onBlur={() => setSidebarTooltip(null)}
          aria-label="User menu"
        >
          <div
            className="rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
            style={{ width: 26, height: 26, background: `linear-gradient(135deg, ${BLUE_PRIMARY}, ${BLUE_SECONDARY})`, fontSize: 10, fontWeight: 700, color: '#fff' }}
          >
            <img
              src="/avatars/joana_48.jpg"
              alt="Joana"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          {!collapsed && (
            <PText size="xx-small" weight="semi-bold" theme="dark" color="primary" style={{ minWidth: 0 }}>
              Joana
            </PText>
          )}
        </button>
      </div>

      {sidebarTooltip && (
        <div
          className="hub-floating-tooltip"
          style={{
            top: sidebarTooltip.top,
            left: sidebarTooltip.left,
          }}
        >
          {sidebarTooltip.label}
        </div>
      )}
    </aside>
  );
}
