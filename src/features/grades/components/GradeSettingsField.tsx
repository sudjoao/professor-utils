import { FieldGroup, FormField } from '@/components/FormField';
import { NumberField } from '@/components/NumberField';
import { OptionButtons } from '@/components/OptionButtons';
import { Label } from '@/components/ui/label';
import { GradeWeightsField } from '@/features/grades/components/GradeWeightsField';
import { MAX_GRADE_LIMIT, SUMMARY_OPTIONS } from '@/features/grades/constants';
import type { GradesFormValues } from '@/features/grades/types';
import { fieldId, type FormError, getFieldError } from '@/lib/forms/formErrors';

type GradeSettingsFieldProps = Pick<
  GradesFormValues,
  | 'summary'
  | 'maxGrade'
  | 'weighted'
  | 'weights'
  | 'includeRecovery'
  | 'includeStatus'
  | 'passingGrade'
> & {
  gradeTitles: string[];
  errors: FormError[];
  onChange: (changes: Partial<GradesFormValues>) => void;
};

type OptionCheckboxProps = {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
};

const OptionCheckbox = ({ checked, label, onChange }: OptionCheckboxProps) => (
  <Label className="items-start text-base font-normal leading-snug">
    <input
      type="checkbox"
      className="mt-0.5 size-5 shrink-0 accent-primary"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
    />
    {label}
  </Label>
);

export const GradeSettingsField = ({
  summary,
  maxGrade,
  weighted,
  weights,
  includeRecovery,
  includeStatus,
  passingGrade,
  gradeTitles,
  errors,
  onChange,
}: GradeSettingsFieldProps) => {
  const hasSummary = summary !== 'none';

  return (
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

      {hasSummary && (
        <fieldset className="space-y-3">
          <legend className="mb-2 text-base font-medium">Mais opções (se quiser)</legend>
          <OptionCheckbox
            checked={weighted}
            label="As notas têm pesos diferentes"
            onChange={(checked) => onChange({ weighted: checked })}
          />
          <OptionCheckbox
            checked={includeRecovery}
            label='Colunas de recuperação: a nota "Final" é a maior entre a média e a recuperação'
            onChange={(checked) => onChange({ includeRecovery: checked })}
          />
          <OptionCheckbox
            checked={includeStatus}
            label='Coluna "Situação": mostra quem está na média e quem está abaixo (em vermelho)'
            onChange={(checked) => onChange({ includeStatus: checked })}
          />
        </fieldset>
      )}

      {hasSummary && weighted && (
        <GradeWeightsField
          gradeTitles={gradeTitles}
          weights={weights}
          error={getFieldError(errors, 'weights')}
          onChange={(nextWeights) => onChange({ weights: nextWeights })}
        />
      )}

      {hasSummary && (includeRecovery || includeStatus) && (
        <FormField
          id={fieldId('passingGrade')}
          label={summary === 'sum' ? 'Total mínimo para ficar na média' : 'Média mínima'}
          hint="Abaixo desse valor, a nota fica em vermelho na planilha."
          error={getFieldError(errors, 'passingGrade')}
        >
          {(control) => (
            <NumberField
              {...control}
              name="a média mínima"
              allowDecimals
              min={0}
              max={MAX_GRADE_LIMIT}
              value={passingGrade}
              onChange={(value) => onChange({ passingGrade: value })}
            />
          )}
        </FormField>
      )}

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
};
