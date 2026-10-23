import type { PrintableSheet } from '@/features/classroom/services/printableSheet';
import { argbToCss, getSheetPalette } from '@/features/classroom/services/sheetStyle';
import type { SheetStylePreferences } from '@/features/classroom/types';
import { cn } from '@/lib/utils';

type PrintableSheetViewProps = {
  sheet: PrintableSheet;
  preferences: SheetStylePreferences;
};

const CELL = 'border border-black px-1 py-0.5';

/** The class sheet as a printable HTML table, with the colors chosen for the spreadsheet. */
export const PrintableSheetView = ({ sheet, preferences }: PrintableSheetViewProps) => {
  const palette = getSheetPalette(preferences.paletteId);
  const headerStyle = { backgroundColor: argbToCss(palette.headerArgb) };
  const stripeStyle = { backgroundColor: argbToCss(palette.stripeArgb) };
  const isLarge = preferences.fontSize === 'large';
  const rowHeight = sheet.tallRows ? 'h-10' : isLarge ? 'h-7' : 'h-6';
  // Many lesson columns: the name column gives them room, as in the spreadsheet.
  const hasManyColumns = sheet.pages.some(({ columns }) => columns.length > 10);

  return (
    <div className={cn('text-black', isLarge ? 'text-[12pt]' : 'text-[10pt]')}>
      {sheet.pages.map((page, pageIndex) => {
        const hasCaptions = page.columns.some(({ caption }) => caption);

        return (
          <section key={pageIndex} className="print-page">
            <h1 className="text-center text-[14pt] font-bold">{page.title}</h1>
            <p className="mb-2">{page.info}</p>
            <table className="w-full table-fixed border-collapse">
              <colgroup>
                <col className="w-8" />
                <col className={hasManyColumns ? 'w-[18%]' : 'w-[30%]'} />
                {page.columns.map((column, index) => (
                  <col key={index} className={column.wide ? 'w-[60%]' : undefined} />
                ))}
              </colgroup>
              <thead>
                <tr style={headerStyle}>
                  <th className={CELL} rowSpan={hasCaptions ? 2 : 1}>
                    Nº
                  </th>
                  <th className={CELL} rowSpan={hasCaptions ? 2 : 1}>
                    Aluno(a)
                  </th>
                  {page.columns.map((column, index) => (
                    <th
                      key={index}
                      className={cn(CELL, hasManyColumns ? 'px-0 text-[6.5pt]' : 'text-[8pt]')}
                      rowSpan={hasCaptions && !column.caption ? 2 : 1}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
                {hasCaptions && (
                  <tr style={headerStyle}>
                    {page.columns
                      .filter(({ caption }) => caption)
                      .map((column, index) => (
                        <th
                          key={index}
                          className={cn(
                            CELL,
                            'font-normal',
                            hasManyColumns ? 'px-0 text-[6.5pt]' : 'text-[8pt]',
                          )}
                        >
                          {column.caption}
                        </th>
                      ))}
                  </tr>
                )}
                {page.extraRow && (
                  <tr>
                    <td className={CELL} />
                    <td className={cn(CELL, 'text-[8pt] font-bold italic')}>
                      {page.extraRow.label}
                    </td>
                    {page.columns.map((_, index) => (
                      <td
                        key={index}
                        className={cn(CELL, 'text-center text-[8pt] font-bold italic')}
                      >
                        {page.extraRow?.values[index] ?? ''}
                      </td>
                    ))}
                  </tr>
                )}
              </thead>
              <tbody>
                {sheet.studentNames.map((name, index) => (
                  <tr
                    key={`${index}-${name}`}
                    className={rowHeight}
                    style={preferences.stripes && index % 2 === 1 ? stripeStyle : undefined}
                  >
                    <td className={cn(CELL, 'text-center')}>{index + 1}</td>
                    <td className={cn(CELL, 'truncate')}>{name}</td>
                    {page.columns.map((_, columnIndex) => (
                      <td key={columnIndex} className={CELL} />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {page.legend && <p className="mt-2 text-[9pt] italic">{page.legend}</p>}
          </section>
        );
      })}
    </div>
  );
};
