import { PIcon, PText } from '@porsche-design-system/components-react';
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
        background: participant.color || SURFACE_RAISED,
        border: `1px solid ${BORDER_DEFAULT}`,
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

export default function TranscriptionCard({ meeting }: TranscriptionCardProps) {
  const participantByName = new Map(meeting.participants.map((participant) => [participant.name, participant]));

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
            textAlign: 'center',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {meeting.title}
        </h3>

        <div
          className="rounded-xl flex items-center justify-end"
          style={{
            minWidth: 116,
            minHeight: 40,
            padding: '6px 9px 6px 14px',
            background: SURFACE_RAISED,
            border: `1px solid ${BORDER_SUBTLE}`,
          }}
          aria-label={`${meeting.participants.length} participants`}
        >
          {meeting.participants.map((participant, index) => (
            <div key={participant.name} style={{ marginLeft: index === 0 ? 0 : -8, zIndex: meeting.participants.length - index }}>
              <ParticipantAvatar participant={participant} />
            </div>
          ))}
        </div>
      </header>

      <div className="grid gap-4 mt-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: SURFACE_RAISED, border: `1px solid ${BORDER_SUBTLE}` }}>
          <PText size="xx-small" theme="dark" color="contrast-medium" style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Key Points
          </PText>
          <ul style={{ margin: 0, paddingLeft: 17, color: 'rgba(255,255,255,0.68)', fontSize: 12, lineHeight: 1.45 }}>
            {meeting.keyPoints.map((point) => (
              <li key={point} style={{ marginBottom: 7 }}>
                {point}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-2 mt-auto">
            <button className="rounded-lg px-3 py-2" style={secondaryButtonStyle}>
              Summary
            </button>
            <button className="rounded-lg px-3 py-2" style={secondaryButtonStyle}>
              Full
            </button>
            <button className="rounded-lg px-3 py-2 flex items-center gap-2" style={chatButtonStyle}>
              <PIcon name={'chat' as never} size="x-small" color="inherit" theme="dark" aria={{ 'aria-label': 'chat' }} style={{ color: '#061017' }} />
              Chat
            </button>
          </div>
        </div>

        <div className="rounded-2xl p-4" style={{ background: SURFACE_RAISED, border: `1px solid ${BORDER_SUBTLE}` }}>
          <PText size="xx-small" theme="dark" color="contrast-medium" style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Tasks
          </PText>

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
      </div>
    </section>
  );
}

const secondaryButtonStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.045)',
  border: `1px solid ${BORDER_DEFAULT}`,
  color: 'rgba(255,255,255,0.72)',
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 700,
};

const chatButtonStyle: React.CSSProperties = {
  background: BLUE_PRIMARY,
  border: '1px solid transparent',
  color: '#061017',
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 800,
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
