import { FieldGroup, FormField } from '@/components/FormField';
import { NumberField } from '@/components/NumberField';
import { OptionButtons } from '@/components/OptionButtons';
import { MAX_GRADE_LIMIT, SUMMARY_OPTIONS } from '@/features/grades/constants';
import type { GradesFormValues } from '@/features/grades/types';
import { fieldId, type FormError, getFieldError } from '@/lib/forms/formErrors';

type GradeSettingsFieldProps = Pick<GradesFormValues, 'summary' | 'maxGrade'> & {
  errors: FormError[];
  onChange: (changes: Partial<GradesFormValues>) => void;
};

export const GradeSettingsField = ({
  summary,
  maxGrade,
  errors,
  onChange,
}: GradeSettingsFieldProps) => (
  <div className="space-y-6">
    <FieldGroup
      id="grades-summary"
      legend="No final, a planilha calcula:"
      hint="A conta é feita sozinha pelo Excel conforme você lança as notas."
    >
      <OptionButtons
        options={SUMMARY_OPTIONS}
        value={summary}
        onChange={(value) => onChange({ summary: value })}
      />
    </FieldGroup>

    <FormField
      id={fieldId('maxGrade')}
      label="Nota máxima de cada avaliação"
      hint="Ex.: 10. Se alguém digitar uma nota maior por engano (como 75 em vez de 7,5), o Excel avisa."
      error={getFieldError(errors, 'maxGrade')}
    >
      {(control) => (
        <NumberField
          {...control}
          name="nota máxima"
          allowDecimals
          min={0}
          max={MAX_GRADE_LIMIT}
          value={maxGrade}
          onChange={(value) => onChange({ maxGrade: value })}
        />
      )}
    </FormField>
  </div>
);
