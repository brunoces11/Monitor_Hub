import { useEffect, useState, type ReactNode } from 'react';
import { PText } from '@porsche-design-system/components-react';
import { BLUE_PRIMARY, BORDER_DEFAULT, BORDER_SUBTLE, SURFACE_CARD } from '../theme';

export type MonitorColumn = {
  key: string;
  label: string;
};

export type MonitorRow = Record<string, string | number | null | undefined>;

type MonitorData = {
  title?: string;
  updated_at?: string | null;
  refresh_interval_ms?: number;
  columns?: MonitorColumn[];
  services?: MonitorRow[];
  containers?: MonitorRow[];
  totals?: MonitorRow | null;
};

interface MonitorCardProps {
  active: boolean;
  endpoint: string;
  fallbackColumns: MonitorColumn[];
  fallbackTitle: string;
  sortRows?: (rows: MonitorRow[]) => MonitorRow[];
}

const defaultRefreshInterval = 15000;

function formatCellValue(value: MonitorRow[string]) {
  if (value === null || value === undefined) return '-';
  return String(value);
}

function getStatusColor(value: string) {
  const normalized = value.toLowerCase();

  if (['running', 'online', 'healthy', 'ok'].includes(normalized)) return '#4ADE80';
  if (['degraded', 'warning', 'slow'].includes(normalized)) return '#FBBF24';
  if (['exited', 'offline', 'error', 'failed'].includes(normalized)) return '#F87171';

  return 'rgba(255,255,255,0.58)';
}

function isStatusColumn(columnKey: string) {
  return ['state', 'status', 'stats'].includes(columnKey);
}

function getColumnWidth(column: MonitorColumn, columns: MonitorColumn[]) {
  const columnKeys = columns.map((item) => item.key);
  const isApiMonitorTable = columnKeys.includes('last_check');

  if (column.key === 'service_name' || column.key === 'name') {
    return isApiMonitorTable ? 'calc(100% - 144px)' : '22%';
  }

  if (column.key === 'stats' || column.key === 'state' || column.key === 'cpu' || column.key === 'mem_percent') {
    if (isApiMonitorTable && column.key === 'stats') return '66px';
    if (column.key === 'stats') return '25%';
    if (column.key === 'state') return '18%';
    return '11%';
  }

  if (column.key === 'mem') return '14%';
  if (isApiMonitorTable && column.key === 'last_check') return '66px';
  if (column.key === 'uptime' || column.key === 'last_check') return '11%';

  return `${Math.max(10, Math.floor(100 / columns.length))}%`;
}

function renderMemoryValue(value: string) {
  const match = value.trim().match(/^([\d.]+)\s*MiB$/i);
  if (!match) return value;

  return (
    <span>
      {match[1]}{' '}
      <span style={{ color: 'rgba(255,255,255,0.62)', fontSize: '0.8em' }}>
        MB
      </span>
    </span>
  );
}

function renderCellContent(columnKey: string, value: string): ReactNode {
  if (columnKey === 'mem') return renderMemoryValue(value);
  return value;
}

export default function MonitorCard({
  active,
  endpoint,
  fallbackColumns,
  fallbackTitle,
  sortRows,
}: MonitorCardProps) {
  const [data, setData] = useState<MonitorData | null>(null);
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
        const response = await fetch(endpoint, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const monitorData = (await response.json()) as MonitorData;
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
  }, [active, endpoint]);

  const columns = data?.columns?.length ? data.columns : fallbackColumns;
  const rows = data?.services ?? data?.containers ?? [];
  const services = sortRows ? sortRows(rows) : rows;
  const title = data?.title || fallbackTitle;
  const lastReadTime = lastReadAt || '-';

  return (
      <section
      className="rounded-2xl p-4 h-full"
      style={{ background: SURFACE_CARD, border: `1px solid ${BORDER_DEFAULT}` }}
      aria-label={title}
    >
      <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <PText size="medium" weight="semi-bold" theme="dark" color="primary">
            {title}
          </PText>
          <PText size="xx-small" theme="dark" color="contrast-medium">
            {services.length} services monitored
          </PText>
        </div>

        <div className="flex flex-col items-start gap-0.5 min-w-0 sm:items-end">
          <span
            style={{
              fontSize: 11,
              color: 'rgba(255,255,255,0.36)',
              fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
              textAlign: 'right',
              lineHeight: 1.05,
            }}
          >
            last read
          </span>
          <span
            style={{
              fontSize: 11,
              color: 'rgba(255,255,255,0.78)',
              fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
              textAlign: 'right',
              lineHeight: 1.05,
            }}
          >
            {loading ? 'reading...' : lastReadTime}
          </span>
          {error && (
            <span style={{ fontSize: 11, color: '#F87171', fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace' }}>
              {error}
            </span>
          )}
        </div>
      </div>

      <div style={{ minWidth: 0 }}>
        <table
          style={{
            width: '100%',
            tableLayout: 'fixed',
            borderCollapse: 'collapse',
            fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
            fontSize: 11,
            lineHeight: 1.2,
          }}
        >
          <colgroup>
            {columns.map((column) => (
              <col key={column.key} style={{ width: getColumnWidth(column, columns) }} />
            ))}
          </colgroup>
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
                    padding: '5px 7px',
                    borderBottom: `1px solid ${BORDER_DEFAULT}`,
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    overflowWrap: 'anywhere',
                  }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {services.map((service, rowIndex) => {
              const rowName = formatCellValue(service.service_name ?? service.name ?? rowIndex);

              return (
                <tr key={`${rowName}-${rowIndex}`}>
                  {columns.map((column) => {
                    const cellValue = formatCellValue(service[column.key]);
                    const shouldColorStatus = isStatusColumn(column.key);

                    return (
                      <td
                        key={column.key}
                        style={{
                          color: shouldColorStatus ? getStatusColor(cellValue) : 'rgba(255,255,255,0.78)',
                          fontWeight: shouldColorStatus ? 700 : 500,
                          padding: '3px 7px',
                          borderBottom: `1px solid ${BORDER_SUBTLE}`,
                          whiteSpace: 'normal',
                          wordBreak: 'break-word',
                          overflowWrap: 'anywhere',
                        }}
                      >
                        {renderCellContent(column.key, cellValue)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            {data?.totals && (
              <tr>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    style={{
                      color: BLUE_PRIMARY,
                      fontWeight: 700,
                      padding: '4px 7px 1px',
                      borderTop: `1px solid ${BORDER_DEFAULT}`,
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {renderCellContent(column.key, formatCellValue(data.totals?.[column.key]))}
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
