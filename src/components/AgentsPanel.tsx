import { useState } from 'react';
import { PIcon, PText } from '@porsche-design-system/components-react';
import { BLUE_PRIMARY, BORDER_DEFAULT, BORDER_SUBTLE, SURFACE_CARD, SURFACE_RAISED, TREND_UP } from '../theme';

type AgentType = 'system' | 'client';

type AgentConfig = {
  type: AgentType;
  name: string;
  enabled: boolean;
  description: string;
  prompt: string;
  tools: string[];
};

type AgentDraft = {
  name: string;
  description: string;
  prompt: string;
  tools: string[];
};

const initialAgents: AgentConfig[] = [
  {
    type: 'system',
    name: 'Manager',
    enabled: true,
    description: 'Coordinates priorities across agents and keeps execution aligned with campaign goals. Reviews task progress, blockers, and handoffs before escalating decisions.',
    prompt: 'Act as the orchestration layer for the HUB. Prioritize active work, identify blockers, assign agent tasks, and produce concise operating updates.',
    tools: ['Task Router', 'Workflow Queue', 'Agent Registry', 'Status Reports'],
  },
  {
    type: 'system',
    name: 'Transcriptor',
    enabled: true,
    description: 'Analyzes meeting transcripts, extracts key decisions and action items, and identifies who owns each follow-up task. Keeps meeting outcomes structured and easy to review.',
    prompt: 'Review meeting transcripts, identify decisions, action items, owners, deadlines, and concise follow-up summaries for the team.',
    tools: ['Transcript Parser', 'Action Items', 'Decision Log', 'Follow-up Tracker'],
  },
  {
    type: 'system',
    name: 'Copy Writer',
    enabled: true,
    description: 'Creates campaign copy, email drafts, hooks, and short-form variations. Optimizes tone, clarity, and conversion angle for each target channel.',
    prompt: 'Write clear, conversion-focused copy for campaigns. Keep voice consistent, generate multiple angles, and flag weak claims before delivery.',
    tools: ['Brand Voice', 'Ad Copy Lab', 'Email Drafts', 'Creative Briefs'],
  },
  {
    type: 'system',
    name: 'Script Writer',
    enabled: true,
    description: 'Builds video scripts, scene outlines, hooks, and narration drafts. Converts campaign objectives into structured scripts for short-form content.',
    prompt: 'Create video scripts with hook, setup, value sequence, CTA, and timing notes. Keep language direct and suitable for social video production.',
    tools: ['Script Builder', 'Scene Planner', 'Voiceover Notes', 'Video Briefs'],
  },
  {
    type: 'system',
    name: 'Campaign Manager',
    enabled: true,
    description: 'Coordinates campaign execution across channels, tracks launch status, and keeps approvals, assets, and timelines synchronized. Bridges planning and delivery.',
    prompt: 'Manage active campaigns, monitor delivery state, track dependencies, and surface next actions when execution needs attention.',
    tools: ['Campaign Dashboard', 'Launch Tracker', 'Approval Queue', 'Channel Planner'],
  },
  {
    type: 'system',
    name: 'Campaign Planner',
    enabled: true,
    description: 'Plans launches, channel sequencing, budget logic, and test structures. Turns strategy into campaign calendars and execution checklists.',
    prompt: 'Plan campaigns from objective to launch. Define channels, audience, schedule, assets, success metrics, and next actions.',
    tools: ['Calendar', 'Budget Planner', 'Audience Map', 'KPI Forecast'],
  },
  {
    type: 'client',
    name: 'AE - Client X',
    enabled: false,
    description: 'Supports account activity for Client X with brief reviews and follow-up preparation. Tracks deliverables, open requests, and client-specific context.',
    prompt: 'Act as account executive support for Client X. Prepare updates, summarize requests, track commitments, and keep client communication precise.',
    tools: ['Client CRM', 'Meeting Notes', 'Follow-up Queue', 'Delivery Tracker'],
  },
  {
    type: 'client',
    name: 'AE - Client Y',
    enabled: true,
    description: 'Supports account activity for Client Y with campaign status and response drafting. Maintains continuity across meetings, asks, and approvals.',
    prompt: 'Act as account executive support for Client Y. Keep communication organized, summarize decisions, and prepare concise client-facing responses.',
    tools: ['Client CRM', 'Inbox Drafts', 'Approval Tracker', 'Campaign Status'],
  },
];

const availableTools = Array.from(new Set(initialAgents.flatMap((agent) => agent.tools)));

const emptyAgentDraft: AgentDraft = {
  name: '',
  description: '',
  prompt: '',
  tools: [],
};

interface AgentsPanelProps {
  onOpenAgentChat?: (agentName: string) => void;
}

export default function AgentsPanel({ onOpenAgentChat }: AgentsPanelProps) {
  const [agents, setAgents] = useState(initialAgents);
  const [editingAgent, setEditingAgent] = useState<AgentConfig | null>(null);
  const [creatingAgentType, setCreatingAgentType] = useState<AgentType | null>(null);
  const [draftPrompt, setDraftPrompt] = useState('');
  const [draftTools, setDraftTools] = useState<string[]>([]);
  const [agentDraft, setAgentDraft] = useState(emptyAgentDraft);
  const [showToolMenu, setShowToolMenu] = useState(false);
  const [showEditToolMenu, setShowEditToolMenu] = useState(false);

  const toggleAgent = (name: string) => {
    setAgents((current) =>
      current.map((agent) => (agent.name === name ? { ...agent, enabled: !agent.enabled } : agent))
    );
  };

  const openEditor = (agent: AgentConfig) => {
    setEditingAgent(agent);
    setDraftPrompt(agent.prompt);
    setDraftTools(agent.tools);
    setShowEditToolMenu(false);
  };

  const submitPrompt = () => {
    if (!editingAgent) return;
    setAgents((current) =>
      current.map((agent) => (agent.name === editingAgent.name ? { ...agent, prompt: draftPrompt, tools: draftTools } : agent))
    );
    setEditingAgent(null);
    setShowEditToolMenu(false);
  };

  const openCreateAgent = (type: AgentType) => {
    setCreatingAgentType(type);
    setAgentDraft(emptyAgentDraft);
    setShowToolMenu(false);
  };

  const updateAgentDraft = (field: keyof AgentDraft, value: string) => {
    setAgentDraft((current) => ({ ...current, [field]: value }));
  };

  const toggleDraftTool = (tool: string) => {
    setAgentDraft((current) => ({
      ...current,
      tools: current.tools.includes(tool)
        ? current.tools.filter((item) => item !== tool)
        : [...current.tools, tool],
    }));
  };

  const toggleEditTool = (tool: string) => {
    setDraftTools((current) =>
      current.includes(tool) ? current.filter((item) => item !== tool) : [...current, tool]
    );
  };

  const submitNewAgent = () => {
    if (!creatingAgentType) return;
    const fallbackName = creatingAgentType === 'system' ? 'New System Agent' : 'New Client Agent';
    setAgents((current) => [
      ...current,
      {
        type: creatingAgentType,
        name: agentDraft.name.trim() || fallbackName,
        enabled: true,
        description: agentDraft.description.trim() || 'New agent ready for configuration. Add a clear role, prompt, and tool access before production use.',
        prompt: agentDraft.prompt.trim() || 'Define this agent prompt before enabling production workflows.',
        tools: agentDraft.tools,
      },
    ]);
    setCreatingAgentType(null);
    setAgentDraft(emptyAgentDraft);
    setShowToolMenu(false);
  };

  const systemAgents = agents.filter((agent) => agent.type === 'system');
  const clientAgents = agents.filter((agent) => agent.type === 'client');

  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="rounded-full flex-shrink-0"
            style={{ width: 2, height: 14, background: BLUE_PRIMARY }}
          />
          <span
            style={{
              color: TREND_UP,
              fontSize: 27,
              fontWeight: 600,
              lineHeight: 1.15,
            }}
          >
            System Agents
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            className="rounded-lg px-2.5 py-1.5"
            onClick={() => openCreateAgent('system')}
            style={{
              background: SURFACE_RAISED,
              border: `1px solid ${BORDER_DEFAULT}`,
              color: 'rgba(255,255,255,0.74)',
              cursor: 'pointer',
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            Add System Agent
          </button>
          <button
            className="rounded-lg px-2.5 py-1.5"
            onClick={() => openCreateAgent('client')}
            style={{
              background: SURFACE_RAISED,
              border: `1px solid ${BORDER_DEFAULT}`,
              color: 'rgba(255,255,255,0.74)',
              cursor: 'pointer',
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            Add Client Agent
          </button>
        </div>
      </div>

      <div className="grid gap-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
        {systemAgents.map((agent) => (
          <AgentCard
            key={agent.name}
            agent={agent}
            onToggle={() => toggleAgent(agent.name)}
            onEdit={() => openEditor(agent)}
            onChat={() => onOpenAgentChat?.(agent.name)}
          />
        ))}
      </div>

      <div className="flex items-center gap-3 mt-8 mb-4">
        <div
          className="rounded-full flex-shrink-0"
          style={{ width: 2, height: 14, background: BLUE_PRIMARY }}
        />
        <span
          style={{
            color: TREND_UP,
            fontSize: 27,
            fontWeight: 600,
            lineHeight: 1.15,
          }}
        >
          Client Agents
        </span>
      </div>

      <div className="grid gap-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
        {clientAgents.map((agent) => (
          <AgentCard
            key={agent.name}
            agent={agent}
            onToggle={() => toggleAgent(agent.name)}
            onEdit={() => openEditor(agent)}
            onChat={() => onOpenAgentChat?.(agent.name)}
          />
        ))}
      </div>

      {editingAgent && (
        <div
          className="fixed inset-0 flex items-center justify-center px-4"
          style={{ background: 'rgba(0,0,0,0.58)', zIndex: 100 }}
          role="dialog"
          aria-modal="true"
          aria-label={`Edit ${editingAgent.name} prompt`}
        >
          <div
            className="rounded-2xl p-5"
            style={{
              width: 'min(720px, 100%)',
              background: SURFACE_CARD,
              border: `1px solid ${BORDER_DEFAULT}`,
              boxShadow: '0 24px 70px rgba(0,0,0,0.44)',
            }}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <PText size="medium" weight="semi-bold" theme="dark" color="primary">
                  {editingAgent.name}
                </PText>
                <PText size="xx-small" theme="dark" color="contrast-medium">
                  Prompt and tools
                </PText>
              </div>
              <button
                className="rounded-lg flex items-center justify-center"
                onClick={() => {
                  setEditingAgent(null);
                  setShowEditToolMenu(false);
                }}
                style={{ width: 32, height: 32, background: SURFACE_RAISED, border: `1px solid ${BORDER_SUBTLE}`, cursor: 'pointer' }}
                aria-label="Close prompt editor"
              >
                <PIcon name="close" size="x-small" color="contrast-medium" theme="dark" aria={{ 'aria-label': 'close' }} />
              </button>
            </div>

            <textarea
              value={draftPrompt}
              onChange={(event) => setDraftPrompt(event.target.value)}
              aria-label="Agent prompt"
              style={{
                width: '100%',
                minHeight: 180,
                resize: 'vertical',
                background: SURFACE_RAISED,
                border: `1px solid ${BORDER_DEFAULT}`,
                color: 'rgba(255,255,255,0.82)',
                borderRadius: 8,
                padding: 12,
                outline: 'none',
                fontSize: 12,
                lineHeight: 1.45,
                fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
              }}
            />

            <div className="mt-4">
              <PText size="xx-small" theme="dark" color="contrast-medium" style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Tools
              </PText>
              <ToolTags tools={draftTools} />
            </div>

            <div className="flex items-center justify-between gap-3 mt-5">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    className="rounded-lg px-3 py-2 flex items-center gap-2"
                    onClick={() => setShowEditToolMenu((value) => !value)}
                    style={{ background: SURFACE_RAISED, border: `1px solid ${BORDER_DEFAULT}`, color: 'rgba(255,255,255,0.74)', cursor: 'pointer', fontSize: 12 }}
                    aria-expanded={showEditToolMenu}
                  >
                    Tools ({draftTools.length})
                    <PIcon name="arrow-compact-up" size="x-small" color="contrast-medium" theme="dark" aria={{ 'aria-label': 'toggle tools' }} />
                  </button>

                  {showEditToolMenu && (
                    <div
                      className="absolute left-0 bottom-full mb-2 rounded-xl p-2"
                      style={{
                        width: 260,
                        maxHeight: 220,
                        overflowY: 'auto',
                        background: SURFACE_RAISED,
                        border: `1px solid ${BORDER_DEFAULT}`,
                        boxShadow: '0 -16px 34px rgba(0,0,0,0.32)',
                        zIndex: 10,
                      }}
                    >
                      {availableTools.map((tool) => (
                        <label
                          key={tool}
                          className="flex items-center gap-2 rounded-lg px-2 py-1.5"
                          style={{ color: 'rgba(255,255,255,0.68)', fontSize: 12, cursor: 'pointer' }}
                        >
                          <input
                            type="checkbox"
                            checked={draftTools.includes(tool)}
                            onChange={() => toggleEditTool(tool)}
                            style={{ accentColor: BLUE_PRIMARY }}
                          />
                          {tool}
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  className="rounded-lg px-3 py-2 flex items-center gap-2"
                  style={{ background: SURFACE_RAISED, border: `1px solid ${BORDER_DEFAULT}`, color: 'rgba(255,255,255,0.74)', cursor: 'pointer', fontSize: 12 }}
                  aria-label="Attach files to agent"
                >
                  <PIcon name="attachment" size="x-small" color="contrast-medium" theme="dark" aria={{ 'aria-label': 'attach files' }} />
                  Attach files
                </button>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  className="rounded-lg px-4 py-2"
                  onClick={() => {
                    setEditingAgent(null);
                    setShowEditToolMenu(false);
                  }}
                  style={{ background: SURFACE_RAISED, border: `1px solid ${BORDER_SUBTLE}`, color: 'rgba(255,255,255,0.72)', cursor: 'pointer', fontSize: 12 }}
                >
                  Cancel
                </button>
                <button
                  className="rounded-lg px-4 py-2"
                  onClick={submitPrompt}
                  style={{ background: BLUE_PRIMARY, border: '1px solid transparent', color: '#061017', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {creatingAgentType && (
        <div
          className="fixed inset-0 flex items-center justify-center px-4"
          style={{ background: 'rgba(0,0,0,0.58)', zIndex: 100 }}
          role="dialog"
          aria-modal="true"
          aria-label={creatingAgentType === 'system' ? 'Add System Agent' : 'Add Client Agent'}
        >
          <div
            className="rounded-2xl p-5"
            style={{
              width: 'min(720px, 100%)',
              background: SURFACE_CARD,
              border: `1px solid ${BORDER_DEFAULT}`,
              boxShadow: '0 24px 70px rgba(0,0,0,0.44)',
            }}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <PText size="medium" weight="semi-bold" theme="dark" color="primary">
                  {creatingAgentType === 'system' ? 'Add System Agent' : 'Add Client Agent'}
                </PText>
                <PText size="xx-small" theme="dark" color="contrast-medium">
                  Title, prompt, tools and files
                </PText>
              </div>
              <button
                className="rounded-lg flex items-center justify-center"
                onClick={() => setCreatingAgentType(null)}
                style={{ width: 32, height: 32, background: SURFACE_RAISED, border: `1px solid ${BORDER_SUBTLE}`, cursor: 'pointer' }}
                aria-label="Close agent creator"
              >
                <PIcon name="close" size="x-small" color="contrast-medium" theme="dark" aria={{ 'aria-label': 'close' }} />
              </button>
            </div>

            <div className="grid gap-3" style={{ gridTemplateColumns: '1fr' }}>
              <input
                value={agentDraft.name}
                onChange={(event) => updateAgentDraft('name', event.target.value)}
                placeholder="Agent title"
                aria-label="Agent title"
                style={inputStyle}
              />
              <textarea
                value={agentDraft.description}
                onChange={(event) => updateAgentDraft('description', event.target.value)}
                placeholder="Agent description"
                aria-label="Agent description"
                style={{ ...inputStyle, minHeight: 78, resize: 'vertical' }}
              />
              <textarea
                value={agentDraft.prompt}
                onChange={(event) => updateAgentDraft('prompt', event.target.value)}
                placeholder="Agent prompt"
                aria-label="Agent prompt"
                style={{ ...inputStyle, minHeight: 140, resize: 'vertical', fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace' }}
              />
            </div>

            <div className="flex flex-wrap items-start justify-between gap-3 mt-4">
              <div className="relative">
                <button
                  className="rounded-lg px-3 py-2 flex items-center gap-2"
                  onClick={() => setShowToolMenu((value) => !value)}
                  style={{ background: SURFACE_RAISED, border: `1px solid ${BORDER_DEFAULT}`, color: 'rgba(255,255,255,0.74)', cursor: 'pointer', fontSize: 12 }}
                  aria-expanded={showToolMenu}
                >
                  Tools ({agentDraft.tools.length})
                  <PIcon name="arrow-compact-down" size="x-small" color="contrast-medium" theme="dark" aria={{ 'aria-label': 'toggle tools' }} />
                </button>

                {showToolMenu && (
                  <div
                    className="absolute left-0 top-full mt-2 rounded-xl p-2"
                    style={{
                      width: 260,
                      maxHeight: 220,
                      overflowY: 'auto',
                      background: SURFACE_RAISED,
                      border: `1px solid ${BORDER_DEFAULT}`,
                      boxShadow: '0 16px 34px rgba(0,0,0,0.32)',
                      zIndex: 10,
                    }}
                  >
                    {availableTools.map((tool) => (
                      <label
                        key={tool}
                        className="flex items-center gap-2 rounded-lg px-2 py-1.5"
                        style={{ color: 'rgba(255,255,255,0.68)', fontSize: 12, cursor: 'pointer' }}
                      >
                        <input
                          type="checkbox"
                          checked={agentDraft.tools.includes(tool)}
                          onChange={() => toggleDraftTool(tool)}
                          style={{ accentColor: BLUE_PRIMARY }}
                        />
                        {tool}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <button
                className="rounded-lg px-3 py-2 flex items-center gap-2"
                style={{ background: SURFACE_RAISED, border: `1px solid ${BORDER_DEFAULT}`, color: 'rgba(255,255,255,0.74)', cursor: 'pointer', fontSize: 12 }}
              >
                <PIcon name="attachment" size="x-small" color="contrast-medium" theme="dark" aria={{ 'aria-label': 'attach files' }} />
                Attach files
              </button>
            </div>

            {agentDraft.tools.length > 0 && (
              <div className="mt-3">
                <ToolTags tools={agentDraft.tools} />
              </div>
            )}

            <div className="flex justify-end gap-2 mt-5">
              <button
                className="rounded-lg px-4 py-2"
                onClick={() => setCreatingAgentType(null)}
                style={{ background: SURFACE_RAISED, border: `1px solid ${BORDER_SUBTLE}`, color: 'rgba(255,255,255,0.72)', cursor: 'pointer', fontSize: 12 }}
              >
                Cancel
              </button>
              <button
                className="rounded-lg px-4 py-2"
                onClick={submitNewAgent}
                style={{ background: BLUE_PRIMARY, border: '1px solid transparent', color: '#061017', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function AgentCard({
  agent,
  onToggle,
  onEdit,
  onChat,
}: {
  agent: AgentConfig;
  onToggle: () => void;
  onEdit: () => void;
  onChat: () => void;
}) {
  return (
    <section
      className="rounded-2xl p-4"
      style={{ background: SURFACE_CARD, border: `1px solid ${BORDER_DEFAULT}` }}
      aria-label={agent.name}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <PText
            size="medium"
            weight="regular"
            theme="dark"
            color="primary"
            style={{ fontSize: '85%', lineHeight: 1.15, color: BLUE_PRIMARY }}
          >
            {agent.name}
          </PText>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <PText size="xx-small" theme="dark" color="contrast-medium">
            {agent.enabled ? 'Online' : 'Offline'}
          </PText>
          <button
            type="button"
            onClick={onToggle}
            className="rounded-full relative flex items-center overflow-hidden"
            style={{
              width: 32,
              height: 18,
              padding: 2,
              background: agent.enabled ? 'rgba(44,194,238,0.18)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${agent.enabled ? 'rgba(44,194,238,0.34)' : BORDER_SUBTLE}`,
              boxShadow: agent.enabled
                ? 'inset 0 1px 2px rgba(255,255,255,0.12), inset 0 -1px 3px rgba(0,0,0,0.18), 0 1px 3px rgba(0,0,0,0.18)'
                : 'inset 0 1px 2px rgba(255,255,255,0.08), inset 0 -1px 3px rgba(0,0,0,0.22), 0 1px 2px rgba(0,0,0,0.14)',
              cursor: 'pointer',
              transition: 'background 160ms ease, border-color 160ms ease, box-shadow 160ms ease',
            }}
            aria-label={`${agent.name} ${agent.enabled ? 'on' : 'off'}`}
            aria-pressed={agent.enabled}
          >
            <span
              className="rounded-full"
              style={{
                width: 12,
                height: 12,
                background: agent.enabled ? BLUE_PRIMARY : 'rgba(255,255,255,0.34)',
                transform: agent.enabled ? 'translateX(12px)' : 'translateX(0)',
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.22), 0 1px 2px rgba(0,0,0,0.25)',
                transition: 'transform 180ms ease, background 180ms ease, box-shadow 180ms ease',
              }}
            />
          </button>
        </div>
      </div>

      <p style={{ marginTop: 12, marginBottom: 0, color: 'rgba(255,255,255,0.58)', fontSize: 12, lineHeight: 1.35, maxWidth: 900 }}>
        {agent.description}
      </p>

      <div
        className="rounded-xl mt-3 p-3"
        style={{ background: SURFACE_RAISED, border: `1px solid ${BORDER_SUBTLE}` }}
      >
        <PText size="xx-small" theme="dark" color="contrast-medium" style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Prompt preview
        </PText>
        <p style={{ margin: '6px 0 0', color: 'rgba(255,255,255,0.72)', fontSize: 12, lineHeight: 1.4 }}>
          {agent.prompt}
        </p>
      </div>

      <div className="flex items-end justify-between gap-4 mt-3">
        <div className="min-w-0">
          <PText size="xx-small" theme="dark" color="contrast-medium" style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Tools
          </PText>
          <ToolTags tools={agent.tools} />
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            className="rounded-lg px-2.5 py-1.5 flex items-center gap-2"
            onClick={onEdit}
            style={{ background: SURFACE_RAISED, border: `1px solid ${BORDER_DEFAULT}`, color: 'rgba(255,255,255,0.74)', cursor: 'pointer', flexShrink: 0, fontSize: 12 }}
          >
            <PIcon name="edit" size="x-small" color="contrast-medium" theme="dark" aria={{ 'aria-label': 'edit prompt' }} />
            Edit
          </button>
          <button
            className="rounded-lg px-2.5 py-1.5 flex items-center gap-2"
            onClick={onChat}
            style={{ background: BLUE_PRIMARY, border: '1px solid transparent', color: '#061017', cursor: 'pointer', flexShrink: 0, fontSize: 12, fontWeight: 700 }}
            aria-label={`Open chat with ${agent.name}`}
          >
            <PIcon name={'chat' as never} size="x-small" color="inherit" theme="dark" aria={{ 'aria-label': 'chat' }} style={{ color: '#061017' }} />
            Chat
          </button>
        </div>
      </div>
    </section>
  );
}

function ToolTags({ tools }: { tools: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {tools.map((tool) => (
        <span
          key={tool}
          className="rounded-full"
          style={{
            padding: '3px 8px',
            background: 'rgba(255,255,255,0.045)',
            border: '1px solid rgba(255,255,255,0.24)',
            color: 'rgba(255,255,255,0.58)',
            fontSize: 10,
            fontWeight: 700,
          }}
        >
          {tool}
        </span>
      ))}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: SURFACE_RAISED,
  border: `1px solid ${BORDER_DEFAULT}`,
  color: 'rgba(255,255,255,0.82)',
  borderRadius: 8,
  padding: 10,
  outline: 'none',
  fontSize: 12,
  lineHeight: 1.45,
};
