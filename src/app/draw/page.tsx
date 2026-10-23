import type { Metadata } from 'next';

import { RestoreGate } from '@/components/RestoreGate';
import { PageContainer } from '@/components/layout/PageContainer';
import { ToolPageHeader } from '@/components/layout/ToolPageHeader';
import { TOOLS } from '@/config/tools';
import { DrawForm } from '@/features/draw/components/DrawForm';

export const metadata: Metadata = {
  title: TOOLS.draw.title,
};

const DrawPage = () => (
  <PageContainer className="space-y-6">
    <ToolPageHeader tool={TOOLS.draw} />
    <RestoreGate>
      <DrawForm />
    </RestoreGate>
  </PageContainer>
);

export default DrawPage;
