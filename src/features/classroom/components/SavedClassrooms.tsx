import { Save, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { UndoNotice } from '@/components/UndoNotice';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const notice = useUndoNotice();

  const trimmedName = values.classroomName.trim();
  const canSave = trimmedName.length > 0 && studentNames.length > 0;
  const existingClassroom = classrooms.find(({ name }) => isSameName(name, trimmedName));
  const selectedClassroom = classrooms.find(({ id }) => id === selectedId);
  const classroomItems = Object.fromEntries(classrooms.map(({ id, name }) => [id, name]));

  const handleSelect = (classroomId: string | null) => {
    const classroom = classrooms.find(({ id }) => id === classroomId);

    if (!classroom) {
      return;
    }

    const previousValues = { ...values };
    const previousSelectedId = selectedId;
    const replacedStudents = wouldReplaceStudents(studentNames, classroom);

    setSelectedId(classroom.id);
    onChange(toClassFormValues(classroom));
    notice.show(
      replacedStudents
        ? `Turma "${classroom.name}" carregada. Os nomes que estavam escritos foram trocados pelos dessa turma.`
        : `Turma "${classroom.name}" carregada.`,
      () => {
        setSelectedId(previousSelectedId);
        onChange(previousValues);
      },
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
        : `Turma "${trimmedName}" salva neste computador. Da próxima vez, é só escolher em "Usar uma turma salva".`,
      previousVersion
        ? () => dispatch(putClassroom({ classroom: previousVersion, index: 0 }))
        : () => dispatch(removeClassroom(action.payload.id)),
    );
  };

  const handleRemove = () => {
    if (!selectedClassroom) {
      return;
    }

    const classroom = selectedClassroom;
    const index = classrooms.indexOf(classroom);

    dispatch(removeClassroom(classroom.id));
    setSelectedId(null);
    notice.show(
      `Turma salva "${classroom.name}" apagada. Os nomes escritos na tela continuam.`,
      () => {
        dispatch(putClassroom({ classroom, index }));
        setSelectedId(classroom.id);
      },
    );
  };

  return (
    <div className="space-y-3 rounded-xl bg-muted p-4">
      {classrooms.length > 0 && (
        <div className="flex flex-wrap items-end gap-2">
          <div className="space-y-2">
            <Label htmlFor="saved-classroom" className="text-base">
              Usar uma turma salva
            </Label>
            <Select items={classroomItems} value={selectedId} onValueChange={handleSelect}>
              <SelectTrigger
                id="saved-classroom"
                className="min-w-56 bg-background text-base data-[size=default]:h-10"
              >
                <SelectValue placeholder="Escolha a turma" />
              </SelectTrigger>
              <SelectContent>
                {classrooms.map(({ id, name }) => (
                  <SelectItem key={id} value={id} className="text-base">
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedClassroom && (
            <Button variant="outline" size="lg" className="h-10" onClick={handleRemove}>
              <Trash2 data-icon="inline-start" />
              Apagar esta turma salva
            </Button>
          )}
        </div>
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
