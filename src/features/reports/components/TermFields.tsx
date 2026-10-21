import { OptionButtons } from '@/components/OptionButtons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SHIFT_OPTIONS, TERM_OPTIONS } from '@/features/reports/constants';
import type { ReportFormValues } from '@/features/reports/types';

type TermFieldsProps = Pick<ReportFormValues, 'term' | 'shift' | 'schoolDays'> & {
  onChange: (changes: Partial<ReportFormValues>) => void;
};

export const TermFields = ({ term, shift, schoolDays, onChange }: TermFieldsProps) => (
  <div className="grid gap-4 sm:grid-cols-3">
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">Bimestre</legend>
      <OptionButtons
        options={TERM_OPTIONS}
        value={term}
        onChange={(value) => onChange({ term: value })}
      />
    </fieldset>
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">Turno</legend>
      <OptionButtons
        options={SHIFT_OPTIONS}
        value={shift}
        onChange={(value) => onChange({ shift: value })}
      />
    </fieldset>
    <div className="space-y-2">
      <Label htmlFor="report-school-days">Total de dias letivos</Label>
      <Input
        id="report-school-days"
        type="number"
        inputMode="numeric"
        min={1}
        className="w-32"
        value={schoolDays || ''}
        onChange={(event) => onChange({ schoolDays: event.target.valueAsNumber || 0 })}
      />
    </div>
  </div>
);
