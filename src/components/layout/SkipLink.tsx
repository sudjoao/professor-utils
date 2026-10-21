import { MAIN_CONTENT_ID } from '@/components/layout/PageContainer';

/** First thing the keyboard reaches: jumps over the header straight to the page content. */
export const SkipLink = () => (
  <a
    href={`#${MAIN_CONTENT_ID}`}
    className="sr-only rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50"
  >
    Pular para o conteúdo
  </a>
);
