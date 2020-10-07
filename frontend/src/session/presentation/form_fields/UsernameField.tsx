import React from 'react';

import { useFormStateContext } from 'react-form-state-context';
import { labelProps } from 'src/session/presentation/labelProps';
import { FormFieldLabel } from 'src/utils/form_utils';
import { createFormFieldProps } from 'react-form-state-context';

type PropsT = {
  fieldName: string;
  label: string;
};

export const UsernameField = (props: PropsT) => {
  const formState = useFormStateContext();
  return (
    <FormFieldLabel {...labelProps(props)}>
      <input
        {...createFormFieldProps({
          formState,
          fieldName: props.fieldName,
          fieldType: 'text',
        })}
      />
    </FormFieldLabel>
  );
};
