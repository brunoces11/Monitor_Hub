export const kpiCards = [
  { label: 'Active Users', value: '18', trend: '+12.4%', trendUp: true, icon: 'user' },
  { label: 'Flows in Progress', value: '7', trend: '+3', trendUp: true, icon: 'arrows' },
  { label: 'Total Leads Today', value: '427', trend: '+8.7%', trendUp: true, icon: 'heart-filled' },
  { label: 'Conversion Rate', value: '14.8%', trend: '-3.1%', trendUp: false, icon: 'chart' },
  { label: 'Revenue Today', value: '$8,812', trend: '+19.2%', trendUp: true, icon: 'card' },
  { label: 'Tasks Completed', value: '42', trend: '+6', trendUp: true, icon: 'check' },
];

export const creativeGenerationData = {
  requestedBy: 'Joana',
  campaign: 'Summer Campaign X',
  creativesRequested: 5,
  style: 'Bold / Clean / Conversion-focused',
  platform: 'Instagram + Facebook',
  status: 'Running',
  progress: 68,
  steps: [
    { label: 'Brief analysis', done: true },
    { label: 'Style matching', done: true },
    { label: 'Asset generation', done: false },
    { label: 'Quality review', done: false },
    { label: 'Export & delivery', done: false },
  ],
};

export const videoAnimationsData = {
  requestedBy: 'Ana',
  project: 'Product Launch Reel',
  variations: 3,
  duration: '15 sec',
  aspectRatio: '9:16',
  status: 'Queued',
  progress: 0,
  steps: [
    { label: 'Script parsing', done: false },
    { label: 'Scene composition', done: false },
    { label: 'Animation render', done: false },
    { label: 'Audio sync', done: false },
    { label: 'Final export', done: false },
  ],
};

export const facebookAdsData = {
  spend: '$1,240',
  ctr: '3.9%',
  cpc: '$0.84',
  leads: 213,
  roas: '4.3x',
  revenue: '$5,332',
  status: 'Healthy',
  chartData: [
    { day: 'Mon', spend: 180, revenue: 720 },
    { day: 'Tue', spend: 160, revenue: 680 },
    { day: 'Wed', spend: 200, revenue: 920 },
    { day: 'Thu', spend: 220, revenue: 1010 },
    { day: 'Fri', spend: 195, revenue: 870 },
    { day: 'Sat', spend: 145, revenue: 620 },
    { day: 'Sun', spend: 140, revenue: 512 },
  ],
};

export const instagramCampaignData = {
  reach: '48,200',
  newLeads24h: 186,
  leadConvRate: '14.8%',
  salesConvRate: '4.2%',
  productSales: '$3,480',
  trend: '+11.2%',
  trendUp: true,
  status: 'Scaling',
  chartData: [
    { day: 'Mon', leads: 22, sales: 8 },
    { day: 'Tue', leads: 30, sales: 12 },
    { day: 'Wed', leads: 28, sales: 10 },
    { day: 'Thu', leads: 35, sales: 15 },
    { day: 'Fri', leads: 32, sales: 13 },
    { day: 'Sat', leads: 20, sales: 7 },
    { day: 'Sun', leads: 19, sales: 6 },
  ],
  funnelData: [
    { name: 'Reach', value: 48200 },
    { name: 'Engaged', value: 7230 },
    { name: 'Leads', value: 1070 },
    { name: 'Sales', value: 201 },
  ],
};

export const facebookCampaignData = {
  reach: '62,900',
  newLeads24h: 241,
  leadConvRate: '16.3%',
  salesConvRate: '5.1%',
  productSales: '$4,920',
  trend: '+8.6%',
  trendUp: true,
  status: 'Healthy',
  chartData: [
    { day: 'Mon', leads: 31, sales: 14 },
    { day: 'Tue', leads: 38, sales: 18 },
    { day: 'Wed', leads: 34, sales: 16 },
    { day: 'Thu', leads: 42, sales: 21 },
    { day: 'Fri', leads: 40, sales: 19 },
    { day: 'Sat', leads: 28, sales: 11 },
    { day: 'Sun', leads: 28, sales: 12 },
  ],
  funnelData: [
    { name: 'Reach', value: 62900 },
    { name: 'Engaged', value: 10280 },
    { name: 'Leads', value: 1677 },
    { name: 'Sales', value: 241 },
  ],
};

export const googleAdsCampaigns = [
  {
    campaign: 'Brand Search - Brazil',
    status: 'Enabled',
    budget: 'R$ 320/day',
    impressions: '84,200',
    clicks: '6,740',
    ctr: '8.0%',
    avgCpc: 'R$ 1.18',
    conversions: '412',
    costPerConv: 'R$ 19.31',
    spend: 'R$ 7,956',
    roas: '6.4x',
  },
  {
    campaign: 'Performance Max - CRM Demo',
    status: 'Learning',
    budget: 'R$ 480/day',
    impressions: '126,900',
    clicks: '7,110',
    ctr: '5.6%',
    avgCpc: 'R$ 1.54',
    conversions: '368',
    costPerConv: 'R$ 29.74',
    spend: 'R$ 10,945',
    roas: '4.8x',
  },
  {
    campaign: 'YouTube Retargeting - Q3 Push',
    status: 'Limited',
    budget: 'R$ 210/day',
    impressions: '241,300',
    clicks: '4,860',
    ctr: '2.0%',
    avgCpc: 'R$ 0.72',
    conversions: '146',
    costPerConv: 'R$ 23.96',
    spend: 'R$ 3,498',
    roas: '3.7x',
  },
];

export const leadGenerationData = [
  {
    dateRegistered: '22/06/2026',
    userName: 'Marcos Silva',
    email: 'marcos.silva@gmail.com',
    phone: '+55 11 99876-2211',
    source: 'Instagram Ads',
    product: 'Creative Generation',
    status: 'Purchased',
  },
  {
    dateRegistered: '22/06/2026',
    userName: 'Beatriz Lima',
    email: 'beatriz.lima@company.com',
    phone: '+55 21 98741-8820',
    source: 'Google Ads',
    product: 'Campaign Monitor',
    status: 'Refunded',
  },
  {
    dateRegistered: '21/06/2026',
    userName: 'Rafael Costa',
    email: 'rafael.costa@startup.io',
    phone: '+55 31 99122-4405',
    source: 'Landing Page',
    product: 'Video Publisher',
    status: 'Purchased',
  },
  {
    dateRegistered: '21/06/2026',
    userName: 'Juliana Pereira',
    email: 'juliana.pereira@agency.com',
    phone: '+55 41 99731-1189',
    source: 'Facebook Ads',
    product: 'Lead Parser',
    status: 'Lead',
  },
];

export const meetingTranscriptions = [
  {
    id: 'mtg-growth-2026-06-27',
    day: '27',
    month: 'JUN',
    title: 'ZOOM: Q3 launch readiness, campaign handoff, and CRM follow-up priorities',
    participants: [
      { name: 'Joana', avatar: '/avatars/joana_48.jpg' },
      { name: 'Ana', initials: 'AN', color: '#7C3AED' },
      { name: 'Marina', initials: 'MA', color: '#0EA5E9' },
      { name: 'Carlos', initials: 'CA', color: '#16A34A' },
    ],
    keyPoints: [
      'Campaign launch depends on final landing page QA and updated conversion events.',
      'CRM import needs duplicate cleanup before the next outbound sequence is triggered.',
      'Creative review approved the first two video angles and requested shorter CTAs.',
      'Reporting cadence will move to twice per week until the Q3 launch stabilizes.',
    ],
    tasks: [
      { task: 'Validate final landing page tracking events', owner: 'Ana' },
      { task: 'Clean CRM duplicate leads before import', owner: 'Marina' },
      { task: 'Rewrite CTA variants for approved video angles', owner: 'Joana' },
      { task: 'Prepare Q3 launch status report template', owner: 'Carlos' },
    ],
  },
];

export const workflowStatusData = [
  { name: 'Running', value: 7, color: '#22d3ee' },
  { name: 'Queued', value: 5, color: '#6366f1' },
  { name: 'Completed', value: 42, color: '#4ade80' },
  { name: 'Failed', value: 2, color: '#f87171' },
];

export const channelRevenueData = [
  { channel: 'Instagram', revenue: 3480, color: '#e879f9' },
  { channel: 'Facebook Ads', revenue: 4920, color: '#60a5fa' },
  { channel: 'Organic', revenue: 1240, color: '#4ade80' },
  { channel: 'Email', revenue: 890, color: '#fbbf24' },
  { channel: 'Direct Sales', revenue: 2180, color: '#22d3ee' },
];

export const activityFeed: Array<{
  id: number;
  user: string;
  action: string;
  target: string;
  time: string;
  status: 'info' | 'success' | 'warning' | 'error';
  icon: string;
}> = [
  {
    id: 2,
    user: 'System',
    action: 'Campaign X Instagram metrics updated',
    target: '+11.2% leads growth detected',
    time: '8 min ago',
    status: 'success',
    icon: 'chart',
  },
  {
    id: 4,
    user: 'System',
    action: 'Product XYZ sales value updated',
    target: '$8,400 total revenue',
    time: '22 min ago',
    status: 'success',
    icon: 'card',
  },
  {
    id: 5,
    user: 'Agent-03',
    action: 'completed lead parsing task',
    target: '213 new leads ingested',
    time: '31 min ago',
    status: 'success',
    icon: 'brain',
  },
  {
    id: 6,
    user: 'System',
    action: 'Error detected in workflow WF-009',
    target: 'Retry scheduled in 5 min',
    time: '48 min ago',
    status: 'error',
    icon: 'error-filled',
  },
];

export const userActivityFeed = [
  {
    id: 1,
    user: 'Joana',
    action: 'submitted a Creative Generation request',
    target: 'Summer Campaign X',
    time: '2 min ago',
    status: 'info' as const,
    icon: 'ai-image',
  },
  {
    id: 3,
    user: 'Ana',
    action: 'queued a video workflow',
    target: 'Product Launch Reel',
    time: '15 min ago',
    status: 'warning' as const,
    icon: 'ai-video',
  },
  {
    id: 7,
    user: 'Marina',
    action: 'reviewed campaign assets',
    target: 'Facebook Ads refresh',
    time: '27 min ago',
    status: 'success' as const,
    icon: 'check',
  },
];

export const serverActivityFeed = activityFeed;

export const agentHealthData: {
  activeAgents: number;
  runningAutomations: number;
  errorCount: number;
  completionRate: string;
  agents: Array<{ name: string; status: 'active' | 'idle'; tasks: number }>;
} = {
  activeAgents: 4,
  runningAutomations: 7,
  errorCount: 2,
  completionRate: '95.4%',
  agents: [
    { name: 'Lead Parser Agent', status: 'active', tasks: 3 },
    { name: 'Creative Gen Agent', status: 'active', tasks: 2 },
    { name: 'Campaign Monitor', status: 'active', tasks: 5 },
    { name: 'Content Scheduler', status: 'idle', tasks: 0 },
    { name: 'Analytics Sync', status: 'active', tasks: 3 },
  ],
};
