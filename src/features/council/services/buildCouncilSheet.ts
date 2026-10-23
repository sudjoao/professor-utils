import {
  getClassInfo,
  getStudentNames,
  validateStudents,
} from '@/features/classroom/services/classForm';
import { formatClassInfo } from '@/features/classroom/services/classSheet';
import type { PrintableSheet } from '@/features/classroom/services/printableSheet';
import type { ClassFormValues, SheetStyle } from '@/features/classroom/types';
import { COUNCIL_COLUMNS, MAX_COUNCIL_COLUMNS } from '@/features/council/constants';
import type { CouncilColumn, CouncilFormValues, CouncilSheetData } from '@/features/council/types';
import type { FormError } from '@/lib/forms/formErrors';
import { parseLines } from '@/lib/text/parseLines';

export const COUNCIL_TITLE = 'Ficha de conselho de classe';

/** The chosen columns in their usual order, then the teacher's own (text) columns. */
export const getCouncilColumns = ({
  columns,
  customColumnsText,
}: Pick<CouncilFormValues, 'columns' | 'customColumnsText'>): CouncilColumn[] => [
  ...COUNCIL_COLUMNS.filter(({ key }) => columns.includes(key)).map(({ title, isText }) => ({
    title,
    isText,
  })),
  ...parseLines(customColumnsText).map((title) => ({ title, isText: true })),
];

export const buildCouncilSheetData = (
  values: ClassFormValues & CouncilFormValues,
  style: SheetStyle,
): CouncilSheetData => ({
  classInfo: getClassInfo(values),
  term: values.term,
  studentNames: getStudentNames(values),
  columns: getCouncilColumns(values),
  tallRows: values.tallRows,
  style,
});

export const validateCouncilForm = (values: ClassFormValues & CouncilFormValues): FormError[] => {
  const columnCount = getCouncilColumns(values).length;

  return [
    ...validateStudents(values),
    ...(columnCount === 0
      ? [{ field: 'councilColumns', message: 'Escolha pelo menos uma coluna para a ficha.' }]
      : []),
    ...(columnCount > MAX_COUNCIL_COLUMNS
      ? [
          {
            field: 'councilColumns',
            message: `A ficha pode ter no máximo ${MAX_COUNCIL_COLUMNS} colunas, mas tem ${columnCount}.`,
          },
        ]
      : []),
  ];
};

export const formatCouncilInfo = ({ classInfo, term }: CouncilSheetData): string =>
  formatClassInfo(classInfo, [`${term}º bimestre`]);

/** Text columns get three times the width of the short ones. */
const TEXT_COLUMN_WEIGHT = 3;

export const buildCouncilPrint = (data: CouncilSheetData): PrintableSheet => ({
  orientation: 'landscape',
  tallRows: data.tallRows,
  studentNames: data.studentNames,
  pages: [
    {
      title: COUNCIL_TITLE,
      info: formatCouncilInfo(data),
      columns: data.columns.map(({ title, isText }) => ({
        label: title,
        weight: isText ? TEXT_COLUMN_WEIGHT : 1,
      })),
    },
  ],
});
