// @flow

import { TextField } from '@material-ui/core';
import React from 'react';

import { formStateProps } from 'src/session/presentation/formStateProps';

type PropsT = {
  fieldName: string,
  label: string,
};

export const EmailField = (props: PropsT) => {
  return (
    <TextField
      autoComplete="email"
      autoFocus
      fullWidth
      label={props.label}
      margin="normal"
      required
      variant="outlined"
      {...formStateProps(props)}
    />
  );
};
