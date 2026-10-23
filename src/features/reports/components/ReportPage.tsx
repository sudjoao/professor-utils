import Image from 'next/image';

import { DEFAULT_HEADER_IMAGE, SHIFT_OPTIONS } from '@/features/reports/constants';
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
import type { ReportDocumentData, StudentReport } from '@/features/reports/types';
import { cn } from '@/lib/utils';

const EMPTY_EVALUATION_LINES = 4;

const RichParagraph = ({ text, className }: { text: RichText; className?: string }) => (
  <p className={cn('text-justify text-[0.7rem] leading-snug', className)}>
    {text.map(({ text: part, bold, italics }, index) => (
      <span key={index} className={cn(bold && 'font-bold', italics && 'italic')}>
        {part}
      </span>
    ))}
  </p>
);

type ReportPageProps = {
  data: ReportDocumentData;
  student: StudentReport;
  headerImage: string | null;
  /** `false` while there is no valid date yet: the line stays blank. */
  hasPlaceAndDate: boolean;
  /** Printing: blank lines without hints, and the official general notes at the end. */
  isPrint?: boolean;
};

/**
 * One page of the "RAv – Formulário 1", in HTML: used by the preview and by the browser print.
 * Built from the same data as the Word document, close to it but not an exact rendering.
 */
export const ReportPage = ({
  data,
  student,
  headerImage,
  hasPlaceAndDate,
  isPrint = false,
}: ReportPageProps) => (
  <article
    aria-label={`Relatório de ${student.name}`}
    className={cn(
      'bg-white font-serif text-black',
      // Printing uses points, so the page fits one sheet whatever text size the screen uses.
      isPrint
        ? 'print-page space-y-2 text-[10.5pt] leading-snug'
        : 'mx-auto max-w-2xl space-y-3 rounded-md border px-8 py-6 text-sm shadow-sm',
    )}
  >
    <header className="flex items-center justify-center gap-4 text-center text-xs">
      <Image
        src={headerImage ?? DEFAULT_HEADER_IMAGE}
        alt=""
        width={40}
        height={48}
        unoptimized
        className="h-12 w-10 object-contain"
      />
      <div>
        {HEADER_LINES.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </header>

    <div className="text-center font-bold">
      <p>{FORM_TITLE}</p>
      <p>{FORM_SUBTITLE}</p>
      <p>ANO LETIVO: {data.schoolYear}</p>
      <p>{data.stage}</p>
    </div>

    <div className="space-y-0.5 font-bold">
      <p>Coordenação Regional de Ensino: {data.regionalCoordination}</p>
      <p>Unidade Escolar: {data.schoolName}</p>
      <p className="flex flex-wrap gap-x-6">
        <span>Ano: {data.grade}</span>
        <span>Turma: {data.classroomName}</span>
        <span>
          Turno:{' '}
          {SHIFT_OPTIONS.map(
            ({ value, label }) => `${value === data.shift ? '■' : '□'} ${label}`,
          ).join('  ')}
        </span>
      </p>
      <p>Professor/a: {data.teacherName}</p>
      <p>Estudante: {student.name}</p>
      <p className="flex flex-wrap gap-x-8 pt-2">
        <span>{data.term}º BIMESTRE</span>
        <span>Total de dias letivos: {data.schoolDays}</span>
        <span>Total de Faltas: {student.absences ?? ''}</span>
      </p>
    </div>

    <RichParagraph text={GUIDANCE} className={isPrint ? 'text-[8pt]' : undefined} />

    <div className="space-y-1 font-sans leading-relaxed">
      {student.paragraphs.length > 0 ? (
        student.paragraphs.map((paragraph, index) => (
          <p key={index} className="text-justify">
            {paragraph || ' '}
          </p>
        ))
      ) : (
        <p className="text-gray-500 italic">
          {Array.from({ length: EMPTY_EVALUATION_LINES }, (_, line) => (
            <span key={line} className="block border-b border-dashed border-gray-300">
              {line === 0 && !isPrint ? '(espaço para escrever a avaliação no Word)' : ' '}
            </span>
          ))}
        </p>
      )}
    </div>

    <p className="pt-2 pl-[45%]">{hasPlaceAndDate ? data.placeAndDate : ' '}</p>

    <div className="grid grid-cols-2 gap-6 pt-4 text-center text-xs">
      <div>
        <p>_______________________{data.teacherRegistration}</p>
        <p>{SIGNATURE_LABELS.teacher}</p>
      </div>
      <div>
        <p>_______________________{data.coordinatorRegistration}</p>
        <p>{SIGNATURE_LABELS.coordinator}</p>
      </div>
    </div>
    <div className="pt-2 text-center text-xs">
      <p>___________________________________</p>
      <p>{SIGNATURE_LABELS.guardian}</p>
    </div>

    <div className="border border-black p-2 text-xs">
      <p className="font-bold">{FINAL_RESULT_TITLE}</p>
      <p className="pt-1 text-center">
        {FINAL_RESULT_OPTIONS.map((option) => `□ ${option}`).join('   ')}
      </p>
    </div>

    {isPrint ? (
      <RichParagraph text={GENERAL_NOTES} className="text-[6.5pt] leading-tight" />
    ) : (
      <p className="text-center text-[0.65rem] text-gray-600">
        (as observações gerais do formulário oficial vêm no fim da página)
      </p>
    )}
  </article>
);
