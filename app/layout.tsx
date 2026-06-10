import '../src/index.css';
import { ThemeProvider } from '../src/ThemeContext';
import { AuthProvider } from '../src/AuthContext';

export const metadata = {
  title: 'VoiceFinance',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
