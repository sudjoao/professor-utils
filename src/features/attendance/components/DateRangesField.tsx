import { Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { DateRange } from '@/features/attendance/types';

type DateRangesFieldProps = {
  dateRanges: DateRange[];
  onAdd: () => void;
  onUpdate: (id: string, changes: Partial<Pick<DateRange, 'start' | 'end'>>) => void;
  onRemove: (id: string) => void;
};

export const DateRangesField = ({
  dateRanges,
  onAdd,
  onUpdate,
  onRemove,
}: DateRangesFieldProps) => (
  <fieldset className="space-y-3">
    <legend className="text-sm font-medium">Períodos</legend>
    <p className="text-xs text-muted-foreground">
      Use um período longo (ex.: o bimestre inteiro) ou vários curtos. Para um dia só, repita a
      mesma data.
    </p>

    {dateRanges.map(({ id, start, end }, index) => (
      <div key={id} className="flex flex-wrap items-end gap-2">
        <div className="space-y-1">
          <Label htmlFor={`range-start-${id}`} className="text-xs text-muted-foreground">
            Início
          </Label>
          <Input
            id={`range-start-${id}`}
            type="date"
            value={start}
            onChange={(event) => onUpdate(id, { start: event.target.value })}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`range-end-${id}`} className="text-xs text-muted-foreground">
            Fim
          </Label>
          <Input
            id={`range-end-${id}`}
            type="date"
            value={end}
            min={start || undefined}
            onChange={(event) => onUpdate(id, { end: event.target.value })}
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Remover período ${index + 1}`}
          disabled={dateRanges.length === 1}
          onClick={() => onRemove(id)}
        >
          <Trash2 />
        </Button>
      </div>
    ))}

    <Button variant="outline" size="sm" onClick={onAdd}>
      <Plus data-icon="inline-start" />
      Adicionar período
    </Button>
  </fieldset>
);
