import { MAX_COLUMNS_PER_PAGE } from '@/features/attendance/constants';
import { MIN_ATTENDANCE } from '@/features/attendance/services/attendanceFormulas';
import type { AttendanceSheetData } from '@/features/attendance/types';
import { formatClassInfo } from '@/features/classroom/services/classSheet';
import type { PrintableSheet } from '@/features/classroom/services/printableSheet';
import { chunk } from '@/lib/array/chunk';

const LEGEND = 'Legenda: P = presente  ·  F = falta  ·  J = falta justificada.';

/** The attendance sheet as printed from the browser: the same pages as the spreadsheet. */
export const buildAttendancePrint = (data: AttendanceSheetData): PrintableSheet => {
  const info = formatClassInfo(data.classInfo);

  if (data.mode === 'signature') {
    return {
      orientation: 'portrait',
      tallRows: true,
      studentNames: data.studentNames,
      pages: [
        {
          title: data.signatureTitle || 'Lista de assinaturas',
          info,
          columns: [{ label: 'Assinatura', weight: 3 }],
        },
      ],
    };
  }

  const pages = chunk(data.columns, MAX_COLUMNS_PER_PAGE);

  return {
    orientation: 'landscape',
    tallRows: false,
    studentNames: data.studentNames,
    pages: pages.map((columns, index) => {
      const isLastPage = index === pages.length - 1;
      const withTotals = data.includeTotals && isLastPage;

      return {
        title:
          pages.length > 1 ? `Lista de chamada (${index + 1}/${pages.length})` : 'Lista de chamada',
        info,
        columns: [
          ...columns.map(({ label, caption }) => ({ label, caption })),
          ...(withTotals ? [{ label: 'Faltas' }, { label: 'Freq.' }] : []),
        ],
        legend: withTotals
          ? `${LEGEND} Some as faltas de todas as páginas; frequência mínima: ${MIN_ATTENDANCE * 100}%.`
          : LEGEND,
      };
    }),
  };
};
