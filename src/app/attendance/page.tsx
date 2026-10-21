import type { Metadata } from 'next';

import { PageContainer } from '@/components/layout/PageContainer';
import { ToolPageHeader } from '@/components/layout/ToolPageHeader';
import { TOOLS } from '@/config/tools';
import { AttendanceForm } from '@/features/attendance/components/AttendanceForm';

export const metadata: Metadata = {
  title: TOOLS.attendance.title,
};

const AttendancePage = () => (
  <PageContainer className="space-y-6">
    <ToolPageHeader tool={TOOLS.attendance} />
    <AttendanceForm />
  </PageContainer>
);

export default AttendancePage;
