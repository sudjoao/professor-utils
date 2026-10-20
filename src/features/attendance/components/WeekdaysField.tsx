import { Button } from '@/components/ui/button';
import {
  ALL_WEEKDAYS,
  BUSINESS_DAYS,
  WEEKDAY_LABELS,
  WEEKDAY_SHORT_LABELS,
  type Weekday,
} from '@/lib/date/weekdays';

type WeekdaysFieldProps = {
  weekdays: Weekday[];
  onToggle: (weekday: Weekday) => void;
  onSelect: (weekdays: Weekday[]) => void;
};

export const WeekdaysField = ({ weekdays, onToggle, onSelect }: WeekdaysFieldProps) => (
  <fieldset className="space-y-3">
    <legend className="text-sm font-medium">Dias da semana com aula</legend>

    <div className="flex flex-wrap gap-1">
      {ALL_WEEKDAYS.map((weekday) => {
        const isSelected = weekdays.includes(weekday);

        return (
          <Button
            key={weekday}
            size="sm"
            variant={isSelected ? 'default' : 'outline'}
            aria-pressed={isSelected}
            aria-label={WEEKDAY_LABELS[weekday]}
            className="w-12"
            onClick={() => onToggle(weekday)}
          >
            {WEEKDAY_SHORT_LABELS[weekday]}
          </Button>
        );
      })}
    </div>

    <div className="flex flex-wrap gap-2">
      <Button variant="link" size="sm" className="px-0" onClick={() => onSelect(BUSINESS_DAYS)}>
        Somente dias úteis
      </Button>
      <Button variant="link" size="sm" className="px-0" onClick={() => onSelect(ALL_WEEKDAYS)}>
        Todos os dias
      </Button>
    </div>
  </fieldset>
);
