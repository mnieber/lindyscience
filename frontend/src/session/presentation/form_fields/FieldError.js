// @flow

import { FormHelperText } from '@material-ui/core';
import React from 'react';

import { useFormStateContext } from 'src/session/presentation/FormStateProvider';

type PropsT = {
  fieldName: string,
};

export const FieldError = (props: PropsT) => {
  const formState = useFormStateContext();
  const error = formState.errors[props.fieldName];
  return error ? (
    <FormHelperText>{formState.errors[props.fieldName]}</FormHelperText>
  ) : null;
};
