import type { SeatingChart } from '@/features/seating/types';
import { cn } from '@/lib/utils';

type SeatingGridProps = {
  chart: SeatingChart;
  selectedSeat?: number | null;
  /** Without it, the grid is only drawn (for printing). */
  onSeatClick?: (seat: number) => void;
  isPrint?: boolean;
};

const seatPosition = (index: number, columns: number) => ({
  row: Math.floor(index / columns) + 1,
  column: (index % columns) + 1,
});

/** The classroom seen from the teacher: board on top, row 1 is the front. */
export const SeatingGrid = ({
  chart,
  selectedSeat,
  onSeatClick,
  isPrint = false,
}: SeatingGridProps) => (
  <div className={cn('space-y-3', isPrint && 'text-black')}>
    <p
      className={cn(
        'rounded-lg border-2 py-2 text-center font-semibold',
        isPrint ? 'border-black text-[12pt]' : 'bg-muted',
      )}
    >
      Quadro e mesa do professor
    </p>
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${chart.columns}, minmax(0, 1fr))` }}
    >
      {chart.seats.map((name, index) => {
        const { row, column } = seatPosition(index, chart.columns);
        const label = `Fileira ${row}, carteira ${column}: ${name ?? 'vazia'}`;
        const content = name ?? (isPrint ? '' : 'vazia');
        const classes = cn(
          'flex min-h-14 items-center justify-center rounded-lg border-2 p-1 text-center leading-tight break-words',
          isPrint ? 'min-h-16 border-black text-[11pt]' : 'text-sm',
          !name && 'border-dashed text-muted-foreground',
        );

        return onSeatClick ? (
          <button
            key={index}
            type="button"
            aria-label={label}
            aria-pressed={selectedSeat === index}
            className={cn(
              classes,
              'cursor-pointer bg-card hover:bg-muted',
              selectedSeat === index &&
                'border-primary bg-primary text-primary-foreground hover:bg-primary',
            )}
            onClick={() => onSeatClick(index)}
          >
            {content}
          </button>
        ) : (
          <div key={index} className={classes}>
            {content}
          </div>
        );
      })}
    </div>
  </div>
);
