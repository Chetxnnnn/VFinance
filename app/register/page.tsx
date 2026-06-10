"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
        // auto-login by calling login endpoint
        await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        router.push('/dashboard');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F2EFE8' }}>
      <form onSubmit={submit} style={{ width: 420, padding: 28, borderRadius: 12, background: '#fff', boxShadow: '0 6px 30px rgba(0,0,0,0.08)' }}>
        <h2 style={{ margin: 0, marginBottom: 12, fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif" }}>Create account</h2>
        <p style={{ marginTop: 0, marginBottom: 18, color: '#666' }}>Create an account to get started with VoiceFinance.</p>
        <label style={{ display: 'block', marginBottom: 8, fontSize: 12, color: '#333' }}>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '10px 12px', marginBottom: 12, border: '1px solid #ddd', borderRadius: 6 }} />
        <label style={{ display: 'block', marginBottom: 8, fontSize: 12, color: '#333' }}>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px 12px', marginBottom: 12, border: '1px solid #ddd', borderRadius: 6 }} />
        {error && <div style={{ color: 'crimson', marginBottom: 12 }}>{error}</div>}
        <button type="submit" style={{ width: '100%', padding: '12px 14px', background: '#00E639', color: '#0F0F0E', border: 'none', borderRadius: 8, fontWeight: 700 }}>Create account</button>
        <div style={{ marginTop: 12, textAlign: 'center' }}>
          <a href="/login" style={{ color: '#00E639', fontWeight: 700, textDecoration: 'none' }}>Already have an account? Sign in</a>
        </div>
      </form>
    </div>
  );
}
