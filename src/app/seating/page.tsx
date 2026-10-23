import type { Metadata } from 'next';

import { RestoreGate } from '@/components/RestoreGate';
import { PageContainer } from '@/components/layout/PageContainer';
import { ToolPageHeader } from '@/components/layout/ToolPageHeader';
import { TOOLS } from '@/config/tools';
import { SeatingForm } from '@/features/seating/components/SeatingForm';

export const metadata: Metadata = {
  title: TOOLS.seating.title,
};

const SeatingPage = () => (
  <PageContainer className="space-y-6">
    <ToolPageHeader tool={TOOLS.seating} />
    <RestoreGate>
      <SeatingForm />
    </RestoreGate>
  </PageContainer>
);

export default SeatingPage;
