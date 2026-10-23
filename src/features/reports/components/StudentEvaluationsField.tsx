import { Eraser } from 'lucide-react';

import { UndoNotice } from '@/components/UndoNotice';
import { Button } from '@/components/ui/button';
import { StudentEvaluationItem } from '@/features/reports/components/StudentEvaluationItem';
import type { StudentEvaluation } from '@/features/reports/types';
import { useUndoNotice } from '@/lib/react/useUndoNotice';

type StudentEvaluationsFieldProps = {
  studentNames: string[];
  schoolDays: number;
  getEvaluation: (studentName: string) => StudentEvaluation | undefined;
  onChange: (studentName: string, changes: Partial<StudentEvaluation>) => void;
  /** Clears this class and term; returns how to undo it. */
  onClear: () => () => void;
};

const itemId = (index: number) => `student-evaluation-${index}`;

/** Opens the next student's item and puts the cursor in its text. */
const openItem = (index: number) => {
  const details = document.getElementById(itemId(index));
  if (details instanceof HTMLDetailsElement) {
    details.open = true;
    details.scrollIntoView({ block: 'start' });
    details.querySelector('textarea')?.focus({ preventScroll: true });
  }
};

export const StudentEvaluationsField = ({
  studentNames,
  schoolDays,
  getEvaluation,
  onChange,
  onClear,
}: StudentEvaluationsFieldProps) => {
  const notice = useUndoNotice();

  if (studentNames.length === 0) {
    return (
      <p className="text-muted-foreground">
        Os alunos aparecem aqui depois que você escrever os nomes no passo 1.
      </p>
    );
  }

  const writtenCount = studentNames.filter((name) => getEvaluation(name)?.text.trim()).length;
  const hasAnything = studentNames.some((name) => getEvaluation(name));

  const handleClear = () =>
    notice.show(
      'As avaliações e as faltas escritas aqui para esta turma e este bimestre foram apagadas.',
      onClear(),
    );

  return (
    <div className="space-y-3">
      <p className="font-medium" aria-live="polite">
        {writtenCount} de {studentNames.length} alunos com avaliação escrita aqui
      </p>
      <ul className="space-y-2">
        {studentNames.map((name, index) => (
          <li key={`${index}-${name}`}>
            <StudentEvaluationItem
              id={itemId(index)}
              studentName={name}
              evaluation={getEvaluation(name)}
              schoolDays={schoolDays}
              onNext={index < studentNames.length - 1 ? () => openItem(index + 1) : undefined}
              onChange={(changes) => onChange(name, changes)}
            />
          </li>
        ))}
      </ul>
      {hasAnything && (
        <Button variant="ghost" onClick={handleClear}>
          <Eraser data-icon="inline-start" />
          Apagar as avaliações desta turma e bimestre
        </Button>
      )}
      <UndoNotice notice={notice.notice} onUndo={notice.undo} onDismiss={notice.dismiss} />
    </div>
  );
};
