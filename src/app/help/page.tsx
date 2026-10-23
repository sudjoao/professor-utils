import type { Metadata } from 'next';

import { PageContainer } from '@/components/layout/PageContainer';
import { FaqList } from '@/features/help/components/FaqList';

export const metadata: Metadata = {
  title: 'Ajuda',
};

const HelpPage = () => (
  <PageContainer className="space-y-6">
    <section className="space-y-3">
      <h1 className="font-heading text-3xl font-semibold">Perguntas frequentes</h1>
      <p className="text-lg text-muted-foreground">
        Clique numa pergunta para ver a resposta. Em cada passo das ferramentas também tem o botão
        &quot;Como fazer este passo?&quot;.
      </p>
    </section>
    <FaqList />
  </PageContainer>
);

export default HelpPage;
