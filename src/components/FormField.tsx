import { CircleAlert } from 'lucide-react';
import type { ReactNode } from 'react';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

/** Props every control needs so assistive technologies read its hint and error with the label. */
export type ControlProps = {
  id: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
};

type FieldMessagesProps = {
  id: string;
  hint?: ReactNode;
  error?: string;
};

const hintId = (id: string) => `${id}-hint`;
const errorId = (id: string) => `${id}-error`;

const describedBy = ({ id, hint, error }: FieldMessagesProps): string | undefined =>
  [error && errorId(id), hint && hintId(id)].filter(Boolean).join(' ') || undefined;

const OptionalMark = () => <span className="font-normal text-muted-foreground"> (opcional)</span>;

// Hint and error come before the control, so they are read before the teacher starts typing.
const FieldMessages = ({ id, hint, error }: FieldMessagesProps) => (
  <>
    {hint && (
      <p id={hintId(id)} className="text-sm text-muted-foreground">
        {hint}
      </p>
    )}
    {error && (
      <p id={errorId(id)} className="flex items-start gap-1.5 text-sm font-medium text-destructive">
        <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
        {error}
      </p>
    )}
  </>
);

type FormFieldProps = FieldMessagesProps & {
  label: ReactNode;
  optional?: boolean;
  className?: string;
  /** Renders the control with the props that link it to the label, hint and error. */
  children: (control: ControlProps) => ReactNode;
};

/** Label, control, hint and error of a single field, already wired for screen readers. */
export const FormField = ({
  id,
  label,
  hint,
  error,
  optional = false,
  className,
  children,
}: FormFieldProps) => (
  <div className={cn('space-y-2', className)}>
    <Label htmlFor={id} className="text-base">
      {label}
      {optional && <OptionalMark />}
    </Label>
    <FieldMessages id={id} hint={hint} error={error} />
    {children({
      id,
      'aria-describedby': describedBy({ id, hint, error }),
      'aria-invalid': error ? true : undefined,
    })}
  </div>
);

type FieldGroupProps = FieldMessagesProps & {
  legend: ReactNode;
  optional?: boolean;
  className?: string;
  children: ReactNode;
};

/** Like `FormField`, for a group of controls (radio buttons, checkboxes, date ranges...). */
export const FieldGroup = ({
  id,
  legend,
  hint,
  error,
  optional = false,
  className,
  children,
}: FieldGroupProps) => (
  <fieldset
    id={id}
    aria-describedby={describedBy({ id, hint, error })}
    aria-invalid={error ? true : undefined}
    className={cn('min-w-0 space-y-3', className)}
  >
    <legend className="mb-2 flex items-center gap-2 text-base font-medium">
      {legend}
      {optional && <OptionalMark />}
    </legend>
    <FieldMessages id={id} hint={hint} error={error} />
    {children}
  </fieldset>
);
