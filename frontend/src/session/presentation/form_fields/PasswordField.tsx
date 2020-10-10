import React from 'react';

import { useFormStateContext } from 'react-form-state-context';
import { labelProps } from 'src/session/presentation/labelProps';
import { FormFieldLabel } from 'src/forms/components/FormFieldLabel';
import { createFormFieldProps } from 'react-form-state-context';

type PropsT = {
  fieldName: string;
  label: string;
};

export const PasswordField = (props: PropsT) => {
  const formState = useFormStateContext();
  return (
    <FormFieldLabel {...labelProps(props)}>
      <input
        className="w-16"
        placeholder="Enter your password"
        type="password"
        {...createFormFieldProps({
          formState,
          fieldName: props.fieldName,
          fieldType: 'password',
        })}
      />
    </FormFieldLabel>
  );
};
