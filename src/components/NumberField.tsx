import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';

import type { ControlProps } from '@/components/FormField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatNumberInput, parseNumberInput, stepNumber } from '@/lib/number/numberInput';

type NumberFieldProps = ControlProps & {
  /** For a field without a visible `<label>` of its own. */
  'aria-label'?: string;
  value: number;
  min: number;
  max: number;
  /** Used in the labels of the − and + buttons, e.g. "aulas" → "Diminuir aulas". */
  name: string;
  allowDecimals?: boolean;
  onChange: (value: number) => void;
};

/**
 * A text field for numbers with large − and + buttons. Unlike `type="number"` it has no tiny
 * spinner, does not change when the mouse wheel scrolls over it and accepts "7,5".
 */
export const NumberField = ({
  value,
  min,
  max,
  name,
  allowDecimals = false,
  onChange,
  ...controlProps
}: NumberFieldProps) => {
  // Keeps what the teacher typed ("7," while typing "7,5") as long as it still means `value`.
  const [draft, setDraft] = useState({ text: formatNumberInput(value), value });
  const isDraftCurrent = Object.is(draft.value, value);
  const text = isDraftCurrent ? draft.text : formatNumberInput(value);

  const handleTextChange = (nextText: string) => {
    const nextValue = parseNumberInput(nextText);
    setDraft({ text: nextText, value: nextValue });
    onChange(nextValue);
  };

  const handleStep = (step: number) => onChange(stepNumber(value, step, min, max));

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon-lg"
        aria-label={`Diminuir ${name}`}
        disabled={value <= min}
        onClick={() => handleStep(-1)}
      >
        <Minus />
      </Button>
      <Input
        {...controlProps}
        type="text"
        inputMode={allowDecimals ? 'decimal' : 'numeric'}
        autoComplete="off"
        className="h-9 w-24 text-center text-base md:text-base"
        value={text}
        onChange={(event) => handleTextChange(event.target.value)}
      />
      <Button
        variant="outline"
        size="icon-lg"
        aria-label={`Aumentar ${name}`}
        disabled={value >= max}
        onClick={() => handleStep(1)}
      >
        <Plus />
      </Button>
    </div>
  );
};
