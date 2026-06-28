import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import RightSidebar from './components/RightSidebar';
import CreativeGenerationPanel from './components/CreativeGenerationPanel';
import VideoAnimationsPanel from './components/VideoAnimationsPanel';
import CampaignCard from './components/CampaignCard';
import GoogleAdsMonitorCard from './components/GoogleAdsMonitorCard';
import LeadGenerationTable from './components/LeadGenerationTable';
import WorkflowStatusChart from './components/WorkflowStatusChart';
import ChannelRevenueChart from './components/ChannelRevenueChart';
import ActivityFeed from './components/ActivityFeed';
import AgentHealthPanel from './components/AgentHealthPanel';
import VpsMonitorCard from './components/VpsMonitorCard';
import ServiceMonitorCard from './components/ServiceMonitorCard';
import VideoPublisherTable from './components/VideoPublisherTable';
import AgentsPanel from './components/AgentsPanel';
import TranscriptionCard from './components/TranscriptionCard';
import KnowledgeGraphPanel from './components/KnowledgeGraphPanel';
import EmailPanel from './components/EmailPanel';
import {
  creativeGenerationData,
  videoAnimationsData,
  googleAdsCampaigns,
  leadGenerationData,
  meetingTranscriptions,
  instagramCampaignData,
  facebookCampaignData,
  workflowStatusData,
  channelRevenueData,
  userActivityFeed,
  serverActivityFeed,
  agentHealthData,
} from './mockData';
import { BLUE_PRIMARY, BLUE_SECONDARY, BORDER_DEFAULT, SURFACE_CARD } from './theme';

const sectionLabels: Record<string, string> = {
  overview: 'System Monitor',
  'creative-studio': 'Video Publisher',
  'thumbnail-creator': 'Thumbnail Creator',
  'video-animations': 'Video Creator',
  'campaign-monitor': 'Campaign Monitor',
  'leads-revenue': 'Leads Funnel',
  workflows: 'Workflows',
  agents: 'Agent Manager',
  transcriptor: 'Transcriptor Agent',
  'knowledge-graph': 'Memory Graph',
  emails: 'AI Email Inbox',
};

const UI_STATE_STORAGE_KEY = 'monitor-hub-ui-state';

type PersistedUiState = {
  activeSection: string;
  sidebarCollapsed: boolean;
  rightChatExpanded: boolean;
  activeChatAgent: string | null;
};

function readPersistedUiState(): PersistedUiState | null {
  if (typeof window === 'undefined') return null;

  try {
    const rawValue = window.localStorage.getItem(UI_STATE_STORAGE_KEY);
    if (!rawValue) return null;

    const parsedValue = JSON.parse(rawValue) as Partial<PersistedUiState>;
    if (typeof parsedValue.activeSection !== 'string') return null;

    return {
      activeSection: parsedValue.activeSection,
      sidebarCollapsed: parsedValue.sidebarCollapsed ?? false,
      rightChatExpanded: parsedValue.rightChatExpanded ?? false,
      activeChatAgent: typeof parsedValue.activeChatAgent === 'string' ? parsedValue.activeChatAgent : null,
    };
  } catch {
    return null;
  }
}

export default function App() {
  const persistedUiState = readPersistedUiState();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(persistedUiState?.sidebarCollapsed ?? false);
  const [rightChatExpanded, setRightChatExpanded] = useState(persistedUiState?.rightChatExpanded ?? false);
  const [rightChatOpenSignal, setRightChatOpenSignal] = useState(0);
  const [activeChatAgent, setActiveChatAgent] = useState<string | null>(persistedUiState?.activeChatAgent ?? null);
  const [activeSection, setActiveSection] = useState(persistedUiState?.activeSection ?? 'overview');
  const mainPadding = activeSection === 'agents' || activeSection === 'transcriptor' || activeSection === 'knowledge-graph'
    ? '24px 24px 24px'
    : activeSection === 'emails'
      ? '14px 8px 8px'
      : '20px 8px 8px';

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.localStorage.setItem(
      UI_STATE_STORAGE_KEY,
      JSON.stringify({
        activeSection,
        sidebarCollapsed,
        rightChatExpanded,
        activeChatAgent,
      } satisfies PersistedUiState),
    );
  }, [activeChatAgent, activeSection, rightChatExpanded, sidebarCollapsed]);

  const handleRightChatToggle = () => {
    if (rightChatExpanded) {
      setRightChatExpanded(false);
      return;
    }

    setRightChatOpenSignal((current) => current + 1);
    setRightChatExpanded(true);
    setSidebarCollapsed(true);
  };

  const handleOpenAgentChat = (agentName: string) => {
    setActiveChatAgent(agentName);
    setRightChatOpenSignal((current) => current + 1);
    setRightChatExpanded(true);
    setSidebarCollapsed(true);
  };

  const handleOpenTranscriptionChat = () => {
    setActiveChatAgent('Transcription');
    setRightChatOpenSignal((current) => current + 1);
    setRightChatExpanded(true);
    setSidebarCollapsed(true);
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0d0d12', color: '#f1f5f9' }}>
      <Sidebar
        collapsed={sidebarCollapsed}
        active={activeSection}
        onToggle={() => setSidebarCollapsed((v) => !v)}
        onActiveChange={setActiveSection}
        onOpenEmails={() => setActiveSection('emails')}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto" style={{ padding: mainPadding }}>
          <div className="relative" style={{ zIndex: 1, maxWidth: '100%' }}>
            {activeSection === 'overview' && <OverviewPanel />}
            {activeSection === 'campaign-monitor' && <CampaignMonitorPanel />}
            {activeSection === 'leads-revenue' && <LeadsRevenuePanel />}
            {activeSection === 'creative-studio' && <VideoPublisherPanel />}
            {activeSection === 'agents' && <AgentsPanel onOpenAgentChat={handleOpenAgentChat} />}
            {activeSection === 'transcriptor' && <TranscriptorPanel onOpenTranscriptionChat={handleOpenTranscriptionChat} />}
            {activeSection === 'knowledge-graph' && <KnowledgeGraphPanel />}
            {activeSection === 'emails' && <EmailPanel />}
            {activeSection !== 'overview' && activeSection !== 'campaign-monitor' && activeSection !== 'leads-revenue' && activeSection !== 'creative-studio' && activeSection !== 'agents' && activeSection !== 'transcriptor' && activeSection !== 'knowledge-graph' && activeSection !== 'emails' && (
              <PendingSection title={sectionLabels[activeSection] || 'Section'} />
            )}
          </div>
        </main>
      </div>

      <RightSidebar expanded={rightChatExpanded} onToggle={handleRightChatToggle} activeAgentName={activeChatAgent} openSignal={rightChatOpenSignal} />
    </div>
  );
}

function OverviewPanel() {
  return (
    <>
      <div className="grid gap-5 items-start mb-8" style={{ gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)' }}>
        <div style={{ minWidth: 0 }}>
          <VpsMonitorCard active />
        </div>
        <div style={{ minWidth: 0 }}>
          <ServiceMonitorCard active />
        </div>
      </div>

      <div className="grid gap-5 items-start mb-8" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
        <div style={{ minWidth: 0 }}>
          <ActivityFeed title="User Activity" items={userActivityFeed} />
        </div>
        <div style={{ minWidth: 0 }}>
          <AgentHealthPanel title="Agent Activity" {...agentHealthData} />
        </div>
        <div style={{ minWidth: 0 }}>
          <ActivityFeed title="Server Activity" items={serverActivityFeed} />
        </div>
      </div>

      <SectionLabel label="Active Workflows" />
      <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
        <CreativeGenerationPanel {...creativeGenerationData} />
        <VideoAnimationsPanel {...videoAnimationsData} />
      </div>

      <div className="mt-8">
        <SectionLabel label="Analytics & Operations" />
        <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          <WorkflowStatusChart data={workflowStatusData} />
          <ChannelRevenueChart data={channelRevenueData} />
        </div>
      </div>

    </>
  );
}

function CampaignMonitorPanel() {
  return (
    <>
      <div className="mb-5">
        <GoogleAdsMonitorCard campaigns={googleAdsCampaigns} />
      </div>

      <SectionLabel label="Campaign X - Platform Performance" />
      <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
        <CampaignCard
          platform="instagram"
          title="Campaign X"
          reach={instagramCampaignData.reach}
          newLeads24h={instagramCampaignData.newLeads24h}
          leadConvRate={instagramCampaignData.leadConvRate}
          salesConvRate={instagramCampaignData.salesConvRate}
          productSales={instagramCampaignData.productSales}
          trend={instagramCampaignData.trend}
          trendUp={instagramCampaignData.trendUp}
          status={instagramCampaignData.status}
          chartData={instagramCampaignData.chartData}
          funnelData={instagramCampaignData.funnelData}
        />
        <CampaignCard
          platform="facebook"
          title="Campaign X"
          reach={facebookCampaignData.reach}
          newLeads24h={facebookCampaignData.newLeads24h}
          leadConvRate={facebookCampaignData.leadConvRate}
          salesConvRate={facebookCampaignData.salesConvRate}
          productSales={facebookCampaignData.productSales}
          trend={facebookCampaignData.trend}
          trendUp={facebookCampaignData.trendUp}
          status={facebookCampaignData.status}
          chartData={facebookCampaignData.chartData}
          funnelData={facebookCampaignData.funnelData}
        />
      </div>
    </>
  );
}

function LeadsRevenuePanel() {
  return (
    <>
      <div className="mb-5">
        <LeadGenerationTable leads={leadGenerationData} />
      </div>
    </>
  );
}

function VideoPublisherPanel() {
  return (
    <>
      <VideoPublisherTable />
    </>
  );
}

function TranscriptorPanel({ onOpenTranscriptionChat }: { onOpenTranscriptionChat: () => void }) {
  return (
    <>
      <SectionLabel label="Transcriptor" />
      <div className="flex flex-col gap-5">
        {meetingTranscriptions.map((meeting) => (
          <TranscriptionCard key={meeting.id} meeting={meeting} onOpenChat={onOpenTranscriptionChat} />
        ))}
      </div>
    </>
  );
}

function PendingSection({ title }: { title: string }) {
  return (
    <div className="rounded-2xl p-6" style={{ background: SURFACE_CARD, border: `1px solid ${BORDER_DEFAULT}` }}>
      <SectionLabel label={title} />
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div
        className="rounded-full flex-shrink-0"
        style={{ width: 2, height: 14, background: `linear-gradient(180deg, ${BLUE_PRIMARY}, ${BLUE_SECONDARY})` }}
      />
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
        {label}
      </span>
    </div>
  );
}
