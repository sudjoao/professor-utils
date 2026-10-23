import Link from 'next/link';

import { NavLinks } from '@/components/layout/NavLinks';
import { TextSizeControl } from '@/components/layout/TextSizeControl';
import { ThemeControl } from '@/components/layout/ThemeControl';

export const AppHeader = () => (
  <header className="border-b">
    <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-4 sm:px-6">
      <Link href="/" className="rounded-md font-heading text-xl font-semibold">
        Professor Utils
      </Link>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <TextSizeControl />
        <ThemeControl />
      </div>
      <NavLinks />
    </div>
  </header>
);
