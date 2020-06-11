// @flow

import React from 'react';
import TextField from '@material-ui/core/TextField';

import { formStateProps } from 'src/session/presentation/formStateProps';

type PropsT = {
  fieldName: string,
  label: string,
};

export const UsernameField = (props: PropsT) => {
  return (
    <TextField
      autoComplete="username"
      fullWidth
      label={props.label}
      margin="normal"
      required
      variant="outlined"
      {...formStateProps(props)}
    />
  );
};
