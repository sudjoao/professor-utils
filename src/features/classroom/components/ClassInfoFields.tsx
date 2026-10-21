import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ClassInfo } from '@/features/classroom/types';

type ClassInfoFieldsProps = ClassInfo & {
  hiddenFields?: (keyof ClassInfo)[];
  onChange: (changes: Partial<ClassInfo>) => void;
};

const FIELDS: { name: keyof ClassInfo; label: string; placeholder: string }[] = [
  { name: 'classroomName', label: 'Turma', placeholder: 'Ex.: 7º ano A' },
  { name: 'subject', label: 'Disciplina', placeholder: 'Ex.: Matemática' },
  { name: 'teacherName', label: 'Professor(a)', placeholder: 'Seu nome' },
];

export const ClassInfoFields = ({
  hiddenFields = [],
  onChange,
  ...values
}: ClassInfoFieldsProps) => (
  <div className="grid gap-4 sm:grid-cols-3">
    {FIELDS.filter(({ name }) => !hiddenFields.includes(name)).map(
      ({ name, label, placeholder }) => (
        <div key={name} className="space-y-2">
          <Label htmlFor={`class-${name}`}>{label}</Label>
          <Input
            id={`class-${name}`}
            value={values[name]}
            placeholder={placeholder}
            onChange={(event) => onChange({ [name]: event.target.value })}
          />
        </div>
      ),
    )}
  </div>
);
