import { useEffect, useState } from 'react';
import { PIcon, PText } from '@porsche-design-system/components-react';
import { BLUE_GRADIENT, BLUE_PRIMARY, BORDER_DEFAULT, SURFACE_RAISED } from '../theme';

interface RightSidebarProps {
  expanded: boolean;
  onToggle: () => void;
}

const assistantMessages = [
  {
    role: 'assistant',
    text: 'Ready to help with monitor alerts, publishing tasks, and workflow checks.',
  },
  {
    role: 'user',
    text: 'Show me what needs attention today.',
  },
  {
    role: 'assistant',
    text: 'Server load is stable. Two campaign automations are ready for review.',
  },
];

const COLLAPSED_WIDTH = 60;
const DEFAULT_EXPANDED_WIDTH = 228;
const MIN_EXPANDED_WIDTH = 220;
const MAX_EXPANDED_WIDTH = 520;

function clampWidth(value: number) {
  return Math.min(MAX_EXPANDED_WIDTH, Math.max(MIN_EXPANDED_WIDTH, value));
}

export default function RightSidebar({ expanded, onToggle }: RightSidebarProps) {
  const [expandedWidth, setExpandedWidth] = useState(DEFAULT_EXPANDED_WIDTH);
  const [resizing, setResizing] = useState(false);

  useEffect(() => {
    if (!resizing) return;

    const handleMouseMove = (event: MouseEvent) => {
      setExpandedWidth(clampWidth(window.innerWidth - event.clientX));
    };

    const handleMouseUp = () => {
      setResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [resizing]);

  return (
    <aside
      className="flex flex-col h-full transition-all duration-300"
      style={{
        width: expanded ? expandedWidth : COLLAPSED_WIDTH,
        flexShrink: 0,
        background: '#0d0d12',
        borderLeft: `1px solid ${BORDER_DEFAULT}`,
        position: 'relative',
        transitionProperty: resizing ? 'none' : undefined,
      }}
    >
      {expanded && (
        <button
          type="button"
          aria-label="Resize AI chat sidebar"
          onMouseDown={(event) => {
            event.preventDefault();
            setResizing(true);
          }}
          style={{
            position: 'absolute',
            left: -4,
            top: 0,
            width: 8,
            height: '100%',
            border: 'none',
            background: 'transparent',
            cursor: 'col-resize',
            zIndex: 5,
          }}
        />
      )}

      <div
        className="flex items-center flex-shrink-0"
        style={{
          minHeight: 64,
          padding: expanded ? '12px 14px' : '12px 10px',
          justifyContent: expanded ? 'space-between' : 'center',
          borderBottom: expanded ? `1px solid ${BORDER_DEFAULT}` : '1px solid transparent',
        }}
      >
        {expanded && (
          <div className="min-w-0">
            <PText size="small" weight="semi-bold" theme="dark" color="primary">
              AI Chat
            </PText>
          </div>
        )}

        <button
          onClick={onToggle}
          className="hub-tooltip flex items-center justify-center rounded-xl"
          data-tooltip={expanded ? 'Close chat' : 'AI Chat'}
          data-tooltip-side="left"
          style={{
            width: 38,
            height: 38,
            background: expanded ? BLUE_GRADIENT : SURFACE_RAISED,
            border: `1px solid ${expanded ? 'rgba(255,255,255,0.18)' : BORDER_DEFAULT}`,
            cursor: 'pointer',
            flexShrink: 0,
          }}
          aria-label={expanded ? 'Close AI chat' : 'Open AI chat'}
        >
          <PIcon name={'chat' as never} size="small" color="primary" theme="dark" aria={{ 'aria-label': 'AI chat' }} style={{ color: '#fff' }} />
        </button>
      </div>

      {expanded && (
        <>
          <div className="flex-1 min-h-0 px-3 py-4 overflow-y-auto">
            <div className="flex flex-col gap-3">
              {assistantMessages.map((message, index) => {
                const isUser = message.role === 'user';
                return (
                  <div
                    key={`${message.role}-${index}`}
                    className="rounded-xl"
                    style={{
                      alignSelf: isUser ? 'flex-end' : 'flex-start',
                      maxWidth: isUser ? '88%' : '94%',
                      padding: isUser ? '9px 10px' : '0 2px',
                      background: isUser ? SURFACE_RAISED : 'transparent',
                      border: isUser ? `1px solid ${BORDER_DEFAULT}` : '1px solid transparent',
                    }}
                  >
                    <PText size="xx-small" theme="dark" color="contrast-medium" style={{ lineHeight: 1.35 }}>
                      {message.text}
                    </PText>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3" style={{ borderTop: `1px solid ${BORDER_DEFAULT}` }}>
            <div
              className="flex items-center gap-2 rounded-xl"
              style={{
                background: SURFACE_RAISED,
                border: `1px solid ${BORDER_DEFAULT}`,
                padding: '7px 8px',
              }}
            >
              <input
                aria-label="AI chat message"
                placeholder="Ask the HUB..."
                style={{
                  flex: 1,
                  minWidth: 0,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'rgba(241, 245, 249, 0.72)',
                  fontSize: 12,
                }}
              />
              <button
                className="hub-tooltip flex items-center justify-center rounded-lg"
                data-tooltip="Send message"
                data-tooltip-side="top"
                style={{
                  width: 30,
                  height: 30,
                  background: BLUE_PRIMARY,
                  border: 'none',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
                aria-label="Send message"
              >
                <PIcon name={'send' as never} size="x-small" color="primary" theme="dark" aria={{ 'aria-label': 'send message' }} style={{ color: '#071016' }} />
              </button>
            </div>
          </div>
        </>
      )}
    </aside>
  );
}
