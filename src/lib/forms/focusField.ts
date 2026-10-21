import { fieldId } from '@/lib/forms/formErrors';

const FOCUSABLE = 'input:not([type="hidden"]), textarea, select, button';

/** Scrolls to a field and puts the cursor on it; for a group, on its first control. */
export const focusField = (field: string) => {
  const element = document.getElementById(fieldId(field));

  if (!element) {
    return;
  }

  const target = element.matches(FOCUSABLE)
    ? element
    : element.querySelector<HTMLElement>(FOCUSABLE);

  element.scrollIntoView({ block: 'center' });
  target?.focus({ preventScroll: true });
};
