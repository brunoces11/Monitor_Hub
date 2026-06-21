import MonitorCard, { type MonitorColumn } from './MonitorCard';

interface VpsMonitorCardProps {
  active: boolean;
}

const fallbackColumns: MonitorColumn[] = [
  { key: 'service_name', label: 'SERVICE NAME' },
  { key: 'state', label: 'STATE' },
  { key: 'cpu', label: 'CPU' },
  { key: 'mem', label: 'MEM' },
  { key: 'mem_percent', label: 'MEM%' },
  { key: 'uptime', label: 'UPTIME' },
];

export default function VpsMonitorCard({ active }: VpsMonitorCardProps) {
  return (
    <MonitorCard
      active={active}
      endpoint="/api/sync/vps-monitor"
      fallbackColumns={fallbackColumns}
      fallbackTitle="Server Monitor"
      tableMinWidth={760}
    />
  );
}
