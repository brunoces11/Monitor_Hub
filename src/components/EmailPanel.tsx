import { useMemo, useState } from 'react';
import { PIcon, PText } from '@porsche-design-system/components-react';
import { BORDER_DEFAULT, BORDER_SUBTLE, SURFACE_CARD, SURFACE_HOVER, SURFACE_RAISED } from '../theme';

type EmailFolder = 'inbox' | 'spam';
type EmailFilter = 'Inbox' | 'Cliente' | 'Emkt' | 'Team' | 'Spam' | 'Unknow' | 'Urgent';

type EmailRecord = {
  id: string;
  folder: EmailFolder;
  fromName: string;
  fromEmail: string;
  company: string;
  subject: string;
  receivedDate: string;
  receivedAt: string;
  preview: string;
  body: string[];
  tags: string[];
  urgencySignal?: string;
  draft: string;
};

const emailMessages: [EmailRecord, ...EmailRecord[]] = [
  {
    id: 'client-checkout-urgent',
    folder: 'inbox',
    fromName: 'Marcos Silva',
    fromEmail: 'marcos.silva@retailmax.com',
    company: 'RetailMax',
    subject: 'Checkout stopped after the last deployment',
    receivedDate: '27/06/26',
    receivedAt: '08:12',
    preview: 'Our paid traffic is live and clients cannot finish purchases. We need help before noon.',
    tags: ['Inbox', 'Cliente', 'Urgent'],
    urgencySignal: 'Revenue impact and deadline before noon',
    body: [
      'Hi Joana, the checkout started failing after the last deployment window.',
      'Our paid campaigns are running and customers are reaching support because they cannot complete purchases. Can your team check the payment handoff and confirm a fix before noon?',
      'This is blocking the daily revenue target and we need an ETA as soon as possible.',
    ],
    draft:
      'Hi Marcos,\n\nWe are treating this as urgent and will check the payment handoff immediately. I will ask the support and engineering workflow to review the last deployment, confirm whether the failure is isolated to checkout, and send you an ETA before noon.\n\nI will keep you updated in this thread.',
  },
  {
    id: 'supplier-credits-urgent',
    folder: 'inbox',
    fromName: 'Camila Andrade',
    fromEmail: 'camila@cloudmotion.io',
    company: 'CloudMotion',
    subject: 'API credits renewal must be approved today',
    receivedDate: '27/06/26',
    receivedAt: '09:04',
    preview: 'The automation credits expire today at 18:00. Without approval, image generation will pause.',
    tags: ['Inbox', 'Team', 'Urgent'],
    urgencySignal: 'Service interruption risk at 18:00',
    body: [
      'Hello Joana, your current API credits package expires today at 18:00.',
      'If the renewal is not approved, generation jobs will be paused until the next billing cycle is active. Please confirm whether we can renew the same tier.',
      'I can keep the current discount if finance approves it today.',
    ],
    draft:
      'Hi Camila,\n\nThanks for the heads-up. Please send the renewal invoice with the current discount and keep the same tier reserved while we route approval internally.\n\nI will confirm the finance approval status today before 18:00.',
  },
  {
    id: 'lead-enterprise-demo',
    folder: 'inbox',
    fromName: 'Beatriz Lima',
    fromEmail: 'beatriz.lima@northstar.ai',
    company: 'Northstar AI',
    subject: 'Enterprise demo for 40-user marketing team',
    receivedDate: '27/06/26',
    receivedAt: '10:27',
    preview: 'We are evaluating tools for campaign monitoring, lead routing, and creative automation.',
    tags: ['Inbox', 'Cliente'],
    body: [
      'Hi team, we found Monitor Hub while researching campaign monitoring and lead routing tools.',
      'We have around 40 users across marketing and sales, and we want to understand how the agent workflow, email triage, and revenue dashboards work together.',
      'Could you share availability for a demo next week?',
    ],
    draft:
      'Hi Beatriz,\n\nThanks for reaching out. Monitor Hub is a good fit for teams that need campaign monitoring, lead routing, and agent-assisted operations in one workspace.\n\nI can offer a demo next week and tailor it to your 40-user marketing and sales workflow. Would Tuesday or Wednesday afternoon work for your team?',
  },
  {
    id: 'marketing-relevant-webinar',
    folder: 'inbox',
    fromName: 'Rafael Costa',
    fromEmail: 'rafael@opsnewsletter.com',
    company: 'Ops Newsletter',
    subject: 'Relevant benchmark: AI email triage for growth teams',
    receivedDate: '27/06/26',
    receivedAt: '11:06',
    preview: 'New benchmark report comparing email classification, reply drafts, and task creation workflows.',
    tags: ['Inbox', 'Emkt'],
    body: [
      'Hi Joana, we published a benchmark on AI email triage workflows for growth and operations teams.',
      'The report compares automatic tagging, spam separation, reply draft quality, and task creation from inbox messages.',
      'It may be useful for your product and operations roadmap.',
    ],
    draft:
      'Hi Rafael,\n\nThanks for sharing the benchmark. The topics are relevant to our current inbox workflow work, especially automatic tagging, draft generation, and task creation.\n\nPlease send the report link and any summary data you recommend we review first.',
  },
  {
    id: 'spam-traffic-boost',
    folder: 'spam',
    fromName: 'Growth Booster',
    fromEmail: 'promo@instant-traffic.example',
    company: 'Instant Traffic',
    subject: 'Guaranteed 10,000 visitors in 24 hours',
    receivedDate: '27/06/26',
    receivedAt: '12:18',
    preview: 'Limited offer. Pay once and receive unlimited high-converting traffic immediately.',
    tags: ['Spam', 'Unknow'],
    body: [
      'Congratulations, your business has been selected for an exclusive traffic boost.',
      'Pay once and receive 10,000 high-converting visitors in 24 hours. No verification needed. Click now to activate.',
    ],
    draft:
      'No reply recommended.\n\nThis message was classified as spam because it contains unrealistic traffic promises, pressure language, and an unverifiable offer.',
  },
];

const tagStyles: Record<string, { background: string; border: string; color: string }> = {
  Urgent: { background: 'rgba(248,113,113,0.14)', border: 'rgba(248,113,113,0.34)', color: '#FCA5A5' },
  Inbox: { background: 'rgba(255,255,255,0.05)', border: BORDER_SUBTLE, color: 'rgba(255,255,255,0.68)' },
  Cliente: { background: 'rgba(255,255,255,0.05)', border: BORDER_SUBTLE, color: 'rgba(255,255,255,0.68)' },
  Emkt: { background: 'rgba(255,255,255,0.05)', border: BORDER_SUBTLE, color: 'rgba(255,255,255,0.68)' },
  Team: { background: 'rgba(255,255,255,0.05)', border: BORDER_SUBTLE, color: 'rgba(255,255,255,0.68)' },
  Spam: { background: 'rgba(255,255,255,0.05)', border: BORDER_SUBTLE, color: 'rgba(255,255,255,0.68)' },
  Unknow: { background: 'rgba(255,255,255,0.05)', border: BORDER_SUBTLE, color: 'rgba(255,255,255,0.68)' },
};

function getTagStyle(tag: string) {
  return tagStyles[tag] ?? { background: 'rgba(255,255,255,0.05)', border: BORDER_SUBTLE, color: 'rgba(255,255,255,0.68)' };
}

function EmailTag({ tag }: { tag: string }) {
  const style = getTagStyle(tag);

  return (
    <span
      className="rounded-full"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        minHeight: 20,
        padding: '3px 7px',
        background: style.background,
        border: `1px solid ${style.border}`,
        color: style.color,
        fontSize: 10,
        fontWeight: 700,
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}
    >
      {tag}
    </span>
  );
}

function ActionButton({ icon, label }: { icon: 'return' | 'share' | 'work'; label: string }) {
  return (
    <button
      type="button"
      className="hub-tooltip flex items-center gap-2 rounded-xl"
      data-tooltip={label}
      data-tooltip-side="top"
      style={{
        height: 34,
        padding: '0 10px',
        background: SURFACE_RAISED,
        border: `1px solid ${BORDER_DEFAULT}`,
        color: 'rgba(255,255,255,0.78)',
        cursor: 'pointer',
        fontSize: 11,
        fontWeight: 700,
      }}
    >
      <PIcon name={icon} size="x-small" color="contrast-medium" theme="dark" aria={{ 'aria-label': label }} />
      <span>{label}</span>
    </button>
  );
}

export default function EmailPanel() {
  const [selectedEmailId, setSelectedEmailId] = useState(emailMessages[0].id);
  const [draftOverrides, setDraftOverrides] = useState<Record<string, string>>({});
  const [activeFilter, setActiveFilter] = useState<EmailFilter>('Inbox');

  const visibleEmails = useMemo(
    () =>
      emailMessages.filter((email) => {
        if (activeFilter === 'Inbox') return email.folder === 'inbox';
        if (activeFilter === 'Spam') return email.tags.includes('Spam');
        return email.tags.includes(activeFilter);
      }),
    [activeFilter]
  );
  const selectedEmail = emailMessages.find((email) => email.id === selectedEmailId) ?? emailMessages[0];
  const selectedDraft = draftOverrides[selectedEmail.id] ?? selectedEmail.draft;
  const inboxCount = emailMessages.filter((email) => email.folder === 'inbox').length;
  const clientCount = emailMessages.filter((email) => email.tags.includes('Cliente')).length;
  const emktCount = emailMessages.filter((email) => email.tags.includes('Emkt')).length;
  const teamCount = emailMessages.filter((email) => email.tags.includes('Team')).length;
  const spamCount = emailMessages.filter((email) => email.tags.includes('Spam')).length;
  const unknowCount = emailMessages.filter((email) => email.tags.includes('Unknow')).length;
  const urgentCount = emailMessages.filter((email) => email.tags.includes('Urgent')).length;

  const handleFilterChange = (filter: EmailFilter) => {
    setActiveFilter(filter);
    setSelectedEmailId((current) => {
      const currentEmail = emailMessages.find((email) => email.id === current);
      const nextVisibleEmails = emailMessages.filter((email) => {
        if (filter === 'Inbox') return email.folder === 'inbox';
        if (filter === 'Spam') return email.tags.includes('Spam');
        return email.tags.includes(filter);
      });
      if (currentEmail && nextVisibleEmails.some((email) => email.id === currentEmail.id)) return current;
      return nextVisibleEmails[0]?.id ?? emailMessages[0].id;
    });
  };

  return (
    <section
      className="flex flex-col gap-2"
      style={{
        height: 'calc(100vh - 28px)',
        minHeight: 680,
      }}
      aria-label="AI email inbox"
    >
      <div
        className="rounded-2xl flex flex-col min-h-0"
        style={{
          flex: '0 0 42%',
          background: SURFACE_CARD,
          border: `1px solid ${BORDER_DEFAULT}`,
          overflow: 'hidden',
        }}
      >
        <div
          className="flex items-center justify-between gap-3"
          style={{
            padding: '12px 14px',
            borderBottom: `1px solid ${BORDER_DEFAULT}`,
          }}
        >
          <div className="min-w-0">
            <PText size="medium" weight="semi-bold" theme="dark" color="primary">
              Inbox
            </PText>
          </div>

          <div className="flex items-center gap-2" style={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {[
              { id: 'Inbox' as const, label: 'Inbox', count: inboxCount, urgent: false },
              { id: 'Cliente' as const, label: 'Cliente', count: clientCount, urgent: false },
              { id: 'Emkt' as const, label: 'Emkt', count: emktCount, urgent: false },
              { id: 'Team' as const, label: 'Team', count: teamCount, urgent: false },
              { id: 'Spam' as const, label: 'Spam', count: spamCount, urgent: false },
              { id: 'Unknow' as const, label: 'Unknow', count: unknowCount, urgent: false },
              { id: 'Urgent' as const, label: 'Urgent', count: urgentCount, urgent: true },
            ].map((filter) => {
              const isActive = activeFilter === filter.id;
              const isUrgent = filter.urgent;

              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => handleFilterChange(filter.id)}
                  className="rounded-xl"
                  style={{
                    height: 30,
                    padding: '0 10px',
                    background: isActive
                      ? (isUrgent ? 'rgba(248,113,113,0.18)' : 'rgba(255,255,255,0.12)')
                      : SURFACE_RAISED,
                    border: `1px solid ${
                      isActive
                        ? (isUrgent ? 'rgba(248,113,113,0.34)' : 'rgba(255,255,255,0.22)')
                        : BORDER_DEFAULT
                    }`,
                    color: isUrgent ? '#FCA5A5' : (isActive ? 'rgba(255,255,255,0.86)' : 'rgba(255,255,255,0.68)'),
                    cursor: 'pointer',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {filter.label} {filter.count}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto">
          {visibleEmails.map((email) => {
            const isSelected = selectedEmail.id === email.id;

            return (
              <button
                key={email.id}
                type="button"
                onClick={() => setSelectedEmailId(email.id)}
                className="w-full text-left"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '65px minmax(150px, 185px) minmax(0, 1fr) 155px',
                  gap: 12,
                  alignItems: 'center',
                  height: 44,
                  padding: '2px 14px',
                  boxSizing: 'border-box',
                  overflow: 'hidden',
                  background: isSelected ? SURFACE_HOVER : 'transparent',
                  border: 'none',
                  borderBottom: `1px solid ${BORDER_SUBTLE}`,
                  cursor: 'pointer',
                }}
              >
                <div className="min-w-0" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2 }}>
                  <span
                    style={{
                      display: 'block',
                      overflow: 'hidden',
                      color: 'rgba(255,255,255,0.82)',
                      fontSize: 9.5,
                      fontWeight: 700,
                      fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
                      lineHeight: 1.22,
                      letterSpacing: '0.03em',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {email.receivedDate}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      overflow: 'hidden',
                      color: 'rgba(255,255,255,0.44)',
                      fontSize: 10,
                      fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
                      lineHeight: 1.22,
                      letterSpacing: '0.03em',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {email.receivedAt}
                  </span>
                </div>

                <div className="min-w-0" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2 }}>
                  <div
                    style={{
                      overflow: 'hidden',
                      color: 'rgba(255,255,255,0.82)',
                      fontSize: 10,
                      fontWeight: 700,
                      lineHeight: 1.22,
                      letterSpacing: '0.03em',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {email.fromName}
                  </div>
                  <div
                    style={{
                      overflow: 'hidden',
                      color: 'rgba(255,255,255,0.48)',
                      fontSize: 10,
                      lineHeight: 1.22,
                      letterSpacing: '0.03em',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {email.fromEmail}
                  </div>
                </div>

                <div className="min-w-0" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2 }}>
                  <div
                    style={{
                      overflow: 'hidden',
                      color: 'rgba(255,255,255,0.82)',
                      fontSize: 11,
                      fontWeight: 700,
                      lineHeight: 1.22,
                      letterSpacing: '0.03em',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {email.subject}
                  </div>
                  <div
                    style={{
                      overflow: 'hidden',
                      color: 'rgba(255,255,255,0.48)',
                      fontSize: 10,
                      lineHeight: 1.22,
                      letterSpacing: '0.03em',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {email.preview}
                  </div>
                </div>

                <div
                  className="flex items-center gap-1.5 min-w-0"
                  style={{
                    flexWrap: 'wrap',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    textAlign: 'right',
                    minWidth: 155,
                    width: 155,
                    maxWidth: 155,
                    overflow: 'hidden',
                  }}
                >
                  {email.tags.map((tag) => (
                    <EmailTag key={`${email.id}-${tag}`} tag={tag} />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="rounded-2xl flex flex-col min-h-0"
        style={{
          flex: '1 1 0',
          background: SURFACE_CARD,
          border: `1px solid ${BORDER_DEFAULT}`,
          overflow: 'hidden',
        }}
      >
        <div
          className="flex items-center justify-between gap-3"
          style={{
            padding: '12px 14px',
            borderBottom: `1px solid ${BORDER_DEFAULT}`,
          }}
        >
          <div className="min-w-0">
            <PText size="medium" weight="semi-bold" theme="dark" color="primary">
              {selectedEmail.subject}
            </PText>
          </div>

            <div className="flex items-center gap-2" style={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <ActionButton icon="return" label="Reply" />
              <ActionButton icon="share" label="Forward" />
              <ActionButton icon="work" label="Create task" />
            </div>
          </div>

        <div
          className="grid flex-1 min-h-0"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            overflow: 'hidden',
          }}
        >
          <div className="min-h-0 overflow-y-auto" style={{ padding: 16, borderRight: `1px solid ${BORDER_DEFAULT}` }}>
            <div className="flex items-center gap-2 mb-4" style={{ flexWrap: 'wrap' }}>
              {selectedEmail.tags.map((tag) => (
                <EmailTag key={`${selectedEmail.id}-reader-${tag}`} tag={tag} />
              ))}
            </div>

            <div
              className="rounded-xl"
              style={{
                padding: 14,
                background: SURFACE_RAISED,
                border: `1px solid ${BORDER_SUBTLE}`,
              }}
            >
              {selectedEmail.body.map((paragraph) => (
                <p key={paragraph} style={{ margin: '0 0 12px', color: 'rgba(255,255,255,0.74)', fontSize: 13, lineHeight: 1.55 }}>
                  {paragraph}
                </p>
              ))}
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
                Received {selectedEmail.receivedAt}
              </p>
            </div>
          </div>

          <div className="flex flex-col min-h-0" style={{ padding: 16 }}>
            <textarea
              aria-label="AI generated email draft"
              value={selectedDraft}
              onChange={(event) =>
                setDraftOverrides((current) => ({
                  ...current,
                  [selectedEmail.id]: event.target.value,
                }))
              }
              style={{
                flex: 1,
                minHeight: 220,
                resize: 'none',
                width: '100%',
                background: SURFACE_RAISED,
                border: `1px solid ${BORDER_SUBTLE}`,
                borderRadius: 8,
                outline: 'none',
                color: 'rgba(255,255,255,0.8)',
                padding: 14,
                fontSize: 13,
                lineHeight: 1.5,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
