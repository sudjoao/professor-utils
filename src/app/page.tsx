import Link from 'next/link';

import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TOOL_LIST } from '@/config/tools';

const HomePage = () => (
  <PageContainer>
    <section className="mb-8 space-y-2">
      <h1 className="font-heading text-3xl font-semibold">Olá, professor(a)!</h1>
      <p className="text-muted-foreground">Escolha uma ferramenta para começar.</p>
    </section>

    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {TOOL_LIST.map(({ href, title, description, icon: Icon }) => (
        <Link key={href} href={href} className="group rounded-xl focus-visible:outline-none">
          <Card className="h-full transition-shadow group-hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-ring">
            <CardHeader>
              <Icon className="mb-2 size-6 text-primary" aria-hidden />
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </section>
  </PageContainer>
);

export default HomePage;
