import { FieldGroup, FormField } from '@/components/FormField';
import { NumberField } from '@/components/NumberField';
import { OptionButtons } from '@/components/OptionButtons';
import { Button } from '@/components/ui/button';
import { MAX_SCHOOL_DAYS, SHIFT_OPTIONS, TERM_OPTIONS } from '@/features/reports/constants';
import type { ReportFormValues } from '@/features/reports/types';
import type { SchoolTerm } from '@/features/schoolCalendar/types';
import { fieldId, type FormError, getFieldError } from '@/lib/forms/formErrors';

type TermFieldsProps = Pick<ReportFormValues, 'term' | 'shift' | 'schoolDays'> & {
  /** The term going on (or just finished), when the school calendar of the year is known. */
  currentTerm?: SchoolTerm;
  /** The school days shown come from the calendar, because the teacher left the field blank. */
  isSchoolDaysFromCalendar: boolean;
  errors: FormError[];
  onChange: (changes: Partial<ReportFormValues>) => void;
};

export const TermFields = ({
  term,
  shift,
  schoolDays,
  currentTerm,
  isSchoolDaysFromCalendar,
  errors,
  onChange,
}: TermFieldsProps) => (
  <div className="grid gap-6 sm:grid-cols-3">
    <FieldGroup
      id={fieldId('term')}
      legend="Bimestre"
      hint={
        currentTerm && currentTerm.term !== term
          ? `Pelo calendário da SEEDF, o bimestre agora é o ${currentTerm.term}º.`
          : undefined
      }
    >
      <OptionButtons
        options={TERM_OPTIONS}
        value={term}
        onChange={(value) => onChange({ term: value })}
      />
      {currentTerm && currentTerm.term !== term && (
        <Button variant="outline" onClick={() => onChange({ term: currentTerm.term })}>
          Mudar para o {currentTerm.term}º bimestre
        </Button>
      )}
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
      hint={
        isSchoolDaysFromCalendar
          ? 'Preenchido com o calendário da SEEDF. Mude se a sua escola tiver outro número.'
          : 'Dias letivos do bimestre.'
      }
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
