"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import App from '../../src/App';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        if (!data.authenticated) return router.push('/login');
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => router.push('/login'));
    return () => { mounted = false; };
  }, [router]);

  if (loading) return <div style={{padding:40}}>Loading...</div>;

  return (
    <div>
      <div style={{ padding: 20, background: '#F2EFE8', borderBottom: '1px solid rgba(15,15,14,0.08)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <strong style={{ marginRight: 8 }}>{user.email}</strong>
            <span style={{ color: '#666' }}>— Dashboard</span>
          </div>
          <div>
            <button onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); router.push('/login'); }} style={{ padding: '8px 12px', background: '#00E639', border: 'none', borderRadius: 8, fontWeight: 700, color: '#0F0F0E' }}>Logout</button>
          </div>
        </div>
      </div>
      <App />
    </div>
  );
}
