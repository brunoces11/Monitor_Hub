import { PTag, PButton, PText, PIcon } from '@porsche-design-system/components-react';
import { BLUE_PRIMARY, BLUE_SECONDARY, SURFACE_CARD, SURFACE_RAISED, BORDER_SUBTLE, BORDER_DEFAULT } from '../theme';

interface Step {
  label: string;
  done: boolean;
}

interface VideoAnimationsPanelProps {
  requestedBy: string;
  project: string;
  variations: number;
  duration: string;
  aspectRatio: string;
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

function VideoThumbnailStrip({ count }: { count: number }) {
  return (
    <div className="flex gap-2 mt-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl flex items-center justify-center relative flex-1 overflow-hidden"
          style={{
            aspectRatio: '9/16',
            background: SURFACE_RAISED,
            border: `1px solid ${BORDER_SUBTLE}`,
            minHeight: 80,
          }}
        >
          <PIcon name="ai-video" size="small" color="contrast-medium" theme="dark" aria={{ 'aria-label': 'video preview' }} />
          <div
            className="absolute bottom-2 left-2 right-2 rounded-full"
            style={{ height: 2, background: BORDER_SUBTLE }}
          />
        </div>
      ))}
    </div>
  );
}

export default function VideoAnimationsPanel({
  requestedBy, project, variations, duration, aspectRatio, status, progress, steps,
}: VideoAnimationsPanelProps) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4 h-full"
      style={{ background: SURFACE_CARD, border: `1px solid ${BORDER_DEFAULT}` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${BLUE_SECONDARY}, ${BLUE_PRIMARY})` }}
          >
            <PIcon name="ai-video" size="small" color="inherit" theme="dark" aria={{ 'aria-label': 'video animations' }} style={{ color: '#fff' }} />
          </div>
          <div>
            <PText size="medium" weight="semi-bold" theme="dark" color="primary">Video Animations</PText>
            <PText size="xx-small" theme="dark" color="contrast-medium">by {requestedBy}</PText>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Meta grid */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'Project', value: project },
          { label: 'Variations', value: `${variations} clips` },
          { label: 'Duration', value: duration },
          { label: 'Aspect Ratio', value: aspectRatio },
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
          <span style={{ fontSize: 12, fontWeight: 600, color: BLUE_SECONDARY }}>
            {status === 'Queued' ? 'In Queue' : `${progress}%`}
          </span>
        </div>
        <div className="rounded-full overflow-hidden" style={{ height: 3, background: SURFACE_RAISED }}>
          {status === 'Queued' ? (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: `repeating-linear-gradient(90deg, rgba(90,118,241,0.2) 0px, rgba(90,118,241,0.2) 8px, transparent 8px, transparent 16px)`,
                borderRadius: 9999,
              }}
            />
          ) : (
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${BLUE_SECONDARY}, ${BLUE_PRIMARY})`,
                borderRadius: 9999,
                transition: 'width 0.6s ease',
              }}
            />
          )}
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

      <VideoThumbnailStrip count={variations} />

      {/* CTA */}
      <div className="flex gap-2 mt-auto pt-1">
        <PButton variant="ghost" compact theme="dark" icon="external">View Details</PButton>
        <PButton variant="secondary" compact theme="dark" icon="ai-video">Preview</PButton>
      </div>
    </div>
  );
}
