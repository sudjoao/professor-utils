import { ChoiceCards } from '@/components/ChoiceCards';
import { FieldGroup, FormField } from '@/components/FormField';
import { NumberField } from '@/components/NumberField';
import { Textarea } from '@/components/ui/textarea';
import { COLUMN_MODE_CHOICES, MAX_GRADE_COLUMNS } from '@/features/grades/constants';
import type { GradesFormValues } from '@/features/grades/types';
import { fieldId, type FormError, getFieldError } from '@/lib/forms/formErrors';

type GradeColumnsFieldProps = Pick<
  GradesFormValues,
  'columnMode' | 'gradeCount' | 'gradeTitlesText'
> & {
  errors: FormError[];
  onChange: (changes: Partial<GradesFormValues>) => void;
};

export const GradeColumnsField = ({
  columnMode,
  gradeCount,
  gradeTitlesText,
  errors,
  onChange,
}: GradeColumnsFieldProps) => (
  <div className="space-y-6">
    <FieldGroup id="grades-column-mode" legend="Como as colunas das notas vão se chamar?">
      <ChoiceCards
        choices={COLUMN_MODE_CHOICES}
        value={columnMode}
        onChange={(mode) => onChange({ columnMode: mode })}
      />
    </FieldGroup>

    {columnMode === 'count' ? (
      <FormField
        id={fieldId('gradeCount')}
        label="Quantidade de notas"
        error={getFieldError(errors, 'gradeCount')}
      >
        {(control) => (
          <NumberField
            {...control}
            name="notas"
            min={1}
            max={MAX_GRADE_COLUMNS}
            value={gradeCount}
            onChange={(value) => onChange({ gradeCount: value })}
          />
        )}
      </FormField>
    ) : (
      <FormField
        id={fieldId('gradeTitlesText')}
        label="Nome de cada nota"
        hint="Escreva um nome por linha, na ordem em que as colunas devem aparecer."
        error={getFieldError(errors, 'gradeTitlesText')}
      >
        {(control) => (
          <Textarea
            {...control}
            rows={6}
            className="min-h-40 text-base md:text-base"
            value={gradeTitlesText}
            placeholder={'Exemplo:\nProva 1\nTrabalho em grupo\nParticipação'}
            onChange={(event) => onChange({ gradeTitlesText: event.target.value })}
          />
        )}
      </FormField>
    )}
  </div>
);
