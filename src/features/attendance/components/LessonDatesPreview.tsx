import { badgeVariants } from '@/components/ui/badge';
import { formatMonthYear, getWeekday, groupByMonth, type IsoDate } from '@/lib/date/isoDate';
import { WEEKDAY_LABELS, WEEKDAY_SHORT_LABELS } from '@/lib/date/weekdays';
import { cn } from '@/lib/utils';

type LessonDatesPreviewProps = {
  candidateDates: IsoDate[];
  excludedDates: IsoDate[];
  onToggleDate: (date: IsoDate) => void;
};

export const LessonDatesPreview = ({
  candidateDates,
  excludedDates,
  onToggleDate,
}: LessonDatesPreviewProps) => {
  if (candidateDates.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        As datas aparecem aqui assim que você preencher um período.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Clique em uma data para tirá-la da lista (ex.: feriados). Clique de novo para incluir.
      </p>

      {[...groupByMonth(candidateDates)].map(([monthKey, dates]) => (
        <div key={monthKey} className="space-y-1">
          <p className="text-xs font-medium capitalize">{formatMonthYear(dates[0])}</p>
          <div className="flex flex-wrap gap-1">
            {dates.map((date) => {
              const isExcluded = excludedDates.includes(date);
              const weekday = getWeekday(date);

              return (
                <button
                  key={date}
                  type="button"
                  aria-pressed={!isExcluded}
                  title={`${WEEKDAY_LABELS[weekday]}${isExcluded ? ' (removida)' : ''}`}
                  className={cn(
                    badgeVariants({ variant: isExcluded ? 'outline' : 'secondary' }),
                    'cursor-pointer tabular-nums',
                    isExcluded && 'text-muted-foreground line-through',
                  )}
                  onClick={() => onToggleDate(date)}
                >
                  {date.slice(8, 10)} {WEEKDAY_SHORT_LABELS[weekday]}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
