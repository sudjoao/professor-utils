import { Save, Trash2 } from 'lucide-react';
import { useState } from 'react';

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
  removeClassroom,
  saveClassroom,
  selectClassrooms,
} from '@/features/classroom/classroomSlice';
import { isSameName, wouldReplaceStudents } from '@/features/classroom/services/classForm';
import type { Classroom } from '@/features/classroom/types';
import { useAppDispatch, usePersistedSelector } from '@/store/hooks';

const NO_CLASSROOMS: Classroom[] = [];

type SavedClassroomsProps = {
  classroomName: string;
  subject: string;
  studentNames: string[];
  onLoad: (classroom: Classroom) => void;
};

export const SavedClassrooms = ({
  classroomName,
  subject,
  studentNames,
  onLoad,
}: SavedClassroomsProps) => {
  const dispatch = useAppDispatch();
  const classrooms = usePersistedSelector(selectClassrooms, NO_CLASSROOMS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  const trimmedName = classroomName.trim();
  const canSave = trimmedName.length > 0 && studentNames.length > 0;
  const isUpdate = classrooms.some(({ name }) => isSameName(name, trimmedName));
  const selectedClassroom = classrooms.find(({ id }) => id === selectedId);
  const classroomItems = Object.fromEntries(classrooms.map(({ id, name }) => [id, name]));

  const handleSelect = (classroomId: string | null) => {
    const classroom = classrooms.find(({ id }) => id === classroomId);

    if (!classroom) {
      return;
    }
    if (
      wouldReplaceStudents(studentNames, classroom) &&
      !window.confirm(
        `Os alunos que estão escritos agora vão ser trocados pelos da turma "${classroom.name}". Deseja continuar?`,
      )
    ) {
      return;
    }

    setSelectedId(classroom.id);
    onLoad(classroom);
    setStatusMessage(`Turma "${classroom.name}" carregada.`);
  };

  const handleSave = () => {
    dispatch(saveClassroom({ name: trimmedName, subject, studentNames }));
    setStatusMessage(
      `Turma "${trimmedName}" salva neste computador. Da próxima vez, é só escolher na lista "Usar uma turma salva".`,
    );
  };

  const handleRemove = () => {
    if (
      !selectedClassroom ||
      !window.confirm(
        `Apagar a turma salva "${selectedClassroom.name}"? Os nomes escritos na tela não serão apagados.`,
      )
    ) {
      return;
    }

    dispatch(removeClassroom(selectedClassroom.id));
    setSelectedId(null);
    setStatusMessage(`Turma "${selectedClassroom.name}" apagada.`);
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
          {isUpdate ? 'Atualizar a turma salva' : 'Salvar esta turma para usar depois'}
        </Button>
        {!canSave && (
          <p id="save-classroom-hint" className="text-sm text-muted-foreground">
            Para salvar, preencha o nome da turma e os alunos.
          </p>
        )}
      </div>

      <p role="status" className="text-sm font-medium">
        {statusMessage}
      </p>
    </div>
  );
};
