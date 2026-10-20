import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { AttendanceSheetHeader } from '@/features/attendance/types';

type ClassInfoFieldsProps = AttendanceSheetHeader & {
  onFieldChange: (field: keyof AttendanceSheetHeader, value: string) => void;
};

const FIELDS: { name: keyof AttendanceSheetHeader; label: string; placeholder: string }[] = [
  { name: 'classroomName', label: 'Turma', placeholder: 'Ex.: 7º ano A' },
  { name: 'subject', label: 'Disciplina', placeholder: 'Ex.: Matemática' },
  { name: 'teacherName', label: 'Professor(a)', placeholder: 'Seu nome' },
];

export const ClassInfoFields = ({ onFieldChange, ...values }: ClassInfoFieldsProps) => (
  <div className="grid gap-4 sm:grid-cols-3">
    {FIELDS.map(({ name, label, placeholder }) => (
      <div key={name} className="space-y-2">
        <Label htmlFor={`attendance-${name}`}>{label}</Label>
        <Input
          id={`attendance-${name}`}
          value={values[name]}
          placeholder={placeholder}
          onChange={(event) => onFieldChange(name, event.target.value)}
        />
      </div>
    ))}
  </div>
);
