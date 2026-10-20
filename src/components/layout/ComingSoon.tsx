import Link from 'next/link';

import { PageContainer } from '@/components/layout/PageContainer';
import { buttonVariants } from '@/components/ui/button';
import type { Tool } from '@/config/tools';

type ComingSoonProps = {
  tool: Tool;
};

export const ComingSoon = ({ tool: { title, description, icon: Icon } }: ComingSoonProps) => (
  <PageContainer className="flex flex-col items-center justify-center gap-4 text-center">
    <Icon className="size-10 text-muted-foreground" aria-hidden />
    <h1 className="font-heading text-2xl font-semibold">{title}</h1>
    <p className="max-w-md text-muted-foreground">{description}</p>
    <p className="text-sm font-medium">Em breve</p>
    <Link href="/" className={buttonVariants({ variant: 'outline' })}>
      Voltar para o início
    </Link>
  </PageContainer>
);
