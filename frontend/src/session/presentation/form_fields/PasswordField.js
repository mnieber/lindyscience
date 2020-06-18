// @flow

import React from 'react';

import { FormFieldLabel } from 'src/utils/form_utils';
import { TextField } from '@material-ui/core';
import { formFieldProps } from 'src/session/presentation/formFieldProps';

type PropsT = {
  fieldName: string,
  label: string,
};

export const PasswordField = (props: PropsT) => {
  return (
    <FormFieldLabel label={props.label}>
      <TextField type="password" {...formFieldProps(props)} />
    </FormFieldLabel>
  );
};
