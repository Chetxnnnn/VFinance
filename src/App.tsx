"use client";
import { useState, useEffect, useRef, ReactNode, CSSProperties } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
type Theme = {
  bg: string; surface: string; ink: string; inkMid: string; inkFaint: string;
  accent: string; accentDk: string; border: string; borderFaint: string;
};
type ThemeProps = { C: Theme };

// ── Theme ──────────────────────────────────────────────────────────────────
const T: Record<"light" | "dark", Theme> = {
  light: {
    bg: "#F2EFE8", surface: "#E8E4DA", ink: "#0F0F0E", inkMid: "#4A4844",
    inkFaint: "#9A9690", accent: "#00E639", accentDk: "#00B82C",
    border: "#0F0F0E", borderFaint: "rgba(15,15,14,0.15)",
  },
  dark: {
    bg: "#0C0C0B", surface: "#161614", ink: "#F2EFE8", inkMid: "#B0ADA6",
    inkFaint: "#5A5854", accent: "#00E639", accentDk: "#00B82C",
    border: "#F2EFE8", borderFaint: "rgba(242,239,232,0.12)",
  },
};

export function useTheme() {
  const [dark, setDark] = useState(false);
  return { dark, C: dark ? T.dark : T.light, toggle: () => setDark((d) => !d) };
}

// ── useInView ──────────────────────────────────────────────────────────────
function useInView(threshold = 0.1): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVis(true); observer.disconnect(); } },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, vis];
}

// ── Reveal ─────────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, y = 24, style = {} }: {
  children: ReactNode; delay?: number; y?: number; style?: CSSProperties;
}) {
  const [ref, vis] = useInView();
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "none" : `translateY(${y}px)`,
      transition: `opacity 0.55s ease ${delay}s, transform 0.55s cubic-bezier(.22,1,.36,1) ${delay}s`,
      ...style,
    }}>{children}</div>
  );
}

// ── Waveform ───────────────────────────────────────────────────────────────
function Waveform({ C }: ThemeProps) {
  const bars = [18, 32, 14, 48, 22, 60, 16, 52, 28, 44, 12, 56, 20, 40, 24, 36, 46, 18];
  const css = `@keyframes wb{0%,100%{transform:scaleY(.3)}50%{transform:scaleY(1)}}` +
    bars.map((_, i) => `.wb${i}{animation:wb ${.7 + (i % 5) * .15}s ease-in-out ${i * .07}s infinite;transform-box:fill-box;transform-origin:center}`).join("");
  return (
    <svg viewBox="0 0 360 80" style={{ width: "100%", display: "block" }}>
      <style>{css}</style>
      {bars.map((h, i) => <rect key={i} className={`wb${i}`} x={8 + i * 19} y={(80 - h) / 2} width={10} height={h} fill={C.accent} />)}
    </svg>
  );
}

// ── SpendRing ──────────────────────────────────────────────────────────────
function SpendRing({ C }: ThemeProps) {
  const cats = [
    { label: "Rent", pct: 38, color: C.ink }, { label: "Food", pct: 22, color: C.accent },
    { label: "Transport", pct: 14, color: C.inkMid }, { label: "Subscriptions", pct: 11, color: C.inkFaint },
    { label: "Other", pct: 15, color: C.borderFaint },
  ];
  const cx = 120, cy = 120, R = 90, r = 54;
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
    <svg viewBox="0 0 380 240" style={{ width: "100%", display: "block" }}>
      {slices.map((s, i) => <path key={i} d={s.d} fill={s.color} stroke={C.bg} strokeWidth={2} />)}
      <text x={cx} y={cy - 8} textAnchor="middle" fontSize={22} fontWeight={700} fontFamily="'Helvetica Neue',Helvetica,Arial,sans-serif" fill={C.ink}>$4,280</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize={10} letterSpacing={2} fontFamily="'Helvetica Neue',Helvetica,Arial,sans-serif" fill={C.inkFaint}>MONTHLY</text>
      {cats.map((c, i) => (
        <g key={i}>
          <rect x={262} y={20 + i * 40} width={12} height={12} fill={c.color} />
          <text x={282} y={31 + i * 40} fontSize={11} fontFamily="'Helvetica Neue',Helvetica,Arial,sans-serif" fill={C.inkMid}>{c.label} — {c.pct}%</text>
        </g>
      ))}
    </svg>
  );
}

// ── BarChart ───────────────────────────────────────────────────────────────
function BarChart({ C }: ThemeProps) {
  const data = [
    { m: "JUL", v: 3100 }, { m: "AUG", v: 3800 }, { m: "SEP", v: 2900 },
    { m: "OCT", v: 4200 }, { m: "NOV", v: 3500 }, { m: "DEC", v: 2700 },
  ];
  const max = 4400, W = 340, H = 120, pad = 12, barW = 36, gap = 20, x0 = 24;
  return (
    <svg viewBox={`0 0 ${W} ${H + 40}`} style={{ width: "100%", display: "block" }}>
      {[1000, 2000, 3000, 4000].map(v => <line key={v} x1={x0} y1={H - (v / max) * H + pad} x2={W - 8} y2={H - (v / max) * H + pad} stroke={C.borderFaint} strokeWidth={0.5} />)}
      {data.map((d, i) => {
        const bh = (d.v / max) * (H - pad), bx = x0 + i * (barW + gap);
        return (
          <g key={i}>
            <rect x={bx} y={H - bh + pad} width={barW} height={bh} fill={i === 3 ? C.accent : C.inkFaint} />
            <text x={bx + barW / 2} y={H + pad + 14} textAnchor="middle" fontSize={9} fontFamily="'Helvetica Neue',Helvetica,Arial,sans-serif" fill={C.inkFaint}>{d.m}</text>
            {i === 3 && <text x={bx + barW / 2} y={H - bh + pad - 5} textAnchor="middle" fontSize={9} fontFamily="'Helvetica Neue',Helvetica,Arial,sans-serif" fill={C.accent}>PEAK</text>}
          </g>
        );
      })}
    </svg>
  );
}

// ── GeoAccent ──────────────────────────────────────────────────────────────
function GeoAccent({ C, style }: { C: Theme; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 400 400" style={{ position: "absolute", pointerEvents: "none", opacity: 0.06, ...style }}>
      <circle cx={200} cy={200} r={180} fill="none" stroke={C.ink} strokeWidth={1} />
      <circle cx={200} cy={200} r={120} fill="none" stroke={C.ink} strokeWidth={0.5} />
      <circle cx={200} cy={200} r={60} fill="none" stroke={C.ink} strokeWidth={0.5} />
      <line x1={20} y1={200} x2={380} y2={200} stroke={C.ink} strokeWidth={0.5} />
      <line x1={200} y1={20} x2={200} y2={380} stroke={C.ink} strokeWidth={0.5} />
      <line x1={73} y1={73} x2={327} y2={327} stroke={C.ink} strokeWidth={0.5} />
      <line x1={327} y1={73} x2={73} y2={327} stroke={C.ink} strokeWidth={0.5} />
      <rect x={110} y={110} width={180} height={180} fill="none" stroke={C.ink} strokeWidth={0.5} />
    </svg>
  );
}

// ── Marquee ────────────────────────────────────────────────────────────────
const ENTRIES = ["$12.50 coffee", "$84 groceries", "$1,200 rent", "$22 gym", "$340 weekend trip", "$18 streaming", "Saved $500", "+4.2% portfolio"];
function Marquee({ C }: ThemeProps) {
  const doubled = [...ENTRIES, ...ENTRIES];
  return (
    <div style={{ overflow: "hidden", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, background: C.accent, padding: "10px 0" }}>
      <div style={{ display: "flex", animation: "marquee 18s linear infinite", whiteSpace: "nowrap" }}>
        {doubled.map((e, i) => (
          <span key={i} style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.06em", color: "#0F0F0E", padding: "0 32px" }}>
            {e} <span style={{ opacity: 0.4, marginLeft: 8 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── handleTts ──────────────────────────────────────────────────────────────
// Points at your separate backend. Update NEXT_PUBLIC_API_URL in .env to your backend origin.
const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000");

const handleTts = async () => {
  const text = "ज़रूर! 6 अगस्त 2026 को 20000 किराया चुका दिया गया था, मैंने इसे रिकॉर्ड कर लिया है!";
  console.log("[handleTts] Starting TTS request, text:", text);
  try {
    console.log("[handleTts] Sending POST to", `${API_BASE}/api/tts`);
    const response = await fetch(`${API_BASE}/api/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    console.log("[handleTts] Response status:", response.status, response.statusText);
    console.log("[handleTts] Response content-type:", response.headers.get("content-type"));
    if (!response.ok) {
      const errBody = await response.text();
      console.error("[handleTts] Non-OK response body:", errBody);
      throw new Error(`Failed to generate speech: ${response.status} ${response.statusText}`);
    }
    console.log("[handleTts] Converting response to blob...");
    const blob = await response.blob();
    console.log("[handleTts] Blob size (bytes):", blob.size, "| type:", blob.type);
    const url = URL.createObjectURL(blob);
    console.log("[handleTts] Object URL created:", url);
    const audio = new Audio(url);
    audio.oncanplaythrough = () => console.log("[handleTts] Audio ready, playing...");
    audio.onended = () => { console.log("[handleTts] Playback finished, revoking URL"); URL.revokeObjectURL(url); };
    audio.onerror = (e) => console.error("[handleTts] Audio playback error:", e);
    await audio.play();
  } catch (error) {
    console.error("[handleTts] Error:", error);
    alert("Something went wrong generating audio.");
  } finally {
    console.log("[handleTts] Done.");
  }
};

const handleSTT = async () => {
  // ── 1. Get mic access ────────────────────────────────────────────────────
  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (err) {
    console.error("[handleSTT] Mic access denied:", err);
    alert("Microphone access is required for speech-to-text.");
    return;
  }

  console.log("[handleSTT] Recording started — speak now (5 s)…");

  // ── 2. Record for 5 seconds ──────────────────────────────────────────────
  const chunks: BlobPart[] = [];
  // Prefer webm/opus (Chrome/Firefox); Safari falls back to whatever is supported
  const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
    ? "audio/webm;codecs=opus"
    : MediaRecorder.isTypeSupported("audio/webm")
      ? "audio/webm"
      : "";
  const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
  recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };

  await new Promise<void>((resolve) => {
    recorder.onstop = () => resolve();
    recorder.start();
    setTimeout(() => recorder.stop(), 5000); // record for 5 s
  });

  // Stop all mic tracks so the browser indicator goes away
  stream.getTracks().forEach((t) => t.stop());

  const audioBlob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
  console.log("[handleSTT] Recorded blob — size:", audioBlob.size, "type:", audioBlob.type);

  // ── 3. Send to backend ───────────────────────────────────────────────────
  const formData = new FormData();
  // Sarvam AI expects the field name "file" with a proper filename
  formData.append("file", audioBlob, "recording.webm");

  try {
    console.log("[handleSTT] POSTing to", `${API_BASE}/api/stt`);
    const response = await fetch(`${API_BASE}/api/stt`, {
      method: "POST",
      body: formData, // multipart/form-data — do NOT set Content-Type manually
    });

    console.log("[handleSTT] Response status:", response.status, response.statusText);

    if (!response.ok) {
      const errBody = await response.text();
      console.error("[handleSTT] Non-OK response body:", errBody);
      throw new Error(`STT request failed: ${response.status} ${response.statusText}`);
    }

    // ── 4. Show transcript ─────────────────────────────────────────────────
    const data = await response.json() as { transcript?: string; text?: string };
    const transcript = data.transcript ?? data.text ?? JSON.stringify(data);
    console.log("[handleSTT] Transcript:", transcript);
    alert(`Transcript:\n${transcript}`);
  } catch (error) {
    console.error("[handleSTT] Error:", error);
    alert("Something went wrong with speech recognition.");
  } finally {
    console.log("[handleSTT] Done.");
  }
};

// ── Navbar ─────────────────────────────────────────────────────────────────
export function Navbar({ C, dark, toggle }: { C: Theme; dark: boolean; toggle: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, background: C.bg, borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`, transition: "border-color 0.3s" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          <div style={{ width: 32, height: 32, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", marginRight: 10, flexShrink: 0 }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#0F0F0E" strokeWidth={2.5} strokeLinecap="square">
              <rect x={9} y={3} width={6} height={11} /><path d="M5 11a7 7 0 0 0 14 0" />
              <line x1={12} y1={18} x2={12} y2={22} /><line x1={8} y1={22} x2={16} y2={22} />
            </svg>
          </div>
          <span style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontWeight: 900, fontSize: "1.05rem", letterSpacing: "-0.02em", color: C.ink, textTransform: "uppercase" }}>VoiceFinance</span>
        </div>
        <div className="nav-desktop" style={{ display: "flex", gap: 40 }}>
          {["Features", "How it works", "Pricing"].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, "-")}`}
              style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: C.inkMid, textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.ink)}
              onMouseLeave={e => (e.currentTarget.style.color = C.inkMid)}>{l}</a>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={toggle} style={{ width: 36, height: 36, background: "none", border: `1px solid ${C.border}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.ink, flexShrink: 0 }}
            onMouseEnter={e => (e.currentTarget.style.background = C.accent)}
            onMouseLeave={e => (e.currentTarget.style.background = "none")}>
            {dark
              ? <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="square"><circle cx={12} cy={12} r={4} /><line x1={12} y1={2} x2={12} y2={5} /><line x1={12} y1={19} x2={12} y2={22} /><line x1={4} y1={12} x2={2} y2={12} /><line x1={22} y1={12} x2={19} y2={12} /></svg>
              : <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="square"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>}
          </button>
          <a href="/register" className="nav-desktop" style={{ padding: "9px 20px", background: C.ink, border: "none", cursor: "pointer", fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.bg, transition: "background 0.2s", display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.background = C.accent)}
            onMouseLeave={e => (e.currentTarget.style.background = C.ink)}>
            Get started
          </a>
          <button className="nav-mobile" onClick={() => setMenuOpen(m => !m)} style={{ width: 36, height: 36, background: "none", border: `1px solid ${C.border}`, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5, color: C.ink }}>
            <span style={{ display: "block", width: 16, height: 1.5, background: C.ink }} />
            <span style={{ display: "block", width: 16, height: 1.5, background: C.ink }} />
            <span style={{ display: "block", width: 16, height: 1.5, background: C.ink }} />
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="nav-mobile" style={{ background: C.bg, borderTop: `1px solid ${C.border}`, padding: "16px 20px", display: "flex", flexDirection: "column", gap: 0 }}>
          {["Features", "How it works", "Pricing"].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, "-")}`} onClick={() => setMenuOpen(false)}
              style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.ink, textDecoration: "none", padding: "14px 0", borderBottom: `1px solid ${C.borderFaint}` }}>{l}</a>
          ))}
          <a href="/register" style={{ marginTop: 16, padding: "13px", background: C.ink, border: "none", cursor: "pointer", fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.bg, display: 'inline-block', textAlign: 'center', textDecoration: 'none' }}>
            Get started
          </a>
        </div>
      )}
    </nav>
  );
}

// ── Hero ───────────────────────────────────────────────────────────────────
function Hero({ C }: ThemeProps) {
  const phrases = ["I spent $12 on coffee", "Move $500 to savings", "Paid $240 electricity", "Dinner was $85 last night"];
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [typing, setTyping] = useState(true);
  useEffect(() => {
    const phrase = phrases[phraseIdx];
    if (typing) {
      if (typed.length < phrase.length) {
        const t = setTimeout(() => setTyped(phrase.slice(0, typed.length + 1)), 55);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setTyping(false), 1600);
        return () => clearTimeout(t);
      }
    } else {
      if (typed.length > 0) {
        const t = setTimeout(() => setTyped(typed.slice(0, -1)), 28);
        return () => clearTimeout(t);
      } else { setPhraseIdx(i => (i + 1) % phrases.length); setTyping(true); }
    }
  }, [typed, typing, phraseIdx]);

  return (
    <section style={{ background: C.bg, padding: "120px 20px 0", position: "relative", overflow: "hidden", minHeight: "100vh" }}>
      <GeoAccent C={C} style={{ width: 600, height: 600, top: -100, right: -100 }} />
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <Reveal delay={0.05}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
            <div style={{ width: 8, height: 8, background: C.accent }} />
            <span style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: C.inkMid }}>AI-Powered Financial OS</span>
          </div>
        </Reveal>
        <div className="hero-grid">
          <div>
            <Reveal delay={0.1}>
              <h1 style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "clamp(3.2rem,7.5vw,7rem)", fontWeight: 900, lineHeight: 0.95, letterSpacing: "-0.04em", color: C.ink, margin: 0, textTransform: "uppercase" }}>
                Your<br /><span style={{ color: C.accent }}>Voice.</span><br />Your<br />Money.
              </h1>
            </Reveal>
            <Reveal delay={0.22}>
              <p style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "1rem", lineHeight: 1.7, color: C.inkMid, maxWidth: 440, marginTop: 36, marginBottom: 0, borderLeft: `2px solid ${C.accent}`, paddingLeft: 20 }}>
                Stop fighting spreadsheets. Speak naturally. Our AI tracks every dollar, spots every pattern, and tells you exactly where your money is going — in real time.
              </p>
            </Reveal>
            <Reveal delay={0.3} style={{ marginTop: 44 }}>
              <div style={{ display: "flex", gap: 0, flexWrap: "wrap" }}>
                <a href="/register" style={{ padding: "14px 36px", background: C.ink, border: `1px solid ${C.ink}`, cursor: "pointer", fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.bg, transition: "all 0.2s", display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.accent; e.currentTarget.style.color = "#0F0F0E"; e.currentTarget.style.borderColor = C.accent; }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.ink; e.currentTarget.style.color = C.bg; e.currentTarget.style.borderColor = C.ink; }}>
                  Start free
                </a>
                <button style={{ padding: "14px 36px", background: "transparent", border: `1px solid ${C.border}`, cursor: "pointer", fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.ink, marginLeft: -1, transition: "background 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = C.borderFaint)}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  See demo →
                </button>
                <button style={{ padding: "14px 36px", background: "transparent", border: `1px solid ${C.border}`, cursor: "pointer", fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.ink, marginLeft: -1, transition: "background 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = C.borderFaint)}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  onClick={handleTts}>
                  Try TTS →
                </button>
                <button style={{ padding: "14px 36px", background: "transparent", border: `1px solid ${C.border}`, cursor: "pointer", fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.ink, marginLeft: -1, transition: "background 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = C.borderFaint)}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  onClick={handleSTT}>
                  Try STT →
                </button>
              </div>
            </Reveal>
            <Reveal delay={0.38} style={{ marginTop: 72 }}>
              <div className="stats-row" style={{ display: "flex", borderTop: `1px solid ${C.borderFaint}`, paddingTop: 32 }}>
                {[["50K+", "Active users"], ["$2.4B", "Tracked yearly"], ["200ms", "Avg response"]].map(([n, l], i) => (
                  <div key={l} style={{ flex: 1, paddingRight: 24, borderRight: i < 2 ? `1px solid ${C.borderFaint}` : "none", paddingLeft: i > 0 ? 24 : 0 }}>
                    <div style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 900, letterSpacing: "-0.04em", color: C.ink }}>{n}</div>
                    <div style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.inkFaint, marginTop: 4 }}>{l}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.18} y={40}>
            <div style={{ border: `1px solid ${C.border}`, background: C.surface }}>
              <div style={{ borderBottom: `1px solid ${C.border}`, padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.inkFaint }}>Voice Input</span>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <div style={{ width: 6, height: 6, background: C.accent, animation: "pulse 1.5s infinite" }} />
                  <span style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.65rem", color: C.accent, letterSpacing: "0.1em" }}>LIVE</span>
                </div>
              </div>
              <div style={{ padding: "24px 20px 16px", minHeight: 64 }}>
                <span style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "1.05rem", color: C.ink, letterSpacing: "-0.01em" }}>
                  "{typed}<span style={{ borderRight: `2px solid ${C.accent}`, marginLeft: 1, animation: "blink 1s step-end infinite" }}>&nbsp;</span>"
                </span>
              </div>
              <div style={{ padding: "0 20px 8px" }}><Waveform C={C} /></div>
              <div style={{ borderTop: `1px solid ${C.borderFaint}`, padding: "16px 20px" }}>
                <div style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.inkFaint, marginBottom: 12 }}>Detected</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[["Category", "Food & Drink"], ["Amount", "$12.50"], ["Merchant", "Starbucks"], ["Budget left", "$187.50"]].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <span style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.inkFaint }}>{k}</span>
                      <span style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.9rem", fontWeight: 700, color: v === "$187.50" ? C.accent : C.ink }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ borderTop: `1px solid ${C.borderFaint}`, padding: "12px 20px" }}>
                <div style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.inkFaint, marginBottom: 8 }}>6-month spending</div>
                <BarChart C={C} />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
      <div style={{ marginTop: 80 }}><Marquee C={C} /></div>
    </section>
  );
}

// ── Features ───────────────────────────────────────────────────────────────
function Features({ C }: ThemeProps) {
  const features = [
    { num: "01", title: "Voice-first input", body: "No app to open. No form to fill. Say 'spent $45 on lunch' and it's done. Our NLP understands context, currency, and merchant names from natural speech." },
    { num: "02", title: "AI that learns you", body: "After two weeks, VoiceFinance knows your Starbucks habit costs you $180/month and suggests better alternatives. Real personalized advice, not generic tips." },
    { num: "03", title: "Instant visualization", body: "Every entry updates 11 live charts simultaneously. Pie charts, bar charts, burn rate graphs — all current, all from voice commands." },
    { num: "04", title: "Bank sync", body: "Connect 12,000+ banks and automatically reconcile your spoken entries with real transactions. Catch duplicate charges and unauthorized payments." },
    { num: "05", title: "Budget enforcement", body: "Set limits by category. Get a voice alert when you're 80% through your food budget. The AI negotiates with your future self so you don't have to." },
    { num: "06", title: "Zero-knowledge security", body: "AES-256 at rest, TLS 1.3 in transit. We cannot read your data even with full database access. Your privacy is structural, not a policy." },
  ];
  return (
    <section id="features" style={{ background: C.bg, borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 20px 60px" }}>
        <Reveal>
          <div className="features-header" style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", borderBottom: `1px solid ${C.border}`, paddingBottom: 24, marginBottom: 0, gap: 24 }}>
            <h2 style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 900, letterSpacing: "-0.04em", textTransform: "uppercase", color: C.ink, margin: 0, flexShrink: 0 }}>Everything<br />you need.</h2>
            <p style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.9rem", color: C.inkMid, maxWidth: 320, textAlign: "right", lineHeight: 1.7, margin: 0 }}>
              A complete financial operating system built around the way humans actually communicate — out loud.
            </p>
          </div>
        </Reveal>
        <div className="features-grid">
          {features.map((f) => (
            <div key={f.num} className="feature-cell" style={{ padding: "36px 32px", transition: "background 0.2s", cursor: "default" }}
              onMouseEnter={e => (e.currentTarget.style.background = C.surface)}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <div style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.2em", color: C.accent, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                <span>{f.num}</span>
                <div style={{ flex: 1, height: 1, background: C.accent, opacity: 0.3 }} />
              </div>
              <h3 style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "1.05rem", fontWeight: 700, letterSpacing: "-0.02em", textTransform: "uppercase", color: C.ink, margin: "0 0 14px" }}>{f.title}</h3>
              <p style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.875rem", lineHeight: 1.75, color: C.inkMid, margin: 0 }}>{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── HowItWorks ─────────────────────────────────────────────────────────────
function HowItWorks({ C }: ThemeProps) {
  const steps = [
    { n: "I", title: "Speak", sub: "Say anything naturally", body: "'Spent $340 on groceries.' 'Transfer $500 to savings.' 'What did I spend on food last month?' — any phrasing works." },
    { n: "II", title: "Extract", sub: "AI parses in 200ms", body: "Amount, category, merchant, intent, and time context are extracted by a fine-tuned language model trained on 40M financial transactions." },
    { n: "III", title: "Insight", sub: "Your data, instantly", body: "Dashboard updates live. Budget impact calculated. AI advice generated. A complete picture of your financial life, updated the moment you finish speaking." },
  ];
  return (
    <section id="how-it-works" style={{ background: C.surface, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 20px" }}>
        <Reveal>
          <div style={{ display: "flex", alignItems: "baseline", gap: 24, marginBottom: 64 }}>
            <div style={{ width: 8, height: 8, background: C.accent, flexShrink: 0, marginBottom: 4 }} />
            <h2 style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.inkMid, margin: 0 }}>How it works</h2>
          </div>
        </Reveal>
        <div className="steps-grid" style={{ borderTop: `1px solid ${C.border}` }}>
          {steps.map((s) => (
            <div key={s.n} className="step-cell" style={{ padding: "48px 40px", position: "relative" }}>
              <div style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "4rem", fontWeight: 900, letterSpacing: "-0.05em", color: C.borderFaint, marginBottom: 32, lineHeight: 1, userSelect: "none" }}>{s.n}</div>
              <div style={{ width: 40, height: 1, background: C.accent, marginBottom: 24 }} />
              <h3 style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "1.8rem", fontWeight: 900, letterSpacing: "-0.03em", textTransform: "uppercase", color: C.ink, margin: "0 0 6px" }}>{s.title}</h3>
              <div style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.accent, marginBottom: 20 }}>{s.sub}</div>
              <p style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.875rem", lineHeight: 1.75, color: C.inkMid, margin: 0 }}>{s.body}</p>
            </div>
          ))}
        </div>
        <Reveal delay={0.1} style={{ marginTop: 64, border: `1px solid ${C.border}` }}>
          <div className="viz-grid">
            <div className="viz-left" style={{ padding: "36px 40px" }}>
              <div style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: C.inkFaint, marginBottom: 24 }}>Monthly spending by category</div>
              <SpendRing C={C} />
            </div>
            <div style={{ padding: "36px 40px" }}>
              <div style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: C.inkFaint, marginBottom: 16 }}>What users discover</div>
              {[["$340/mo", "Average forgotten subscriptions found"], ["23%", "Reduction in discretionary spending after 30 days"], ["$1,200", "Average extra saved in first 6 months"], ["11 min", "Time saved daily vs. manual budgeting"]].map(([stat, label]) => (
                <div key={stat} style={{ display: "flex", alignItems: "baseline", gap: 20, padding: "18px 0", borderBottom: `1px solid ${C.borderFaint}` }}>
                  <span style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "1.6rem", fontWeight: 900, letterSpacing: "-0.04em", color: C.accent, minWidth: 90 }}>{stat}</span>
                  <span style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.85rem", color: C.inkMid, lineHeight: 1.5 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── FinanceLiteracy ────────────────────────────────────────────────────────
function FinanceLiteracy({ C }: ThemeProps) {
  const rules = [
    { rule: "50/30/20", title: "The allocation rule", body: "50% needs, 30% wants, 20% savings. This single framework underpins the budgeting logic VoiceFinance builds for every new user." },
    { rule: "Rule of 72", title: "Doubling time", body: "Divide 72 by your return rate. At 8%, money doubles in 9 years. Our AI tells you exactly when your savings goals will be reached." },
    { rule: "6× salary", title: "Emergency fund", body: "6 months of expenses in liquid savings before investing anything else. VoiceFinance tracks your progress toward this baseline automatically." },
    { rule: "1% fee", title: "The hidden cost", body: "A 1% fund expense ratio costs $100K+ over 30 years on a $200K portfolio. We flag high-fee funds when you mention them." },
  ];
  return (
    <section style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 20px" }}>
        <Reveal>
          <div className="literacy-header" style={{ gap: 40, alignItems: "start", marginBottom: 56 }}>
            <div>
              <h2 style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 900, letterSpacing: "-0.04em", textTransform: "uppercase", color: C.ink, margin: 0, lineHeight: 1 }}>
                Financial rules<br />to live by.
              </h2>
            </div>
            <p style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.9rem", color: C.inkMid, lineHeight: 1.8, margin: 0, maxWidth: 500 }}>
              VoiceFinance doesn't just track numbers — it teaches you how to think about money. These are the four principles baked into our AI advice engine.
            </p>
          </div>
        </Reveal>
        <div className="rules-grid" style={{ borderTop: `1px solid ${C.border}`, borderLeft: `1px solid ${C.border}` }}>
          {rules.map((r) => (
            <div key={r.rule} style={{ padding: "32px 28px", borderRight: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, transition: "background 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.background = C.surface)}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <div style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "1.9rem", fontWeight: 900, letterSpacing: "-0.04em", color: C.ink, marginBottom: 12 }}>{r.rule}</div>
              <div style={{ width: 24, height: 2, background: C.accent, marginBottom: 16 }} />
              <div style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.inkMid, marginBottom: 10 }}>{r.title}</div>
              <p style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.83rem", color: C.inkFaint, lineHeight: 1.7, margin: 0 }}>{r.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ───────────────────────────────────────────────────────────
function Testimonials({ C }: ThemeProps) {
  const quotes = [
    { q: "I had no idea I was spending $420 a month on subscriptions. VoiceFinance found it in the first week.", a: "Sarah M.", t: "Saves $420/mo now" },
    { q: "The voice input is genuinely magic. I log expenses while walking to the car. Takes 4 seconds.", a: "James R.", t: "Uses it 6× daily" },
    { q: "As a freelancer with lumpy income, the AI budget flexibility actually makes financial planning feel possible.", a: "Priya K.", t: "3× better clarity" },
  ];
  return (
    <section style={{ background: C.ink, borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 20px" }}>
        <Reveal>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 56 }}>
            <div style={{ width: 8, height: 8, background: C.accent }} />
            <span style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.accent }}>From users</span>
          </div>
        </Reveal>
        <div className="testimonials-grid" style={{ borderTop: "1px solid rgba(242,239,232,0.12)" }}>
          {quotes.map((q) => (
            <div key={q.a} className="testimonial-cell" style={{ padding: "40px 36px" }}>
              <div style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "3rem", lineHeight: 0.7, color: C.accent, marginBottom: 24, fontWeight: 900 }}>"</div>
              <p style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "1rem", lineHeight: 1.75, color: C.bg, margin: "0 0 28px" }}>{q.q}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.8rem", fontWeight: 700, color: "rgba(242,239,232,0.6)" }}>{q.a}</span>
                <span style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.accent }}>{q.t}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Pricing ────────────────────────────────────────────────────────────────
function Pricing({ C }: ThemeProps) {
  const plans = [
    { name: "Starter", price: "Free", period: "", desc: "For individuals starting to take control.", features: ["50 voice entries / month", "3 budget categories", "Monthly AI summary", "Single device", "Community support"], cta: "Get started", featured: false },
    { name: "Pro", price: "$12", period: "/mo", desc: "Complete financial control. No compromises.", features: ["Unlimited voice entries", "Unlimited categories", "Weekly AI insights", "Multi-device + Watch", "Bank sync (12,000+)", "CSV / PDF export", "Priority support"], cta: "Go pro", featured: true },
    { name: "Family", price: "$24", period: "/mo", desc: "Shared accounts for households.", features: ["Up to 6 members", "Shared budgets", "Individual privacy mode", "Family spending reports", "Dedicated manager", "API access", "SLA guarantee"], cta: "Contact us", featured: false },
  ];
  return (
    <section id="pricing" style={{ background: C.bg, borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 20px" }}>
        <Reveal>
          <div className="pricing-header" style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: 48, marginBottom: 56, gap: 24 }}>
            <h2 style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "clamp(2.2rem,4vw,4rem)", fontWeight: 900, letterSpacing: "-0.04em", textTransform: "uppercase", color: C.ink, margin: 0, lineHeight: 0.95 }}>Transparent<br />pricing.</h2>
            <p style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.875rem", color: C.inkMid, maxWidth: 280, lineHeight: 1.7, margin: 0 }}>
              No trials that expire without warning. No seat fees. No surprises.
            </p>
          </div>
        </Reveal>
        <div className="pricing-grid" style={{ border: `1px solid ${C.border}` }}>
          {plans.map((p) => (
            <div key={p.name} className="pricing-cell" style={{ padding: "40px 36px", background: p.featured ? C.ink : "transparent", position: "relative" }}>
              {p.featured && (
                <div style={{ position: "absolute", top: 20, right: 20, background: C.accent, padding: "4px 10px", fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#0F0F0E" }}>Popular</div>
              )}
              <div style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: p.featured ? C.accent : C.inkFaint, marginBottom: 8 }}>{p.name}</div>
              <p style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.82rem", color: p.featured ? "rgba(242,239,232,0.5)" : C.inkFaint, marginBottom: 28, lineHeight: 1.5 }}>{p.desc}</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 36 }}>
                <span style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "3rem", fontWeight: 900, letterSpacing: "-0.04em", color: p.featured ? C.bg : C.ink, lineHeight: 1 }}>{p.price}</span>
                <span style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.875rem", color: p.featured ? "rgba(242,239,232,0.4)" : C.inkFaint }}>{p.period}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 36 }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ color: C.accent, fontSize: "0.85rem", lineHeight: "1.4", flexShrink: 0, fontWeight: 900 }}>+</span>
                    <span style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.82rem", color: p.featured ? "rgba(242,239,232,0.7)" : C.inkMid, lineHeight: 1.5 }}>{f}</span>
                  </div>
                ))}
              </div>
              <a href="/register" style={{ width: "100%", padding: "13px 0", background: p.featured ? C.accent : "transparent", border: `1px solid ${p.featured ? C.accent : C.border}`, cursor: "pointer", fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: p.featured ? "#0F0F0E" : C.ink, transition: "background 0.2s, color 0.2s", display: 'inline-block', textAlign: 'center', textDecoration: 'none' }}
                onMouseEnter={e => { if (p.featured) { e.currentTarget.style.background = C.accentDk; } else { e.currentTarget.style.background = C.ink; e.currentTarget.style.color = C.bg; } }}
                onMouseLeave={e => { if (p.featured) { e.currentTarget.style.background = C.accent; } else { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.ink; } }}>
                {p.cta} →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTABand ────────────────────────────────────────────────────────────────
function CTABand({ C }: ThemeProps) {
  return (
    <section style={{ background: C.accent, borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
        <Reveal>
          <h2 style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 900, letterSpacing: "-0.04em", textTransform: "uppercase", color: "#0F0F0E", margin: 0, lineHeight: 0.95 }}>
            Stop guessing.<br />Start knowing.
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <div style={{ display: "flex", gap: 0, flexWrap: "wrap" }}>
            <a href="/register" style={{ padding: "16px 40px", background: "#0F0F0E", border: "1px solid #0F0F0E", cursor: "pointer", fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.accent, transition: "all 0.2s", display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#0F0F0E"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#0F0F0E"; e.currentTarget.style.color = C.accent; }}>
              Start free now
            </a>
            <button style={{ padding: "16px 40px", background: "transparent", border: "1px solid rgba(15,15,14,0.4)", cursor: "pointer", fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#0F0F0E", marginLeft: -1, transition: "background 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(15,15,14,0.08)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              Book a demo →
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────
function Footer({ C }: ThemeProps) {
  return (
    <footer style={{ background: "#0C0C0B", borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 20px 36px" }}>
        <div className="footer-grid" style={{ marginBottom: 48 }}>
          <div>
            <div style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "1.1rem", fontWeight: 900, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#F2EFE8", marginBottom: 16 }}>
              Voice<span style={{ color: "#00E639" }}>Finance</span>
            </div>
            <p style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.83rem", color: "rgba(242,239,232,0.4)", lineHeight: 1.8, maxWidth: 260, margin: 0 }}>
              Your voice is the most natural interface ever created. We're building the financial future around it.
            </p>
          </div>
          {[
            { h: "Product", l: ["Features", "How it works", "Pricing", "Changelog", "Mobile app"] },
            { h: "Company", l: ["About", "Blog", "Careers", "Press", "Contact"] },
            { h: "Legal", l: ["Privacy", "Terms", "Security", "GDPR"] },
          ].map(({ h, l }) => (
            <div key={h}>
              <div style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(242,239,232,0.3)", marginBottom: 20 }}>{h}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {l.map(li => (
                  <a key={li} href="#" style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.83rem", color: "rgba(242,239,232,0.45)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#00E639")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(242,239,232,0.45)")}>{li}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="footer-bottom" style={{ borderTop: "1px solid rgba(242,239,232,0.1)", paddingTop: 24 }}>
          <span style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.72rem", color: "rgba(242,239,232,0.25)" }}>© {new Date().getFullYear()} VoiceFinance. All rights reserved.</span>
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
            {["Twitter", "LinkedIn", "GitHub"].map(s => (
              <a key={s} href="#" style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: "0.72rem", color: "rgba(242,239,232,0.25)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#00E639")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(242,239,232,0.25)")}>{s}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── App (root) ─────────────────────────────────────────────────────────────
export default function App() {
  const { dark, C, toggle } = useTheme();
  return (
    <div style={{ background: C.bg, transition: "background 0.3s, color 0.3s" }}>
      <style>{`
        .nav-mobile { display: none !important; }
        .nav-desktop { display: flex !important; }
        .hero-grid { display: grid; grid-template-columns: 1fr 420px; gap: 60px; align-items: start; }
        .features-header { display: flex; }
        .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); }
        .feature-cell:nth-child(-n+3) { border-bottom: 1px solid ${C.borderFaint}; }
        .feature-cell:not(:nth-child(3n)) { border-right: 1px solid ${C.borderFaint}; }
        .steps-grid { display: grid; grid-template-columns: repeat(3,1fr); }
        .step-cell:not(:last-child) { border-right: 1px solid ${C.border}; }
        .viz-grid { display: grid; grid-template-columns: 1fr 1fr; }
        .viz-left { border-right: 1px solid ${C.border}; }
        .literacy-header { display: grid; grid-template-columns: 280px 1fr; }
        .rules-grid { display: grid; grid-template-columns: repeat(4,1fr); }
        .testimonials-grid { display: grid; grid-template-columns: repeat(3,1fr); }
        .testimonial-cell:not(:last-child) { border-right: 1px solid rgba(242,239,232,0.12); }
        .pricing-header { display: flex; align-items: flex-end; justify-content: space-between; }
        .pricing-grid { display: grid; grid-template-columns: repeat(3,1fr); }
        .pricing-cell:not(:last-child) { border-right: 1px solid ${C.border}; }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; }
        .footer-bottom { display: flex; justify-content: space-between; align-items: center; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }

        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr; gap: 48px; }
          .features-grid { grid-template-columns: repeat(2, 1fr); }
          .feature-cell { border-right: none !important; border-bottom: 1px solid ${C.borderFaint} !important; }
          .feature-cell:nth-child(odd):not(:last-child) { border-right: 1px solid ${C.borderFaint} !important; }
          .steps-grid { grid-template-columns: 1fr; }
          .step-cell { border-right: none !important; border-bottom: 1px solid ${C.border}; }
          .step-cell:last-child { border-bottom: none; }
          .viz-grid { grid-template-columns: 1fr; }
          .viz-left { border-right: none !important; border-bottom: 1px solid ${C.border}; }
          .rules-grid { grid-template-columns: repeat(2,1fr); }
          .testimonials-grid { grid-template-columns: 1fr; }
          .testimonial-cell { border-right: none !important; border-bottom: 1px solid rgba(242,239,232,0.12); }
          .testimonial-cell:last-child { border-bottom: none; }
          .pricing-grid { grid-template-columns: 1fr; }
          .pricing-cell { border-right: none !important; border-bottom: 1px solid ${C.border}; }
          .pricing-cell:last-child { border-bottom: none; }
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 36px; }
          .literacy-header { grid-template-columns: 1fr; }
        }

        @media (max-width: 600px) {
          .nav-mobile { display: flex !important; }
          .nav-desktop { display: none !important; }
          .features-grid { grid-template-columns: 1fr; }
          .feature-cell { border-right: none !important; }
          .rules-grid { grid-template-columns: 1fr; }
          .footer-grid { grid-template-columns: 1fr; gap: 32px; }
          .footer-bottom { flex-direction: column; align-items: flex-start; gap: 16px; }
          .pricing-header { flex-direction: column; align-items: flex-start; }
          .pricing-header p { text-align: left !important; }
          .features-header { flex-direction: column; }
          .features-header p { text-align: left !important; }
        }
      `}</style>

      <Navbar C={C} dark={dark} toggle={toggle} />
      <Hero C={C} />
      <Features C={C} />
      <HowItWorks C={C} />
      <FinanceLiteracy C={C} />
      <Testimonials C={C} />
      <Pricing C={C} />
      <CTABand C={C} />
      <Footer C={C} />
    </div>
  );
}
