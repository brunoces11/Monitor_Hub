import { PIcon, PButton, PText } from '@porsche-design-system/components-react';
import { SURFACE_RAISED, BORDER_DEFAULT } from '../theme';

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
      <div className="flex-1" />

      <div
        className="flex items-center gap-1.5 rounded-lg px-3 py-2"
        style={{ background: SURFACE_RAISED, border: `1px solid ${BORDER_DEFAULT}` }}
      >
        <PIcon name="clock" size="x-small" color="contrast-medium" theme="dark" aria={{ 'aria-label': 'time' }} />
        <PText size="xx-small" theme="dark" color="contrast-medium">
          {dateStr} - {timeStr}
        </PText>
      </div>

      <PButton variant="secondary" icon="add" compact theme="dark">
        New Workflow
      </PButton>
      <PButton variant="primary" icon="ai-spark" compact theme="dark">
        Run Automation
      </PButton>
    </header>
  );
}
