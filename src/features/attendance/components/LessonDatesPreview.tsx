import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  formatLongDate,
  formatMonthYear,
  getWeekday,
  groupByMonth,
  type IsoDate,
} from '@/lib/date/isoDate';
import { WEEKDAY_LABELS, WEEKDAY_SHORT_LABELS } from '@/lib/date/weekdays';
import { pluralize } from '@/lib/text/pluralize';

type LessonDatesPreviewProps = {
  candidateDates: IsoDate[];
  excludedDates: IsoDate[];
  onToggleDate: (date: IsoDate) => void;
  onIncludeAll: () => void;
};

export const LessonDatesPreview = ({
  candidateDates,
  excludedDates,
  onToggleDate,
  onIncludeAll,
}: LessonDatesPreviewProps) => {
  if (candidateDates.length === 0) {
    return (
      <p className="text-muted-foreground">
        As datas das aulas aparecem aqui assim que você escolher o período.
      </p>
    );
  }

  const removedCount = candidateDates.filter((date) => excludedDates.includes(date)).length;

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="font-medium">Datas que vão aparecer na lista</h3>
        <p className="text-sm text-muted-foreground">
          Desmarque as datas sem aula (por exemplo, feriados). Para colocar de volta, marque de
          novo.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <p className="font-medium" aria-live="polite">
          {pluralize(candidateDates.length - removedCount, 'data com aula', 'datas com aula')}
          {removedCount > 0 && ` · ${pluralize(removedCount, 'tirada', 'tiradas')}`}
        </p>
        {removedCount > 0 && (
          <Button variant="outline" onClick={onIncludeAll}>
            Colocar todas as datas de volta
          </Button>
        )}
      </div>

      {[...groupByMonth(candidateDates)].map(([monthKey, dates]) => (
        <fieldset key={monthKey} className="space-y-2">
          <legend className="text-sm font-semibold first-letter:uppercase">
            {formatMonthYear(dates[0])}
          </legend>
          <div className="flex flex-wrap gap-2">
            {dates.map((date) => {
              const isIncluded = !excludedDates.includes(date);
              const weekday = getWeekday(date);

              return (
                <label
                  key={date}
                  className="inline-flex min-h-10 cursor-pointer items-center gap-1 rounded-lg border px-2.5 text-sm tabular-nums outline-ring outline-offset-2 transition-colors hover:bg-muted has-checked:border-primary has-checked:bg-secondary has-focus-visible:outline-3 has-focus-visible:outline-solid [&:not(:has(:checked))]:text-muted-foreground [&:not(:has(:checked))]:line-through"
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    aria-label={`${WEEKDAY_LABELS[weekday]}, ${formatLongDate(date)}`}
                    checked={isIncluded}
                    onChange={() => onToggleDate(date)}
                  />
                  {isIncluded && <Check className="size-3.5" aria-hidden />}
                  <span aria-hidden>
                    {date.slice(8, 10)} {WEEKDAY_SHORT_LABELS[weekday]}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
};
