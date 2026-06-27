import { PText } from '@porsche-design-system/components-react';
import { useEffect, useState } from 'react';
import { BORDER_DEFAULT, BORDER_SUBTLE, SURFACE_CARD, SURFACE_RAISED, BLUE_PRIMARY } from '../theme';

type LeadRecord = {
  dateRegistered: string;
  userName: string;
  email: string;
  phone: string;
  source: string;
  product: string;
  status: string;
};

interface LeadGenerationTableProps {
  leads: LeadRecord[];
}

function formatLeadDate(dateValue: string) {
  const [day, month, year] = dateValue.split('/');
  return `${day}/${month}/${year?.slice(-2) ?? year}`;
}

function LeadStatusIcon({ status }: { status: string }) {
  const normalized = status.toLowerCase();

  if (normalized === 'purchased') {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
        <path d="M6.5 12.5 10.1 16.1 17.7 8.5" fill="none" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (normalized === 'refunded') {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
        <path d="M7 7 17 17M17 7 7 17" fill="none" stroke="#F87171" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="6.9" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.6" />
    </svg>
  );
}

function getLeadStatusMeta(status: string) {
  const normalized = status.toLowerCase();

  if (normalized === 'purchased') {
    return { label: 'Purchased', icon: <LeadStatusIcon status="purchased" /> };
  }

  if (normalized === 'refunded') {
    return { label: 'Refunded', icon: <LeadStatusIcon status="refunded" /> };
  }

  return { label: 'Lead', icon: <LeadStatusIcon status="lead" /> };
}

const columns: Array<{ key: keyof LeadRecord; label: string; width: string }> = [
  { key: 'dateRegistered', label: 'DATE', width: '80px' },
  { key: 'userName', label: 'USER NAME', width: '16%' },
  { key: 'email', label: 'EMAIL', width: '21%' },
  { key: 'phone', label: 'PHONE', width: '140px' },
  { key: 'source', label: 'SOURCE', width: '14%' },
  { key: 'product', label: 'PRODUCT', width: '16%' },
  { key: 'status', label: 'STATUS', width: '65px' },
];

export default function LeadGenerationTable({ leads }: LeadGenerationTableProps) {
  const [rows, setRows] = useState(leads);
  const [openStatusId, setOpenStatusId] = useState<string | null>(null);

  useEffect(() => {
    setRows(leads);
  }, [leads]);

  return (
    <section
      className="rounded-2xl p-4"
      style={{ background: SURFACE_CARD, border: `1px solid ${BORDER_DEFAULT}` }}
      aria-label="Lead generation table"
    >
      <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <PText size="medium" weight="semi-bold" theme="dark" color="primary">
            Leads
          </PText>
          <PText size="xx-small" theme="dark" color="contrast-medium">
            Captured leads with source, product interaction, and purchase status
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
            registration / source / product / conversion
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
            {rows.map((lead) => (
              <tr key={`${lead.email}-${lead.dateRegistered}`}>
                {columns.map((column) => {
                  const value = lead[column.key];

                  return (
                    <td
                      key={column.key}
                      style={{
                        color: column.key === 'userName' ? 'rgba(255,255,255,0.84)' : 'rgba(255,255,255,0.74)',
                        fontWeight: column.key === 'userName' ? 700 : 500,
                        padding: '5px 7px',
                        borderBottom: `1px solid ${BORDER_SUBTLE}`,
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                        overflowWrap: 'anywhere',
                        verticalAlign: 'middle',
                      }}
                    >
                      {column.key === 'status' ? (
                        <div className="relative inline-flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => setOpenStatusId((current) => (current === lead.email ? null : lead.email))}
                            aria-expanded={openStatusId === lead.email}
                            aria-label={`Change status for ${lead.userName}`}
                            style={{
                              width: 24,
                              height: 24,
                              padding: 0,
                              border: 'none',
                              background: 'transparent',
                              cursor: 'pointer',
                            }}
                          >
                            <LeadStatusIcon status={String(value)} />
                          </button>
                          {openStatusId === lead.email && (
                            <>
                              <button
                                aria-label="Close status menu"
                                onClick={() => setOpenStatusId(null)}
                                style={{
                                  position: 'fixed',
                                  inset: 0,
                                  zIndex: 29,
                                  background: 'transparent',
                                  border: 'none',
                                  cursor: 'default',
                                }}
                              />
                              <div
                                className="absolute right-0 top-full mt-2 rounded-xl p-2 flex flex-col gap-1"
                                style={{
                                  width: 140,
                                  background: SURFACE_RAISED,
                                  border: `1px solid ${BORDER_DEFAULT}`,
                                  boxShadow: '0 16px 34px rgba(0,0,0,0.32)',
                                  zIndex: 30,
                                }}
                              >
                                {(['Purchased', 'Refunded', 'Lead'] as const).map((option) => {
                                  const optionMeta = getLeadStatusMeta(option);

                                  return (
                                    <button
                                      key={option}
                                      type="button"
                                      className="rounded-lg px-2 py-1.5 text-left flex items-center gap-2"
                                      style={{
                                        background: value === option ? 'rgba(44,194,238,0.1)' : 'rgba(255,255,255,0.03)',
                                        border: value === option ? `1px solid rgba(44,194,238,0.22)` : '1px solid transparent',
                                        color: 'rgba(255,255,255,0.9)',
                                        cursor: 'pointer',
                                        fontSize: 11,
                                        fontWeight: 700,
                                      }}
                                      onClick={() => {
                                        setRows((current) =>
                                          current.map((item) => (item.email === lead.email ? { ...item, status: option } : item))
                                        );
                                        setOpenStatusId(null);
                                      }}
                                    >
                                      {optionMeta.icon}
                                      {optionMeta.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </>
                          )}
                        </div>
                      ) : column.key === 'dateRegistered' ? (
                        formatLeadDate(String(value))
                      ) : column.key === 'userName' ? (
                        <div className="rounded-xl px-2 py-1" style={{ background: SURFACE_RAISED, border: `1px solid ${BORDER_SUBTLE}` }}>
                          {value}
                        </div>
                      ) : column.key === 'source' ? (
                        <span style={{ color: BLUE_PRIMARY, fontWeight: 700 }}>{value}</span>
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
