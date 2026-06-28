import { useEffect, useRef, useState } from 'react';
import { PIcon, PText } from '@porsche-design-system/components-react';
import { BLUE_GRADIENT, BLUE_PRIMARY, BORDER_DEFAULT, SURFACE_RAISED } from '../theme';

interface RightSidebarProps {
  expanded: boolean;
  onToggle: () => void;
  activeAgentName?: string | null;
}

type ChatRole = 'assistant' | 'user';

type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
};

const RIGHT_CHAT_STORAGE_KEY = 'monitor-hub-right-sidebar-chat';

const defaultChatMessages: ChatMessage[] = [
  {
    id: 'welcome-assistant',
    role: 'assistant',
    text: 'Ready to help with monitor alerts, publishing tasks, and workflow checks.',
  },
];

const COLLAPSED_WIDTH = 60;
const DEFAULT_EXPANDED_WIDTH = 390;
const MIN_EXPANDED_WIDTH = 380;
const MAX_EXPANDED_WIDTH = 760;

function readPersistedChatMessages(): ChatMessage[] {
  if (typeof window === 'undefined') return defaultChatMessages;

  try {
    const rawValue = window.localStorage.getItem(RIGHT_CHAT_STORAGE_KEY);
    if (!rawValue) return defaultChatMessages;

    const parsedValue = JSON.parse(rawValue) as unknown;
    if (!Array.isArray(parsedValue)) return defaultChatMessages;

    const messages = parsedValue.filter((item): item is ChatMessage => {
      return Boolean(
        item &&
          typeof item === 'object' &&
          'id' in item &&
          'role' in item &&
          'text' in item &&
          typeof (item as ChatMessage).id === 'string' &&
          ((item as ChatMessage).role === 'assistant' || (item as ChatMessage).role === 'user') &&
          typeof (item as ChatMessage).text === 'string',
      );
    });

    return messages.length > 0 ? messages : defaultChatMessages;
  } catch {
    return defaultChatMessages;
  }
}

function buildAssistantReply(userText: string, activeAgentName?: string | null) {
  const normalizedText = userText.toLowerCase();
  const agentLabel = activeAgentName ? `${activeAgentName} ` : '';

  if (normalizedText.includes('status') || normalizedText.includes('today')) {
    return `I checked the current ${agentLabel}signals. The workspace looks stable, and the most relevant items are ready for review.`;
  }

  if (normalizedText.includes('email') || normalizedText.includes('inbox')) {
    return 'I can help triage the inbox. I would start by grouping urgent threads, labeling client requests, and drafting replies for the highest-priority messages.';
  }

  if (normalizedText.includes('graph') || normalizedText.includes('memory')) {
    return 'For the memory graph, I can identify the connected nodes, compress the relations, and surface the most relevant links first.';
  }

  if (normalizedText.includes('campaign') || normalizedText.includes('lead')) {
    return 'I can review the campaign flow and lead signals, then summarize what is active, what is blocked, and what should be prioritized next.';
  }

  return `I can help with that. If you want, I can break it into a short action plan or summarize the next step for ${activeAgentName ? activeAgentName : 'the workspace'}.`;
}

export default function RightSidebar({ expanded, onToggle, activeAgentName }: RightSidebarProps) {
  const [draftMessage, setDraftMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(readPersistedChatMessages);
  const [expandedWidth, setExpandedWidth] = useState(DEFAULT_EXPANDED_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const replyTimerRef = useRef<number | null>(null);
  const wasExpandedRef = useRef(expanded);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.localStorage.setItem(RIGHT_CHAT_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [expanded, messages]);

  useEffect(() => {
    if (expanded && !wasExpandedRef.current) {
      setExpandedWidth(DEFAULT_EXPANDED_WIDTH);
    }

    wasExpandedRef.current = expanded;
  }, [expanded]);

  useEffect(() => {
    return () => {
      if (replyTimerRef.current !== null) {
        window.clearTimeout(replyTimerRef.current);
      }
    };
  }, []);

  const handleSendMessage = () => {
    const text = draftMessage.trim();
    if (!text) return;

    if (replyTimerRef.current !== null) {
      window.clearTimeout(replyTimerRef.current);
      replyTimerRef.current = null;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
    };

    setMessages((current) => [...current, userMessage]);
    setDraftMessage('');

      replyTimerRef.current = window.setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: buildAssistantReply(text, activeAgentName),
      };

      setMessages((current) => [...current, assistantMessage]);
      replyTimerRef.current = null;
    }, 650);
  };

  const handleResizePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsResizing(true);
  };

  const handleResizePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!isResizing) return;

    const nextWidth = window.innerWidth - event.clientX;
    setExpandedWidth(Math.min(MAX_EXPANDED_WIDTH, Math.max(MIN_EXPANDED_WIDTH, nextWidth)));
  };

  const handleResizePointerEnd = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!isResizing) return;

    event.currentTarget.releasePointerCapture(event.pointerId);
    setIsResizing(false);
  };

  const sidebarWidth = expanded ? expandedWidth : COLLAPSED_WIDTH;

  return (
    <aside
      className="flex flex-col h-full"
      style={{
        width: sidebarWidth,
        minWidth: sidebarWidth,
        maxWidth: sidebarWidth,
        flexBasis: sidebarWidth,
        flexShrink: 0,
        background: '#0d0d12',
        borderLeft: `1px solid ${BORDER_DEFAULT}`,
        position: 'relative',
        transition: isResizing ? 'none' : 'width 300ms ease, min-width 300ms ease, max-width 300ms ease, flex-basis 300ms ease',
      }}
    >
      {expanded && (
        <button
          type="button"
          aria-label="Resize AI chat sidebar"
          onPointerDown={handleResizePointerDown}
          onPointerMove={handleResizePointerMove}
          onPointerUp={handleResizePointerEnd}
          onPointerCancel={handleResizePointerEnd}
          className="hub-tooltip"
          data-tooltip="Resize chat"
          data-tooltip-side="left"
          style={{
            position: 'absolute',
            left: -4,
            top: 0,
            width: 8,
            height: '100%',
            padding: 0,
            border: 'none',
            background: isResizing ? 'rgba(44,194,238,0.18)' : 'transparent',
            cursor: 'col-resize',
            zIndex: 10,
            touchAction: 'none',
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
              {messages.map((message) => {
                const isUser = message.role === 'user';
                return (
                  <div
                    key={message.id}
                    className="flex items-end gap-2"
                    style={{
                      alignSelf: isUser ? 'flex-end' : 'flex-start',
                      maxWidth: '94%',
                      flexDirection: isUser ? 'row-reverse' : 'row',
                    }}
                  >
                    {!isUser && (
                      <div
                        className="rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
                        style={{
                          width: 28,
                          height: 28,
                          padding: 2,
                          background: SURFACE_RAISED,
                          border: `1px solid ${BORDER_DEFAULT}`,
                        }}
                        aria-label="AI agent avatar"
                      >
                        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
                          <rect x="6.25" y="5" width="11.5" height="12" rx="4.4" fill="none" stroke="#fff" strokeWidth="1.5" />
                          <circle cx="9.6" cy="10.5" r="1" fill="#fff" />
                          <circle cx="14.4" cy="10.5" r="1" fill="#fff" />
                          <path d="M9.2 13.2c.9.75 1.9 1.1 2.8 1.1s1.9-.35 2.8-1.1" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                          <path d="M12 3.2v2.3" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                          <circle cx="12" cy="2.3" r="1" fill="#fff" />
                        </svg>
                      </div>
                    )}
                    {isUser && (
                      <div
                        className="rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
                        style={{
                          width: 40,
                          height: 40,
                          background: SURFACE_RAISED,
                          border: `1px solid ${BORDER_DEFAULT}`,
                        }}
                        aria-label="Joana avatar"
                      >
                        <img
                          src="/avatars/joana_48.jpg"
                          alt="Joana"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    <div
                      className="rounded-xl"
                      style={{
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
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
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
              <button
                className="flex items-center justify-center rounded-lg flex-shrink-0"
                style={{
                  width: 28,
                  height: 28,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
                aria-label="Attach files"
              >
                <PIcon name="attachment" size="x-small" color="contrast-medium" theme="dark" aria={{ 'aria-label': 'attach files' }} />
              </button>
              <input
                aria-label="AI chat message"
                placeholder={activeAgentName ? `Message ${activeAgentName}...` : 'Ask the HUB...'}
                value={draftMessage}
                onChange={(event) => setDraftMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleSendMessage();
                  }
                }}
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
              {activeAgentName && (
                <span
                  className="rounded-full flex items-center"
                  style={{
                    padding: '4px 8px',
                    background: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${BORDER_DEFAULT}`,
                    color: 'rgba(241,245,249,0.72)',
                    fontSize: 10,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {activeAgentName}
                </span>
              )}
              <button
                className="hub-tooltip flex items-center justify-center rounded-lg"
                data-tooltip="Send message"
                data-tooltip-side="top"
                type="button"
                onClick={handleSendMessage}
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
