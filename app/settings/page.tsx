"use client";

import AuthLayout from '../../src/AuthLayout';
import { useThemeContext } from '../../src/ThemeContext';

const FONT = "'Helvetica Neue',Helvetica,Arial,sans-serif";

export default function SettingsPage() {
  const { C } = useThemeContext();

  const settings = [
    { id: 'email-summary', label: 'Enable email summaries', desc: 'Get weekly financial summaries via email', checked: true },
    { id: 'auto-categorize', label: 'Auto-categorize transactions', desc: 'Automatically sort expenses by category', checked: true },
    { id: 'notifications', label: 'Push notifications', desc: 'Receive alerts for budget milestones', checked: false },
  ];

  const styles = `
    @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    .page-header { animation: slideUp 0.4s ease-out; }
    .settings-card { animation: slideUp 0.4s ease-out 0.08s both; }
    .setting-item { animation: slideUp 0.35s ease-out; }
    button { transition: all 0.2s ease; }
  `;

  return (
    <>
      <style>{styles}</style>
      <AuthLayout>
        <div style={{ maxWidth: 600, padding: '32px 28px' }}>
          <div className="page-header" style={{ marginBottom: 32 }}>
            <h1 style={{
              margin: 0, fontFamily: FONT, color: C.ink, fontSize: '2.2rem',
              fontWeight: 900, letterSpacing: '-0.03em', textTransform: 'uppercase',
            }}>Settings</h1>
            <p style={{ margin: '6px 0 0', color: C.inkMid, fontFamily: FONT, fontSize: '0.85rem' }}>
              Customize your preferences
            </p>
          </div>

          <div className="settings-card" style={{ border: `1px solid ${C.border}` }}>
            <div style={{ padding: '24px 24px 8px' }}>
              {settings.map((s, idx) => (
                <div key={s.id} className="setting-item" style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  paddingBottom: 16, marginBottom: 16,
                  borderBottom: idx < settings.length - 1 ? `1px solid ${C.borderFaint}` : 'none',
                  animation: `slideUp 0.35s ease-out ${0.1 + idx * 0.06}s both`,
                }}>
                  <div>
                    <div style={{ fontWeight: 700, color: C.ink, fontSize: '0.9rem', fontFamily: FONT }}>{s.label}</div>
                    <div style={{ fontSize: '0.82rem', color: C.inkMid, fontFamily: FONT, marginTop: 4 }}>{s.desc}</div>
                  </div>
                  <div
                    onClick={() => {}}
                    style={{
                      width: 40, height: 22, display: 'flex', alignItems: 'center',
                      padding: '2px', cursor: 'pointer', flexShrink: 0,
                      background: s.checked ? C.accent : C.borderFaint,
                      transition: 'background 0.2s ease',
                    }}
                  >
                    <div style={{
                      width: 18, height: 18, background: '#FFFFFF',
                      transition: 'transform 0.2s ease',
                      transform: s.checked ? 'translateX(18px)' : 'translateX(0)',
                    }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: '20px 24px', borderTop: `1px solid ${C.borderFaint}` }}>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontWeight: 700, color: C.ink, fontSize: '0.9rem', fontFamily: FONT, marginBottom: 4 }}>Export data</div>
                <div style={{ fontSize: '0.82rem', color: C.inkMid, fontFamily: FONT }}>Download all your financial data as CSV</div>
              </div>
              <button style={{
                padding: '10px 16px', background: 'transparent', border: `1px solid ${C.border}`,
                color: C.ink, fontWeight: 600, cursor: 'pointer', fontFamily: FONT,
                fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase',
              }}
                onMouseEnter={(e) => (e.currentTarget.style.background = C.surface)}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >Export</button>
            </div>

            <div style={{ padding: '16px 24px 24px', display: 'flex', gap: 10 }}>
              <button style={{
                padding: '12px 20px', background: C.accent, border: 'none',
                color: '#0F0F0E', fontWeight: 700, cursor: 'pointer', fontFamily: FONT,
                fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase',
              }}
                onMouseEnter={(e) => (e.currentTarget.style.background = C.accentDk)}
                onMouseLeave={(e) => (e.currentTarget.style.background = C.accent)}
              >Save settings</button>
              <button style={{
                padding: '12px 20px', background: 'transparent', border: `1px solid ${C.border}`,
                color: C.ink, fontWeight: 600, cursor: 'pointer', fontFamily: FONT,
                fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase',
              }}
                onMouseEnter={(e) => (e.currentTarget.style.background = C.surface)}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >Cancel</button>
            </div>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
