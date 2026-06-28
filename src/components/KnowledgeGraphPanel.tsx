import { useEffect, useMemo, useState } from 'react';
import ReactFlow, {
  Background,
  BaseEdge,
  Controls,
  MiniMap,
  useNodesState,
  type Edge,
  type EdgeProps,
  type Node,
  type NodeDragHandler,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  agentHealthData,
  channelRevenueData,
  creativeGenerationData,
  facebookCampaignData,
  googleAdsCampaigns,
  instagramCampaignData,
  meetingTranscriptions,
  userActivityFeed,
} from '../mockData';
import { BLUE_PRIMARY, BORDER_DEFAULT, BORDER_SUBTLE, SURFACE_CARD } from '../theme';

type GraphNodeKind = 'core' | 'domain' | 'record';

type GraphMeta = {
  id: string;
  label: string;
  kind: GraphNodeKind;
  category: string;
  source: string;
  summary: string;
  facts: string[];
  accent: string;
};

type FloatingEdgeData = {
  relation: string;
  start?: GraphPoint;
  end?: GraphPoint;
};

type GraphPoint = {
  x: number;
  y: number;
};

const categoryColors = {
  core: '#2CC2EE',
  campaigns: '#60A5FA',
  agents: '#A78BFA',
  transcriptions: '#34D399',
  content: '#F59E0B',
  emails: '#F87171',
  clients: '#22D3EE',
  products: '#C084FC',
};

const graphMeta: GraphMeta[] = [
  {
    id: 'hub',
    label: 'HUB Second Brain',
    kind: 'core',
    category: 'Knowledge Base',
    source: 'All operational streams',
    summary: 'Central graph where campaigns, clients, agents, transcripts, content, emails, and products become connected organizational memory.',
    facts: ['Unifies marketing operations', 'Connects internal products with client service work', 'Acts as the query layer for AI agents'],
    accent: categoryColors.core,
  },
  {
    id: 'campaigns',
    label: 'Campaigns',
    kind: 'domain',
    category: 'Acquisition',
    source: 'Campaign Monitor',
    summary: 'Performance, spend, creative, and conversion data from managed campaigns.',
    facts: [`${googleAdsCampaigns.length} Google Ads campaigns tracked`, `Instagram reach ${instagramCampaignData.reach}`, `Facebook reach ${facebookCampaignData.reach}`],
    accent: categoryColors.campaigns,
  },
  {
    id: 'agents',
    label: 'Agents',
    kind: 'domain',
    category: 'Automation',
    source: 'Agents + Agent Activity',
    summary: 'System and client agents that parse data, generate content, monitor campaigns, and coordinate workflows.',
    facts: [`${agentHealthData.activeAgents} active agents`, `${agentHealthData.runningAutomations} running automations`, `${agentHealthData.completionRate} completion rate`],
    accent: categoryColors.agents,
  },
  {
    id: 'transcriptions',
    label: 'Transcriptions',
    kind: 'domain',
    category: 'Meetings',
    source: 'Transcriptor',
    summary: 'Processed meeting transcripts with key points, participants, action items, and task ownership.',
    facts: [`${meetingTranscriptions.length} processed meeting`, `${meetingTranscriptions[0].participants.length} participants detected`, `${meetingTranscriptions[0].tasks.length} tasks extracted`],
    accent: categoryColors.transcriptions,
  },
  {
    id: 'content',
    label: 'Generated Content',
    kind: 'domain',
    category: 'Creative Ops',
    source: 'Video Publisher + Creative Studio',
    summary: 'Creative requests, videos, titles, tags, thumbnails, and assets generated or scheduled by users and agents.',
    facts: [`${creativeGenerationData.creativesRequested} creatives requested`, creativeGenerationData.platform, creativeGenerationData.status],
    accent: categoryColors.content,
  },
  {
    id: 'emails',
    label: 'Emails',
    kind: 'domain',
    category: 'Communication',
    source: 'Inbox and follow-up signals',
    summary: 'Incoming messages, follow-ups, approvals, and client communication events that can feed agents and tasks.',
    facts: ['7 unread email notifications', 'Client follow-up queue ready', 'Slack and Gmail APIs monitored'],
    accent: categoryColors.emails,
  },
  {
    id: 'clients',
    label: 'Clients',
    kind: 'domain',
    category: 'Accounts',
    source: 'Client agents and CRM context',
    summary: 'Client-specific knowledge around deliverables, meetings, campaigns, approvals, and account history.',
    facts: ['Client X account context', 'Client Y account context', 'AE agents assigned'],
    accent: categoryColors.clients,
  },
  {
    id: 'products',
    label: 'Products',
    kind: 'domain',
    category: 'Owned Business',
    source: 'Revenue and community data',
    summary: 'Internal products, mentorship offers, paid communities, revenue signals, and product-led campaigns.',
    facts: [`Direct sales revenue ${channelRevenueData.find((item) => item.channel === 'Direct Sales')?.revenue ?? 0}`, 'Product XYZ sales tracked', 'Community user activity available'],
    accent: categoryColors.products,
  },
  {
    id: 'google-ads',
    label: 'Google Ads Campaigns',
    kind: 'record',
    category: 'Campaign record',
    source: 'Google Ads monitor',
    summary: 'Paid search and Performance Max campaigns with spend, CTR, conversions, cost per conversion, and ROAS.',
    facts: googleAdsCampaigns.map((campaign) => `${campaign.campaign}: ${campaign.roas} ROAS`),
    accent: categoryColors.campaigns,
  },
  {
    id: 'campaign-x',
    label: 'Campaign X',
    kind: 'record',
    category: 'Cross-platform campaign',
    source: 'Instagram + Facebook campaign cards',
    summary: 'Shared campaign context connecting platform metrics, creative production, leads, and product sales.',
    facts: [`Instagram trend ${instagramCampaignData.trend}`, `Facebook trend ${facebookCampaignData.trend}`, `Product sales ${facebookCampaignData.productSales}`],
    accent: categoryColors.campaigns,
  },
  {
    id: 'transcriptor-agent',
    label: 'Transcriptor Agent',
    kind: 'record',
    category: 'System agent',
    source: 'Agent Manager',
    summary: 'Agent responsible for meeting transcript analysis, action item extraction, and owner attribution.',
    facts: ['Extracts key points', 'Identifies task owners', 'Feeds the graph with meeting knowledge'],
    accent: categoryColors.agents,
  },
  {
    id: 'creative-agent',
    label: 'Creative Gen Agent',
    kind: 'record',
    category: 'System agent',
    source: 'Agent Activity',
    summary: 'Agent connected to creative generation requests and campaign content production.',
    facts: ['2 active tasks', creativeGenerationData.campaign, `${creativeGenerationData.progress}% workflow progress`],
    accent: categoryColors.agents,
  },
  {
    id: 'meeting-growth',
    label: 'Growth Sync',
    kind: 'record',
    category: 'Meeting transcript',
    source: 'Transcriptor card',
    summary: 'Processed growth meeting with participants, key points, and assigned action items.',
    facts: meetingTranscriptions[0].keyPoints.slice(0, 3),
    accent: categoryColors.transcriptions,
  },
  {
    id: 'tasks',
    label: 'Tasks + Owners',
    kind: 'record',
    category: 'Execution layer',
    source: 'Transcription task table',
    summary: 'Action items extracted from meetings and linked to responsible team members.',
    facts: meetingTranscriptions[0].tasks.map((task) => `${task.owner}: ${task.task}`),
    accent: categoryColors.transcriptions,
  },
  {
    id: 'video-publisher',
    label: 'Video Publisher',
    kind: 'record',
    category: 'Content operation',
    source: 'Video Publisher',
    summary: 'Scheduled video content, metadata, thumbnails, status, and social distribution choices.',
    facts: ['PMT_LOVABLE_01', 'PMT_LOVABLE_02', 'Multi-channel publishing targets'],
    accent: categoryColors.content,
  },
  {
    id: 'creative-request',
    label: 'Summer Campaign X',
    kind: 'record',
    category: 'Creative request',
    source: 'User Activity + Creative Generation',
    summary: 'Creative generation request submitted by Joana for Instagram and Facebook campaign assets.',
    facts: [`Requested by ${creativeGenerationData.requestedBy}`, creativeGenerationData.style, userActivityFeed[0].time],
    accent: categoryColors.content,
  },
  {
    id: 'client-x',
    label: 'Client X',
    kind: 'record',
    category: 'Client account',
    source: 'AE - Client X',
    summary: 'Client account context for brief reviews, follow-ups, deliverables, and campaign status.',
    facts: ['AE agent configured', 'CRM context available', 'Meeting notes connected'],
    accent: categoryColors.clients,
  },
  {
    id: 'product-xyz',
    label: 'Product XYZ',
    kind: 'record',
    category: 'Owned product',
    source: 'Revenue and campaign data',
    summary: 'Owned product connected to campaign revenue, sales conversion, and direct sales channels.',
    facts: ['Sales value updated to $8,400', 'Campaign sales attribution available', 'Direct Sales channel linked'],
    accent: categoryColors.products,
  },
];

const nodePositions: Record<string, { x: number; y: number }> = {
  hub: { x: 520, y: 315 },
  campaigns: { x: 520, y: 95 },
  agents: { x: 730, y: 175 },
  transcriptions: { x: 790, y: 345 },
  content: { x: 650, y: 535 },
  emails: { x: 390, y: 535 },
  clients: { x: 250, y: 345 },
  products: { x: 310, y: 175 },
  'google-ads': { x: 395, y: 10 },
  'campaign-x': { x: 645, y: 10 },
  'transcriptor-agent': { x: 895, y: 205 },
  'creative-agent': { x: 830, y: 55 },
  'meeting-growth': { x: 980, y: 345 },
  tasks: { x: 890, y: 500 },
  'video-publisher': { x: 760, y: 675 },
  'creative-request': { x: 545, y: 690 },
  'client-x': { x: 70, y: 365 },
  'product-xyz': { x: 130, y: 115 },
};

const relationshipEdges: Edge[] = [
  makeEdge('hub', 'campaigns', 'stores campaign data'),
  makeEdge('hub', 'agents', 'orchestrates agents'),
  makeEdge('hub', 'transcriptions', 'stores meeting memory'),
  makeEdge('hub', 'content', 'stores creative assets'),
  makeEdge('hub', 'emails', 'captures communication'),
  makeEdge('hub', 'clients', 'maps accounts'),
  makeEdge('hub', 'products', 'tracks owned offers'),
  makeEdge('campaigns', 'google-ads', 'paid acquisition'),
  makeEdge('campaigns', 'campaign-x', 'platform performance'),
  makeEdge('agents', 'transcriptor-agent', 'meeting analysis'),
  makeEdge('agents', 'creative-agent', 'asset generation'),
  makeEdge('transcriptions', 'meeting-growth', 'processed transcript'),
  makeEdge('meeting-growth', 'tasks', 'extracts action items'),
  makeEdge('content', 'video-publisher', 'publishes video metadata'),
  makeEdge('content', 'creative-request', 'creative brief'),
  makeEdge('creative-agent', 'creative-request', 'generates assets'),
  makeEdge('campaign-x', 'creative-request', 'uses campaign assets'),
  makeEdge('campaign-x', 'product-xyz', 'attributes sales'),
  makeEdge('clients', 'client-x', 'account context'),
  makeEdge('client-x', 'meeting-growth', 'meeting history'),
  makeEdge('products', 'product-xyz', 'owned revenue'),
  makeEdge('emails', 'client-x', 'follow-ups'),
  makeEdge('tasks', 'agents', 'agent execution'),
];

const graphMetaById = new Map(graphMeta.map((meta) => [meta.id, meta]));

function makeEdge(source: string, target: string, label: string): Edge {
  return {
    id: `${source}-${target}`,
    source,
    target,
    type: 'floating',
    data: { relation: label },
    style: { stroke: 'rgba(255,255,255,0.16)', strokeWidth: 1.35 },
  };
}

function getNodeSize(meta?: GraphMeta) {
  if (meta?.kind === 'core') return 136;
  if (meta?.kind === 'domain') return 118;
  return 104;
}

function getCircleBoundaryPoint(from: GraphPoint, to: GraphPoint, radius: number) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.hypot(dx, dy) || 1;
  const inset = 2;
  const safeRadius = Math.max(1, radius - inset);

  return {
    x: from.x + (dx / distance) * safeRadius,
    y: from.y + (dy / distance) * safeRadius,
  };
}

function FloatingCircleEdge({ id, style, data, interactionWidth }: EdgeProps<FloatingEdgeData>) {
  if (!data?.start || !data?.end) return null;

  const path = `M ${data.start.x},${data.start.y} L ${data.end.x},${data.end.y}`;

  return (
    <BaseEdge
      id={id}
      path={path}
      style={style}
      interactionWidth={interactionWidth}
    />
  );
}

const edgeTypes = {
  floating: FloatingCircleEdge,
};

function getNodeStyle(meta: GraphMeta, isSelected: boolean): React.CSSProperties {
  const size = meta.kind === 'core' ? 136 : meta.kind === 'domain' ? 118 : 104;

  return {
    width: size,
    height: size,
    padding: meta.kind === 'core' ? '16px' : '12px',
    background: meta.kind === 'core' ? '#202436' : SURFACE_CARD,
    border: `1px solid ${isSelected ? meta.accent : `${meta.accent}77`}`,
    borderRadius: '999px',
    color: 'rgba(255,255,255,0.84)',
    boxShadow: isSelected ? `0 0 0 4px ${meta.accent}26, 0 18px 40px rgba(0,0,0,0.28)` : '0 12px 30px rgba(0,0,0,0.16)',
    fontSize: meta.kind === 'core' ? 12 : 10,
    fontWeight: 750,
    lineHeight: 1.18,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'grab',
    whiteSpace: 'normal',
    wordBreak: 'break-word',
  };
}

function getRelationTagStyle(accent: string): React.CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    maxWidth: '100%',
    padding: '5px 10px',
    borderRadius: 999,
    background: `${accent}14`,
    border: `1px solid ${accent}33`,
    color: accent,
    fontSize: 10,
    fontWeight: 800,
    lineHeight: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };
}

function createGraphNodes(selectedNodeId: string): Node[] {
  return graphMeta.map((meta) => ({
    id: meta.id,
    position: nodePositions[meta.id],
    data: { label: meta.label },
    style: getNodeStyle(meta, meta.id === selectedNodeId),
  }));
}

const initialGraphNodes = createGraphNodes('hub');

export default function KnowledgeGraphPanel() {
  const [selectedNodeId, setSelectedNodeId] = useState('hub');
  const [graphNodes, setGraphNodes, onNodesChange] = useNodesState(initialGraphNodes);
  const selectedNode = graphMeta.find((node) => node.id === selectedNodeId) || graphMeta[0];
  const relatedEdges = relationshipEdges.filter((edge) => edge.source === selectedNode.id || edge.target === selectedNode.id);
  const nodePositionsById = useMemo(
    () => new Map(graphNodes.map((node) => [node.id, node.position])),
    [graphNodes]
  );

  useEffect(() => {
    setGraphNodes((currentNodes) =>
      currentNodes.map((node) => {
        const meta = graphMetaById.get(node.id);
        if (!meta) return node;

        return {
          ...node,
          data: { label: meta.label },
          style: getNodeStyle(meta, node.id === selectedNodeId),
        };
      })
    );
  }, [selectedNodeId, setGraphNodes]);

  const graphEdges: Edge[] = useMemo(() => relationshipEdges.map((edge) => {
    const isConnectedToSelected = edge.source === selectedNodeId || edge.target === selectedNodeId;
    const selectedAccent = selectedNode.accent;
    const sourceCenter = nodePositionsById.get(edge.source) || nodePositions[edge.source] || { x: 0, y: 0 };
    const targetCenter = nodePositionsById.get(edge.target) || nodePositions[edge.target] || { x: 0, y: 0 };
    const sourceRadius = getNodeSize(graphMetaById.get(edge.source)) / 2;
    const targetRadius = getNodeSize(graphMetaById.get(edge.target)) / 2;

    return {
      ...edge,
      animated: false,
      data: {
        ...edge.data,
        start: getCircleBoundaryPoint(sourceCenter, targetCenter, sourceRadius),
        end: getCircleBoundaryPoint(targetCenter, sourceCenter, targetRadius),
      },
      style: {
        stroke: isConnectedToSelected ? `${selectedAccent}d9` : 'rgba(255,255,255,0.13)',
        strokeWidth: isConnectedToSelected ? 2.15 : 1.25,
        opacity: isConnectedToSelected ? 1 : 0.58,
      },
    };
  }), [nodePositionsById, selectedNode.accent, selectedNodeId]);

  const handleNodeDragStart: NodeDragHandler = (_, node) => {
    setSelectedNodeId(node.id);
  };

  const handleNodeDragStop: NodeDragHandler = (_, node) => {
    setSelectedNodeId(node.id);
  };

  return (
    <section className="flex flex-col gap-4 h-full min-h-[calc(100vh-48px)]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="rounded-full flex-shrink-0" style={{ width: 2, height: 14, background: BLUE_PRIMARY }} />
          <span style={{ color: BLUE_PRIMARY, fontSize: 27, fontWeight: 650, lineHeight: 1.15 }}>
            Knowledge Graph
          </span>
        </div>
        <div className="flex items-center gap-2">
          {['Campaigns', 'Agents', 'Transcripts', 'Content', 'Clients'].map((label) => (
            <span
              key={label}
              className="rounded-full"
              style={{
                padding: '4px 8px',
                color: 'rgba(255,255,255,0.5)',
                background: 'rgba(255,255,255,0.035)',
                border: `1px solid ${BORDER_SUBTLE}`,
                fontSize: 10,
                fontWeight: 700,
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-4 flex-1 min-h-[640px]" style={{ gridTemplateColumns: 'minmax(0, 1fr) 345px' }}>
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{ background: '#101016', border: `1px solid ${BORDER_DEFAULT}` }}
        >
          <ReactFlow
            nodes={graphNodes}
            edges={graphEdges}
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange}
            onNodeClick={(_, node) => setSelectedNodeId(node.id)}
            onNodeDragStart={handleNodeDragStart}
            onNodeDragStop={handleNodeDragStop}
            nodeOrigin={[0.5, 0.5]}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.35}
            maxZoom={1.25}
            nodesDraggable
            nodeDragThreshold={4}
            panOnDrag
            proOptions={{ hideAttribution: true }}
            className="knowledge-graph-flow"
          >
            <Background color="rgba(255,255,255,0.08)" gap={22} size={1} />
            <MiniMap
              nodeColor={(node) => graphMeta.find((item) => item.id === node.id)?.accent || BLUE_PRIMARY}
              maskColor="rgba(0,0,0,0.42)"
              style={{
                position: 'absolute',
                right: 8,
                bottom: 8,
                width: 140,
                height: 105,
                background: '#15151b',
                border: `1px solid ${BORDER_DEFAULT}`,
                borderRadius: 6,
                zIndex: 40,
                boxShadow: '0 14px 32px rgba(0,0,0,0.35)',
              }}
            />
            <Controls showInteractive={false} />
          </ReactFlow>
        </div>

        <aside
          className="rounded-2xl p-4 flex flex-col gap-4"
          style={{ background: SURFACE_CARD, border: `1px solid ${BORDER_DEFAULT}` }}
        >
          <div>
            <div className="flex items-center justify-between gap-3" style={{ minWidth: 0 }}>
              <h2 style={{ margin: 0, color: 'rgba(255,255,255,0.88)', fontSize: 18, lineHeight: 1.22, minWidth: 0 }}>
                {selectedNode.label}
              </h2>
              <span
                className="rounded-full inline-flex flex-shrink-0"
                style={{
                  padding: '4px 8px',
                  color: selectedNode.accent,
                  background: `${selectedNode.accent}14`,
                  border: `1px solid ${selectedNode.accent}33`,
                  fontSize: 10,
                  fontWeight: 800,
                }}
              >
                {selectedNode.category}
              </span>
            </div>
            <p style={{ margin: '9px 0 0', color: 'rgba(255,255,255,0.58)', fontSize: 12, lineHeight: 1.45 }}>
              {selectedNode.summary}
            </p>
          </div>

          <div>
            <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: 10, fontWeight: 800, marginBottom: 8 }}>
              FACTS
            </div>
            <div className="flex flex-col gap-2">
              {selectedNode.facts.map((fact) => (
                <div key={fact} className="flex gap-2" style={{ color: 'rgba(255,255,255,0.66)', fontSize: 12, lineHeight: 1.35 }}>
                  <span className="rounded-full flex-shrink-0" style={{ width: 6, height: 6, marginTop: 5, background: selectedNode.accent }} />
                  <span>{fact}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: 10, fontWeight: 800, marginBottom: 8 }}>
              RELATIONS
            </div>
            <div className="flex flex-wrap gap-2">
              {relatedEdges.map((edge) => {
                const relatedId = edge.source === selectedNode.id ? edge.target : edge.source;
                const related = graphMeta.find((node) => node.id === relatedId);
                const tagAccent = related?.accent || selectedNode.accent;
                return (
                  <button
                    key={edge.id}
                    className="text-left"
                    onClick={() => setSelectedNodeId(relatedId)}
                    title={related?.label || relatedId}
                    style={getRelationTagStyle(tagAccent)}
                  >
                    <span>{String(edge.data?.relation || 'related')}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
