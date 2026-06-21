import MonitorCard, { type MonitorColumn } from './MonitorCard';

interface ServiceMonitorCardProps {
  active: boolean;
}

const fallbackColumns: MonitorColumn[] = [
  { key: 'service_name', label: 'SERVICE NAME' },
  { key: 'stats', label: 'STATS' },
  { key: 'last_check', label: 'LAST CHECK' },
];

export default function ServiceMonitorCard({ active }: ServiceMonitorCardProps) {
  return (
    <MonitorCard
      active={active}
      endpoint="/api/sync/service-monitor"
      fallbackColumns={fallbackColumns}
      fallbackTitle="API Monitor"
      tableMinWidth={360}
    />
  );
}
