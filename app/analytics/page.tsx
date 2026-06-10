"use client";

import AuthLayout from '../../src/AuthLayout';
import { useThemeContext } from '../../src/ThemeContext';

const FONT = "'Helvetica Neue',Helvetica,Arial,sans-serif";

export default function AnalyticsPage() {
  const { C } = useThemeContext();

  const stats = [
    { label: 'Monthly spend', value: '$4,280', color: '#E03E3E' },
    { label: 'Avg transaction', value: '$38', color: C.accent },
    { label: 'Savings this month', value: '$420', color: '#00B82C' },
  ];

  const insights = [
    'Your spending is 12% lower than last month',
    'Netflix subscription renews in 5 days',
    'Best time to spend: Weekday mornings',
  ];

  const styles = `
    @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    .page-header { animation: slideUp 0.4s ease-out; }
    .stat-card { animation: slideUp 0.4s ease-out; transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1); cursor: pointer; }
    .stat-card:hover { background: ${C.surface} !important; }
    .insight-item { animation: slideUp 0.35s ease-out; }
  `;

  return (
    <>
      <style>{styles}</style>
      <AuthLayout>
        <div style={{ maxWidth: 1000, padding: '32px 28px' }}>
          <div className="page-header" style={{ marginBottom: 32 }}>
            <h1 style={{
              margin: 0, fontFamily: FONT, color: C.ink, fontSize: '2.2rem',
              fontWeight: 900, letterSpacing: '-0.03em', textTransform: 'uppercase',
            }}>AI Analytics</h1>
            <p style={{ margin: '6px 0 0', color: C.inkMid, fontFamily: FONT, fontSize: '0.85rem' }}>
              Automated insights generated from your voice entries
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: `1px solid ${C.border}`, marginBottom: 24 }}>
            {stats.map((s, idx) => (
              <div key={s.label} className="stat-card" style={{
                padding: '24px', background: 'transparent',
                borderRight: idx < 2 ? `1px solid ${C.borderFaint}` : 'none',
                animation: `slideUp 0.4s ease-out ${0.06 + idx * 0.08}s both`,
              }}>
                <div style={{
                  fontSize: '0.65rem', color: C.inkMid, textTransform: 'uppercase',
                  letterSpacing: '0.14em', fontWeight: 700, fontFamily: FONT, marginBottom: 10,
                }}>{s.label}</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: s.color, fontFamily: FONT }}>{s.value}</div>
              </div>
            ))}
          </div>

          <div className="page-header" style={{ border: `1px solid ${C.border}` }}>
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.borderFaint}` }}>
              <span style={{
                fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em',
                textTransform: 'uppercase', color: C.inkMid, fontFamily: FONT,
              }}>
                Quick Insights
              </span>
            </div>
            <div style={{ padding: '20px' }}>
              {insights.map((item, idx) => (
                <div key={idx} className="insight-item" style={{
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                  padding: '12px 0',
                  borderBottom: idx < insights.length - 1 ? `1px solid ${C.borderFaint}` : 'none',
                  animation: `slideUp 0.35s ease-out ${0.15 + idx * 0.06}s both`,
                }}>
                  <span style={{ width: 5, height: 5, background: C.accent, display: 'inline-block', flexShrink: 0, marginTop: 7 }} />
                  <span style={{ fontFamily: FONT, fontSize: '0.85rem', color: C.inkMid, lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
