import { Button } from '@/components/ui/button';

type Option<Value> = {
  value: Value;
  label: string;
};

type OptionButtonsProps<Value> = {
  options: Option<Value>[];
  value: Value;
  onChange: (value: Value) => void;
};

/** A row of buttons where exactly one is selected, like a compact radio group. */
export const OptionButtons = <Value extends string | number>({
  options,
  value,
  onChange,
}: OptionButtonsProps<Value>) => (
  <div className="flex flex-wrap gap-1">
    {options.map((option) => (
      <Button
        key={option.value}
        size="sm"
        variant={option.value === value ? 'default' : 'outline'}
        aria-pressed={option.value === value}
        onClick={() => onChange(option.value)}
      >
        {option.label}
      </Button>
    ))}
  </div>
);
