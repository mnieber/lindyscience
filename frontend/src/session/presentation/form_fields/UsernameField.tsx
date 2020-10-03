import React from 'react';

import { useFormStateContext } from 'src/session/presentation/FormStateProvider';
import { labelProps } from 'src/session/presentation/labelProps';
import { FormFieldLabel } from 'src/utils/form_utils';
import { formFieldProps } from 'src/session/presentation/formFieldProps';

type PropsT = {
  fieldName: string;
  label: string;
};

export const UsernameField = (props: PropsT) => {
  const formState = useFormStateContext();
  return (
    <FormFieldLabel {...labelProps(props)}>
      <input {...formFieldProps(formState, props)} />
    </FormFieldLabel>
  );
};
