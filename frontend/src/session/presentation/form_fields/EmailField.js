// @flow

import React from 'react';

import { FormFieldLabel } from 'src/utils/form_utils';
import { labelProps } from 'src/session/presentation/labelProps';
import { formFieldProps } from 'src/session/presentation/formFieldProps';

type PropsT = {
  fieldName: string,
  label: string,
};

export const EmailField = (props: PropsT) => {
  return (
    <FormFieldLabel {...labelProps(props)}>
      <input autoFocus {...formFieldProps(props)} />
    </FormFieldLabel>
  );
};
