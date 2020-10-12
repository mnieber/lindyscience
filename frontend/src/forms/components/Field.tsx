import React from 'react';
import { FormFieldContext } from 'src/forms/components/FormFieldContext';
import { FormFieldLabel } from 'src/forms/components/FormFieldLabel';
import { FormFieldError } from 'src/forms/components/FormFieldError';

interface FieldT {
  fieldName: string;
  label: string;
}

export const Field: React.FC<FieldT> = ({ fieldName, label, children }) => {
  return (
    <FormFieldContext fieldName={fieldName} label={label}>
      <div className="flex flex-col">
        <FormFieldLabel />
        {children}
        <FormFieldError />
      </div>
    </FormFieldContext>
  );
};
