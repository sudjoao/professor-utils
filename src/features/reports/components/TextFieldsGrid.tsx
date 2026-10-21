import type { HTMLInputTypeAttribute } from 'react';

import { FormField } from '@/components/FormField';
import { Input } from '@/components/ui/input';
import type { ReportFormValues } from '@/features/reports/types';
import { fieldId, type FormError, getFieldError } from '@/lib/forms/formErrors';

type TextFieldName = {
  [Key in keyof ReportFormValues]: ReportFormValues[Key] extends string ? Key : never;
}[keyof ReportFormValues];

export type TextField = {
  name: TextFieldName;
  label: string;
  placeholder?: string;
  hint?: string;
  optional?: boolean;
  type?: HTMLInputTypeAttribute;
};

type TextFieldsGridProps = {
  fields: TextField[];
  values: ReportFormValues;
  errors: FormError[];
  onChange: (changes: Partial<ReportFormValues>) => void;
};

export const TextFieldsGrid = ({ fields, values, errors, onChange }: TextFieldsGridProps) => (
  <div className="grid gap-x-4 gap-y-6 sm:grid-cols-2">
    {fields.map(({ name, label, placeholder, hint, optional, type = 'text' }) => (
      <FormField
        key={name}
        id={fieldId(name)}
        label={label}
        hint={hint}
        optional={optional}
        error={getFieldError(errors, name)}
      >
        {(control) => (
          <Input
            {...control}
            type={type}
            className="h-10 text-base md:text-base"
            value={values[name]}
            placeholder={placeholder}
            onChange={(event) => onChange({ [name]: event.target.value })}
          />
        )}
      </FormField>
    ))}
  </div>
);
