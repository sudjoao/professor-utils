import Link from 'next/link';

import { TOOL_LIST } from '@/config/tools';

export const AppHeader = () => (
  <header className="border-b">
    <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
      <Link href="/" className="font-heading text-lg font-semibold">
        Professor Utils
      </Link>
      <nav className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        {TOOL_LIST.map(({ href, title }) => (
          <Link key={href} href={href} className="transition-colors hover:text-foreground">
            {title}
          </Link>
        ))}
      </nav>
    </div>
  </header>
);
