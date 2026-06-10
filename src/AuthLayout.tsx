"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useThemeContext } from "./ThemeContext";
import { useAuth } from "./AuthContext";

const FONT = "'Helvetica Neue',Helvetica,Arial,sans-serif";

function AddExpenseModal({ C, onClose }: { C: any; onClose: () => void }) {
  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [category, setCategory] = useState("Food & Drink");
  const [saved, setSaved] = useState(false);

  const categories = ["Food & Drink", "Transport", "Shopping", "Subscriptions", "Bills", "Other"];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !merchant) return;
    setSaved(true);
    setTimeout(() => onClose(), 1200);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 500,
      background: "rgba(0,0,0,0.5)", display: "flex",
      alignItems: "center", justifyContent: "center",
      animation: "fadeIn 0.2s ease-out",
    }} onClick={onClose}>
      <div style={{
        width: 400, background: C.bg, border: `1px solid ${C.border}`,
        animation: "slideUp 0.3s ease-out",
      }} onClick={(e) => e.stopPropagation()}>
        {saved ? (
          <div style={{ padding: "48px 32px", textAlign: "center" }}>
            <div style={{ width: 40, height: 40, background: C.accent, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#0F0F0E" strokeWidth={3} strokeLinecap="square"><polyline points="20,6 9,17 4,12" /></svg>
            </div>
            <div style={{ fontFamily: FONT, fontSize: "1.1rem", fontWeight: 900, color: C.ink, letterSpacing: "-0.02em", marginBottom: 6 }}>Expense logged</div>
            <div style={{ fontFamily: FONT, fontSize: "0.85rem", color: C.inkMid }}>{merchant} — ${amount}</div>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div style={{ padding: "28px 28px 0" }}>
              <div style={{ width: 8, height: 8, background: C.accent, marginBottom: 16 }} />
              <h2 style={{
                margin: 0, fontFamily: FONT, color: C.ink, fontSize: "1.3rem",
                fontWeight: 900, letterSpacing: "-0.03em", textTransform: "uppercase",
              }}>Log Expense</h2>
              <p style={{ margin: "6px 0 0", color: C.inkMid, fontSize: "0.82rem", fontFamily: FONT }}>
                Quick voice-style expense entry
              </p>
            </div>

            <div style={{ padding: "24px 28px 28px" }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.inkMid, fontFamily: FONT, marginBottom: 6 }}>Amount ($)</div>
                <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" step="0.01" min="0" placeholder="0.00" required
                  style={{
                    width: "100%", padding: "11px 14px", border: `1px solid ${C.borderFaint}`, outline: "none",
                    background: C.surface, color: C.ink, fontFamily: FONT, fontSize: "0.9rem",
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.inkMid, fontFamily: FONT, marginBottom: 6 }}>Merchant / Description</div>
                <input value={merchant} onChange={(e) => setMerchant(e.target.value)} placeholder="e.g. Starbucks" required
                  style={{
                    width: "100%", padding: "11px 14px", border: `1px solid ${C.borderFaint}`, outline: "none",
                    background: C.surface, color: C.ink, fontFamily: FONT, fontSize: "0.9rem",
                  }}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.inkMid, fontFamily: FONT, marginBottom: 6 }}>Category</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {categories.map((c) => (
                    <div key={c} onClick={() => setCategory(c)} style={{
                      padding: "6px 12px", cursor: "pointer", fontFamily: FONT, fontSize: "0.75rem",
                      fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                      border: `1px solid ${category === c ? C.accent : C.borderFaint}`,
                      background: category === c ? C.accent : "transparent",
                      color: category === c ? "#0F0F0E" : C.inkMid,
                      transition: "all 0.15s ease",
                    }}>{c}</div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button type="submit" style={{
                  flex: 1, padding: "13px 0", background: C.accent, border: "none",
                  color: "#0F0F0E", fontWeight: 700, cursor: "pointer", fontFamily: FONT,
                  fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase",
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = C.accentDk)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = C.accent)}
                >Log expense</button>
                <button type="button" onClick={onClose} style={{
                  padding: "13px 20px", background: "transparent", border: `1px solid ${C.border}`,
                  color: C.ink, fontWeight: 600, cursor: "pointer", fontFamily: FONT,
                  fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase",
                }}>Cancel</button>
              </div>
            </div>
          </form>
        )}
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { C } = useThemeContext();
  const { loading, authenticated, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [showExpense, setShowExpense] = useState(false);

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", background: C.bg, display: "flex",
        alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16,
      }}>
        <div style={{ width: 8, height: 8, background: C.accent, animation: "pulse 1.5s infinite" }} />
        <span style={{ fontFamily: FONT, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.inkFaint }}>Loading</span>
      </div>
    );
  }

  if (!authenticated) {
    router.push('/login');
    return null;
  }

  const links: { label: string; href: string }[] = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Expenses", href: "/expenses" },
    { label: "AI Analytics", href: "/analytics" },
    { label: "Transactions", href: "/transactions" },
    { label: "Reports", href: "/reports" },
    { label: "Profile", href: "/profile" },
    { label: "Settings", href: "/settings" },
    { label: "Help", href: "/help" },
  ];

  const styles = `
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
    .main-content { animation: fadeIn 0.3s ease-out; }
    .nav-link { transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1); }
  `;

  return (
    <>
      <style>{styles}</style>
      <div style={{ display: "flex", minHeight: "100vh", background: C.bg }}>
        <aside style={{
          position: 'fixed', top: 0, left: 0, bottom: 0, width: 220,
          background: C.surface, borderRight: `1px solid ${C.borderFaint}`,
          padding: '20px 20px 12px', boxSizing: "border-box",
          display: "flex", flexDirection: "column",
          zIndex: 100,
        }}>
          <div>
            <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28, marginTop: 16, textDecoration: 'none' }}>
              <div style={{
                width: 32, height: 32, background: C.accent, display: "flex",
                alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#0F0F0E" strokeWidth={2.5} strokeLinecap="square">
                  <rect x={9} y={3} width={6} height={11} /><path d="M5 11a7 7 0 0 0 14 0" />
                  <line x1={12} y1={18} x2={12} y2={22} /><line x1={8} y1={22} x2={16} y2={22} />
                </svg>
              </div>
              <span style={{ fontFamily: FONT, fontWeight: 900, color: C.ink, fontSize: '0.95rem', letterSpacing: '-0.02em' }}>VoiceFinance</span>
            </Link>

            <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {links.map((l) => {
                const active = pathname === l.href || pathname.startsWith(l.href + "/");
                return (
                  <Link key={l.href} href={l.href} style={{ textDecoration: 'none' }}>
                    <div
                      className="nav-link"
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "10px 12px",
                        color: active ? "#0F0F0E" : C.inkMid,
                        background: active ? C.accent : "transparent",
                        fontFamily: FONT,
                        fontWeight: active ? 700 : 600,
                        fontSize: "0.92rem", cursor: "pointer",
                      }}
                      onMouseEnter={() => setHoveredLink(l.href)}
                      onMouseLeave={() => setHoveredLink(null)}
                    >
                      <span style={{
                        width: 5, height: 5,
                        background: active ? "#0F0F0E" : (hoveredLink === l.href ? C.accent : C.borderFaint),
                        display: "inline-block", transition: 'all 0.2s ease', flexShrink: 0,
                      }} />
                      <span style={{ flex: 1 }}>{l.label}</span>
                      {active && <span style={{ fontSize: '0.65rem', opacity: 0.5, color: '#0F0F0E' }}>◆</span>}
                    </div>
                  </Link>
                );
              })}
            </nav>

            <div style={{ marginTop: 24, borderTop: `1px solid ${C.borderFaint}`, paddingTop: 14 }}>
              <div style={{ fontSize: "0.65rem", color: C.inkMid, marginBottom: 8, letterSpacing: '0.1em', fontWeight: 700, textTransform: 'uppercase' }}>Account</div>
              <Link href="/profile" style={{ textDecoration: 'none' }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", padding: '8px 8px', cursor: "pointer" }}>
                  <div style={{
                    width: 28, height: 28, background: C.accent, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', color: '#0F0F0E',
                    fontWeight: 700, fontSize: '0.75rem', flexShrink: 0,
                  }}>{user?.email?.[0]?.toUpperCase() ?? "U"}</div>
                  <div style={{
                    fontWeight: 600, fontSize: '0.85rem', color: C.ink,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    fontFamily: FONT,
                  }}>{user?.email?.split('@')[0] ?? "User"}</div>
                </div>
              </Link>
            </div>
          </div>

          <div style={{ marginTop: "auto", borderTop: `1px solid ${C.borderFaint}`, paddingTop: 12 }}>
            <button
              onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); router.push('/login'); }}
              style={{
                width: "100%", padding: "10px 0", background: "transparent", border: `1px solid ${C.borderFaint}`,
                fontFamily: FONT, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em",
                textTransform: "uppercase", color: C.inkMid, cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#E03E3E"; e.currentTarget.style.borderColor = "#E03E3E"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = C.inkMid; e.currentTarget.style.borderColor = C.borderFaint; }}
            >
              Logout
            </button>
          </div>
        </aside>

        <main style={{ flex: 1, marginLeft: 220 }} className="main-content">
          {children}
        </main>
      </div>

      <button
        onClick={() => setShowExpense(true)}
        style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 200,
          width: 52, height: 52, background: C.accent, border: "none",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 0.2s ease",
          boxShadow: `0 4px 16px ${C.accent}50`,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = C.accentDk)}
        onMouseLeave={(e) => (e.currentTarget.style.background = C.accent)}
      >
        <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#0F0F0E" strokeWidth={2.5} strokeLinecap="square">
          <line x1={12} y1={5} x2={12} y2={19} /><line x1={5} y1={12} x2={19} y2={12} />
        </svg>
      </button>

      {showExpense && <AddExpenseModal C={C} onClose={() => setShowExpense(false)} />}
    </>
  );
}
