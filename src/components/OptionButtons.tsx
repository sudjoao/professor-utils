import { Check } from 'lucide-react';
import { useId } from 'react';

type Option<Value> = {
  value: Value;
  label: string;
};

type OptionButtonsProps<Value> = {
  options: Option<Value>[];
  value: Value;
  onChange: (value: Value) => void;
};

/**
 * A row of buttons where exactly one is selected: native radios drawn as buttons, so screen
 * readers and the arrow keys treat them as a single choice. Use inside a `FieldGroup`.
 */
export const OptionButtons = <Value extends string | number>({
  options,
  value,
  onChange,
}: OptionButtonsProps<Value>) => {
  const name = useId();

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = option.value === value;

        return (
          <label
            key={option.value}
            className="inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-lg border px-3 font-medium transition-colors outline-ring outline-offset-2 hover:bg-muted has-checked:border-primary has-checked:bg-primary has-checked:text-primary-foreground has-focus-visible:outline-3 has-focus-visible:outline-solid"
          >
            <input
              type="radio"
              name={name}
              className="sr-only"
              checked={isSelected}
              onChange={() => onChange(option.value)}
            />
            {isSelected && <Check className="size-4" aria-hidden />}
            {option.label}
          </label>
        );
      })}
    </div>
  );
};
