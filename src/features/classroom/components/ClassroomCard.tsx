import { RotateCcw } from 'lucide-react';
import { useState } from 'react';

import { SaveStatus } from '@/components/SaveStatus';
import { StepCard } from '@/components/StepCard';
import { UndoNotice } from '@/components/UndoNotice';
import { Button } from '@/components/ui/button';
import { ClassInfoFields } from '@/features/classroom/components/ClassInfoFields';
import { SavedClassrooms } from '@/features/classroom/components/SavedClassrooms';
import { StudentsField } from '@/features/classroom/components/StudentsField';
import { CLASSROOM_HELP } from '@/features/classroom/help';
import type { ClassFormValues, ClassInfo } from '@/features/classroom/types';
import { focusField } from '@/lib/forms/focusField';
import { type FormError, getFieldError } from '@/lib/forms/formErrors';
import { useUndoNotice } from '@/lib/react/useUndoNotice';

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

  const notice = useUndoNotice();

  const handleStartNewClass = () => {
    const previousValues = {
      classroomName: values.classroomName,
      subject: values.subject,
      studentsText: values.studentsText,
    };

    onChange(NEW_CLASS_VALUES);
    setNewClassCount((count) => count + 1);
    // The button goes away with the data; the cursor goes where the new class starts.
    requestAnimationFrame(() => focusField('classroomName'));
    notice.show(
      'Turma, disciplina e nomes dos alunos foram limpos para uma turma nova. As turmas salvas continuam guardadas.',
      () => onChange(previousValues),
    );
  };

  return (
    <StepCard
      step={step}
      totalSteps={totalSteps}
      title="Turma e alunos"
      status={
        <SaveStatus
          value={[
            values.classroomName,
            values.subject,
            values.teacherName,
            values.studentsText,
            values.sortStudents,
          ].join('|')}
        />
      }
      help={CLASSROOM_HELP}
      description="Escreva os nomes dos alunos ou use uma turma que você já salvou. O que você escrever aqui aparece também nas outras ferramentas."
    >
      <SavedClassrooms
        key={newClassCount}
        values={values}
        studentNames={studentNames}
        onChange={onChange}
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
      <UndoNotice notice={notice.notice} onUndo={notice.undo} onDismiss={notice.dismiss} />
    </StepCard>
  );
};
