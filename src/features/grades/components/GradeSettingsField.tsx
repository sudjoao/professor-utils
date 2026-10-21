import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MAX_GRADE_LIMIT, SUMMARY_OPTIONS } from '@/features/grades/constants';
import type { GradesFormValues } from '@/features/grades/types';

type GradeSettingsFieldProps = Pick<GradesFormValues, 'summary' | 'maxGrade'> & {
  onChange: (changes: Partial<GradesFormValues>) => void;
};

export const GradeSettingsField = ({ summary, maxGrade, onChange }: GradeSettingsFieldProps) => (
  <div className="space-y-6">
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">Coluna calculada no final</legend>
      <div className="flex flex-wrap gap-1">
        {SUMMARY_OPTIONS.map(({ value, label }) => (
          <Button
            key={value}
            size="sm"
            variant={summary === value ? 'default' : 'outline'}
            aria-pressed={summary === value}
            onClick={() => onChange({ summary: value })}
          >
            {label}
          </Button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        A planilha calcula sozinha conforme você lança as notas.
      </p>
    </fieldset>

    <div className="space-y-2">
      <Label htmlFor="grades-max">Nota máxima de cada avaliação</Label>
      <Input
        id="grades-max"
        type="number"
        inputMode="decimal"
        min={0}
        max={MAX_GRADE_LIMIT}
        step="any"
        className="w-32"
        value={maxGrade || ''}
        onChange={(event) => onChange({ maxGrade: event.target.valueAsNumber || 0 })}
      />
      <p className="text-xs text-muted-foreground">
        O Excel não aceita notas abaixo de 0 ou acima desse valor.
      </p>
    </div>
  </div>
);
