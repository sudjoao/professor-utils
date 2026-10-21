import { RotateCcw } from 'lucide-react';
import { useState } from 'react';

import { StepCard } from '@/components/StepCard';
import { Button } from '@/components/ui/button';
import { ClassInfoFields } from '@/features/classroom/components/ClassInfoFields';
import { SavedClassrooms } from '@/features/classroom/components/SavedClassrooms';
import { StudentsField } from '@/features/classroom/components/StudentsField';
import { toClassFormValues } from '@/features/classroom/services/classForm';
import type { ClassFormValues, ClassInfo } from '@/features/classroom/types';
import { type FormError, getFieldError } from '@/lib/forms/formErrors';

/** The teacher's name stays: it is the same person starting another class. */
const NEW_CLASS_VALUES: Partial<ClassFormValues> = {
  classroomName: '',
  subject: '',
  studentsText: '',
};

type ClassroomCardProps = {
  step: number;
  totalSteps: number;
  values: ClassFormValues;
  studentNames: string[];
  hiddenFields?: (keyof ClassInfo)[];
  optionalFields?: (keyof ClassInfo)[];
  errors: FormError[];
  onChange: (changes: Partial<ClassFormValues>) => void;
};

export const ClassroomCard = ({
  step,
  totalSteps,
  values,
  studentNames,
  hiddenFields,
  optionalFields,
  errors,
  onChange,
}: ClassroomCardProps) => {
  // Remounting the saved classrooms clears the one shown as selected.
  const [newClassCount, setNewClassCount] = useState(0);
  const hasClassData = [values.classroomName, values.subject, values.studentsText].some(
    (value) => value.trim().length > 0,
  );

  const handleStartNewClass = () => {
    if (
      window.confirm(
        'Limpar a turma, a disciplina e os nomes dos alunos para começar outra turma? As turmas salvas não são apagadas.',
      )
    ) {
      onChange(NEW_CLASS_VALUES);
      setNewClassCount((count) => count + 1);
    }
  };

  return (
    <StepCard
      step={step}
      totalSteps={totalSteps}
      title="Turma e alunos"
      description="Escreva os nomes dos alunos ou use uma turma que você já salvou. O que você escrever aqui aparece também nas outras ferramentas."
    >
      <SavedClassrooms
        key={newClassCount}
        classroomName={values.classroomName}
        subject={values.subject}
        studentNames={studentNames}
        onLoad={(classroom) => onChange(toClassFormValues(classroom))}
      />
      <ClassInfoFields
        classroomName={values.classroomName}
        subject={values.subject}
        teacherName={values.teacherName}
        hiddenFields={hiddenFields}
        optionalFields={optionalFields}
        errors={errors}
        onChange={onChange}
      />
      <StudentsField
        studentsText={values.studentsText}
        sortStudents={values.sortStudents}
        studentCount={studentNames.length}
        error={getFieldError(errors, 'studentsText')}
        onStudentsTextChange={(studentsText) => onChange({ studentsText })}
        onSortStudentsChange={(sortStudents) => onChange({ sortStudents })}
      />
      {hasClassData && (
        <Button variant="outline" size="lg" className="h-10" onClick={handleStartNewClass}>
          <RotateCcw data-icon="inline-start" />
          Começar uma turma nova
        </Button>
      )}
    </StepCard>
  );
};
