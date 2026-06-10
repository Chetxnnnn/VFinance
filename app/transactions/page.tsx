"use client";

import AuthLayout from '../../src/AuthLayout';
import { useThemeContext } from '../../src/ThemeContext';

const FONT = "'Helvetica Neue',Helvetica,Arial,sans-serif";

export default function TransactionsPage() {
  const { C } = useThemeContext();

  const tx = [
    { id: 't1', when: 'Today', desc: 'Coffee — Starbucks', amount: -12.5 },
    { id: 't2', when: 'Yesterday', desc: 'Salary Deposit', amount: 2500 },
    { id: 't3', when: 'Jun 6', desc: 'Groceries — BigMart', amount: -84.23 },
    { id: 't4', when: 'Jun 5', desc: 'Netflix Subscription', amount: -14.99 },
  ];

  const styles = `
    @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    .page-header { animation: slideUp 0.4s ease-out; }
    .tx-item { animation: slideUp 0.35s ease-out; transition: all 0.2s ease; cursor: pointer; }
    .tx-item:hover { background: ${C.surface} !important; }
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
            }}>Transactions</h1>
            <p style={{ margin: '6px 0 0', color: C.inkMid, fontFamily: FONT, fontSize: '0.85rem' }}>
              All recorded transactions from voice input
            </p>
          </div>

          <div style={{ display: 'grid', gap: 0, border: `1px solid ${C.border}` }}>
            {tx.map((t, idx) => (
              <div key={t.id} className="tx-item" style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '16px 20px', background: 'transparent',
                borderBottom: idx < tx.length - 1 ? `1px solid ${C.borderFaint}` : 'none',
                animation: `slideUp 0.35s ease-out ${0.06 + idx * 0.08}s both`,
              }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center', flex: 1 }}>
                  <div style={{
                    width: 6, height: 6, flexShrink: 0,
                    background: t.amount < 0 ? C.inkFaint : C.accent,
                  }} />
                  <div>
                    <div style={{ fontWeight: 700, color: C.ink, fontSize: '0.9rem', fontFamily: FONT }}>{t.desc}</div>
                    <div style={{ fontSize: '0.78rem', color: C.inkFaint, fontFamily: FONT }}>{t.when}</div>
                  </div>
                </div>
                <div style={{
                  fontWeight: 900, fontSize: '0.9rem', fontFamily: FONT, minWidth: 80, textAlign: 'right',
                  color: t.amount < 0 ? '#E03E3E' : C.accent,
                }}>
                  {t.amount < 0 ? `-${Math.abs(t.amount).toFixed(2)}` : `+${t.amount.toFixed(2)}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
