import type { Metadata } from 'next';

import { PageContainer } from '@/components/layout/PageContainer';
import { TOOLS } from '@/config/tools';
import { ReportsForm } from '@/features/reports/components/ReportsForm';

export const metadata: Metadata = {
  title: TOOLS.reports.title,
};

const ReportsPage = () => (
  <PageContainer className="space-y-6">
    <section className="space-y-2">
      <h1 className="font-heading text-3xl font-semibold">{TOOLS.reports.title}</h1>
      <p className="text-muted-foreground">{TOOLS.reports.description}</p>
    </section>
    <ReportsForm />
  </PageContainer>
);

export default ReportsPage;
