import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { AIDA64Provider } from '@/lib/aida64-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CPU Temperature Monitoring - Logoipsum',
  description: 'Advanced CPU and Room Temperature Monitoring Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AIDA64Provider>
            {children}
          </AIDA64Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}