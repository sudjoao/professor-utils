import type { Metadata } from 'next';

import { RestoreGate } from '@/components/RestoreGate';
import { PageContainer } from '@/components/layout/PageContainer';
import { BackupPanel } from '@/features/backup/components/BackupPanel';

export const metadata: Metadata = {
  title: 'Meus dados',
};

const DataPage = () => (
  <PageContainer className="space-y-6">
    <section className="space-y-3">
      <h1 className="font-heading text-3xl font-semibold">Meus dados</h1>
      <p className="text-lg text-muted-foreground">
        Guarde uma cópia das suas turmas e dos dados da escola, ou leve tudo para outro computador.
      </p>
    </section>
    <RestoreGate>
      <BackupPanel />
    </RestoreGate>
  </PageContainer>
);

export default DataPage;
