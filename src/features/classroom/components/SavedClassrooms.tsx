import { Check, Save, Trash2 } from 'lucide-react';

import { UndoNotice } from '@/components/UndoNotice';
import { Button } from '@/components/ui/button';
import {
  putClassroom,
  removeClassroom,
  saveClassroom,
  selectClassrooms,
} from '@/features/classroom/classroomSlice';
import {
  isSameName,
  toClassFormValues,
  wouldReplaceStudents,
} from '@/features/classroom/services/classForm';
import type { Classroom, ClassFormValues } from '@/features/classroom/types';
import { useUndoNotice } from '@/lib/react/useUndoNotice';
import { pluralize } from '@/lib/text/pluralize';
import { useAppDispatch, usePersistedSelector } from '@/store/hooks';

const NO_CLASSROOMS: Classroom[] = [];

type LoadableValues = Pick<ClassFormValues, 'classroomName' | 'subject' | 'studentsText'>;

type SavedClassroomsProps = {
  values: LoadableValues;
  studentNames: string[];
  onChange: (changes: LoadableValues) => void;
};

export const SavedClassrooms = ({ values, studentNames, onChange }: SavedClassroomsProps) => {
  const dispatch = useAppDispatch();
  const classrooms = usePersistedSelector(selectClassrooms, NO_CLASSROOMS);
  const notice = useUndoNotice();

  const trimmedName = values.classroomName.trim();
  const canSave = trimmedName.length > 0 && studentNames.length > 0;
  const existingClassroom = classrooms.find(({ name }) => isSameName(name, trimmedName));
  // The classroom on screen: same name and the same students.
  const isInUse = (classroom: Classroom) =>
    isSameName(classroom.name, trimmedName) &&
    studentNames.length > 0 &&
    !wouldReplaceStudents(studentNames, classroom);

  const handleUse = (classroom: Classroom) => {
    const previousValues = { ...values };
    const replacedStudents = wouldReplaceStudents(studentNames, classroom);

    onChange(toClassFormValues(classroom));
    notice.show(
      replacedStudents
        ? `Turma "${classroom.name}" carregada. Os nomes que estavam escritos foram trocados pelos dessa turma.`
        : `Turma "${classroom.name}" carregada.`,
      () => onChange(previousValues),
    );
  };

  const handleSave = () => {
    const previousVersion = existingClassroom;
    const action = dispatch(
      saveClassroom({ name: trimmedName, subject: values.subject, studentNames }),
    );

    notice.show(
      previousVersion
        ? `Turma "${trimmedName}" atualizada com os nomes de agora.`
        : `Turma "${trimmedName}" salva neste computador. Da próxima vez, é só clicar em "Usar esta turma".`,
      previousVersion
        ? () => dispatch(putClassroom({ classroom: previousVersion, index: 0 }))
        : () => dispatch(removeClassroom(action.payload.id)),
    );
  };

  const handleRemove = (classroom: Classroom) => {
    const index = classrooms.indexOf(classroom);

    dispatch(removeClassroom(classroom.id));
    notice.show(
      `Turma salva "${classroom.name}" apagada. Os nomes escritos na tela continuam.`,
      () => dispatch(putClassroom({ classroom, index })),
    );
  };

  return (
    <div className="space-y-3 rounded-xl bg-muted p-4">
      {classrooms.length > 0 && (
        <section aria-labelledby="saved-classrooms-title" className="space-y-2">
          <h3 id="saved-classrooms-title" className="font-medium">
            Usar uma turma salva
          </h3>
          <ul className="grid gap-2 sm:grid-cols-2">
            {classrooms.map((classroom) => (
              <li
                key={classroom.id}
                className="flex flex-wrap items-center gap-2 rounded-lg border bg-background p-3"
              >
                <div className="min-w-40 flex-1">
                  <p className="font-semibold">{classroom.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {[pluralize(classroom.students.length, 'aluno', 'alunos'), classroom.subject]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                </div>
                {isInUse(classroom) ? (
                  <span className="inline-flex items-center gap-1 px-2 font-medium">
                    <Check className="size-4" aria-hidden />
                    Em uso
                  </span>
                ) : (
                  <Button
                    variant="outline"
                    aria-label={`Usar a turma ${classroom.name}`}
                    onClick={() => handleUse(classroom)}
                  >
                    Usar esta turma
                  </Button>
                )}
                <Button
                  variant="ghost"
                  aria-label={`Apagar a turma salva ${classroom.name}`}
                  onClick={() => handleRemove(classroom)}
                >
                  <Trash2 data-icon="inline-start" />
                  Apagar
                </Button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="space-y-1">
        <Button
          variant="outline"
          size="lg"
          className="h-10"
          disabled={!canSave}
          aria-describedby={canSave ? undefined : 'save-classroom-hint'}
          onClick={handleSave}
        >
          <Save data-icon="inline-start" />
          {existingClassroom ? 'Atualizar a turma salva' : 'Salvar esta turma para usar depois'}
        </Button>
        {!canSave && (
          <p id="save-classroom-hint" className="text-sm text-muted-foreground">
            Para salvar, preencha o nome da turma e os alunos.
          </p>
        )}
      </div>

      <UndoNotice notice={notice.notice} onUndo={notice.undo} onDismiss={notice.dismiss} />
    </div>
  );
};
