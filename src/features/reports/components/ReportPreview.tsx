import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { DEFAULT_HEADER_IMAGE, SHIFT_OPTIONS } from '@/features/reports/constants';
import { buildReportData } from '@/features/reports/services/buildReportData';
import {
  FINAL_RESULT_OPTIONS,
  FINAL_RESULT_TITLE,
  FORM_SUBTITLE,
  FORM_TITLE,
  GUIDANCE,
  HEADER_LINES,
  type RichText,
  SIGNATURE_LABELS,
} from '@/features/reports/services/officialTexts';
import type { ReportFormValues } from '@/features/reports/types';
import { isIsoDate } from '@/lib/date/isoDate';

const EMPTY_EVALUATION_LINES = 4;

const RichParagraph = ({ text }: { text: RichText }) => (
  <p className="text-justify text-[0.7rem] leading-snug">
    {text.map(({ text: part, bold, italics }, index) => (
      <span key={index} className={`${bold ? 'font-bold' : ''} ${italics ? 'italic' : ''}`}>
        {part}
      </span>
    ))}
  </p>
);

type ReportPreviewProps = {
  values: ReportFormValues;
};

/**
 * A close copy of one page of the Word document, built from the same data, so the teacher
 * checks names, dates and texts before downloading. Not an exact rendering of Word.
 */
export const ReportPreview = ({ values }: ReportPreviewProps) => {
  const [index, setIndex] = useState(0);
  // The long date needs a valid date; the preview shows a blank one meanwhile.
  const data = buildReportData(
    isIsoDate(values.documentDate) ? values : { ...values, documentDate: '2000-01-01', city: '' },
  );
  const student = data.students[Math.min(index, data.students.length - 1)];

  if (!student) {
    return <p className="text-muted-foreground">A prévia aparece quando houver alunos na lista.</p>;
  }

  const position = data.students.indexOf(student);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          disabled={position === 0}
          aria-label="Ver o aluno anterior"
          onClick={() => setIndex(position - 1)}
        >
          <ChevronLeft data-icon="inline-start" />
          Anterior
        </Button>
        <p className="min-w-48 flex-1 text-center font-medium" aria-live="polite">
          {student.name} ({position + 1} de {data.students.length})
        </p>
        <Button
          variant="outline"
          disabled={position === data.students.length - 1}
          aria-label="Ver o próximo aluno"
          onClick={() => setIndex(position + 1)}
        >
          Próximo
          <ChevronRight data-icon="inline-end" />
        </Button>
      </div>

      <article
        aria-label={`Prévia do relatório de ${student.name}`}
        className="mx-auto max-w-2xl space-y-3 rounded-md border bg-white px-8 py-6 font-serif text-sm text-black shadow-sm"
      >
        <header className="flex items-center justify-center gap-4 text-center text-xs">
          <Image
            src={values.headerImage ?? DEFAULT_HEADER_IMAGE}
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

        <RichParagraph text={GUIDANCE} />

        <div className="space-y-1 font-sans leading-relaxed">
          {student.paragraphs.length > 0 ? (
            student.paragraphs.map((paragraph, paragraphIndex) => (
              <p key={paragraphIndex} className="text-justify">
                {paragraph || ' '}
              </p>
            ))
          ) : (
            <p className="text-gray-500 italic">
              {Array.from({ length: EMPTY_EVALUATION_LINES }, (_, line) => (
                <span key={line} className="block border-b border-dashed border-gray-300">
                  {line === 0 ? '(espaço para escrever a avaliação no Word)' : ' '}
                </span>
              ))}
            </p>
          )}
        </div>

        <p className="pt-2 pl-[45%]">{isIsoDate(values.documentDate) ? data.placeAndDate : ''}</p>

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
        <p className="text-center text-[0.65rem] text-gray-600">
          (as observações gerais do formulário oficial vêm no fim da página)
        </p>
      </article>
    </div>
  );
};
