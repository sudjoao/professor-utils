import { FormField } from '@/components/FormField';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { fieldId } from '@/lib/forms/formErrors';
import { pluralize } from '@/lib/text/pluralize';

type StudentsFieldProps = {
  studentsText: string;
  sortStudents: boolean;
  studentCount: number;
  error?: string;
  onStudentsTextChange: (text: string) => void;
  onSortStudentsChange: (sortStudents: boolean) => void;
};

export const StudentsField = ({
  studentsText,
  sortStudents,
  studentCount,
  error,
  onStudentsTextChange,
  onSortStudentsChange,
}: StudentsFieldProps) => (
  <div className="space-y-3">
    <FormField
      id={fieldId('studentsText')}
      label="Nomes dos alunos"
      hint="Escreva ou cole um nome por linha. Pode copiar a coluna de nomes de outra planilha."
      error={error}
    >
      {(control) => (
        <Textarea
          {...control}
          rows={10}
          className="min-h-56 text-base md:text-base"
          value={studentsText}
          placeholder={'Exemplo:\nAna Souza\nBruno Lima\nCarla Dias'}
          onChange={(event) => onStudentsTextChange(event.target.value)}
        />
      )}
    </FormField>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Label className="text-base font-normal">
        {/* Native checkbox: the shadcn one is not named by a wrapping <label>. */}
        <input
          type="checkbox"
          className="size-5 accent-primary"
          checked={sortStudents}
          onChange={(event) => onSortStudentsChange(event.target.checked)}
        />
        Colocar os nomes em ordem alfabética
      </Label>
      <p className="font-medium" aria-live="polite">
        {pluralize(studentCount, 'aluno', 'alunos')} na lista
      </p>
    </div>
  </div>
);
