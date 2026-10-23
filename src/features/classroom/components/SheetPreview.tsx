import { argbToCss, getSheetPalette } from '@/features/classroom/services/sheetStyle';
import type { SheetStylePreferences } from '@/features/classroom/types';
import { cn } from '@/lib/utils';

const PREVIEW_ROWS = 4;
const PREVIEW_COLUMNS = 5;
const EXAMPLE_NAMES = ['Ana Souza', 'Bruno Lima', 'Carla Dias', 'Davi Rocha'];

type SheetPreviewProps = {
  preferences: SheetStylePreferences;
  columnTitles: string[];
  studentNames: string[];
};

/** A small HTML copy of the top of the sheet, so the teacher sees the colors before downloading. */
export const SheetPreview = ({ preferences, columnTitles, studentNames }: SheetPreviewProps) => {
  const palette = getSheetPalette(preferences.paletteId);
  const names = (studentNames.length > 0 ? studentNames : EXAMPLE_NAMES).slice(0, PREVIEW_ROWS);
  const columns = columnTitles.slice(0, PREVIEW_COLUMNS);
  const hasMoreColumns = columnTitles.length > PREVIEW_COLUMNS;
  const headerStyle = { backgroundColor: argbToCss(palette.headerArgb) };
  const stripeStyle = { backgroundColor: argbToCss(palette.stripeArgb) };

  return (
    <div className="space-y-2">
      <h3 className="font-medium">Como a planilha vai ficar</h3>
      {/* Focusable so keyboard users can scroll the preview sideways with the arrow keys. */}
      <div
        role="region"
        aria-label="Prévia da planilha"
        tabIndex={0}
        className="overflow-x-auto rounded-lg border bg-white p-3 text-black"
      >
        <table
          className={cn(
            'border-collapse',
            preferences.fontSize === 'large' ? 'text-base' : 'text-sm',
          )}
        >
          <caption className="sr-only">Prévia das primeiras linhas e colunas da planilha</caption>
          <thead>
            <tr>
              {['Nº', 'Aluno(a)', ...columns, ...(hasMoreColumns ? ['...'] : [])].map(
                (title, index) => (
                  <th
                    key={`${index}-${title}`}
                    scope="col"
                    style={headerStyle}
                    className="border border-black px-2 py-1 text-center font-bold"
                  >
                    {title}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {names.map((name, index) => {
              const rowStyle = preferences.stripes && index % 2 === 1 ? stripeStyle : undefined;
              const emptyCells = columns.length + (hasMoreColumns ? 1 : 0);

              return (
                <tr key={`${index}-${name}`} style={rowStyle}>
                  <td className="border border-black px-2 py-1 text-center">{index + 1}</td>
                  <th scope="row" className="border border-black px-2 py-1 text-left font-normal">
                    {name}
                  </th>
                  {Array.from({ length: emptyCells }, (_, cell) => (
                    <td key={cell} className="min-w-10 border border-black px-2 py-1" />
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
