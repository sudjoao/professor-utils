import type { Metadata } from 'next';

import { RestoreGate } from '@/components/RestoreGate';
import { PageContainer } from '@/components/layout/PageContainer';
import { ToolPageHeader } from '@/components/layout/ToolPageHeader';
import { TOOLS } from '@/config/tools';
import { ReportsForm } from '@/features/reports/components/ReportsForm';

export const metadata: Metadata = {
  title: TOOLS.reports.title,
};

const ReportsPage = () => (
  <PageContainer className="space-y-6">
    <ToolPageHeader tool={TOOLS.reports} />
    <RestoreGate>
      <ReportsForm />
    </RestoreGate>
  </PageContainer>
);

export default ReportsPage;
