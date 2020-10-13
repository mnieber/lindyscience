import React from 'react';

import {
  useFormStateContext,
  createFormFieldProps,
} from 'react-form-state-context';
import { useFormFieldContext } from 'src/forms/components/FormFieldContext';

// Generic component that shows a text input initialized with the value
// for `fieldName` in the current form state.
export const TextField: React.FC<any> = (...otherProps) => {
  const formState = useFormStateContext();
  const fieldContext = useFormFieldContext();

  return (
    <input
      type="text"
      {...createFormFieldProps({
        formState,
        fieldName: fieldContext.fieldName,
        fieldType: 'text',
      })}
      {...otherProps}
    />
  );
};
