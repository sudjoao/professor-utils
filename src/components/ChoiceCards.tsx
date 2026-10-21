import { useId } from 'react';

import { cn } from '@/lib/utils';

type Choice<Value> = {
  value: Value;
  label: string;
  description?: string;
};

type ChoiceCardsProps<Value> = {
  choices: Choice<Value>[];
  value: Value;
  className?: string;
  onChange: (value: Value) => void;
};

/**
 * Large radio buttons, each with a short explanation. Use inside a `FieldGroup`, which gives
 * the question. Native radios keep the keyboard behavior people already know (arrow keys).
 */
export const ChoiceCards = <Value extends string | number>({
  choices,
  value,
  className,
  onChange,
}: ChoiceCardsProps<Value>) => {
  const name = useId();

  return (
    <div className={cn('grid gap-3 sm:grid-cols-2', className)}>
      {choices.map((choice) => (
        <label
          key={choice.value}
          className="flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-colors hover:bg-muted has-checked:border-primary has-checked:bg-muted"
        >
          <input
            type="radio"
            name={name}
            className="mt-0.5 size-5 shrink-0 accent-primary"
            checked={choice.value === value}
            onChange={() => onChange(choice.value)}
          />
          <span className="space-y-1">
            <span className="block font-medium">{choice.label}</span>
            {choice.description && (
              <span className="block text-sm text-muted-foreground">{choice.description}</span>
            )}
          </span>
        </label>
      ))}
    </div>
  );
};
