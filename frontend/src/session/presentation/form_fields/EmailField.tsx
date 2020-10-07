import React from 'react';

import { useFormStateContext } from 'react-form-state-context';
import { FormFieldLabel } from 'src/utils/form_utils';
import { labelProps } from 'src/session/presentation/labelProps';
import { createFormFieldProps } from 'react-form-state-context';

type PropsT = {
  fieldName: string;
  label: string;
};

export const EmailField = (props: PropsT) => {
  const formState = useFormStateContext();

  return (
    <FormFieldLabel {...labelProps(props)}>
      <input
        autoFocus
        {...createFormFieldProps({
          formState,
          fieldName: props.fieldName,
          fieldType: 'text',
        })}
      />
    </FormFieldLabel>
  );
};
