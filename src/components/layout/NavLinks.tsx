'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { MAIN_TOOLS, OTHER_TOOLS, OTHER_TOOLS_ANCHOR } from '@/config/tools';
import { cn } from '@/lib/utils';

const OTHER_TOOLS_HREF = `/#${OTHER_TOOLS_ANCHOR}`;

const LINKS = [
  { href: '/', title: 'Início' },
  ...MAIN_TOOLS,
  { href: OTHER_TOOLS_HREF, title: 'Outras ferramentas' },
  { href: '/data', title: 'Meus dados' },
  { href: '/help', title: 'Ajuda' },
];

const isCurrentLink = (href: string, pathname: string): boolean =>
  href === OTHER_TOOLS_HREF
    ? OTHER_TOOLS.some((tool) => tool.href === pathname)
    : href === pathname;

export const NavLinks = () => {
  const pathname = usePathname();

  return (
    <nav aria-label="Ferramentas" className="w-full">
      <ul className="flex flex-wrap gap-2">
        {LINKS.map(({ href, title }) => {
          const isCurrent = isCurrentLink(href, pathname);

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
