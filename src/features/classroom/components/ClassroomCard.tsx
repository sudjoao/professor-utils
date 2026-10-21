import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClassInfoFields } from '@/features/classroom/components/ClassInfoFields';
import { SavedClassrooms } from '@/features/classroom/components/SavedClassrooms';
import { StudentsField } from '@/features/classroom/components/StudentsField';
import { toClassFormValues } from '@/features/classroom/services/classForm';
import type { ClassFormValues, ClassInfo } from '@/features/classroom/types';

type ClassroomCardProps = {
  title: string;
  values: ClassFormValues;
  studentNames: string[];
  hiddenFields?: (keyof ClassInfo)[];
  onChange: (changes: Partial<ClassFormValues>) => void;
};

export const ClassroomCard = ({
  title,
  values,
  studentNames,
  hiddenFields,
  onChange,
}: ClassroomCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>
        Cole a lista de alunos ou carregue uma turma que você já salvou.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <ClassInfoFields
        classroomName={values.classroomName}
        subject={values.subject}
        teacherName={values.teacherName}
        hiddenFields={hiddenFields}
        onChange={onChange}
      />
      <StudentsField
        studentsText={values.studentsText}
        sortStudents={values.sortStudents}
        studentCount={studentNames.length}
        onStudentsTextChange={(studentsText) => onChange({ studentsText })}
        onSortStudentsChange={(sortStudents) => onChange({ sortStudents })}
      />
      <SavedClassrooms
        classroomName={values.classroomName}
        studentNames={studentNames}
        onLoad={(classroom) => onChange(toClassFormValues(classroom))}
      />
    </CardContent>
  </Card>
);
