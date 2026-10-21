import type { Metadata } from 'next';

import { PageContainer } from '@/components/layout/PageContainer';
import { ToolPageHeader } from '@/components/layout/ToolPageHeader';
import { TOOLS } from '@/config/tools';
import { GradesForm } from '@/features/grades/components/GradesForm';

export const metadata: Metadata = {
  title: TOOLS.grades.title,
};

const GradesPage = () => (
  <PageContainer className="space-y-6">
    <ToolPageHeader tool={TOOLS.grades} />
    <GradesForm />
  </PageContainer>
);

export default GradesPage;
