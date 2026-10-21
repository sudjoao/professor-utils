import { Plus, Trash2 } from 'lucide-react';

import { FieldGroup } from '@/components/FormField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { DateRange } from '@/features/attendance/types';
import { fieldId } from '@/lib/forms/formErrors';

type DateRangesFieldProps = {
  dateRanges: DateRange[];
  error?: string;
  onAdd: () => void;
  onUpdate: (id: string, changes: Partial<Pick<DateRange, 'start' | 'end'>>) => void;
  onRemove: (id: string) => void;
};

export const DateRangesField = ({
  dateRanges,
  error,
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
