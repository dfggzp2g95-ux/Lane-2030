import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { AppShell } from '@/components/layout/app-shell';
import { ServiceWorkerRegister } from '@/components/sw-register';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Lane 2030 — Competitive Swimming Tracker',
  description:
    'Track every aspect of training, meets, goals, and college recruiting from freshman year to graduation in 2030.',
  manifest: '/manifest.webmanifest',
  applicationName: 'Lane 2030',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Lane 2030',
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
  },
  themeColor: '#0B1F3A',
  viewport:
    'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider defaultTheme="system">
          <AppShell>{children}</AppShell>
          <ServiceWorkerRegister />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
