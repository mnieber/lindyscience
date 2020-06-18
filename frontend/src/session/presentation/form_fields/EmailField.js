// @flow

import React from 'react';

import { formFieldProps } from 'src/session/presentation/formFieldProps';

type PropsT = {
  fieldName: string,
  label: string,
};

export const EmailField = (props: PropsT) => {
  return (
    <FormFieldLabel label={props.label}>
      <input autoFocus {...formFieldProps(props)} />
    </FormFieldLabel>
  );
};
