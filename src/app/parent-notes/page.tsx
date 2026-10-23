import type { Metadata } from 'next';

import { RestoreGate } from '@/components/RestoreGate';
import { PageContainer } from '@/components/layout/PageContainer';
import { ToolPageHeader } from '@/components/layout/ToolPageHeader';
import { TOOLS } from '@/config/tools';
import { ParentNotesForm } from '@/features/parentNotes/components/ParentNotesForm';

export const metadata: Metadata = {
  title: TOOLS.parentNotes.title,
};

const ParentNotesPage = () => (
  <PageContainer className="space-y-6">
    <ToolPageHeader tool={TOOLS.parentNotes} />
    <RestoreGate>
      <ParentNotesForm />
    </RestoreGate>
  </PageContainer>
);

export default ParentNotesPage;
