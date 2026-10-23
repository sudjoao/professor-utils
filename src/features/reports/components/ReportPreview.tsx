import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { ReportPage } from '@/features/reports/components/ReportPage';
import { buildPrintableReportData } from '@/features/reports/services/buildReportData';
import type { ReportFormValues } from '@/features/reports/types';

type ReportPreviewProps = {
  values: ReportFormValues;
};

/** Page by page, so the teacher checks names, dates and texts before downloading. */
export const ReportPreview = ({ values }: ReportPreviewProps) => {
  const [index, setIndex] = useState(0);
  const { data, hasPlaceAndDate } = buildPrintableReportData(values);
  const position = Math.min(index, data.students.length - 1);
  const student = data.students[position];

  if (!student) {
    return <p className="text-muted-foreground">A prévia aparece quando houver alunos na lista.</p>;
  }

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
      <ReportPage
        data={data}
        student={student}
        headerImage={values.headerImage}
        hasPlaceAndDate={hasPlaceAndDate}
      />
    </div>
  );
};
