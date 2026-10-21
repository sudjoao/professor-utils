import { Check } from 'lucide-react';
import { useId } from 'react';

import { FieldGroup } from '@/components/FormField';
import { OptionButtons } from '@/components/OptionButtons';
import { Label } from '@/components/ui/label';
import { SheetPreview } from '@/features/classroom/components/SheetPreview';
import { SHEET_FONT_SIZE_OPTIONS, SHEET_PALETTES } from '@/features/classroom/constants';
import { argbToCss } from '@/features/classroom/services/sheetStyle';
import type { SheetStylePreferences } from '@/features/classroom/types';

type SheetStyleFieldProps = {
  preferences: SheetStylePreferences;
  columnTitles: string[];
  studentNames: string[];
  onChange: (changes: Partial<SheetStylePreferences>) => void;
};

export const SheetStyleField = ({
  preferences,
  columnTitles,
  studentNames,
  onChange,
}: SheetStyleFieldProps) => {
  const paletteName = useId();

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <FieldGroup
          id="sheet-palette"
          legend="Cor da planilha"
          hint="Cores claras, que continuam boas para ler mesmo impressas em preto e branco."
        >
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {SHEET_PALETTES.map((palette) => {
              const isSelected = palette.id === preferences.paletteId;

              return (
                <label
                  key={palette.id}
                  className="flex cursor-pointer flex-col gap-2 rounded-xl border-2 p-2 outline-ring outline-offset-2 transition-colors hover:bg-muted has-checked:border-primary has-focus-visible:outline-3 has-focus-visible:outline-solid"
                >
                  <input
                    type="radio"
                    name={paletteName}
                    className="sr-only"
                    checked={isSelected}
                    onChange={() => onChange({ paletteId: palette.id })}
                  />
                  <span className="overflow-hidden rounded-md border border-black/40" aria-hidden>
                    <span
                      className="block h-4"
                      style={{ backgroundColor: argbToCss(palette.headerArgb) }}
                    />
                    <span className="block h-3 bg-white" />
                    <span
                      className="block h-3"
                      style={{ backgroundColor: argbToCss(palette.stripeArgb) }}
                    />
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    {isSelected && <Check className="size-4" aria-hidden />}
                    {palette.label}
                  </span>
                </label>
              );
            })}
          </div>
        </FieldGroup>

        <Label className="text-base font-normal">
          <input
            type="checkbox"
            className="size-5 accent-primary"
            checked={preferences.stripes}
            onChange={(event) => onChange({ stripes: event.target.checked })}
          />
          Pintar uma linha sim, outra não (ajuda a seguir a linha de cada aluno)
        </Label>

        <FieldGroup
          id="sheet-font-size"
          legend="Tamanho da letra na planilha"
          hint="A letra grande deixa as linhas mais altas; a lista pode ocupar mais folhas."
        >
          <OptionButtons
            options={SHEET_FONT_SIZE_OPTIONS}
            value={preferences.fontSize}
            onChange={(fontSize) => onChange({ fontSize })}
          />
        </FieldGroup>

        <p className="text-sm text-muted-foreground">
          Essas escolhas ficam salvas e valem para a lista de chamada e para a lista de notas.
        </p>
      </div>

      <SheetPreview
        preferences={preferences}
        columnTitles={columnTitles}
        studentNames={studentNames}
      />
    </div>
  );
};
