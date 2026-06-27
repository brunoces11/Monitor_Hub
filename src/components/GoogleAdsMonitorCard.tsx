import { PText } from '@porsche-design-system/components-react';
import { BLUE_PRIMARY, BORDER_DEFAULT, BORDER_SUBTLE, SURFACE_CARD, SURFACE_RAISED } from '../theme';

type GoogleAdsCampaign = {
  campaign: string;
  status: string;
  budget: string;
  impressions: string;
  clicks: string;
  ctr: string;
  avgCpc: string;
  conversions: string;
  costPerConv: string;
  spend: string;
  roas: string;
};

interface GoogleAdsMonitorCardProps {
  campaigns: GoogleAdsCampaign[];
}

function CampaignStatusIcon({ status }: { status: string }) {
  const normalized = status.toLowerCase();

  if (normalized === 'enabled') {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
        <path d="M8 6.8 18 12 8 17.2V6.8Z" fill="#4ADE80" />
      </svg>
    );
  }

  if (normalized === 'learning') {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
        <rect x="7" y="6.6" width="3.2" height="10.8" rx="1" fill="#9CA3AF" />
        <rect x="13.8" y="6.6" width="3.2" height="10.8" rx="1" fill="#9CA3AF" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <rect x="6.8" y="6.8" width="10.4" height="10.4" rx="1.2" fill="#F87171" />
    </svg>
  );
}

const columns: Array<{ key: keyof GoogleAdsCampaign; label: string; width: string }> = [
  { key: 'campaign', label: 'CAMPAIGN', width: '21%' },
  { key: 'status', label: 'STATUS', width: '6.4%' },
  { key: 'budget', label: 'BUDGET', width: '9%' },
  { key: 'impressions', label: 'PRINTS', width: '10%' },
  { key: 'clicks', label: 'CLICKS', width: '8%' },
  { key: 'ctr', label: 'CTR', width: '6%' },
  { key: 'avgCpc', label: 'AVG CPC', width: '8%' },
  { key: 'conversions', label: 'CONV.', width: '7%' },
  { key: 'costPerConv', label: 'COST / CONV.', width: '10%' },
  { key: 'spend', label: 'SPEND', width: '8%' },
  { key: 'roas', label: 'ROAS', width: '5%' },
];

export default function GoogleAdsMonitorCard({ campaigns }: GoogleAdsMonitorCardProps) {
  return (
    <section
      className="rounded-2xl p-4"
      style={{ background: SURFACE_CARD, border: `1px solid ${BORDER_DEFAULT}` }}
      aria-label="Google Ads"
    >
      <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <PText size="medium" weight="semi-bold" theme="dark" color="primary">
            Google Ads
          </PText>
          <PText size="xx-small" theme="dark" color="contrast-medium">
            3 campaigns under performance monitoring
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
            sync scope
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
            budget / traffic / conversion / return
          </span>
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
              <col key={column.key} style={{ width: column.width }} />
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
            {campaigns.map((campaign) => (
              <tr key={campaign.campaign}>
                {columns.map((column) => {
                  const value = campaign[column.key];

                  return (
                    <td
                      key={column.key}
                      style={{
                        color: column.key === 'campaign' ? 'rgba(255,255,255,0.84)' : 'rgba(255,255,255,0.74)',
                        fontWeight: column.key === 'campaign' ? 700 : 500,
                        padding: '5px 7px',
                        borderBottom: `1px solid ${BORDER_SUBTLE}`,
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                        overflowWrap: 'anywhere',
                        verticalAlign: 'middle',
                        textAlign: column.key === 'status' ? 'center' : 'left',
                      }}
                    >
                      {column.key === 'status' ? (
                        <span className="inline-flex w-full items-center justify-center" aria-label={String(value)}>
                          <CampaignStatusIcon status={String(value)} />
                        </span>
                      ) : column.key === 'roas' ? (
                        <span style={{ color: BLUE_PRIMARY, fontWeight: 700 }}>{value}</span>
                      ) : column.key === 'campaign' ? (
                        <div className="rounded-xl px-2 py-1" style={{ background: SURFACE_RAISED, border: `1px solid ${BORDER_SUBTLE}` }}>
                          {value}
                        </div>
                      ) : (
                        value
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
