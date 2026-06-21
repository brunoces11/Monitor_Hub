import MonitorCard, { type MonitorColumn, type MonitorRow } from './MonitorCard';

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

const memoryUnitMultipliers: Record<string, number> = {
  b: 1,
  kib: 1024,
  kb: 1000,
  mib: 1024 ** 2,
  mb: 1000 ** 2,
  gib: 1024 ** 3,
  gb: 1000 ** 3,
  tib: 1024 ** 4,
  tb: 1000 ** 4,
};

function parseMemoryBytes(value: MonitorRow[string]) {
  const text = String(value ?? '').trim().toLowerCase();
  const match = text.match(/^([\d.]+)\s*([a-z]+)?$/);
  if (!match) return 0;

  const amount = Number(match[1]);
  const unit = match[2] || 'b';
  if (!Number.isFinite(amount)) return 0;

  return amount * (memoryUnitMultipliers[unit] ?? 1);
}

function sortRowsByMemoryDesc(rows: MonitorRow[]) {
  return [...rows].sort((a, b) => parseMemoryBytes(b.mem) - parseMemoryBytes(a.mem));
}

export default function VpsMonitorCard({ active }: VpsMonitorCardProps) {
  return (
    <MonitorCard
      active={active}
      endpoint="/api/sync/vps-monitor"
      fallbackColumns={fallbackColumns}
      fallbackTitle="Server Monitor"
      sortRows={sortRowsByMemoryDesc}
      tableMinWidth={760}
    />
  );
}
