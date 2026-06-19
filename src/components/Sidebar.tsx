import { PIcon, PText } from '@porsche-design-system/components-react';
import { BLUE_PRIMARY, BLUE_GRADIENT, SURFACE_CARD, SURFACE_RAISED, BORDER_SUBTLE, BORDER_DEFAULT } from '../theme';

const navItems = [
  { id: 'overview', label: 'Overview', icon: 'grid' },
  { id: 'creative-studio', label: 'Video Publisher', icon: 'upload' },
  { id: 'thumbnail-creator', label: 'Thumbnail Creator', icon: 'ai-image' },
  { id: 'video-animations', label: 'Video Creator', icon: 'ai-video' },
  { id: 'campaign-monitor', label: 'Campaign Monitor', icon: 'chart' },
  { id: 'leads-revenue', label: 'Leads & Revenue', icon: 'card' },
  { id: 'workflows', label: 'Workflows', icon: 'arrows' },
  { id: 'agents', label: 'Agents', icon: 'brain' },
];

const systemStatus = [
  { label: 'Active Users', value: '18' },
  { label: 'Running Flows', value: '7' },
  { label: 'Completed Today', value: '42' },
  { label: 'Alerts', value: '2' },
];

interface SidebarProps {
  collapsed: boolean;
  active: string;
  onToggle: () => void;
  onActiveChange: (id: string) => void;
}

export default function Sidebar({ collapsed, active, onToggle, onActiveChange }: SidebarProps) {
  return (
    <aside
      className="flex flex-col h-full transition-all duration-300"
      style={{
        width: collapsed ? 60 : 220,
        flexShrink: 0,
        background: '#0d0d12',
        borderRight: `1px solid ${BORDER_DEFAULT}`,
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
          paddingLeft: collapsed ? 12 : 32,
          paddingRight: 12,
        }}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <div
          className="flex items-center justify-center rounded-lg flex-shrink-0"
          style={{ width: 32, height: 32, background: BLUE_GRADIENT }}
        >
          <PIcon name="ai-spark-filled" size="x-small" color="inherit" theme="dark" aria={{ 'aria-label': 'Operational Hub' }} style={{ color: '#fff' }} />
        </div>
        {!collapsed && (
          <span style={{ color: '#f1f5f9', fontSize: 20.8, fontWeight: 600, lineHeight: 1.1 }}>
            Operational Hub
          </span>
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {navItems.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onActiveChange(item.id)}
              className="w-full flex items-center gap-3 rounded-lg mb-0.5 transition-all duration-150"
              style={{
                padding: collapsed ? '9px 0' : '9px 10px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                background: isActive ? SURFACE_RAISED : 'transparent',
                border: isActive ? `1px solid ${BORDER_DEFAULT}` : '1px solid transparent',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              }}
              title={collapsed ? item.label : undefined}
            >
              <PIcon
                name={item.icon as never}
                size="small"
                color="contrast-high"
                theme="dark"
                aria={{ 'aria-label': item.label }}
                style={{ flexShrink: 0, opacity: isActive ? 1 : 0.82 }}
              />
              {!collapsed && (
                <PText
                  size="x-small"
                  theme="dark"
                  color="inherit"
                  style={{ color: isActive ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.4)' }}
                >
                  {item.label}
                </PText>
              )}
            </button>
          );
        })}
      </nav>

      {/* System Status */}
      {!collapsed && (
        <div
          className="mx-2 mb-3 rounded-xl p-3"
          style={{ background: SURFACE_CARD, border: `1px solid ${BORDER_SUBTLE}` }}
        >
          <PText size="xx-small" theme="dark" color="contrast-medium" style={{ marginBottom: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            System Status
          </PText>
          <div className="grid grid-cols-2 gap-2.5">
            {systemStatus.map((s) => (
              <div key={s.label} className="flex flex-col gap-0.5">
                <PText size="xx-small" theme="dark" color="contrast-medium">{s.label}</PText>
                <span style={{ color: BLUE_PRIMARY, fontWeight: 700, fontSize: 15, lineHeight: 1 }}>
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {collapsed && (
        <div className="flex flex-col items-center gap-2 pb-3 pt-2">
          <div className="rounded-full" style={{ width: 4, height: 4, background: BLUE_PRIMARY, opacity: 0.6 }} />
          <div className="rounded-full" style={{ width: 4, height: 4, background: 'rgba(255,255,255,0.18)' }} />
        </div>
      )}
    </aside>
  );
}
