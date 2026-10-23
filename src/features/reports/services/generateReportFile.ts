import { Packer } from 'docx';
import JSZip from 'jszip';

import { DEFAULT_HEADER_IMAGE } from '@/features/reports/constants';
import { buildReportData } from '@/features/reports/services/buildReportData';
import { buildReportDocument } from '@/features/reports/services/buildReportDocument';
import { loadHeaderImage } from '@/features/reports/services/headerImage';
import { getStudentReportFileName } from '@/features/reports/services/reportFileNames';
import type { HeaderImage, ReportDocumentData, ReportFormValues } from '@/features/reports/types';

/** One .docx per student, all inside a .zip, named in class order. */
export const buildReportZip = async (
  data: ReportDocumentData,
  headerImage: HeaderImage,
): Promise<JSZip> => {
  const zip = new JSZip();

  await Promise.all(
    data.students.map(async (student, index) => {
      const document = buildReportDocument({ ...data, students: [student] }, headerImage);
      zip.file(
        getStudentReportFileName(index, student.name, data.term),
        await Packer.toArrayBuffer(document),
      );
    }),
  );

  return zip;
};

export const generateReportFile = async (values: ReportFormValues): Promise<Blob> => {
  const headerImage = await loadHeaderImage(values.headerImage ?? DEFAULT_HEADER_IMAGE);
  return Packer.toBlob(buildReportDocument(buildReportData(values), headerImage));
};

export const generateReportZip = async (values: ReportFormValues): Promise<Blob> => {
  const headerImage = await loadHeaderImage(values.headerImage ?? DEFAULT_HEADER_IMAGE);
  const zip = await buildReportZip(buildReportData(values), headerImage);
  return zip.generateAsync({ type: 'blob' });
};
