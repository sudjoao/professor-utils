import type { Metadata } from 'next';

import { PageContainer } from '@/components/layout/PageContainer';
import { TOOLS } from '@/config/tools';
import { GradesForm } from '@/features/grades/components/GradesForm';

export const metadata: Metadata = {
  title: TOOLS.grades.title,
};

const GradesPage = () => (
  <PageContainer className="space-y-6">
    <section className="space-y-2">
      <h1 className="font-heading text-3xl font-semibold">{TOOLS.grades.title}</h1>
      <p className="text-muted-foreground">{TOOLS.grades.description}</p>
    </section>
    <GradesForm />
  </PageContainer>
);

export default GradesPage;
