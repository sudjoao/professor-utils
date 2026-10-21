import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/** Target of the "skip to content" link. */
export const MAIN_CONTENT_ID = 'conteudo';

type PageContainerProps = {
  children: ReactNode;
  className?: string;
};

export const PageContainer = ({ children, className }: PageContainerProps) => (
  <main
    id={MAIN_CONTENT_ID}
    tabIndex={-1}
    className={cn('mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6', className)}
  >
    {children}
  </main>
);
