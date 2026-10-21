import { StepCard } from '@/components/StepCard';
import { ClassInfoFields } from '@/features/classroom/components/ClassInfoFields';
import { SavedClassrooms } from '@/features/classroom/components/SavedClassrooms';
import { StudentsField } from '@/features/classroom/components/StudentsField';
import { toClassFormValues } from '@/features/classroom/services/classForm';
import type { ClassFormValues, ClassInfo } from '@/features/classroom/types';
import { type FormError, getFieldError } from '@/lib/forms/formErrors';

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
}: ClassroomCardProps) => (
  <StepCard
    step={step}
    totalSteps={totalSteps}
    title="Turma e alunos"
    description="Escreva os nomes dos alunos ou use uma turma que você já salvou."
  >
    <SavedClassrooms
      classroomName={values.classroomName}
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
  </StepCard>
);
