"use client";

import AuthLayout from '../../src/AuthLayout';
import { useThemeContext } from '../../src/ThemeContext';

const FONT = "'Helvetica Neue',Helvetica,Arial,sans-serif";

export default function HelpPage() {
  const { C } = useThemeContext();

  const faqs = [
    { q: 'How do I add a voice expense?', a: 'Go to the dashboard and click the mic or use the mobile app. Simply speak naturally like "I spent $12 on coffee" and the app handles the rest.' },
    { q: 'How do I export my data?', a: 'Visit the Reports section and use the Download button to get a CSV file of all your transactions.' },
    { q: 'Can I set a monthly budget?', a: 'Yes! Go to Settings and configure your spending limits by category. You\'ll get alerts when approaching limits.' },
    { q: 'Is my data encrypted?', a: 'All your financial data is encrypted end-to-end. We never store your actual speech, only the transcribed transactions.' },
    { q: 'How accurate is the AI categorization?', a: 'Our AI learns from your patterns. Accuracy improves over time as you confirm or correct categorizations.' },
  ];

  const styles = `
    @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    .page-header { animation: slideUp 0.4s ease-out; }
    .faq-item { animation: slideUp 0.35s ease-out; transition: all 0.2s ease; cursor: pointer; }
    .faq-item:hover { border-color: ${C.accent} !important; }
  `;

  return (
    <>
      <style>{styles}</style>
      <AuthLayout>
        <div style={{ maxWidth: 700, padding: '32px 28px' }}>
          <div className="page-header" style={{ marginBottom: 32 }}>
            <h1 style={{
              margin: 0, fontFamily: FONT, color: C.ink, fontSize: '2.2rem',
              fontWeight: 900, letterSpacing: '-0.03em', textTransform: 'uppercase',
            }}>Help &amp; FAQ</h1>
            <p style={{ margin: '6px 0 0', color: C.inkMid, fontFamily: FONT, fontSize: '0.85rem' }}>
              Find answers to common questions
            </p>
          </div>

          <div style={{ borderTop: `1px solid ${C.border}` }}>
            {faqs.map((f, i) => (
              <div key={i} className="faq-item" style={{
                borderBottom: `1px solid ${C.borderFaint}`,
                padding: '20px 0',
                animation: `slideUp 0.35s ease-out ${0.06 + i * 0.06}s both`,
              }}>
                <div style={{
                  fontWeight: 700, color: C.ink, fontSize: '0.9rem',
                  fontFamily: FONT, marginBottom: 8,
                }}>{f.q}</div>
                <div style={{ color: C.inkMid, fontSize: '0.85rem', fontFamily: FONT, lineHeight: 1.7 }}>{f.a}</div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 32, padding: '24px', border: `1px solid ${C.accent}30`,
            textAlign: 'center',
          }}>
            <div style={{ fontWeight: 700, color: C.ink, fontFamily: FONT, fontSize: '0.9rem', marginBottom: 6 }}>
              Can&apos;t find what you&apos;re looking for?
            </div>
            <div style={{ color: C.inkMid, fontSize: '0.85rem', fontFamily: FONT }}>
              Contact our support team at support@voicefinance.app
            </div>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
