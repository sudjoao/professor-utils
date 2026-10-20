import type { Metadata } from 'next';

import { ComingSoon } from '@/components/layout/ComingSoon';
import { TOOLS } from '@/config/tools';

export const metadata: Metadata = {
  title: TOOLS.attendance.title,
};

const AttendancePage = () => <ComingSoon tool={TOOLS.attendance} />;

export default AttendancePage;
