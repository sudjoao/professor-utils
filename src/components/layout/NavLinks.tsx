'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { TOOL_LIST } from '@/config/tools';
import { cn } from '@/lib/utils';

const LINKS = [{ href: '/', title: 'Início' }, ...TOOL_LIST];

export const NavLinks = () => {
  const pathname = usePathname();

  return (
    <nav aria-label="Ferramentas" className="w-full">
      <ul className="flex flex-wrap gap-2">
        {LINKS.map(({ href, title }) => {
          const isCurrent = pathname === href;

          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={isCurrent ? 'page' : undefined}
                className={cn(
                  'inline-flex min-h-10 items-center rounded-lg px-3 font-medium underline-offset-4 transition-colors hover:bg-muted hover:underline',
                  isCurrent && 'bg-primary text-primary-foreground hover:bg-primary/90',
                )}
              >
                {title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
