// @flow

import React from 'react';

import { labelProps } from 'src/session/presentation/labelProps';
import { FormFieldLabel } from 'src/utils/form_utils';
import { formFieldProps } from 'src/session/presentation/formFieldProps';

type PropsT = {
  fieldName: string,
  label: string,
};

export const UsernameField = (props: PropsT) => {
  return (
    <FormFieldLabel {...labelProps(props)}>
      <input {...formFieldProps(props)} />
    </FormFieldLabel>
  );
};
