import {
  INITIAL_SEATING,
  saveSeatingChart,
  selectSeatingCharts,
} from '@/features/seating/seatingSlice';
import {
  createSeatingChart,
  getDefaultSize,
  resizeSeatingChart,
  swapSeats,
  syncSeatingChart,
} from '@/features/seating/services/seatingChart';
import type { SeatingChart, SeatingOrder } from '@/features/seating/types';
import { normalizeKey } from '@/lib/text/normalizeKey';
import { useAppDispatch, usePersistedSelector } from '@/store/hooks';

/**
 * The seating chart of a class, saved in the browser. Until the teacher changes anything,
 * the students are shown in alphabetical order in a grid that fits them.
 */
export const useSeatingChart = (classroomName: string, studentNames: string[]) => {
  const dispatch = useAppDispatch();
  const charts = usePersistedSelector(selectSeatingCharts, INITIAL_SEATING.charts);
  const key = normalizeKey(classroomName);
  const savedChart: SeatingChart | undefined = charts[key];
  const baseChart =
    savedChart ??
    createSeatingChart(studentNames, {
      ...getDefaultSize(studentNames.length),
      order: 'alphabetical',
    });
  const { chart, unseated } = syncSeatingChart(baseChart, studentNames);

  const save = (nextChart: SeatingChart) => dispatch(saveSeatingChart({ key, chart: nextChart }));

  /** Places everyone again; returns how to undo it. */
  const rearrange = (order: SeatingOrder) => {
    const previous = chart;
    save(createSeatingChart(studentNames, { rows: chart.rows, columns: chart.columns, order }));
    return () => save(previous);
  };

  return {
    chart,
    unseated,
    resize: (size: { rows: number; columns: number }) => save(resizeSeatingChart(chart, size)),
    swap: (first: number, second: number) => save(swapSeats(chart, first, second)),
    rearrange,
  };
};
