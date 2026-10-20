import type { Metadata } from 'next';

import { ComingSoon } from '@/components/layout/ComingSoon';
import { TOOLS } from '@/config/tools';

export const metadata: Metadata = {
  title: TOOLS.grades.title,
};

const GradesPage = () => <ComingSoon tool={TOOLS.grades} />;

export default GradesPage;
