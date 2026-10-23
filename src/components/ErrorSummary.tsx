import { useEffect, useRef } from 'react';

import { focusField } from '@/lib/forms/focusField';
import { fieldId, type FormError } from '@/lib/forms/formErrors';

type ErrorSummaryProps = {
  errors: FormError[];
  /** Grows on every blocked attempt: the summary then takes the focus. */
  failedAttempts: number;
  title?: string;
};

/** What is still missing, each item a link to its field. Shown after a blocked attempt. */
export const ErrorSummary = ({
  errors,
  failedAttempts,
  title = 'Antes de baixar, falta arrumar:',
}: ErrorSummaryProps) => {
  const summaryRef = useRef<HTMLDivElement>(null);

  // A blocked download (or print) brings the teacher to the list of what is missing.
  useEffect(() => {
    if (failedAttempts > 0) {
      summaryRef.current?.focus();
    }
  }, [failedAttempts]);

  if (errors.length === 0) {
    return null;
  }

  return (
    <div
      ref={summaryRef}
      tabIndex={-1}
      role="alert"
      className="space-y-2 rounded-xl border-2 border-destructive p-4"
    >
      <p className="font-semibold text-destructive">{title}</p>
      <ul className="list-inside list-disc space-y-1">
        {errors.map(({ field, message }) => (
          <li key={`${field}-${message}`}>
            {field ? (
              <a
                href={`#${fieldId(field)}`}
                className="underline underline-offset-4"
                onClick={(event) => {
                  event.preventDefault();
                  focusField(field);
                }}
              >
                {message}
              </a>
            ) : (
              message
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
