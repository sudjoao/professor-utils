import { Plus, Trash2 } from 'lucide-react';

import { FieldGroup } from '@/components/FormField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { DateRange } from '@/features/attendance/types';
import type { SchoolTerm } from '@/features/schoolCalendar/types';
import { formatDayMonth } from '@/lib/date/isoDate';
import { fieldId } from '@/lib/forms/formErrors';

type DateRangesFieldProps = {
  dateRanges: DateRange[];
  /** Terms of the current year's school calendar; empty when it is unknown. */
  schoolTerms: SchoolTerm[];
  currentTerm?: SchoolTerm;
  error?: string;
  onApplyTerm: (term: SchoolTerm) => void;
  onAdd: () => void;
  onUpdate: (id: string, changes: Partial<Pick<DateRange, 'start' | 'end'>>) => void;
  onRemove: (id: string) => void;
};

const isOnlyRange = (dateRanges: DateRange[], { start, end }: SchoolTerm) =>
  dateRanges.length === 1 && dateRanges[0].start === start && dateRanges[0].end === end;

export const DateRangesField = ({
  dateRanges,
  schoolTerms,
  currentTerm,
  error,
  onApplyTerm,
  onAdd,
  onUpdate,
  onRemove,
}: DateRangesFieldProps) => (
  <FieldGroup
    id={fieldId('dateRanges')}
    legend="Período das aulas"
    hint="Use o bimestre inteiro ou vários períodos menores. Para um dia só, repita a mesma data."
    error={error}
  >
    {schoolTerms.length > 0 && (
      <div className="space-y-2 rounded-xl bg-muted p-4">
        <p id="school-terms-label" className="font-medium">
          Usar as datas de um bimestre (calendário da SEEDF {schoolTerms[0].start.slice(0, 4)})
        </p>
        <div role="group" aria-labelledby="school-terms-label" className="flex flex-wrap gap-2">
          {schoolTerms.map((schoolTerm) => (
            <Button
              key={schoolTerm.term}
              variant={isOnlyRange(dateRanges, schoolTerm) ? 'default' : 'outline'}
              aria-pressed={isOnlyRange(dateRanges, schoolTerm)}
              className="h-auto flex-col items-start gap-0 px-3 py-1.5"
              onClick={() => onApplyTerm(schoolTerm)}
            >
              <span>
                {schoolTerm.term}º bimestre
                {schoolTerm.term === currentTerm?.term && ' (atual)'}
              </span>
              <span className="text-sm font-normal">
                {formatDayMonth(schoolTerm.start)} a {formatDayMonth(schoolTerm.end)}
              </span>
            </Button>
          ))}
        </div>
      </div>
    )}

    {dateRanges.map(({ id, start, end }, index) => (
      <div
        key={id}
        role="group"
        aria-label={`Período ${index + 1}`}
        className="flex flex-wrap items-end gap-3"
      >
        <div className="space-y-1">
          <Label htmlFor={`range-start-${id}`}>De</Label>
          <Input
            id={`range-start-${id}`}
            type="date"
            className="h-10 text-base md:text-base"
            value={start}
            onChange={(event) => onUpdate(id, { start: event.target.value })}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`range-end-${id}`}>Até</Label>
          <Input
            id={`range-end-${id}`}
            type="date"
            className="h-10 text-base md:text-base"
            value={end}
            min={start || undefined}
            onChange={(event) => onUpdate(id, { end: event.target.value })}
          />
        </div>
        {dateRanges.length > 1 && (
          <Button variant="outline" size="lg" className="h-10" onClick={() => onRemove(id)}>
            <Trash2 data-icon="inline-start" />
            Tirar o período {index + 1}
          </Button>
        )}
      </div>
    ))}

    <Button variant="outline" size="lg" className="h-10" onClick={onAdd}>
      <Plus data-icon="inline-start" />
      Adicionar outro período
    </Button>
  </FieldGroup>
);
