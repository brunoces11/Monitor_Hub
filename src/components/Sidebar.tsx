import { PIcon, PText } from '@porsche-design-system/components-react';
import { BLUE_PRIMARY, BLUE_SECONDARY, BLUE_GRADIENT, SURFACE_RAISED, BORDER_DEFAULT } from '../theme';

const navItems = [
  { id: 'overview', label: 'System Monitor', icon: 'grid' },
  { id: 'campaign-monitor', label: 'Campaign Monitor', icon: 'chart' },
  { id: 'creative-studio', label: 'Video Publisher', icon: 'upload' },
  { id: 'thumbnail-creator', label: 'Thumbnail Creator', icon: 'ai-image' },
  { id: 'video-animations', label: 'Video Creator', icon: 'ai-video' },
  { id: 'leads-revenue', label: 'Leads & Revenue', icon: 'card' },
  { id: 'workflows', label: 'Workflows', icon: 'arrows' },
  { id: 'agents', label: 'Agents', icon: 'brain' },
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
          <span style={{ color: '#f1f5f9', fontSize: 25, fontWeight: 600, lineHeight: 1.1 }}>
            HUB
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

      <div className="mx-2 mb-3 flex items-center gap-2">
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
            style={{ width: 12, height: 12, background: '#F87171', fontSize: 8, fontWeight: 700, color: '#fff' }}
          >
            2
          </span>
        </button>

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
          aria-label="Email notifications"
        >
          <PIcon name="email" size="small" color="primary" theme="dark" aria={{ 'aria-label': 'email notifications' }} />
          <span
            className="absolute top-1.5 right-1.5 rounded-full flex items-center justify-center"
            style={{ width: 12, height: 12, background: '#F87171', fontSize: 8, fontWeight: 700, color: '#fff' }}
          >
            7
          </span>
        </button>

        <button
          className="flex items-center gap-2 rounded-xl min-w-0"
          style={{
            height: 38,
            background: SURFACE_RAISED,
            border: `1px solid ${BORDER_DEFAULT}`,
            cursor: 'pointer',
            flex: 1,
            padding: '6px 8px',
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
          <PText size="xx-small" weight="semi-bold" theme="dark" color="primary" style={{ minWidth: 0 }}>
            Joao
          </PText>
        </button>
      </div>

      {collapsed && (
        <div className="flex flex-col items-center gap-2 pb-3 pt-2">
          <div className="rounded-full" style={{ width: 4, height: 4, background: BLUE_PRIMARY, opacity: 0.6 }} />
          <div className="rounded-full" style={{ width: 4, height: 4, background: 'rgba(255,255,255,0.18)' }} />
        </div>
      )}
    </aside>
  );
}
