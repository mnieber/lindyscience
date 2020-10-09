import React from 'react';

import {
  useFormStateContext,
  createFormFieldProps,
} from 'react-form-state-context';

// Generic component that shows a text input initialized with the value
// for `fieldName` in the current form state.
export const TextField: React.FC<any> = (
  { fieldName }: { fieldName: string },
  ...otherProps
) => {
  const formState = useFormStateContext();

  return (
    <input
      type="text"
      {...createFormFieldProps({ formState, fieldName, fieldType: 'text' })}
      {...otherProps}
    />
  );
};
