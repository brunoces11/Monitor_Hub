import { PText, PIcon } from '@porsche-design-system/components-react';
import { BLUE_PRIMARY, SURFACE_CARD, SURFACE_RAISED, BORDER_SUBTLE, BORDER_DEFAULT } from '../theme';

interface Agent {
  name: string;
  status: 'active' | 'idle';
  tasks: number;
}

interface AgentHealthPanelProps {
  title?: string;
  activeAgents: number;
  runningAutomations: number;
  errorCount: number;
  completionRate: string;
  agents: Agent[];
}

export default function AgentHealthPanel({
  title = 'Agent & Workflow Health',
  activeAgents,
  runningAutomations,
  errorCount,
  completionRate,
  agents,
}: AgentHealthPanelProps) {
  const summary = [
    { label: 'Active Agents', value: String(activeAgents), color: BLUE_PRIMARY, icon: 'brain' },
    { label: 'Running', value: String(runningAutomations), color: BLUE_PRIMARY, icon: 'arrows' },
    { label: 'Errors', value: String(errorCount), color: '#f87171', icon: 'error-filled' },
  ];

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{ background: SURFACE_CARD, border: `1px solid ${BORDER_DEFAULT}` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PIcon name="brain" size="small" color="inherit" theme="dark" aria={{ 'aria-label': 'agents' }} style={{ color: BLUE_PRIMARY }} />
          <PText size="medium" weight="semi-bold" theme="dark" color="primary">
            {title}
          </PText>
        </div>
        <div className="flex items-center gap-2">
          <PText size="xx-small" theme="dark" color="contrast-medium">Completion Rate</PText>
          <span style={{ fontSize: 15, fontWeight: 700, color: BLUE_PRIMARY }}>{completionRate}</span>
        </div>
      </div>

      {/* Summary grid */}
      <div className="grid grid-cols-3 gap-3">
        {summary.map(({ label, value, color, icon }) => (
          <div
            key={label}
            className="rounded-xl p-3 flex flex-col gap-1 items-center"
            style={{ background: SURFACE_RAISED, border: `1px solid ${BORDER_SUBTLE}`, textAlign: 'center' }}
          >
            <PIcon name={icon as any} size="x-small" color="inherit" theme="dark" aria={{ 'aria-label': label }} style={{ color }} />
            <span style={{ fontSize: 20, fontWeight: 700, color }}>{value}</span>
            <PText size="xx-small" theme="dark" color="contrast-medium">{label}</PText>
          </div>
        ))}
      </div>

      {/* Agent list */}
      <div className="flex flex-col gap-2">
        <PText size="xx-small" theme="dark" color="contrast-medium" style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Agent Registry
        </PText>
        {agents.map((agent) => (
          <div
            key={agent.name}
            className="rounded-xl p-3 flex items-center gap-3"
            style={{ background: SURFACE_RAISED, border: `1px solid ${BORDER_SUBTLE}` }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.12)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = BORDER_SUBTLE)}
          >
            <div
              className="rounded-full flex-shrink-0"
              style={{
                width: 7,
                height: 7,
                background: agent.status === 'active' ? BLUE_PRIMARY : 'rgba(255,255,255,0.18)',
              }}
            />
            <PText size="x-small" theme="dark" color="primary" style={{ flex: 1 }}>
              {agent.name}
            </PText>
            <div
              className="rounded-full px-2 py-0.5"
              style={{
                background: agent.status === 'active' ? 'rgba(44,194,238,0.08)' : 'rgba(255,255,255,0.04)',
                border: agent.status === 'active' ? `1px solid rgba(44,194,238,0.18)` : `1px solid ${BORDER_SUBTLE}`,
              }}
            >
              <PText size="xx-small" theme="dark" color="inherit" style={{ color: agent.status === 'active' ? BLUE_PRIMARY : 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
                {agent.status}
              </PText>
            </div>
            {agent.tasks > 0 && (
              <PText size="xx-small" theme="dark" color="contrast-medium">
                {agent.tasks} tasks
              </PText>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
