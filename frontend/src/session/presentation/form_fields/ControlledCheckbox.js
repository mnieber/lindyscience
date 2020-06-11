// @flow

import { Checkbox } from '@material-ui/core';
import React from 'react';

import { formStateProps } from 'src/session/presentation/formStateProps';

type PropsT = {
  fieldName: string,
};

export const ControlledCheckbox = (props: PropsT) => {
  return <Checkbox color="primary" {...formStateProps(props, 'checkbox')} />;
};
