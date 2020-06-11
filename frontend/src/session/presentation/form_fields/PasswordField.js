// @flow

import React from 'react';

import { labelProps } from 'src/session/presentation/labelProps';
import { FormFieldLabel } from 'src/utils/form_utils';
import { TextField } from '@material-ui/core';
import { formFieldProps } from 'src/session/presentation/formFieldProps';

type PropsT = {
  fieldName: string,
  label: string,
};

export const PasswordField = (props: PropsT) => {
  return (
    <FormFieldLabel {...labelProps(props)}>
      <TextField type="password" {...formFieldProps(props)} />
    </FormFieldLabel>
  );
};
