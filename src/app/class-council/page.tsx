import type { Metadata } from 'next';

import { RestoreGate } from '@/components/RestoreGate';
import { PageContainer } from '@/components/layout/PageContainer';
import { ToolPageHeader } from '@/components/layout/ToolPageHeader';
import { TOOLS } from '@/config/tools';
import { CouncilForm } from '@/features/council/components/CouncilForm';

export const metadata: Metadata = {
  title: TOOLS.council.title,
};

const CouncilPage = () => (
  <PageContainer className="space-y-6">
    <ToolPageHeader tool={TOOLS.council} />
    <RestoreGate>
      <CouncilForm />
    </RestoreGate>
  </PageContainer>
);

export default CouncilPage;
