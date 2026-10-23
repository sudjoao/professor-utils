import type { Metadata } from 'next';

import { RestoreGate } from '@/components/RestoreGate';
import { PageContainer } from '@/components/layout/PageContainer';
import { ToolPageHeader } from '@/components/layout/ToolPageHeader';
import { TOOLS } from '@/config/tools';
import { LabelsForm } from '@/features/labels/components/LabelsForm';

export const metadata: Metadata = {
  title: TOOLS.labels.title,
};

const LabelsPage = () => (
  <PageContainer className="space-y-6">
    <ToolPageHeader tool={TOOLS.labels} />
    <RestoreGate>
      <LabelsForm />
    </RestoreGate>
  </PageContainer>
);

export default LabelsPage;
