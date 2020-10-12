import React from 'react';

import { useFormStateContext } from 'react-form-state-context';
import { createFormFieldProps } from 'react-form-state-context';
import { useFormFieldContext } from 'src/forms/components/FormFieldContext';

type PropsT = {};

export const PasswordField = (props: PropsT) => {
  const formState = useFormStateContext();
  const fieldContext = useFormFieldContext();

  return (
    <input
      placeholder="Enter your password"
      type="password"
      {...createFormFieldProps({
        formState,
        fieldName: fieldContext.fieldName,
        fieldType: 'password',
      })}
    />
  );
};
