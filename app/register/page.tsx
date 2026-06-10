"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../src/App';

const FONT = "'Helvetica Neue',Helvetica,Arial,sans-serif";

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [focus, setFocus] = useState<'email' | 'password' | null>(null);
  const router = useRouter();
  const { dark, C, toggle } = useTheme();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        router.push('/dashboard');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch {
      setError('Network error');
    }
  };

  const inputBase = (field: 'email' | 'password') => ({
    width: '100%',
    padding: '12px 14px',
    border: `1px solid ${focus === field ? C.accent : C.borderFaint}`,
    outline: 'none',
    borderRadius: 0,
    background: C.bg,
    color: C.ink,
    fontFamily: FONT,
    fontSize: '0.9rem',
    transition: 'border-color 0.2s ease',
    marginBottom: 0,
  });

  const styles = `
    @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .auth-form { animation: slideUp 0.5s ease-out; }
    .auth-link { transition: all 0.25s ease; position: relative; }
    .auth-link::after { content: ""; position: absolute; bottom: -1px; left: 0; width: 0; height: 1px; background: ${C.accent}; transition: width 0.25s ease; }
    .auth-link:hover::after { width: 100%; }
    .error-enter { animation: fadeIn 0.2s ease-out; }
  `;

  return (
    <div style={{ background: C.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{styles}</style>

      <header style={{
        padding: '0 24px', height: 64, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', borderBottom: `1px solid ${C.borderFaint}`,
      }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 32, height: 32, background: C.accent, display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#0F0F0E" strokeWidth={2.5} strokeLinecap="square">
              <rect x={9} y={3} width={6} height={11} /><path d="M5 11a7 7 0 0 0 14 0" />
              <line x1={12} y1={18} x2={12} y2={22} /><line x1={8} y1={22} x2={16} y2={22} />
            </svg>
          </div>
          <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: '1.05rem', letterSpacing: '-0.02em', color: C.ink, textTransform: 'uppercase' }}>VoiceFinance</span>
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <a href="/login"
            style={{
              fontFamily: FONT, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: C.inkMid, textDecoration: 'none', transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = C.ink)}
            onMouseLeave={e => (e.currentTarget.style.color = C.inkMid)}>
            Sign in
          </a>
          <button onClick={toggle} style={{
            width: 36, height: 36, background: 'none', border: `1px solid ${C.border}`,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: C.ink, flexShrink: 0, transition: 'background 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = C.accent)}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
            {dark
              ? <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="square"><circle cx={12} cy={12} r={4} /><line x1={12} y1={2} x2={12} y2={5} /><line x1={12} y1={19} x2={12} y2={22} /><line x1={4} y1={12} x2={2} y2={12} /><line x1={22} y1={12} x2={19} y2={12} /></svg>
              : <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="square"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>}
          </button>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <form onSubmit={submit} className="auth-form" style={{
          width: 400, border: `1px solid ${C.border}`, fontFamily: FONT,
        }}>
          <div style={{ padding: '32px 32px 0' }}>
            <div style={{ width: 8, height: 8, background: C.accent, marginBottom: 20 }} />
            <h2 style={{
              margin: 0, fontFamily: FONT, color: C.ink, fontSize: '1.6rem',
              fontWeight: 900, letterSpacing: '-0.03em', textTransform: 'uppercase',
            }}>Create account</h2>
            <p style={{ margin: '6px 0 0', color: C.inkMid, fontSize: '0.85rem', lineHeight: 1.6 }}>
              Get started with VoiceFinance.
            </p>
          </div>

          <div style={{ padding: '28px 32px 32px' }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{
                fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em',
                textTransform: 'uppercase', color: C.inkMid, fontFamily: FONT, marginBottom: 8,
              }}>Email</div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocus('email')}
                onBlur={() => setFocus(null)}
                type="email"
                required
                style={inputBase('email')}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{
                fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em',
                textTransform: 'uppercase', color: C.inkMid, fontFamily: FONT, marginBottom: 8,
              }}>Password</div>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocus('password')}
                onBlur={() => setFocus(null)}
                type="password"
                required
                style={inputBase('password')}
              />
            </div>

            {error && (
              <div className="error-enter" style={{
                display: 'flex', gap: 8, alignItems: 'center', marginBottom: 20,
                padding: '10px 14px', border: `1px solid ${C.border}`,
              }}>
                <span style={{ color: '#E03E3E', fontSize: '0.85rem', fontWeight: 700, flexShrink: 0 }}>!</span>
                <span style={{ fontFamily: FONT, fontSize: '0.8rem', color: C.inkMid, lineHeight: 1.5 }}>{error}</span>
              </div>
            )}

            <button type="submit" style={{
              width: '100%', padding: '14px 0', background: C.accent, color: '#0F0F0E',
              border: 'none', fontFamily: FONT, fontSize: '0.75rem', fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = C.accentDk)}
              onMouseLeave={e => (e.currentTarget.style.background = C.accent)}>
              Create account →
            </button>

            <div style={{
              marginTop: 24, paddingTop: 20, borderTop: `1px solid ${C.borderFaint}`,
              display: 'flex', justifyContent: 'center',
            }}>
              <a href="/login" className="auth-link" style={{
                fontFamily: FONT, fontSize: '0.8rem', fontWeight: 600,
                color: C.inkMid, textDecoration: 'none',
              }}>
                Already have an account? <span style={{ color: C.accent, fontWeight: 700 }}>Sign in</span>
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
