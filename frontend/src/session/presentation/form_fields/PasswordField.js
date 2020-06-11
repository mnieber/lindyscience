// @flow

import { TextField } from '@material-ui/core';
import React from 'react';

import { formStateProps } from 'src/session/presentation/formStateProps';

type PropsT = {
  fieldName: string,
  label: string,
};

export const PasswordField = (props: PropsT) => {
  return (
    <TextField
      autoComplete="current-password"
      fullWidth
      label={props.label}
      margin="normal"
      required
      type="password"
      variant="outlined"
      {...formStateProps(props)}
    />
  );
};
