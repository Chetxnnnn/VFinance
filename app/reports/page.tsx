"use client";

import AuthLayout from '../../src/AuthLayout';
import { useThemeContext } from '../../src/ThemeContext';

const FONT = "'Helvetica Neue',Helvetica,Arial,sans-serif";

export default function ReportsPage() {
  const { C } = useThemeContext();

  const reports = [
    { id: 'r1', name: 'Monthly summary — May 2026', date: '2026-06-01' },
    { id: 'r2', name: 'Subscriptions report', date: '2026-05-28' },
    { id: 'r3', name: 'Spending trends — Q2 2026', date: '2026-06-01' },
  ];

  const styles = `
    @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    .page-header { animation: slideUp 0.4s ease-out; }
    .report-item { animation: slideUp 0.35s ease-out; transition: all 0.2s ease; cursor: pointer; }
    .report-item:hover { background: ${C.surface} !important; }
    button { transition: all 0.2s ease; }
  `;

  return (
    <>
      <style>{styles}</style>
      <AuthLayout>
        <div style={{ maxWidth: 800, padding: '32px 28px' }}>
          <div className="page-header" style={{ marginBottom: 32 }}>
            <h1 style={{
              margin: 0, fontFamily: FONT, color: C.ink, fontSize: '2.2rem',
              fontWeight: 900, letterSpacing: '-0.03em', textTransform: 'uppercase',
            }}>Reports</h1>
            <p style={{ margin: '6px 0 0', color: C.inkMid, fontFamily: FONT, fontSize: '0.85rem' }}>
              Generated financial reports and summaries
            </p>
          </div>

          <div style={{ border: `1px solid ${C.border}` }}>
            {reports.map((r, idx) => (
              <div key={r.id} className="report-item" style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '16px 20px', background: 'transparent',
                borderBottom: idx < reports.length - 1 ? `1px solid ${C.borderFaint}` : 'none',
                animation: `slideUp 0.35s ease-out ${0.06 + idx * 0.08}s both`,
              }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1 }}>
                  <div style={{ width: 5, height: 5, background: C.accent, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 700, color: C.ink, fontSize: '0.9rem', fontFamily: FONT }}>{r.name}</div>
                    <div style={{ fontSize: '0.78rem', color: C.inkFaint, fontFamily: FONT }}>{r.date}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={{
                    padding: '8px 14px', background: 'transparent', border: `1px solid ${C.border}`,
                    color: C.ink, fontWeight: 600, cursor: 'pointer', fontFamily: FONT,
                    fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = C.surface)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >View</button>
                  <button style={{
                    padding: '8px 14px', background: C.accent, border: 'none',
                    color: '#0F0F0E', fontWeight: 700, cursor: 'pointer', fontFamily: FONT,
                    fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = C.accentDk)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = C.accent)}
                  >Download</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
