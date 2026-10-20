import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { AppHeader } from '@/components/layout/AppHeader';
import { StoreProvider } from '@/store/StoreProvider';

import './globals.css';

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Professor Utils',
    template: '%s | Professor Utils',
  },
  description: 'Ferramentas simples para o dia a dia do professor.',
};

const RootLayout = ({ children }: LayoutProps<'/'>) => (
  <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
    <body className="flex min-h-full flex-col">
      <StoreProvider>
        <AppHeader />
        {children}
      </StoreProvider>
    </body>
  </html>
);

export default RootLayout;
