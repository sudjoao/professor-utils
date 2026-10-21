import type { HTMLInputTypeAttribute } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ReportFormValues } from '@/features/reports/types';

type TextFieldName = {
  [Key in keyof ReportFormValues]: ReportFormValues[Key] extends string ? Key : never;
}[keyof ReportFormValues];

export type TextField = {
  name: TextFieldName;
  label: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
};

type TextFieldsGridProps = {
  fields: TextField[];
  values: ReportFormValues;
  onChange: (changes: Partial<ReportFormValues>) => void;
};

export const TextFieldsGrid = ({ fields, values, onChange }: TextFieldsGridProps) => (
  <div className="grid gap-4 sm:grid-cols-2">
    {fields.map(({ name, label, placeholder, type = 'text' }) => (
      <div key={name} className="space-y-2">
        <Label htmlFor={`report-${name}`}>{label}</Label>
        <Input
          id={`report-${name}`}
          type={type}
          value={values[name]}
          placeholder={placeholder}
          onChange={(event) => onChange({ [name]: event.target.value })}
        />
      </div>
    ))}
  </div>
);
