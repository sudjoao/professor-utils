import { ArrowRight, CircleHelp, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { TOOL_LIST } from '@/config/tools';

const HOW_IT_WORKS = [
  'Escolha a ferramenta e escreva (ou cole) os nomes dos alunos.',
  'Responda às perguntas de cada passo. Os exemplos mostram o que escrever.',
  'Clique no botão de baixar e abra o arquivo no Excel ou no Word.',
];

const HomePage = () => (
  <PageContainer className="space-y-10">
    <section className="space-y-3">
      <h1 className="font-heading text-3xl font-semibold">Olá, professor(a)!</h1>
      <p className="text-lg text-muted-foreground">
        Ferramentas simples para preparar listas e relatórios da sua turma em poucos minutos.
      </p>
    </section>

    <section aria-labelledby="tools-heading" className="space-y-4">
      <h2 id="tools-heading" className="font-heading text-2xl font-semibold">
        O que você quer fazer?
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOL_LIST.map(({ href, title, description, icon: Icon }) => (
          <li key={href}>
            <Link href={href} className="group block h-full rounded-xl">
              <Card className="h-full text-base transition-shadow group-hover:shadow-md group-hover:ring-foreground/30">
                <CardHeader className="gap-2">
                  <Icon className="mb-1 size-8 text-primary" aria-hidden />
                  <h3 className="font-heading text-xl font-semibold">{title}</h3>
                  <CardDescription className="text-base">{description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <span className="inline-flex items-center gap-2 font-medium underline-offset-4 group-hover:underline">
                    Abrir
                    <ArrowRight className="size-4" aria-hidden />
                  </span>
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </section>

    <section aria-labelledby="how-heading" className="space-y-4">
      <h2 id="how-heading" className="font-heading text-2xl font-semibold">
        Como funciona
      </h2>
      <ol className="grid gap-4 sm:grid-cols-3">
        {HOW_IT_WORKS.map((step, index) => (
          <li key={step} className="flex gap-3 rounded-xl bg-muted p-4">
            <span
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground"
              aria-hidden
            >
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </section>

    <section className="flex flex-wrap items-center gap-3 rounded-xl bg-muted p-4">
      <CircleHelp className="size-6 shrink-0 text-primary" aria-hidden />
      <p className="flex-1">Ficou com alguma dúvida?</p>
      <Link
        href="/help"
        className="inline-flex min-h-10 items-center rounded-lg border-2 bg-background px-4 font-medium underline-offset-4 hover:underline"
      >
        Ver as perguntas frequentes
      </Link>
    </section>

    <section className="flex items-start gap-3 rounded-xl border-2 p-4">
      <ShieldCheck className="mt-0.5 size-6 shrink-0 text-primary" aria-hidden />
      <p>
        <strong>Seus dados ficam só neste computador.</strong> Os nomes dos alunos e os dados da
        escola não são enviados pela internet; ficam guardados neste navegador para você não
        precisar escrever tudo de novo.
      </p>
    </section>
  </PageContainer>
);

export default HomePage;
