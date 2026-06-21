import { PTag, PButton, PText, PIcon } from '@porsche-design-system/components-react';
import { BLUE_PRIMARY, BLUE_SECONDARY, SURFACE_CARD, SURFACE_RAISED, BORDER_SUBTLE, BORDER_DEFAULT } from '../theme';

interface Step {
  label: string;
  done: boolean;
}

interface CreativeGenerationPanelProps {
  requestedBy: string;
  campaign: string;
  creativesRequested: number;
  style: string;
  platform: string;
  status: string;
  progress: number;
  steps: Step[];
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, 'success' | 'warning' | 'info' | 'error'> = {
    Running: 'info',
    Queued: 'warning',
    Completed: 'success',
    Failed: 'error',
  };
  return <PTag variant={map[status] ?? 'info'} theme="dark" compact>{status}</PTag>;
}

function ThumbnailStrip({ count, progress }: { count: number; progress: number }) {
  return (
    <div className="flex gap-2 mt-2">
      {Array.from({ length: count }).map((_, i) => {
        const isDone = i < Math.floor((progress / 100) * count);
        const isActive = !isDone && i === Math.floor((progress / 100) * count);
        return (
          <div
            key={i}
            className="rounded-lg flex items-center justify-center flex-1"
            style={{
              aspectRatio: '1 / 1.25',
              background: isDone ? `rgba(44,194,238,0.07)` : SURFACE_RAISED,
              border: `1px solid ${isDone ? `rgba(44,194,238,0.18)` : BORDER_SUBTLE}`,
              minHeight: 48,
            }}
          >
            {isDone && (
              <PIcon name="check" size="x-small" color="inherit" theme="dark" aria={{ 'aria-label': 'done' }} style={{ color: BLUE_PRIMARY }} />
            )}
            {isActive && (
              <div className="rounded-full" style={{ width: 5, height: 5, background: BLUE_PRIMARY, opacity: 0.7 }} />
            )}
            {!isDone && !isActive && (
              <PIcon name="image" size="x-small" color="contrast-medium" theme="dark" aria={{ 'aria-label': 'placeholder' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function CreativeGenerationPanel({
  requestedBy, campaign, creativesRequested, style, platform, status, progress, steps,
}: CreativeGenerationPanelProps) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{ background: SURFACE_CARD, border: `1px solid ${BORDER_DEFAULT}` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${BLUE_PRIMARY}, ${BLUE_SECONDARY})` }}
          >
            <PIcon name="ai-image" size="small" color="inherit" theme="dark" aria={{ 'aria-label': 'creative generation' }} style={{ color: '#fff' }} />
          </div>
          <div>
            <PText size="medium" weight="semi-bold" theme="dark" color="primary">Creative Generation</PText>
            <PText size="xx-small" theme="dark" color="contrast-medium">by {requestedBy}</PText>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Meta */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'Campaign', value: campaign },
          { label: 'Creatives', value: `${creativesRequested} assets` },
          { label: 'Style', value: style },
          { label: 'Platform', value: platform },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl p-3" style={{ background: SURFACE_RAISED, border: `1px solid ${BORDER_SUBTLE}` }}>
            <PText size="xx-small" theme="dark" color="contrast-medium" style={{ marginBottom: 2 }}>{label}</PText>
            <PText size="x-small" weight="semi-bold" theme="dark" color="primary">{value}</PText>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <PText size="xx-small" theme="dark" color="contrast-medium">Progress</PText>
          <span style={{ fontSize: 12, fontWeight: 600, color: BLUE_PRIMARY }}>{progress}%</span>
        </div>
        <div className="rounded-full overflow-hidden" style={{ height: 3, background: SURFACE_RAISED }}>
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${BLUE_PRIMARY}, ${BLUE_SECONDARY})`,
              borderRadius: 4,
              transition: 'width 0.6s ease',
            }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-1.5">
        {steps.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <div
              className="rounded-full flex-shrink-0 flex items-center justify-center"
              style={{
                width: 15, height: 15,
                background: s.done ? `rgba(44,194,238,0.1)` : SURFACE_RAISED,
                border: s.done ? `1px solid rgba(44,194,238,0.25)` : `1px solid ${BORDER_SUBTLE}`,
              }}
            >
              {s.done && <PIcon name="check" size="x-small" color="inherit" theme="dark" aria={{ 'aria-label': 'done' }} style={{ color: BLUE_PRIMARY, width: 9, height: 9 }} />}
            </div>
            <PText size="xx-small" theme="dark" color={s.done ? 'contrast-high' : 'contrast-medium'}>{s.label}</PText>
          </div>
        ))}
      </div>

      <ThumbnailStrip count={creativesRequested} progress={progress} />

      {/* CTA */}
      <div className="flex gap-2 pt-1">
        <PButton variant="ghost" compact theme="dark" icon="external">View Details</PButton>
        <PButton variant="secondary" compact theme="dark" icon="image">Open Assets</PButton>
      </div>
    </div>
  );
}
