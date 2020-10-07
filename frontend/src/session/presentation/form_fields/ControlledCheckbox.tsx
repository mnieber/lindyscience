import React from 'react';

import {
  createFormFieldProps,
  useFormStateContext,
} from 'react-form-state-context';

type PropsT = {
  fieldName: string;
};

export const ControlledCheckbox = (props: PropsT) => {
  const formState = useFormStateContext();

  return (
    <input
      className="text-primary"
      {...createFormFieldProps({
        formState,
        fieldName: props.fieldName,
        fieldType: 'checkbox',
      })}
    />
  );
};
