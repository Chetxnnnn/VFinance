"use client";

import AuthLayout from '../../src/AuthLayout';
import { useThemeContext } from '../../src/ThemeContext';

const FONT = "'Helvetica Neue',Helvetica,Arial,sans-serif";

export default function ExpensesPage() {
  const { C } = useThemeContext();

  const expenses = [
    { id: 1, date: '2026-06-09', merchant: 'Starbucks', category: 'Food & Drink', amount: 12.5 },
    { id: 2, date: '2026-06-08', merchant: 'Shell', category: 'Transport', amount: 34.2 },
    { id: 3, date: '2026-06-06', merchant: 'Amazon', category: 'Shopping', amount: 89.99 },
    { id: 4, date: '2026-06-05', merchant: 'Netflix', category: 'Subscriptions', amount: 14.99 },
  ];

  const styles = `
    @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    .page-header { animation: slideUp 0.4s ease-out; }
    .page-table { animation: slideUp 0.4s ease-out 0.08s both; }
    tbody tr { transition: background 0.2s ease; }
    tbody tr:hover { background: ${C.surface}; }
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
            }}>Expenses</h1>
            <p style={{ margin: '6px 0 0', color: C.inkMid, fontFamily: FONT, fontSize: '0.85rem' }}>
              Recent expenses captured from voice input
            </p>
          </div>

          <div className="page-table" style={{ border: `1px solid ${C.border}` }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FONT }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {['Date', 'Merchant', 'Category', 'Amount'].map(h => (
                    <th key={h} style={{
                      padding: '14px 18px', fontSize: '0.65rem', fontWeight: 700,
                      letterSpacing: '0.14em', textTransform: 'uppercase', color: C.inkMid,
                      textAlign: h === 'Amount' ? 'right' : 'left',
                      background: C.surface,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {expenses.map((e, idx) => (
                  <tr key={e.id} style={{
                    borderTop: `1px solid ${C.borderFaint}`,
                    animation: `slideUp 0.3s ease-out ${0.12 + idx * 0.06}s both`,
                  }}>
                    <td style={{ padding: '14px 18px', color: C.ink, fontSize: '0.88rem' }}>{e.date}</td>
                    <td style={{ padding: '14px 18px', color: C.ink, fontWeight: 600, fontSize: '0.88rem' }}>{e.merchant}</td>
                    <td style={{ padding: '14px 18px', color: C.inkMid, fontSize: '0.85rem' }}>{e.category}</td>
                    <td style={{ padding: '14px 18px', color: C.accent, fontWeight: 900, fontSize: '0.88rem', textAlign: 'right' }}>${e.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
