import React from 'react';

import { useFormStateContext } from 'src/session/presentation/FormStateProvider';
import { labelProps } from 'src/session/presentation/labelProps';
import { FormFieldLabel } from 'src/utils/form_utils';
import { formFieldProps } from 'src/session/presentation/formFieldProps';

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
        {...formFieldProps(formState, props)}
      />
    </FormFieldLabel>
  );
};
