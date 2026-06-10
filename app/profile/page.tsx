"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '../../src/AuthLayout';
import { useThemeContext } from '../../src/ThemeContext';
import { useAuth } from '../../src/AuthContext';

const FONT = "'Helvetica Neue',Helvetica,Arial,sans-serif";

export default function ProfilePage() {
  const { C } = useThemeContext();
  const { user } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('vf_display_name') || '';
  });
  const [currency, setCurrency] = useState('USD ($)');
  const [saved, setSaved] = useState(false);

  const save = () => {
    localStorage.setItem('vf_display_name', name);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const styles = `
    @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .page-header { animation: slideUp 0.4s ease-out; }
    .profile-card { animation: slideUp 0.4s ease-out 0.08s both; }
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
            }}>Profile</h1>
            <p style={{ margin: '6px 0 0', color: C.inkMid, fontFamily: FONT, fontSize: '0.85rem' }}>
              Manage your personal information
            </p>
          </div>

          <div className="profile-card" style={{ border: `1px solid ${C.border}` }}>
            <div style={{ padding: '24px', borderBottom: `1px solid ${C.borderFaint}` }}>
              <div style={{
                fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em',
                textTransform: 'uppercase', color: C.inkMid, fontFamily: FONT, marginBottom: 10,
              }}>Email</div>
              <div style={{
                padding: '12px 14px', border: `1px solid ${C.borderFaint}`,
                color: C.ink, fontWeight: 500, fontFamily: FONT, fontSize: '0.9rem',
              }}>{user?.email}</div>
            </div>

            <div style={{ padding: '24px', borderBottom: `1px solid ${C.borderFaint}` }}>
              <div style={{
                fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em',
                textTransform: 'uppercase', color: C.inkMid, fontFamily: FONT, marginBottom: 10,
              }}>Display Name</div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your display name"
                style={{
                  width: '100%', padding: '12px 14px', border: `1px solid ${C.borderFaint}`, outline: 'none',
                  background: C.bg, color: C.ink, fontFamily: FONT, fontSize: '0.9rem', fontWeight: 500,
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ padding: '24px', borderBottom: `1px solid ${C.borderFaint}` }}>
              <div style={{
                fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em',
                textTransform: 'uppercase', color: C.inkMid, fontFamily: FONT, marginBottom: 10,
              }}>Currency</div>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                style={{
                  width: '100%', padding: '12px 14px', border: `1px solid ${C.borderFaint}`, outline: 'none',
                  background: C.bg, color: C.ink, fontFamily: FONT, fontSize: '0.9rem', fontWeight: 500,
                  boxSizing: 'border-box',
                }}>
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
                <option>INR (₹)</option>
              </select>
            </div>

            <div style={{ padding: '20px 24px', display: 'flex', gap: 10, alignItems: 'center' }}>
              <button onClick={save} style={{
                padding: '12px 20px', background: C.accent, border: 'none',
                color: '#0F0F0E', fontWeight: 700, cursor: 'pointer', fontFamily: FONT,
                fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase',
              }}
                onMouseEnter={(e) => (e.currentTarget.style.background = C.accentDk)}
                onMouseLeave={(e) => (e.currentTarget.style.background = C.accent)}
              >Save changes</button>
              <button onClick={() => router.back()} style={{
                padding: '12px 20px', background: 'transparent', border: `1px solid ${C.border}`,
                color: C.ink, fontWeight: 600, cursor: 'pointer', fontFamily: FONT,
                fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase',
              }}
                onMouseEnter={(e) => (e.currentTarget.style.background = C.surface)}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >Cancel</button>
              {saved && (
                <span style={{
                  fontFamily: FONT, fontSize: '0.75rem', color: C.accent, fontWeight: 700,
                  animation: 'fadeIn 0.3s ease-out',
                }}>Saved!</span>
              )}
            </div>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
