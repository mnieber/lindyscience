import React from 'react';

import { formFieldProps } from 'src/session/presentation/formFieldProps';

type PropsT = {
  fieldName: string;
};

export const ControlledCheckbox = (props: PropsT) => {
  return (
    <input className="text-primary" {...formFieldProps(props, 'checkbox')} />
  );
};
