import { FormField } from '@/components/FormField';
import { NumberField } from '@/components/NumberField';
import { MAX_LESSON_COLUMNS } from '@/features/attendance/constants';
import { fieldId } from '@/lib/forms/formErrors';

type LessonCountFieldProps = {
  lessonCount: number;
  error?: string;
  onChange: (lessonCount: number) => void;
};

export const LessonCountField = ({ lessonCount, error, onChange }: LessonCountFieldProps) => (
  <FormField
    id={fieldId('lessonCount')}
    label="Quantidade de aulas"
    hint="As colunas saem numeradas (1, 2, 3...), com espaço em branco para você escrever a data de cada aula."
    error={error}
  >
    {(control) => (
      <NumberField
        {...control}
        name="aulas"
        min={1}
        max={MAX_LESSON_COLUMNS}
        value={lessonCount}
        onChange={onChange}
      />
    )}
  </FormField>
);
