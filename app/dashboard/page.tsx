"use client";

import { useState } from 'react';
import AuthLayout from '../../src/AuthLayout';
import { useThemeContext } from '../../src/ThemeContext';
import { useAuth } from '../../src/AuthContext';

const FONT = "'Helvetica Neue',Helvetica,Arial,sans-serif";

function DonutChart({ C }: { C: any }) {
  const cats = [
    { label: "Rent", pct: 38, color: C.ink },
    { label: "Food", pct: 22, color: C.accent },
    { label: "Transport", pct: 14, color: C.inkMid },
    { label: "Subscriptions", pct: 11, color: "#9A9690" },
    { label: "Other", pct: 15, color: C.borderFaint },
  ];
  const cx = 100, cy = 100, R = 72, r = 44;
  const r6 = (n: number) => Math.round(n * 1e6) / 1e6;
  let angle = -Math.PI / 2;
  const slices = cats.map(c => {
    const a0 = angle, a1 = angle + (c.pct / 100) * 2 * Math.PI; angle = a1;
    const x0 = r6(cx + R * Math.cos(a0)), y0 = r6(cy + R * Math.sin(a0));
    const x1 = r6(cx + R * Math.cos(a1)), y1 = r6(cy + R * Math.sin(a1));
    const xi0 = r6(cx + r * Math.cos(a0)), yi0 = r6(cy + r * Math.sin(a0));
    const xi1 = r6(cx + r * Math.cos(a1)), yi1 = r6(cy + r * Math.sin(a1));
    const large = c.pct > 50 ? 1 : 0;
    return { ...c, d: `M${x0},${y0} A${R},${R} 0 ${large},1 ${x1},${y1} L${xi1},${yi1} A${r},${r} 0 ${large},0 ${xi0},${yi0}Z` };
  });

  return (
    <svg viewBox="0 0 340 200" style={{ width: "100%", display: "block" }}>
      {slices.map((s, i) => (
        <path key={i} d={s.d} fill={s.color} stroke={C.bg} strokeWidth={2} />
      ))}
      <text x={100} y={100} textAnchor="middle" fontSize={18} fontWeight={900} fontFamily={FONT} fill={C.ink}>$4,280</text>
      <text x={100} y={120} textAnchor="middle" fontSize={9} letterSpacing={2} fontFamily={FONT} fill={C.inkFaint}>TOTAL</text>
      <g transform="translate(190, 12)">
        {cats.map((c, i) => (
          <g key={i} transform={`translate(0, ${i * 36})`}>
            <rect x={0} y={4} width={10} height={10} fill={c.color} />
            <text x={16} y={13} fontSize={11} fontFamily={FONT} fill={C.inkMid}>{c.label} — {c.pct}%</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

function BarChart({ C }: { C: any }) {
  const data = [
    { m: "JUL", v: 3100 }, { m: "AUG", v: 3800 }, { m: "SEP", v: 2900 },
    { m: "OCT", v: 4200 }, { m: "NOV", v: 3500 }, { m: "DEC", v: 2700 },
  ];
  const max = 4400, W = 340, H = 130, barW = 34, gap = 18, x0 = 20, pad = 10;

  return (
    <svg viewBox={`0 0 ${W} ${H + 30}`} style={{ width: "100%", display: "block" }}>
      {[1000, 2000, 3000, 4000].map(v => (
        <line key={v} x1={x0} y1={H - (v / max) * H + pad} x2={W - 8} y2={H - (v / max) * H + pad}
          stroke={C.borderFaint} strokeWidth={0.5} />
      ))}
      {data.map((d, i) => {
        const bh = (d.v / max) * (H - pad), bx = x0 + i * (barW + gap);
        const peak = d.v === 4200;
        return (
          <g key={i}>
            <rect x={bx} y={H - bh + pad} width={barW} height={bh}
              fill={peak ? C.accent : C.inkFaint}
              rx={0} ry={0} />
            {peak && (
              <text x={bx + barW / 2} y={H - bh + pad - 6} textAnchor="middle" fontSize={8}
                fontFamily={FONT} fill={C.accent} fontWeight={700}>PEAK</text>
            )}
            <text x={bx + barW / 2} y={H + pad + 14} textAnchor="middle" fontSize={9}
              fontFamily={FONT} fill={C.inkFaint}>{d.m}</text>
          </g>
        );
      })}
    </svg>
  );
}

function BudgetBars({ C }: { C: any }) {
  const budgets = [
    { label: "Housing", spent: 1200, budget: 1400 },
    { label: "Food", spent: 680, budget: 800 },
    { label: "Transport", spent: 310, budget: 400 },
    { label: "Entertainment", spent: 180, budget: 250 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {budgets.map((b) => {
        const pct = Math.min(b.spent / b.budget, 1);
        const warn = pct > 0.85;
        return (
          <div key={b.label}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontFamily: FONT, fontSize: "0.75rem", color: C.inkMid }}>{b.label}</span>
              <span style={{ fontFamily: FONT, fontSize: "0.75rem", fontWeight: 700, color: warn ? "#E03E3E" : C.ink }}>
                ${b.spent} / ${b.budget}
              </span>
            </div>
            <div style={{ height: 6, background: C.borderFaint, position: "relative" }}>
              <div style={{
                height: "100%", width: `${pct * 100}%`,
                background: warn ? "#E03E3E" : C.accent,
                transition: "width 0.5s ease",
              }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function DashboardPage() {
  const { C } = useThemeContext();
  const { user } = useAuth();
  const [displayName] = useState(() => typeof window !== 'undefined' ? localStorage.getItem('vf_display_name') || '' : '');

  const greeting = displayName || user?.email?.split('@')[0] || 'User';

  const stats = [
    { t: 'Balance', v: '$12,420', desc: 'Total account balance' },
    { t: 'Monthly spend', v: '$4,280', desc: 'This month' },
    { t: 'Budget left', v: '$1,870', desc: 'Remaining budget' },
  ];

  const recent = [
    { d: 'Today', desc: 'Coffee — Starbucks', amt: -12.5 },
    { d: 'Yesterday', desc: 'Salary Deposit', amt: 2500 },
    { d: 'Jun 6', desc: 'Groceries — Whole Foods', amt: -84.23 },
  ];

  const insights = [
    'Subscription: Netflix — $14.99/mo',
    'Food spending \u2193 8% vs last month',
    'Save $200 \u2192 Emergency fund',
  ];

  const styles = `
    @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    .dash-section { animation: slideUp 0.4s ease-out; }
    .hover-card { transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1); cursor: pointer; }
    .hover-card:hover { background: ${C.surface} !important; }
  `;

  return (
    <>
      <style>{styles}</style>
      <AuthLayout>
        <div style={{ maxWidth: 1100, padding: '32px 28px' }}>
          <div className="dash-section" style={{ marginBottom: 36 }}>
            <h1 style={{
              margin: 0, fontFamily: FONT, color: C.ink, fontSize: '2.2rem',
              fontWeight: 900, letterSpacing: '-0.03em', textTransform: 'uppercase',
            }}>Dashboard</h1>
            <p style={{ margin: '6px 0 0', color: C.inkMid, fontFamily: FONT, fontSize: '0.85rem' }}>
              Welcome back, <span style={{ color: C.accent, fontWeight: 700 }}>{greeting}</span>
            </p>
          </div>

          <div className="dash-section" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: `1px solid ${C.border}`, marginBottom: 24 }}>
            {stats.map((s, i) => (
              <div key={s.t} className="hover-card" style={{
                padding: '24px 24px',
                borderRight: i < 2 ? `1px solid ${C.borderFaint}` : 'none',
                background: 'transparent',
              }}>
                <div style={{
                  fontSize: '0.65rem', color: C.inkMid, textTransform: 'uppercase',
                  letterSpacing: '0.14em', fontWeight: 700, fontFamily: FONT, marginBottom: 10,
                }}>{s.t}</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: C.ink, fontFamily: FONT, marginBottom: 6 }}>{s.v}</div>
                <div style={{ fontSize: '0.78rem', color: C.inkFaint, fontFamily: FONT }}>{s.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }}>
            <div>
              <div className="dash-section" style={{ border: `1px solid ${C.border}`, marginBottom: 24 }}>
                <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.borderFaint}` }}>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em',
                    textTransform: 'uppercase', color: C.inkMid, fontFamily: FONT,
                  }}>
                    Spending by Category
                  </span>
                </div>
                <div style={{ padding: '16px 20px' }}>
                  <DonutChart C={C} />
                </div>
              </div>

              <div className="dash-section" style={{ border: `1px solid ${C.border}`, marginBottom: 24 }}>
                <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.borderFaint}` }}>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em',
                    textTransform: 'uppercase', color: C.inkMid, fontFamily: FONT,
                  }}>
                    6-Month Trend
                  </span>
                </div>
                <div style={{ padding: '16px 20px' }}>
                  <BarChart C={C} />
                </div>
              </div>

              <div className="dash-section" style={{ border: `1px solid ${C.border}` }}>
                <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.borderFaint}` }}>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em',
                    textTransform: 'uppercase', color: C.inkMid, fontFamily: FONT,
                  }}>
                    Recent Transactions
                  </span>
                </div>
                {recent.map((t, i) => (
                  <div key={i} className="hover-card" style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '14px 20px', fontFamily: FONT,
                    borderBottom: i < recent.length - 1 ? `1px solid ${C.borderFaint}` : 'none',
                    background: 'transparent',
                  }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1 }}>
                      <div style={{ width: 6, height: 6, background: t.amt < 0 ? C.inkFaint : C.accent, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: 700, color: C.ink, fontSize: '0.9rem' }}>{t.desc}</div>
                        <div style={{ fontSize: '0.75rem', color: C.inkFaint }}>{t.d}</div>
                      </div>
                    </div>
                    <div style={{
                      fontWeight: 900, fontSize: '0.9rem',
                      color: t.amt < 0 ? '#E03E3E' : C.accent,
                    }}>
                      {t.amt < 0 ? `-${Math.abs(t.amt).toFixed(2)}` : `+${t.amt.toFixed(2)}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="dash-section" style={{
                border: `1px solid ${C.accent}30`, marginBottom: 20,
                padding: '20px',
              }}>
                <div style={{
                  fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em',
                  textTransform: 'uppercase', color: C.accent, fontFamily: FONT, marginBottom: 16,
                }}>Voice Input</div>
                <div style={{ color: C.inkMid, fontSize: '0.85rem', fontFamily: FONT, lineHeight: 1.6 }}>
                  &ldquo;I spent $12 on coffee&rdquo;
                </div>
                <div style={{
                  height: 60, marginTop: 14, border: `1px solid ${C.borderFaint}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3,
                }}>
                  {[16, 28, 12, 40, 18, 48, 14].map((h, i) => (
                    <div key={i} style={{
                      width: 3, height: h, background: C.accent,
                      animation: `pulse 1.5s ease-in-out ${i * 0.15}s infinite`,
                    }} />
                  ))}
                </div>
              </div>

              <div className="dash-section" style={{ border: `1px solid ${C.border}`, marginBottom: 20 }}>
                <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.borderFaint}` }}>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em',
                    textTransform: 'uppercase', color: C.inkMid, fontFamily: FONT,
                  }}>
                    Budget Overview
                  </span>
                </div>
                <div style={{ padding: '16px 20px' }}>
                  <BudgetBars C={C} />
                </div>
              </div>

              <div className="dash-section" style={{ border: `1px solid ${C.border}` }}>
                <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.borderFaint}` }}>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em',
                    textTransform: 'uppercase', color: C.inkMid, fontFamily: FONT,
                  }}>
                    AI Insights
                  </span>
                </div>
                <div style={{ padding: '16px 20px' }}>
                  {insights.map((item, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: 10, alignItems: 'flex-start',
                      padding: '10px 0',
                      borderBottom: i < insights.length - 1 ? `1px solid ${C.borderFaint}` : 'none',
                    }}>
                      <span style={{
                        width: 5, height: 5, background: C.accent,
                        display: 'inline-block', flexShrink: 0, marginTop: 7,
                      }} />
                      <span style={{ fontFamily: FONT, fontSize: '0.85rem', color: C.inkMid, lineHeight: 1.6 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
