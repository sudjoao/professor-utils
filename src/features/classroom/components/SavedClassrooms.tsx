import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { saveClassroom, selectClassrooms } from '@/features/classroom/classroomSlice';
import type { Classroom } from '@/features/classroom/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

type SavedClassroomsProps = {
  classroomName: string;
  studentNames: string[];
  onLoad: (classroom: Classroom) => void;
};

export const SavedClassrooms = ({ classroomName, studentNames, onLoad }: SavedClassroomsProps) => {
  const dispatch = useAppDispatch();
  const classrooms = useAppSelector(selectClassrooms);
  const [savedMessage, setSavedMessage] = useState('');

  const canSave = classroomName.trim().length > 0 && studentNames.length > 0;
  const classroomItems = Object.fromEntries(classrooms.map(({ id, name }) => [id, name]));

  const handleSelect = (classroomId: string | null) => {
    const classroom = classrooms.find(({ id }) => id === classroomId);

    if (classroom) {
      onLoad(classroom);
    }
  };

  const handleSave = () => {
    dispatch(saveClassroom({ name: classroomName, studentNames }));
    setSavedMessage(`Turma "${classroomName.trim()}" salva neste navegador.`);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {classrooms.length > 0 && (
        <Select items={classroomItems} onValueChange={handleSelect}>
          <SelectTrigger className="min-w-48">
            <SelectValue placeholder="Carregar turma salva" />
          </SelectTrigger>
          <SelectContent>
            {classrooms.map(({ id, name }) => (
              <SelectItem key={id} value={id}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <Button
        variant="outline"
        disabled={!canSave}
        title={canSave ? undefined : 'Informe o nome da turma e os alunos para salvar'}
        onClick={handleSave}
      >
        Salvar turma
      </Button>
      {savedMessage && <span className="text-xs text-muted-foreground">{savedMessage}</span>}
    </div>
  );
};
