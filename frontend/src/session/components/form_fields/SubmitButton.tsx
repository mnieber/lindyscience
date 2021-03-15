import React from 'react';

import { useFormStateContext } from 'react-form-state-context';

type PropsT = {
  label: string;
};

export const SubmitButton = (props: PropsT) => {
  const formState = useFormStateContext();
  const onClick = () => {
    formState.submit();
  };

  return (
    <button type="submit" className="" onClick={onClick}>
      {props.label}
    </button>
  );
};
