import { Check } from 'lucide-react';

import { FieldGroup } from '@/components/FormField';
import { Button } from '@/components/ui/button';
import { fieldId } from '@/lib/forms/formErrors';
import {
  ALL_WEEKDAYS,
  BUSINESS_DAYS,
  WEEKDAY_LABELS,
  WEEKDAY_SHORT_LABELS,
  type Weekday,
} from '@/lib/date/weekdays';

type WeekdaysFieldProps = {
  weekdays: Weekday[];
  error?: string;
  onToggle: (weekday: Weekday) => void;
  onSelect: (weekdays: Weekday[]) => void;
};

export const WeekdaysField = ({ weekdays, error, onToggle, onSelect }: WeekdaysFieldProps) => (
  <FieldGroup id={fieldId('weekdays')} legend="Dias da semana com aula" error={error}>
    <div className="flex flex-wrap gap-2">
      {ALL_WEEKDAYS.map((weekday) => (
        <label
          key={weekday}
          className="inline-flex min-h-10 cursor-pointer items-center gap-1 rounded-lg border px-3 font-medium capitalize outline-ring outline-offset-2 transition-colors hover:bg-muted has-checked:border-primary has-checked:bg-primary has-checked:text-primary-foreground has-focus-visible:outline-3 has-focus-visible:outline-solid"
        >
          <input
            type="checkbox"
            className="sr-only"
            aria-label={WEEKDAY_LABELS[weekday]}
            checked={weekdays.includes(weekday)}
            onChange={() => onToggle(weekday)}
          />
          {weekdays.includes(weekday) && <Check className="size-4" aria-hidden />}
          <span aria-hidden>{WEEKDAY_SHORT_LABELS[weekday]}</span>
        </label>
      ))}
    </div>

    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => onSelect(BUSINESS_DAYS)}>
        Marcar de segunda a sexta
      </Button>
      <Button variant="outline" onClick={() => onSelect(ALL_WEEKDAYS)}>
        Marcar todos os dias
      </Button>
    </div>
  </FieldGroup>
);
