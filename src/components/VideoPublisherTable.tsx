import { useState } from 'react';
import { PIcon, PText } from '@porsche-design-system/components-react';
import { BLUE_PRIMARY, BLUE_SECONDARY, SURFACE_CARD, SURFACE_RAISED, BORDER_DEFAULT, BORDER_SUBTLE } from '../theme';

type Platform = 'youtube' | 'twitter' | 'linkedin' | 'facebook' | 'instagram';
type EditableField = 'title' | 'description' | 'tags';

type VideoItem = {
  id: number;
  name: string;
  title: string;
  description: string;
  tags: string[];
  hasThumb: boolean;
  date: string;
  status: 'Scheduled' | 'Published' | 'Draft';
  platforms: Platform[];
};

type EditState = {
  itemId: number;
  field: EditableField;
  value: string;
} | null;

const initialVideos: VideoItem[] = [
  {
    id: 1,
    name: 'PMT_LOVABLE_01',
    title: 'Lovable Introduction: Build faster product experiences with AI',
    description: 'Short intro video showing how Lovable helps teams prototype, iterate, and publish product ideas quickly.',
    tags: ['lovable', 'ai-builder', 'product-demo'],
    hasThumb: true,
    date: 'Jun 24',
    status: 'Scheduled',
    platforms: ['youtube', 'linkedin', 'facebook'],
  },
  {
    id: 2,
    name: 'PMT_LOVABLE_02',
    title: 'Lovable Workflow Overview for marketing operations',
    description: 'A concise walkthrough for turning campaign notes into a polished landing page and launch-ready assets.',
    tags: ['workflow', 'automation', 'launch'],
    hasThumb: true,
    date: 'Jun 28',
    status: 'Draft',
    platforms: ['instagram'],
  },
];

const socialColumns: Array<{ key: Platform; icon: string; label: string }> = [
  { key: 'youtube', icon: 'logo-youtube', label: 'YouTube' },
  { key: 'twitter', icon: 'logo-x', label: 'Twitter' },
  { key: 'linkedin', icon: 'logo-linkedin', label: 'LinkedIn' },
  { key: 'facebook', icon: 'logo-facebook', label: 'Facebook' },
  { key: 'instagram', icon: 'logo-instagram', label: 'Instagram' },
];

const statusColors: Record<VideoItem['status'], string> = {
  Scheduled: BLUE_PRIMARY,
  Published: '#4ADE80',
  Draft: 'rgba(255,255,255,0.48)',
};

function EllipsisButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="rounded-md flex items-center justify-center"
      style={{
        width: 24,
        height: 22,
        background: 'rgba(255,255,255,0.06)',
        border: `1px solid ${BORDER_SUBTLE}`,
        color: 'rgba(255,255,255,0.58)',
        cursor: 'pointer',
        flexShrink: 0,
        fontSize: 13,
        fontWeight: 700,
        lineHeight: 1,
      }}
      aria-label={label}
    >
      ...
    </button>
  );
}

function StaticCalendar({
  selectedDate,
  onClose,
  onSelectDate,
}: {
  selectedDate: string;
  onClose: () => void;
  onSelectDate: (date: string) => void;
}) {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const dates = Array.from({ length: 30 }, (_, index) => index + 1);
  const selectedDay = Number(selectedDate.replace('Jun ', ''));

  return (
    <>
      <button
        aria-label="Close calendar"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 24,
          background: 'transparent',
          border: 'none',
          cursor: 'default',
        }}
      />
      <div
        className="absolute left-0 top-full mt-2 rounded-xl p-3"
        style={{
        width: 220,
          background: SURFACE_RAISED,
          border: `1px solid ${BORDER_DEFAULT}`,
          boxShadow: '0 16px 34px rgba(0,0,0,0.32)',
          zIndex: 25,
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <PText size="xx-small" weight="semi-bold" theme="dark" color="primary">
            June 2026
          </PText>
          <button
            className="rounded-md flex items-center justify-center"
            onClick={onClose}
            style={{
              width: 20,
              height: 20,
              background: 'rgba(255,255,255,0.06)',
              border: `1px solid ${BORDER_SUBTLE}`,
              color: 'rgba(255,255,255,0.62)',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 700,
              lineHeight: 1,
            }}
            aria-label="Close calendar"
          >
            X
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-1">
          {days.map((day, index) => (
            <span key={`${day}-${index}`} style={{ color: 'rgba(255,255,255,0.34)', fontSize: 10, textAlign: 'center' }}>
              {day}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {dates.map((date) => {
            const isSelected = date === selectedDay;

            return (
              <button
                key={date}
                className="rounded-md flex items-center justify-center"
                onClick={() => onSelectDate(`Jun ${date}`)}
                style={{
                  height: 24,
                  background: isSelected ? 'rgba(44,194,238,0.12)' : 'transparent',
                  border: isSelected ? `1px solid rgba(44,194,238,0.26)` : '1px solid transparent',
                  color: isSelected ? BLUE_PRIMARY : 'rgba(255,255,255,0.56)',
                  cursor: 'pointer',
                  fontSize: 10,
                }}
              >
                {date}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default function VideoPublisherTable() {
  const [videos, setVideos] = useState(initialVideos);
  const [editState, setEditState] = useState<EditState>(null);
  const [thumbItem, setThumbItem] = useState<VideoItem | null>(null);
  const [openCalendarId, setOpenCalendarId] = useState<number | null>(null);
  const [openStatusId, setOpenStatusId] = useState<number | null>(null);
  const [pendingStatusId, setPendingStatusId] = useState<number | null>(null);

  function openEdit(item: VideoItem, field: EditableField) {
    setEditState({
      itemId: item.id,
      field,
      value: field === 'tags' ? item.tags.join(', ') : item[field],
    });
  }

  function saveEdit() {
    if (!editState) return;

    setVideos((current) =>
      current.map((item) => {
        if (item.id !== editState.itemId) return item;
        if (editState.field === 'tags') {
          return {
            ...item,
            tags: editState.value
              .split(',')
              .map((tag) => tag.trim())
              .filter(Boolean),
          };
        }

        return { ...item, [editState.field]: editState.value };
      })
    );
    setEditState(null);
  }

  function togglePlatform(itemId: number, platform: Platform) {
    setVideos((current) =>
      current.map((item) => {
        if (item.id !== itemId) return item;
        const isActive = item.platforms.includes(platform);
        return {
          ...item,
          platforms: isActive ? item.platforms.filter((value) => value !== platform) : [...item.platforms, platform],
        };
      })
    );
  }

  function updateStatus(itemId: number, status: VideoItem['status']) {
    setOpenStatusId(null);
    setPendingStatusId(itemId);
    window.setTimeout(() => {
      setVideos((current) => current.map((item) => (item.id === itemId ? { ...item, status } : item)));
      setPendingStatusId((current) => (current === itemId ? null : current));
    }, 2000);
  }

  function updateDate(itemId: number, date: string) {
    setVideos((current) => current.map((item) => (item.id === itemId ? { ...item, date } : item)));
    setOpenCalendarId(null);
  }

  function deleteThumb(itemId: number) {
    setVideos((current) => current.map((item) => (item.id === itemId ? { ...item, hasThumb: false } : item)));
    setThumbItem(null);
  }

  function replaceThumb(itemId: number) {
    setVideos((current) => current.map((item) => (item.id === itemId ? { ...item, hasThumb: true } : item)));
  }

  return (
    <div>
        <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full flex-shrink-0" style={{ width: 2, height: 14, background: `linear-gradient(180deg, ${BLUE_PRIMARY}, ${BLUE_SECONDARY})` }} />
          <div>
            <PText size="medium" weight="semi-bold" theme="dark" color="primary">
              Video Publisher
            </PText>
            <PText size="xx-small" theme="dark" color="contrast-medium">
              2 videos ready for scheduling
            </PText>
          </div>
        </div>
      </div>

      <div style={{ overflowX: 'visible', overflowY: 'visible' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            tableLayout: 'fixed',
            fontSize: 11,
          }}
        >
          <colgroup>
            <col style={{ width: '12%', minWidth: 110 }} />
            <col style={{ width: '18%', minWidth: 160 }} />
            <col style={{ width: '24%', minWidth: 200 }} />
            <col style={{ width: '9%', minWidth: 92 }} />
            <col style={{ width: '5%', minWidth: 52 }} />
            <col style={{ width: '7%', minWidth: 78 }} />
            <col style={{ width: '1.5%', minWidth: 26 }} />
            <col style={{ width: '1.5%', minWidth: 26 }} />
            <col style={{ width: '1.5%', minWidth: 26 }} />
            <col style={{ width: '1.5%', minWidth: 26 }} />
            <col style={{ width: '1.5%', minWidth: 26 }} />
            <col style={{ width: '12.5%', minWidth: 112 }} />
          </colgroup>
          <thead>
            <tr>
              {['Name', 'Title', 'Description', 'Tags', 'Thumb', 'Date'].map((header) => (
                <th key={header} style={{ ...headerStyle, whiteSpace: 'normal' }}>
                  {header}
                </th>
              ))}
              {socialColumns.map((column) => (
                <th key={column.key} style={{ ...headerStyle, textAlign: 'center' }} aria-label={column.label}>
                  <div className="flex items-center justify-center">
                    <PIcon
                      name={column.icon as any}
                      size="x-small"
                      color="contrast-medium"
                      theme="dark"
                      aria={{ 'aria-label': column.label }}
                      style={{ transform: 'scale(0.8)' }}
                    />
                  </div>
                </th>
              ))}
              <th style={headerStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((item) => (
              <tr key={item.id}>
                <td style={cellStyle}>
                  <span style={{ color: 'rgba(255,255,255,0.82)', fontWeight: 700 }}>{item.name}</span>
                </td>
                <td style={cellStyle}>
                  <div className="flex items-center gap-2 min-w-0">
                    <span style={wrapStyle}>{item.title}</span>
                    <EllipsisButton onClick={() => openEdit(item, 'title')} label={`Edit ${item.name} title`} />
                  </div>
                </td>
                <td style={cellStyle}>
                  <div className="flex items-center gap-2 min-w-0">
                    <span style={wrapStyle}>{item.description}</span>
                    <EllipsisButton onClick={() => openEdit(item, 'description')} label={`Edit ${item.name} description`} />
                  </div>
                </td>
                <td style={compactCellStyle}>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className="flex items-center gap-1 min-w-0" style={{ overflow: 'hidden' }}>
                      {item.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full"
                          style={tagPillStyle}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <EllipsisButton onClick={() => openEdit(item, 'tags')} label={`Edit ${item.name} tags`} />
                  </div>
                </td>
                <td style={{ ...cellStyle, textAlign: 'center' }}>
                  <button
                    className="rounded-lg inline-flex items-center justify-center"
                    style={{
                      width: 28,
                      height: 28,
                      background: 'rgba(44,194,238,0.08)',
                      border: `1px solid rgba(44,194,238,0.2)`,
                      cursor: 'pointer',
                    }}
                    onClick={() => setThumbItem(item)}
                    aria-label={`Open ${item.name} thumb`}
                  >
                    {item.hasThumb && <PIcon name="check" size="x-small" color="inherit" theme="dark" aria={{ 'aria-label': 'thumb assigned' }} style={{ color: BLUE_PRIMARY }} />}
                  </button>
                </td>
                <td style={compactCellStyle}>
                  <div className="relative">
                    <button
                      className="rounded-lg"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: `1px solid ${BORDER_SUBTLE}`,
                        color: 'rgba(255,255,255,0.72)',
                        cursor: 'pointer',
                        fontSize: 9.35,
                        padding: '3px 6px',
                      }}
                      onClick={() => setOpenCalendarId((current) => (current === item.id ? null : item.id))}
                    >
                      {item.date}
                    </button>
                    {openCalendarId === item.id && (
                      <StaticCalendar
                        selectedDate={item.date}
                        onClose={() => setOpenCalendarId(null)}
                        onSelectDate={(date) => updateDate(item.id, date)}
                      />
                    )}
                  </div>
                </td>
                {socialColumns.map((column) => (
                  <td key={column.key} style={{ ...cellStyle, textAlign: 'center' }}>
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={item.platforms.includes(column.key)}
                        onChange={() => togglePlatform(item.id, column.key)}
                        aria-label={`${item.name} ${column.label}`}
                        style={{ accentColor: BLUE_PRIMARY, cursor: 'pointer', transform: 'scale(0.85)' }}
                      />
                    </div>
                  </td>
                ))}
                <td style={cellStyle}>
                  <div className="relative">
                    <button
                      className="rounded-full px-2 py-1 flex items-center gap-1.5"
                      style={{
                        color: statusColors[item.status],
                        background: 'rgba(255,255,255,0.04)',
                        border: `1px solid ${BORDER_SUBTLE}`,
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontSize: 11,
                      }}
                      disabled={pendingStatusId === item.id}
                      onClick={() => setOpenStatusId((current) => (current === item.id ? null : item.id))}
                      aria-expanded={openStatusId === item.id}
                    >
                      {pendingStatusId === item.id ? (
                        <>
                          <span
                            className="inline-block"
                            style={{
                              width: 9,
                              height: 9,
                              borderRadius: 9999,
                              border: '1.5px solid rgba(255,255,255,0.24)',
                              borderTopColor: BLUE_PRIMARY,
                              animation: 'vp-spin 0.8s linear infinite',
                            }}
                          />
                          {item.status}
                        </>
                      ) : (
                        <>
                          {item.status}
                          <PIcon name="arrow-compact-down" size="x-small" color="contrast-medium" theme="dark" aria={{ 'aria-label': 'status options' }} />
                        </>
                      )}
                    </button>
                    {openStatusId === item.id && (
                      <>
                        <button
                          aria-label="Close status menu"
                          onClick={() => setOpenStatusId(null)}
                          style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 29,
                            background: 'transparent',
                            border: 'none',
                            cursor: 'default',
                          }}
                        />
                        <div
                          className="absolute right-0 top-full mt-2 rounded-xl p-2 flex flex-col gap-1"
                          style={{
                            width: 140,
                            background: SURFACE_RAISED,
                            border: `1px solid ${BORDER_DEFAULT}`,
                            boxShadow: '0 16px 34px rgba(0,0,0,0.32)',
                            zIndex: 30,
                          }}
                        >
                          {(
                            item.status === 'Published'
                              ? [{ label: 'Unpublish', value: 'Draft' as const }]
                              : [
                                  { label: 'Publish now', value: 'Published' as const },
                                  { label: 'Schedule', value: 'Scheduled' as const },
                                  { label: 'Draft', value: 'Draft' as const },
                                ]
                          ).map((option) => (
                            <button
                              key={option.label}
                              className="rounded-lg px-2 py-1.5 text-left"
                              style={{
                                background: item.status === option.value ? 'rgba(44,194,238,0.1)' : 'rgba(255,255,255,0.03)',
                                border: item.status === option.value ? `1px solid rgba(44,194,238,0.22)` : '1px solid transparent',
                                color: item.status === option.value ? BLUE_PRIMARY : 'rgba(255,255,255,0.68)',
                                cursor: 'pointer',
                                fontSize: 11,
                                fontWeight: 700,
                              }}
                              onClick={() => updateStatus(item.id, option.value)}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editState && (
        <div style={overlayStyle}>
          <div className="rounded-2xl p-5" style={modalStyle}>
            <PText size="medium" weight="semi-bold" theme="dark" color="primary">
              Edit {editState.field}
            </PText>
            <textarea
              value={editState.value}
              onChange={(event) => setEditState({ ...editState, value: event.target.value })}
              style={{
                width: '100%',
                minHeight: 180,
                marginTop: 14,
                background: SURFACE_RAISED,
                border: `1px solid ${BORDER_DEFAULT}`,
                borderRadius: 7,
                color: '#f1f5f9',
                outline: 'none',
                padding: 12,
                resize: 'vertical',
                fontSize: 13,
                lineHeight: 1.5,
              }}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button style={secondaryButtonStyle} onClick={() => setEditState(null)}>
                Cancel
              </button>
              <button style={primaryButtonStyle} onClick={saveEdit}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {thumbItem && (
        <div style={overlayStyle}>
          <div className="rounded-2xl p-5" style={{ ...modalStyle, width: 520 }}>
            <PText size="medium" weight="semi-bold" theme="dark" color="primary">
              Thumb - {thumbItem.name}
            </PText>
            <div
              className="rounded-xl mt-4 flex items-center justify-center"
              style={{
                height: 250,
                background: `linear-gradient(135deg, rgba(44,194,238,0.18), rgba(90,118,241,0.18)), ${SURFACE_RAISED}`,
                border: `1px solid ${BORDER_DEFAULT}`,
              }}
            >
              <div className="text-center">
                <PIcon name="image" size="large" color="inherit" theme="dark" aria={{ 'aria-label': 'thumb preview' }} style={{ color: BLUE_PRIMARY }} />
                <PText size="small" weight="semi-bold" theme="dark" color="primary">
                  Lovable video thumb preview
                </PText>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button style={secondaryButtonStyle} onClick={() => replaceThumb(thumbItem.id)}>
                Replace
              </button>
              <button style={secondaryButtonStyle} onClick={() => deleteThumb(thumbItem.id)}>
                Delete
              </button>
              <button style={primaryButtonStyle} onClick={() => setThumbItem(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const headerStyle: React.CSSProperties = {
  color: 'rgba(255,255,255,0.46)',
  fontWeight: 700,
  textAlign: 'left',
  padding: '8px 10px',
  borderBottom: `1px solid ${BORDER_DEFAULT}`,
  whiteSpace: 'nowrap',
};

const cellStyle: React.CSSProperties = {
  padding: '9px 10px',
  borderBottom: `1px solid ${BORDER_SUBTLE}`,
  verticalAlign: 'middle',
  whiteSpace: 'normal',
  wordBreak: 'break-word',
};

const compactCellStyle: React.CSSProperties = {
  ...cellStyle,
  padding: '5px 6px',
};

const tagPillStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: `1px solid ${BORDER_SUBTLE}`,
  color: 'rgba(255,255,255,0.58)',
  fontSize: 9.35,
  lineHeight: 1.1,
  padding: '2px 5px',
  whiteSpace: 'nowrap',
};

const wrapStyle: React.CSSProperties = {
  color: 'rgba(255,255,255,0.72)',
  whiteSpace: 'normal',
  overflowWrap: 'anywhere',
  minWidth: 0,
  lineHeight: 1.2,
};

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.58)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100,
};

const modalStyle: React.CSSProperties = {
  width: 640,
  maxWidth: 'calc(100vw - 48px)',
  background: SURFACE_CARD,
  border: `1px solid ${BORDER_DEFAULT}`,
  boxShadow: '0 24px 60px rgba(0,0,0,0.46)',
};

const primaryButtonStyle: React.CSSProperties = {
  background: `linear-gradient(135deg, ${BLUE_PRIMARY}, ${BLUE_SECONDARY})`,
  border: 'none',
  borderRadius: 6,
  color: '#fff',
  cursor: 'pointer',
  fontWeight: 700,
  padding: '8px 14px',
};

const secondaryButtonStyle: React.CSSProperties = {
  background: SURFACE_RAISED,
  border: `1px solid ${BORDER_DEFAULT}`,
  borderRadius: 6,
  color: 'rgba(255,255,255,0.72)',
  cursor: 'pointer',
  fontWeight: 700,
  padding: '8px 14px',
};
