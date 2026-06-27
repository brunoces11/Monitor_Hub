import { useState } from 'react';
import { PText } from '@porsche-design-system/components-react';
import { BLUE_PRIMARY, BORDER_DEFAULT, BORDER_SUBTLE, SURFACE_CARD, SURFACE_RAISED } from '../theme';

type Participant = {
  name: string;
  avatar?: string;
  initials?: string;
  color?: string;
};

type TranscriptionTask = {
  task: string;
  owner: string;
};

export type MeetingTranscription = {
  id: string;
  day: string;
  month: string;
  title: string;
  participants: Participant[];
  keyPoints: string[];
  tasks: TranscriptionTask[];
};

interface TranscriptionCardProps {
  meeting: MeetingTranscription;
  onOpenChat?: (meeting: MeetingTranscription) => void;
}

function getParticipantInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function ParticipantAvatar({ participant, size = 28 }: { participant: Participant; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
      title={participant.name}
      style={{
        width: size,
        height: size,
        background: participant.avatar ? '#FFFFFF' : (participant.color || '#FFFFFF'),
        border: '1px solid rgba(255,255,255,0.95)',
        boxShadow: '0 2px 6px rgba(0,0,0,0.22)',
        color: '#fff',
        fontSize: Math.max(8, Math.floor(size * 0.34)),
        fontWeight: 700,
      }}
    >
      {participant.avatar ? (
        <img src={participant.avatar} alt={participant.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        participant.initials || getParticipantInitials(participant.name)
      )}
    </div>
  );
}

export default function TranscriptionCard({ meeting, onOpenChat }: TranscriptionCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const participantByName = new Map(meeting.participants.map((participant) => [participant.name, participant]));
  const [titleSource, ...titleRest] = meeting.title.split(': ');
  const hasTitleSource = titleRest.length > 0;
  const titleBody = hasTitleSource ? titleRest.join(': ') : meeting.title;

  return (
    <section
      className="rounded-2xl p-4"
      style={{ background: SURFACE_CARD, border: `1px solid ${BORDER_DEFAULT}` }}
      aria-label={meeting.title}
    >
      <header className="grid items-center gap-4" style={{ gridTemplateColumns: '74px minmax(0, 1fr) auto' }}>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center justify-center" style={{ width: 42 }}>
            <span style={{ color: 'rgba(255,255,255,0.48)', fontSize: 20, fontWeight: 700, lineHeight: 1 }}>
              {meeting.day}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.32)', fontSize: 10, fontWeight: 800, lineHeight: 1.15 }}>
              {meeting.month}
            </span>
          </div>
          <div style={{ width: 1, height: 38, background: BORDER_DEFAULT }} />
        </div>

        <h3
          style={{
            margin: 0,
            color: 'rgba(255,255,255,0.86)',
            fontSize: 17,
            fontWeight: 650,
            lineHeight: 1.25,
            textAlign: 'left',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {hasTitleSource ? (
            <>
              <span style={{ color: BLUE_PRIMARY }}>{titleSource}</span>
              {': '}
              {titleBody}
            </>
          ) : (
            meeting.title
          )}
        </h3>

        <div className="flex items-center justify-end gap-3">
          <div className="flex items-center justify-end" aria-label={`${meeting.participants.length} participants`}>
            {meeting.participants.map((participant, index) => (
              <div
                key={participant.name}
                style={{
                  marginLeft: index === 0 ? 0 : -9,
                  zIndex: meeting.participants.length - index,
                }}
              >
                <ParticipantAvatar participant={participant} />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setIsExpanded((current) => !current)}
            aria-label={isExpanded ? 'Collapse transcription card' : 'Expand transcription card'}
            aria-expanded={isExpanded}
            style={collapseButtonStyle}
          >
            <span
              aria-hidden="true"
              style={{
                ...chevronStyle,
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          </button>
        </div>
      </header>

      {isExpanded ? (
        <div className="grid gap-4 mt-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: SURFACE_RAISED, border: `1px solid ${BORDER_SUBTLE}` }}>
          <PText size="xx-small" theme="dark" color="contrast-medium" style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Summary
          </PText>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.68)', fontSize: 12, lineHeight: 1.5 }}>
            The team aligned on launch readiness, finalized campaign handoff details, and confirmed the CRM cleanup path.
            The meeting also clarified the creative review status and the next reporting cadence for the upcoming Q3 push.
          </p>
          <PText size="xx-small" theme="dark" color="contrast-medium" style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Key Points
          </PText>
          <ul style={{ margin: 0, paddingLeft: 17, color: 'rgba(255,255,255,0.68)', fontSize: 12, lineHeight: 1.45 }}>
            {meeting.keyPoints.map((point) => (
              <li key={point} style={{ marginBottom: 7, listStyle: 'disc' }}>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl p-4" style={{ background: SURFACE_RAISED, border: `1px solid ${BORDER_SUBTLE}` }}>
          <table
            style={{
              width: '100%',
              marginTop: 10,
              borderCollapse: 'collapse',
              fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
              fontSize: 11,
              lineHeight: 1.25,
            }}
          >
            <thead>
              <tr>
                <th style={tableHeaderStyle}>TASK</th>
                <th style={{ ...tableHeaderStyle, width: 92 }}>OWNER</th>
              </tr>
            </thead>
            <tbody>
              {meeting.tasks.map((task) => {
                const owner = participantByName.get(task.owner) || { name: task.owner };

                return (
                  <tr key={task.task}>
                    <td style={tableCellStyle}>{task.task}</td>
                    <td style={tableCellStyle}>
                      <div className="flex items-center gap-2">
                        <ParticipantAvatar participant={owner} size={24} />
                        <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>{task.owner}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="col-span-2 flex items-center justify-end flex-wrap gap-2">
          <button
            className="rounded-lg flex items-center justify-center gap-2"
            style={secondaryButtonStyle}
            aria-label="Download"
          >
            Download
          </button>
          <button className="rounded-lg flex items-center justify-center gap-2" style={secondaryButtonStyle} aria-label="Edit">
            Edit
          </button>
          <button
            className="rounded-lg flex items-center justify-center gap-2"
            style={chatButtonStyle}
            onClick={() => onOpenChat?.(meeting)}
            aria-label="Open chat"
          >
            Chat
          </button>
          <button className="rounded-lg flex items-center justify-center gap-2" style={approveButtonStyle} aria-label="Approve Record">
            Approve Record
          </button>
        </div>
      </div>
      ) : null}
    </section>
  );
}

const collapseButtonStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 999,
  border: `1px solid ${BORDER_DEFAULT}`,
  background: 'rgba(255,255,255,0.03)',
  cursor: 'pointer',
  padding: 0,
};

const chevronStyle: React.CSSProperties = {
  width: 8,
  height: 8,
  borderRight: '1.5px solid rgba(255,255,255,0.72)',
  borderBottom: '1.5px solid rgba(255,255,255,0.72)',
  transform: 'rotate(45deg)',
  transition: 'transform 160ms ease',
  marginTop: -2,
};

const secondaryButtonStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.045)',
  border: `1px solid ${BORDER_DEFAULT}`,
  color: 'rgba(255,255,255,0.72)',
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 700,
  padding: '6px 7px',
};

const chatButtonStyle: React.CSSProperties = {
  background: BLUE_PRIMARY,
  border: '1px solid transparent',
  color: '#061017',
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 800,
  padding: '6px 7px',
};

const approveButtonStyle: React.CSSProperties = {
  background: '#4ADE80',
  border: '1px solid rgba(74,222,128,0.18)',
  color: '#071016',
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 800,
  padding: '6px 7px',
};

const tableHeaderStyle: React.CSSProperties = {
  color: 'rgba(255,255,255,0.42)',
  fontWeight: 800,
  textAlign: 'left',
  padding: '0 0 8px',
  borderBottom: `1px solid ${BORDER_DEFAULT}`,
};

const tableCellStyle: React.CSSProperties = {
  color: 'rgba(255,255,255,0.72)',
  fontWeight: 500,
  padding: '9px 0',
  borderBottom: `1px solid ${BORDER_SUBTLE}`,
  verticalAlign: 'middle',
};
