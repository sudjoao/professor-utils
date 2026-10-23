import { CalendarOff, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  isRemovedByCalendar,
  isSelectedDate,
} from '@/features/attendance/services/buildLessonDates';
import type { AttendanceFormValues } from '@/features/attendance/types';
import { summarizeCalendarNotes } from '@/features/schoolCalendar/services/schoolCalendar';
import type { CalendarNote, CalendarNoteKind } from '@/features/schoolCalendar/types';
import {
  formatDayMonth,
  formatLongDate,
  formatMonthYear,
  getWeekday,
  groupByMonth,
  type IsoDate,
} from '@/lib/date/isoDate';
import { WEEKDAY_LABELS, WEEKDAY_SHORT_LABELS } from '@/lib/date/weekdays';
import { pluralize } from '@/lib/text/pluralize';
import { cn } from '@/lib/utils';

const NOTE_KIND_LABELS: Record<CalendarNoteKind, string> = {
  holiday: 'Feriado',
  recess: 'Recesso',
  movable: 'Dia móvel',
};

type LessonDatesPreviewProps = Pick<
  AttendanceFormValues,
  'excludedDates' | 'restoredDates' | 'skipNoClassDays'
> & {
  candidateDates: IsoDate[];
  calendarNotes: Map<IsoDate, CalendarNote>;
  onToggleDate: (date: IsoDate) => void;
  onReset: () => void;
  onSkipNoClassDaysChange: (skipNoClassDays: boolean) => void;
};

const formatPeriod = (start: IsoDate, end: IsoDate) =>
  start === end ? formatDayMonth(start) : `${formatDayMonth(start)} a ${formatDayMonth(end)}`;

export const LessonDatesPreview = ({
  candidateDates,
  calendarNotes,
  excludedDates,
  restoredDates,
  skipNoClassDays,
  onToggleDate,
  onReset,
  onSkipNoClassDaysChange,
}: LessonDatesPreviewProps) => {
  if (candidateDates.length === 0) {
    return (
      <p className="text-muted-foreground">
        As datas das aulas aparecem aqui assim que você escolher o período.
      </p>
    );
  }

  const selection = { excludedDates, restoredDates, skipNoClassDays };
  const selectedCount = candidateDates.filter((date) =>
    isSelectedDate(date, selection, calendarNotes),
  ).length;
  const calendarCount = candidateDates.filter((date) =>
    isRemovedByCalendar(date, selection, calendarNotes),
  ).length;
  const handRemovedCount = candidateDates.filter((date) => excludedDates.includes(date)).length;
  const hasChanges = handRemovedCount > 0 || restoredDates.length > 0;
  const noteSummaries = summarizeCalendarNotes(candidateDates, calendarNotes);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="font-medium">Datas que vão aparecer na lista</h3>
        <p className="text-sm text-muted-foreground">
          Desmarque as datas sem aula. Para colocar uma data de volta, marque de novo.
        </p>
      </div>

      <Label className="text-base font-normal">
        <input
          type="checkbox"
          className="size-5 accent-primary"
          checked={skipNoClassDays}
          onChange={(event) => onSkipNoClassDaysChange(event.target.checked)}
        />
        Tirar sozinho os feriados e recessos (calendário da SEEDF)
      </Label>

      <div className="flex flex-wrap items-center gap-3">
        <p className="font-medium" aria-live="polite">
          {[
            pluralize(selectedCount, 'data com aula', 'datas com aula'),
            calendarCount > 0 &&
              pluralize(calendarCount, 'feriado ou recesso tirado', 'feriados ou recessos tirados'),
            handRemovedCount > 0 &&
              pluralize(handRemovedCount, 'tirada por você', 'tiradas por você'),
          ]
            .filter(Boolean)
            .join(' · ')}
        </p>
        {hasChanges && (
          <Button variant="outline" onClick={onReset}>
            Voltar às datas sugeridas
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
              const isIncluded = isSelectedDate(date, selection, calendarNotes);
              const note = calendarNotes.get(date);
              const weekday = getWeekday(date);

              return (
                <label
                  key={date}
                  className={cn(
                    'inline-flex min-h-10 cursor-pointer flex-col justify-center rounded-lg border px-2.5 py-1 text-sm tabular-nums outline-ring outline-offset-2 transition-colors hover:bg-muted has-checked:border-primary has-checked:bg-secondary has-focus-visible:outline-3 has-focus-visible:outline-solid [&:not(:has(:checked))]:text-muted-foreground',
                    note && 'border-dashed border-note',
                  )}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    aria-label={[WEEKDAY_LABELS[weekday], formatLongDate(date), note?.label]
                      .filter(Boolean)
                      .join(', ')}
                    checked={isIncluded}
                    onChange={() => onToggleDate(date)}
                  />
                  <span
                    className={cn('flex items-center gap-1', !isIncluded && 'line-through')}
                    aria-hidden
                  >
                    {isIncluded && <Check className="size-3.5" />}
                    {date.slice(8, 10)} {WEEKDAY_SHORT_LABELS[weekday]}
                  </span>
                  {note && (
                    <span className="text-xs font-medium text-note-foreground" aria-hidden>
                      {NOTE_KIND_LABELS[note.kind]}
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}

      {noteSummaries.length > 0 && (
        <section
          aria-labelledby="calendar-notes-title"
          className="space-y-2 rounded-xl bg-muted p-4"
        >
          <h4 id="calendar-notes-title" className="flex items-center gap-2 font-medium">
            <CalendarOff className="size-5" aria-hidden />
            Feriados, recessos e dias móveis neste período
          </h4>
          <ul className="space-y-1 text-sm">
            {noteSummaries.map(({ date, endDate, kind, label }) => (
              <li key={date}>
                <strong>{formatPeriod(date, endDate)}</strong> – {label}
                {kind === 'movable' &&
                  ': tem aula, mas a escola pode trocar por recesso. Se for o caso, desmarque.'}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};
