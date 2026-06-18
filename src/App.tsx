import { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import CreativeGenerationPanel from './components/CreativeGenerationPanel';
import VideoAnimationsPanel from './components/VideoAnimationsPanel';
import CampaignCard from './components/CampaignCard';
import WorkflowStatusChart from './components/WorkflowStatusChart';
import ChannelRevenueChart from './components/ChannelRevenueChart';
import ActivityFeed from './components/ActivityFeed';
import AgentHealthPanel from './components/AgentHealthPanel';
import {
  creativeGenerationData,
  videoAnimationsData,
  instagramCampaignData,
  facebookCampaignData,
  workflowStatusData,
  channelRevenueData,
  activityFeed,
  agentHealthData,
} from './mockData';
import { BLUE_PRIMARY, BLUE_SECONDARY } from './theme';

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0d0d12', color: '#f1f5f9' }}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((v) => !v)} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar />

        <main className="flex-1 overflow-y-auto" style={{ padding: '28px 32px' }}>
          <div className="relative" style={{ zIndex: 1, maxWidth: 1400 }}>

            {/* Active Workflows */}
            <SectionLabel label="Active Workflows" />
            <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
              <CreativeGenerationPanel {...creativeGenerationData} />
              <VideoAnimationsPanel {...videoAnimationsData} />
            </div>

            {/* Campaign X */}
            <div className="mt-8">
              <SectionLabel label="Campaign X — Platform Performance" />
              <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))' }}>
                <CampaignCard
                  platform="instagram"
                  title="Campaign X — Instagram"
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
                  title="Campaign X — Facebook Ads"
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
            </div>

            {/* Analytics & Operations */}
            <div className="mt-8">
              <SectionLabel label="Analytics & Operations" />
              <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                <WorkflowStatusChart data={workflowStatusData} />
                <ChannelRevenueChart data={channelRevenueData} />
                <ActivityFeed items={activityFeed} />
              </div>
            </div>

            {/* Agent Infrastructure */}
            <div className="mt-8 mb-10">
              <SectionLabel label="Agent Infrastructure" />
              <AgentHealthPanel {...agentHealthData} />
            </div>

          </div>
        </main>
      </div>
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
