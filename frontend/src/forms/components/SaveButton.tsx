import React from 'react';
import { useFormStateContext } from 'react-form-state-context';

interface PropsT {}

export const SaveButton: React.FC<PropsT> = (props: PropsT) => {
  const formState = useFormStateContext();
  return (
    <button
      className="button button--wide ml-2"
      onClick={(e) => {
        e.preventDefault();
        formState.submit();
      }}
      disabled={false}
    >
      save
    </button>
  );
};
