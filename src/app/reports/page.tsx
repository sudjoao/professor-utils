import type { Metadata } from 'next';

import { ComingSoon } from '@/components/layout/ComingSoon';
import { TOOLS } from '@/config/tools';

export const metadata: Metadata = {
  title: TOOLS.reports.title,
};

const ReportsPage = () => <ComingSoon tool={TOOLS.reports} />;

export default ReportsPage;
