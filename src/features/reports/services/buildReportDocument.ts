import {
  AlignmentType,
  BorderStyle,
  Document,
  Header,
  HorizontalPositionRelativeFrom,
  ImageRun,
  type IRunOptions,
  LineRuleType,
  Paragraph,
  Tab,
  Table,
  TableBorders,
  TableCell,
  TableLayoutType,
  TableRow,
  TabStopType,
  TextRun,
  TextWrappingSide,
  TextWrappingType,
  VerticalPositionRelativeFrom,
  WidthType,
} from 'docx';

import { SHIFT_OPTIONS } from '@/features/reports/constants';
import {
  FINAL_RESULT_OPTIONS,
  FINAL_RESULT_TITLE,
  FORM_SUBTITLE,
  FORM_TITLE,
  GENERAL_NOTES,
  GUIDANCE,
  HEADER_LINES,
  type RichText,
  SIGNATURE_LABELS,
} from '@/features/reports/services/officialTexts';
import type { HeaderImage, ReportDocumentData, StudentReport } from '@/features/reports/types';

/*
 * Layout copied from the official "RAv – Formulário 1" template.
 * Measures are in twips (1/20 pt), font sizes in half-points and image offsets in EMUs.
 */
const PAGE = {
  width: 11906,
  height: 16838,
  margin: { top: 1702, bottom: 993, left: 1701, right: 1133, header: 708, footer: 708 },
};
const CONTENT_WIDTH = PAGE.width - PAGE.margin.left - PAGE.margin.right;

const TIMES = 'Times New Roman';
const ARIAL = 'Arial';
const FONT_SIZE = { normal: 24, small: 20 };
const ONE_AND_A_HALF_LINES = 360;

// Measured on the official template, so the lines look the same.
const IDENTIFICATION_TAB_STOPS = [1400, 2900, 3800, 5400, 7200];
const TERM_TAB_STOPS = [2000, 5000];
const PLACE_AND_DATE_INDENT = 5664;
const HEADER_IMAGE_OFFSET = { horizontal: -202564, vertical: -330834 };

const EMPTY_EVALUATION_LINES = 4;
const SIGNATURE_LINE = '_'.repeat(27);
const GUARDIAN_SIGNATURE_LINE = '_'.repeat(43);
const CHECKED = '■';
const UNCHECKED = '□';

type RunStyle = Pick<IRunOptions, 'bold' | 'italics' | 'font' | 'size' | 'break'>;

const run = (text: string, style: RunStyle = {}) =>
  new TextRun({ text, font: TIMES, size: FONT_SIZE.normal, ...style });

const richRuns = (richText: RichText, size: number) =>
  richText.map(({ text, bold, italics }) => run(text, { bold, italics, size }));

const emptyLine = () => new Paragraph({});

const boldLine = (text: string, pageBreakBefore = false) =>
  new Paragraph({ pageBreakBefore, children: [run(text, { bold: true })] });

const centeredLine = (text: string, style: RunStyle = {}, pageBreakBefore = false) =>
  new Paragraph({ alignment: AlignmentType.CENTER, pageBreakBefore, children: [run(text, style)] });

const justifiedRichText = (richText: RichText) =>
  new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    children: richRuns(richText, FONT_SIZE.small),
  });

/** Bold line whose parts are aligned with tab stops, like "Ano: 3º   Turma: A   Turno: ■ Matutino". */
const tabbedBoldLine = (parts: string[], tabStops: number[]) =>
  new Paragraph({
    tabStops: tabStops.map((position) => ({ type: TabStopType.LEFT, position })),
    children: parts.map(
      (part, index) =>
        new TextRun({
          children: index === 0 ? [part] : [new Tab(), part],
          bold: true,
          font: TIMES,
          size: FONT_SIZE.normal,
        }),
    ),
  });

const buildHeader = (image: HeaderImage) =>
  new Header({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new ImageRun({
            type: image.type,
            data: image.data,
            transformation: { width: image.width, height: image.height },
            altText: { name: 'Brasão', description: 'Imagem do cabeçalho' },
            floating: {
              horizontalPosition: {
                relative: HorizontalPositionRelativeFrom.COLUMN,
                offset: HEADER_IMAGE_OFFSET.horizontal,
              },
              verticalPosition: {
                relative: VerticalPositionRelativeFrom.PARAGRAPH,
                offset: HEADER_IMAGE_OFFSET.vertical,
              },
              wrap: { type: TextWrappingType.SQUARE, side: TextWrappingSide.BOTH_SIDES },
            },
          }),
          ...HEADER_LINES.map((line, index) => run(line, { break: index > 0 ? 1 : undefined })),
        ],
      }),
    ],
  });

/**
 * Where the teacher writes the evaluation: Arial 12, 1.5 spacing, justified, like the filled example.
 * The paragraph mark carries the same font, so typing in a blank line keeps the formatting.
 */
const evaluationParagraph = (text: string) =>
  new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { line: ONE_AND_A_HALF_LINES, lineRule: LineRuleType.AUTO },
    run: { font: ARIAL, size: FONT_SIZE.normal },
    children: text ? [run(text, { font: ARIAL })] : [],
  });

const signatureCell = (registration: string, label: string) =>
  new TableCell({
    width: { size: CONTENT_WIDTH / 2, type: WidthType.DXA },
    children: [centeredLine(`${SIGNATURE_LINE}${registration}`), centeredLine(label)],
  });

const buildSignaturesTable = ({
  teacherRegistration,
  coordinatorRegistration,
}: ReportDocumentData) =>
  new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    layout: TableLayoutType.FIXED,
    columnWidths: [CONTENT_WIDTH / 2, CONTENT_WIDTH / 2],
    borders: TableBorders.NONE,
    rows: [
      new TableRow({
        cantSplit: true,
        children: [
          signatureCell(teacherRegistration, SIGNATURE_LABELS.teacher),
          signatureCell(coordinatorRegistration, SIGNATURE_LABELS.coordinator),
        ],
      }),
    ],
  });

const BOX_BORDER = { style: BorderStyle.SINGLE, size: 4, color: '000000' };

const buildFinalResultBox = () =>
  new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    layout: TableLayoutType.FIXED,
    columnWidths: [CONTENT_WIDTH],
    borders: { top: BOX_BORDER, bottom: BOX_BORDER, left: BOX_BORDER, right: BOX_BORDER },
    rows: [
      new TableRow({
        cantSplit: true,
        children: [
          new TableCell({
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            children: [
              new Paragraph({ children: [run(FINAL_RESULT_TITLE, { bold: true })] }),
              emptyLine(),
              centeredLine(
                FINAL_RESULT_OPTIONS.map((option) => `${UNCHECKED} ${option}`).join('   '),
              ),
            ],
          }),
        ],
      }),
    ],
  });

const buildStudentSection = (
  data: ReportDocumentData,
  student: StudentReport,
  isFirstStudent: boolean,
): (Paragraph | Table)[] => {
  const shiftParts = SHIFT_OPTIONS.map(
    ({ value, label }) => `${value === data.shift ? CHECKED : UNCHECKED} ${label}`,
  );
  const evaluationLines =
    student.paragraphs.length > 0 ? student.paragraphs : Array(EMPTY_EVALUATION_LINES).fill('');

  return [
    centeredLine(FORM_TITLE, { bold: true }, !isFirstStudent),
    centeredLine(FORM_SUBTITLE, { bold: true }),
    centeredLine(`ANO LETIVO: ${data.schoolYear}`, { bold: true }),
    centeredLine(data.stage, { bold: true }),
    emptyLine(),
    boldLine(`Coordenação Regional de Ensino: ${data.regionalCoordination}`),
    boldLine(`Unidade Escolar: ${data.schoolName}`),
    tabbedBoldLine(
      [`Ano: ${data.grade}`, `Turma: ${data.classroomName}`, 'Turno:', ...shiftParts],
      IDENTIFICATION_TAB_STOPS,
    ),
    boldLine(`Professor/a: ${data.teacherName}`),
    boldLine(`Estudante: ${student.name}`),
    emptyLine(),
    tabbedBoldLine(
      [`${data.term}º BIMESTRE`, `Total de dias letivos: ${data.schoolDays}`, 'Total de Faltas: '],
      TERM_TAB_STOPS,
    ),
    emptyLine(),
    justifiedRichText(GUIDANCE),
    emptyLine(),
    ...evaluationLines.map(evaluationParagraph),
    emptyLine(),
    emptyLine(),
    new Paragraph({
      indent: { left: PLACE_AND_DATE_INDENT },
      children: [run(data.placeAndDate)],
    }),
    emptyLine(),
    emptyLine(),
    buildSignaturesTable(data),
    emptyLine(),
    emptyLine(),
    centeredLine(GUARDIAN_SIGNATURE_LINE),
    centeredLine(SIGNATURE_LABELS.guardian),
    emptyLine(),
    buildFinalResultBox(),
    emptyLine(),
    justifiedRichText(GENERAL_NOTES),
  ];
};

/** One "RAv – Formulário 1" per student, each starting on a new page. */
export const buildReportDocument = (data: ReportDocumentData, headerImage: HeaderImage) =>
  new Document({
    creator: 'Professor Utils',
    title: FORM_TITLE,
    styles: {
      default: {
        document: {
          // Portuguese spell checking for the text the teacher writes in Word.
          run: { font: TIMES, size: FONT_SIZE.normal, language: { value: 'pt-BR' } },
          paragraph: { spacing: { after: 0, line: 240, lineRule: LineRuleType.AUTO } },
        },
      },
    },
    sections: [
      {
        properties: {
          page: { size: { width: PAGE.width, height: PAGE.height }, margin: PAGE.margin },
        },
        headers: { default: buildHeader(headerImage) },
        children: data.students.flatMap((student, index) =>
          buildStudentSection(data, student, index === 0),
        ),
      },
    ],
  });
