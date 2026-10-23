import { useState } from 'react';

import type { FormError } from '@/lib/forms/formErrors';

/**
 * Errors only show up after the first attempt, so the form does not start all red;
 * every blocked attempt counts, so the page can bring the teacher to the errors again.
 */
export const useValidation = (errors: FormError[]) => {
  const [hasTried, setHasTried] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);

  /** `true` when there is nothing to fix. */
  const validate = (): boolean => {
    setHasTried(true);
    if (errors.length > 0) {
      setFailedAttempts((count) => count + 1);
      return false;
    }
    return true;
  };

  return { visibleErrors: hasTried ? errors : [], failedAttempts, validate };
};
