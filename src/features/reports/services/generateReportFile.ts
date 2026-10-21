import { Packer } from 'docx';

import { DEFAULT_HEADER_IMAGE } from '@/features/reports/constants';
import { buildReportData } from '@/features/reports/services/buildReportData';
import { buildReportDocument } from '@/features/reports/services/buildReportDocument';
import { loadHeaderImage } from '@/features/reports/services/headerImage';
import type { ReportFormValues } from '@/features/reports/types';

export const generateReportFile = async (values: ReportFormValues): Promise<Blob> => {
  const headerImage = await loadHeaderImage(values.headerImage ?? DEFAULT_HEADER_IMAGE);
  return Packer.toBlob(buildReportDocument(buildReportData(values), headerImage));
};
