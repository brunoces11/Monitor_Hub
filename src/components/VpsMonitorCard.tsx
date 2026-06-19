import { useEffect, useState } from 'react';
import { PIcon, PText } from '@porsche-design-system/components-react';
import { BLUE_PRIMARY, BORDER_DEFAULT, BORDER_SUBTLE, SURFACE_CARD } from '../theme';

type MonitorColumn = {
  key: string;
  label: string;
};

type MonitorRow = Record<string, string | number | null | undefined>;

type VpsMonitorData = {
  title?: string;
  updated_at?: string | null;
  refresh_interval_ms?: number;
  columns?: MonitorColumn[];
  services?: MonitorRow[];
  containers?: MonitorRow[];
  totals?: MonitorRow | null;
};

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

const defaultRefreshInterval = 15000;

function formatCellValue(value: MonitorRow[string]) {
  if (value === null || value === undefined) return '-';
  return String(value);
}

function getStateColor(state: string) {
  if (state.toLowerCase() === 'running') return '#4ADE80';
  if (state.toLowerCase() === 'exited') return '#F87171';
  return 'rgba(255,255,255,0.58)';
}

export default function VpsMonitorCard({ active }: VpsMonitorCardProps) {
  const [data, setData] = useState<VpsMonitorData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastReadAt, setLastReadAt] = useState<string | null>(null);

  useEffect(() => {
    if (!active) return;

    let cancelled = false;
    let timeoutId: number | undefined;

    async function loadMonitorData() {
      setLoading(true);
      try {
        const response = await fetch('/api/sync/vps-monitor', { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const monitorData = (await response.json()) as VpsMonitorData;
        if (cancelled) return defaultRefreshInterval;

        setData(monitorData);
        setLastReadAt(
          new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
        );
        setError(null);
        return monitorData.refresh_interval_ms || defaultRefreshInterval;
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load monitor data');
        }
        return defaultRefreshInterval;
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    function scheduleNextRead(refreshInterval: number) {
      timeoutId = window.setTimeout(async () => {
        const nextRefreshInterval = await loadMonitorData();
        if (!cancelled) scheduleNextRead(nextRefreshInterval);
      }, refreshInterval);
    }

    loadMonitorData().then((refreshInterval) => {
      if (!cancelled) scheduleNextRead(refreshInterval);
    });

    return () => {
      cancelled = true;
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [active]);

  const columns = data?.columns?.length ? data.columns : fallbackColumns;
  const services = data?.services ?? data?.containers ?? [];
  const title = data?.title || 'VPS Monitor';

  return (
    <section
      className="rounded-2xl p-5 mb-8"
      style={{ background: SURFACE_CARD, border: `1px solid ${BORDER_DEFAULT}` }}
      aria-label={title}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-2.5">
          <PIcon name="grid" size="small" color="inherit" theme="dark" aria={{ 'aria-label': title }} style={{ color: BLUE_PRIMARY }} />
          <div>
            <PText size="medium" weight="semi-bold" theme="dark" color="primary">
              {title}
            </PText>
            <PText size="xx-small" theme="dark" color="contrast-medium">
              {services.length} services monitored
            </PText>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.42)', fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace' }}>
            {loading ? 'reading...' : `last read ${lastReadAt || '-'}`}
          </span>
          {error && (
            <span style={{ fontSize: 11, color: '#F87171', fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace' }}>
              {error}
            </span>
          )}
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            minWidth: 760,
            borderCollapse: 'collapse',
            fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
            fontSize: 11,
            lineHeight: 1.2,
          }}
        >
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  style={{
                    color: 'rgba(255,255,255,0.46)',
                    fontWeight: 700,
                    textAlign: 'left',
                    padding: '6px 10px',
                    borderBottom: `1px solid ${BORDER_DEFAULT}`,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {services.map((service, rowIndex) => (
              <tr key={`${formatCellValue(service.service_name)}-${rowIndex}`}>
                {columns.map((column) => {
                  const cellValue = formatCellValue(service[column.key]);
                  const isState = column.key === 'state';

                  return (
                    <td
                      key={column.key}
                      style={{
                        color: isState ? getStateColor(cellValue) : 'rgba(255,255,255,0.78)',
                        fontWeight: isState ? 700 : 500,
                        padding: '4px 10px',
                        borderBottom: `1px solid ${BORDER_SUBTLE}`,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {cellValue}
                    </td>
                  );
                })}
              </tr>
            ))}
            {data?.totals && (
              <tr>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    style={{
                      color: column.key === 'state' || column.key === 'mem' ? BLUE_PRIMARY : 'rgba(255,255,255,0.86)',
                      fontWeight: 700,
                      padding: '5px 10px 1px',
                      borderTop: `1px solid ${BORDER_DEFAULT}`,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {formatCellValue(data.totals?.[column.key])}
                  </td>
                ))}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
