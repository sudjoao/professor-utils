import { ArrowDown, Check } from 'lucide-react';
import { useId, useRef } from 'react';

import { FormField } from '@/components/FormField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PhrasePicker } from '@/features/reports/components/PhrasePicker';
import { EMPTY_EVALUATION, parseAbsences } from '@/features/reports/services/studentEvaluations';
import type { StudentEvaluation } from '@/features/reports/types';
import { insertSentence } from '@/lib/text/insertText';
import { pluralize } from '@/lib/text/pluralize';

type StudentEvaluationItemProps = {
  id: string;
  studentName: string;
  evaluation?: StudentEvaluation;
  schoolDays: number;
  /** Opens the next student; missing for the last one. */
  onNext?: () => void;
  onChange: (changes: Partial<StudentEvaluation>) => void;
};

const describeStatus = ({ text, absences }: StudentEvaluation): string =>
  [
    text.trim() ? 'avaliação escrita' : 'sem avaliação aqui',
    absences === null ? '' : pluralize(absences, 'falta', 'faltas'),
  ]
    .filter(Boolean)
    .join(' · ');

export const StudentEvaluationItem = ({
  id,
  studentName,
  evaluation = EMPTY_EVALUATION,
  schoolDays,
  onNext,
  onChange,
}: StudentEvaluationItemProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const absencesId = useId();
  const hasText = evaluation.text.trim().length > 0;
  const hasTooManyAbsences = evaluation.absences !== null && evaluation.absences > schoolDays;

  const insertPhrase = (phrase: string) => {
    const textarea = textareaRef.current;
    const { text, cursor } = insertSentence(
      evaluation.text,
      phrase,
      textarea?.selectionStart ?? evaluation.text.length,
      textarea?.selectionEnd ?? evaluation.text.length,
    );

    onChange({ text });
    requestAnimationFrame(() => {
      textarea?.focus();
      textarea?.setSelectionRange(cursor, cursor);
    });
  };

  return (
    <details id={id} className="group rounded-xl border-2 bg-card">
      <summary className="flex min-h-12 cursor-pointer flex-wrap items-center gap-x-3 gap-y-1 rounded-xl px-4 py-2">
        <span className="font-semibold">{studentName}</span>
        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
          {hasText && <Check className="size-4" aria-hidden />}
          {describeStatus(evaluation)}
        </span>
      </summary>

      <div className="space-y-4 px-4 pb-4">
        <FormField
          id={`${id}-text`}
          label={`Avaliação de ${studentName}`}
          optional
          hint="Entra no relatório logo depois do texto comum. Se deixar em branco, fica para escrever no Word."
        >
          {(control) => (
            <Textarea
              {...control}
              ref={textareaRef}
              lang="pt-BR"
              spellCheck
              className="min-h-40 text-base md:text-base"
              value={evaluation.text}
              onChange={(event) => onChange({ text: event.target.value })}
            />
          )}
        </FormField>

        <PhrasePicker studentName={studentName} onInsert={insertPhrase} />

        <FormField
          id={absencesId}
          label="Total de faltas"
          optional
          hint={`O bimestre tem ${pluralize(schoolDays, 'dia letivo', 'dias letivos')}. Se deixar em branco, fica para preencher no Word.`}
          error={
            hasTooManyAbsences ? 'Mais faltas do que dias letivos: confira o número.' : undefined
          }
        >
          {(control) => (
            <Input
              {...control}
              inputMode="numeric"
              autoComplete="off"
              className="h-10 w-24 text-center text-base md:text-base"
              value={evaluation.absences ?? ''}
              onChange={(event) => onChange({ absences: parseAbsences(event.target.value) })}
            />
          )}
        </FormField>

        {onNext && (
          <Button variant="outline" size="lg" className="h-10" onClick={onNext}>
            <ArrowDown data-icon="inline-start" />
            Próximo aluno
          </Button>
        )}
      </div>
    </details>
  );
};
