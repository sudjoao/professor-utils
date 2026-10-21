import { FieldGroup, FormField } from '@/components/FormField';
import { NumberField } from '@/components/NumberField';
import { OptionButtons } from '@/components/OptionButtons';
import { MAX_SCHOOL_DAYS, SHIFT_OPTIONS, TERM_OPTIONS } from '@/features/reports/constants';
import type { ReportFormValues } from '@/features/reports/types';
import { fieldId, type FormError, getFieldError } from '@/lib/forms/formErrors';

type TermFieldsProps = Pick<ReportFormValues, 'term' | 'shift' | 'schoolDays'> & {
  errors: FormError[];
  onChange: (changes: Partial<ReportFormValues>) => void;
};

export const TermFields = ({ term, shift, schoolDays, errors, onChange }: TermFieldsProps) => (
  <div className="grid gap-6 sm:grid-cols-3">
    <FieldGroup id={fieldId('term')} legend="Bimestre">
      <OptionButtons
        options={TERM_OPTIONS}
        value={term}
        onChange={(value) => onChange({ term: value })}
      />
    </FieldGroup>
    <FieldGroup id={fieldId('shift')} legend="Turno">
      <OptionButtons
        options={SHIFT_OPTIONS}
        value={shift}
        onChange={(value) => onChange({ shift: value })}
      />
    </FieldGroup>
    <FormField
      id={fieldId('schoolDays')}
      label="Total de dias letivos"
      hint="Dias letivos do bimestre."
      error={getFieldError(errors, 'schoolDays')}
    >
      {(control) => (
        <NumberField
          {...control}
          name="dias letivos"
          min={1}
          max={MAX_SCHOOL_DAYS}
          value={schoolDays}
          onChange={(value) => onChange({ schoolDays: value })}
        />
      )}
    </FormField>
  </div>
);
