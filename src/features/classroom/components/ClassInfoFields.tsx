import { FormField } from '@/components/FormField';
import { Input } from '@/components/ui/input';
import type { ClassInfo } from '@/features/classroom/types';
import { fieldId, type FormError, getFieldError } from '@/lib/forms/formErrors';

type ClassInfoFieldsProps = ClassInfo & {
  hiddenFields?: (keyof ClassInfo)[];
  optionalFields?: (keyof ClassInfo)[];
  errors: FormError[];
  onChange: (changes: Partial<ClassInfo>) => void;
};

const FIELDS: { name: keyof ClassInfo; label: string; placeholder: string }[] = [
  { name: 'classroomName', label: 'Turma', placeholder: 'Ex.: 7º ano A' },
  { name: 'subject', label: 'Disciplina', placeholder: 'Ex.: Matemática' },
  { name: 'teacherName', label: 'Professor(a)', placeholder: 'Seu nome completo' },
];

export const ClassInfoFields = ({
  hiddenFields = [],
  optionalFields = [],
  errors,
  onChange,
  ...values
}: ClassInfoFieldsProps) => (
  <div className="grid gap-4 sm:grid-cols-3">
    {FIELDS.filter(({ name }) => !hiddenFields.includes(name)).map(
      ({ name, label, placeholder }) => (
        <FormField
          key={name}
          id={fieldId(name)}
          label={label}
          optional={optionalFields.includes(name)}
          error={getFieldError(errors, name)}
        >
          {(control) => (
            <Input
              {...control}
              className="h-10 text-base md:text-base"
              value={values[name]}
              placeholder={placeholder}
              onChange={(event) => onChange({ [name]: event.target.value })}
            />
          )}
        </FormField>
      ),
    )}
  </div>
);
