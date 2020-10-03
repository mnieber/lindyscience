import React from 'react';

import { useFormStateContext } from 'src/session/presentation/FormStateProvider';

type PropsT = {
  onClick: Function;
  label: string;
};

export const SubmitButton = (props: PropsT) => {
  const formState = useFormStateContext();
  const onClick = () => {
    props.onClick(formState);
  };

  return (
    <button type="submit" className="" onClick={onClick}>
      {props.label}
    </button>
  );
};
