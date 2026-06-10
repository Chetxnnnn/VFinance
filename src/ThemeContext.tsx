"use client";

import React, { createContext, useContext, useState } from 'react';

const T: Record<"light" | "dark", any> = {
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

const ThemeContext = createContext<any>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);
  const C = dark ? T.dark : T.light;
  const toggle = () => setDark((d) => !d);
  
  return (
    <ThemeContext.Provider value={{ dark, C, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeContext must be used within ThemeProvider');
  return ctx;
}
