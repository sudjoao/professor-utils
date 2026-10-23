import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';

import { AppHeader } from '@/components/layout/AppHeader';
import { ServiceWorkerRegistration } from '@/components/layout/ServiceWorkerRegistration';
import { SkipLink } from '@/components/layout/SkipLink';
import { HTML_PREFERENCES_SCRIPT } from '@/lib/display/htmlPreferences';
import { StoreProvider } from '@/store/StoreProvider';

import './globals.css';

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Professor Utils',
    template: '%s | Professor Utils',
  },
  description: 'Ferramentas simples para o dia a dia do professor.',
};

export const viewport: Viewport = {
  themeColor: '#171717',
};

const RootLayout = ({ children }: LayoutProps<'/'>) => (
  // The inline script sets `data-text-size` and `data-theme` before React hydrates.
  <html
    lang="pt-BR"
    className={`${geistSans.variable} h-full antialiased`}
    suppressHydrationWarning
  >
    <head>
      <script dangerouslySetInnerHTML={{ __html: HTML_PREFERENCES_SCRIPT }} />
    </head>
    <body className="flex min-h-full flex-col">
      <SkipLink />
      <ServiceWorkerRegistration />
      <StoreProvider>
        <AppHeader />
        {children}
      </StoreProvider>
    </body>
  </html>
);

export default RootLayout;
