import type { Metadata } from 'next';

import { Geist } from 'next/font/google';
import { cookies } from 'next/headers';

import { AuthProvider } from '@/components/auth/AuthProvider';
import { JsonLd } from '@/components/JsonLd';
import { GlobalFooter } from '@/components/layout/GlobalFooter';
import { GlobalNav } from '@/components/layout/GlobalNav';
import { QueryClientProvider } from '@/components/QueryClientProvider';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  description:
    'Create polls, collect anonymous or verified feedback, and analyze responses in real-time. Free online polling tool with live analytics dashboards, anti-spam protection, and shareable links.',
  icons: {
    apple: '/favicon.svg',
    icon: '/favicon.svg',
  },
  metadataBase: new URL('https://opinion.atharvdangedev.in'),
  openGraph: {
    description:
      'Create polls, collect anonymous or verified feedback, and analyze responses in real-time. Free online polling tool with live analytics.',
    images: [
      {
        alt: 'Opinion - Create & Share Polls',
        height: 630,
        url: '/og-image.png',
        width: 1200,
      },
    ],
    locale: 'en_US',
    siteName: 'Opinion',
    title: 'Opinion - Create & Share Polls',
    type: 'website',
    url: 'https://opinion.atharvdangedev.in',
  },
  robots: {
    follow: true,
    index: true,
  },
  title: {
    default: 'Opinion - Create & Share Polls',
    template: '%s - Opinion',
  },
  twitter: {
    card: 'summary_large_image',
    description:
      'Create polls, collect anonymous or verified feedback, and analyze responses in real-time.',
    images: ['/og-image.png'],
    title: 'Opinion - Create & Share Polls',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const hasSession = cookieStore.has(process.env.SESSION_COOKIE_NAME || 'opinion_session');

  return (
    <html className={cn('font-sans', geist.variable)} lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthProvider hasSession={hasSession}>
            <QueryClientProvider>
              <TooltipProvider>
                <div className="flex min-h-screen flex-col">
                  <GlobalNav />
                  <main className="flex-1">{children}</main>
                  <GlobalFooter />
                </div>
                <Toaster />
                <JsonLd />
              </TooltipProvider>
            </QueryClientProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
