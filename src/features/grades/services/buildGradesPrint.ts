import { formatClassInfo } from '@/features/classroom/services/classSheet';
import type { PrintableSheet } from '@/features/classroom/services/printableSheet';
import { getResultColumnTitles } from '@/features/grades/services/buildGradesSheetData';
import type { GradesSheetData } from '@/features/grades/types';

const PORTRAIT_MAX_COLUMNS = 6;

const formatNumber = (value: number): string => value.toLocaleString('pt-BR');

/** The grades sheet as printed from the browser, to fill in by hand. */
export const buildGradesPrint = (data: GradesSheetData): PrintableSheet => {
  const titles = [...data.gradeTitles, ...getResultColumnTitles(data)];
  const usesPassingGrade = data.includeRecovery || data.includeStatus;

  return {
    orientation: titles.length <= PORTRAIT_MAX_COLUMNS ? 'portrait' : 'landscape',
    tallRows: false,
    studentNames: data.studentNames,
    pages: [
      {
        title: 'Lista de notas',
        info: formatClassInfo(data.classInfo, [
          `Nota máxima: ${formatNumber(data.maxGrade)}`,
          ...(usesPassingGrade ? [`Média mínima: ${formatNumber(data.passingGrade)}`] : []),
        ]),
        columns: titles.map((label) => ({ label })),
        extraRow: data.weights
          ? { label: 'Peso de cada nota', values: data.weights.map(formatNumber) }
          : undefined,
      },
    ],
  };
};
