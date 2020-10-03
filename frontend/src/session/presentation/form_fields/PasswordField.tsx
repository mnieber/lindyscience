import React from 'react';

import { labelProps } from 'src/session/presentation/labelProps';
import { FormFieldLabel } from 'src/utils/form_utils';
import { formFieldProps } from 'src/session/presentation/formFieldProps';

type PropsT = {
  fieldName: string;
  label: string;
};

export const PasswordField = (props: PropsT) => {
  return (
    <FormFieldLabel {...labelProps(props)}>
      <input
        className="w-16"
        placeholder="Enter your password"
        type="password"
        {...formFieldProps(props)}
      />
    </FormFieldLabel>
  );
};
