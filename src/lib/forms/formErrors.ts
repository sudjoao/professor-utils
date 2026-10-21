/** A message for the teacher. `field` names the form value it is about, so the page can point to it. */
export type FormError = {
  field?: string;
  message: string;
};

/** DOM id of the control (or group of controls) that edits `field`. */
export const fieldId = (field: string): string => `field-${field}`;

export const getFieldError = (errors: FormError[], field: string): string | undefined =>
  errors.find((error) => error.field === field)?.message;
