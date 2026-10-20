import type { Metadata } from 'next';

import { PageContainer } from '@/components/layout/PageContainer';
import { TOOLS } from '@/config/tools';
import { AttendanceForm } from '@/features/attendance/components/AttendanceForm';

export const metadata: Metadata = {
  title: TOOLS.attendance.title,
};

const AttendancePage = () => (
  <PageContainer className="space-y-6">
    <section className="space-y-2">
      <h1 className="font-heading text-3xl font-semibold">{TOOLS.attendance.title}</h1>
      <p className="text-muted-foreground">{TOOLS.attendance.description}</p>
    </section>
    <AttendanceForm />
  </PageContainer>
);

export default AttendancePage;
