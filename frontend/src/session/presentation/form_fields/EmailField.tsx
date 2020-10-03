import React from 'react';

import { useFormStateContext } from 'src/session/presentation/FormStateProvider';
import { FormFieldLabel } from 'src/utils/form_utils';
import { labelProps } from 'src/session/presentation/labelProps';
import { formFieldProps } from 'src/session/presentation/formFieldProps';

type PropsT = {
  fieldName: string;
  label: string;
};

export const EmailField = (props: PropsT) => {
  const formState = useFormStateContext();

  return (
    <FormFieldLabel {...labelProps(props)}>
      <input autoFocus {...formFieldProps(formState, props)} />
    </FormFieldLabel>
  );
};
