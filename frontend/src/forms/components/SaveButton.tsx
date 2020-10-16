import React from 'react';
import classnames from 'classnames';
import { useFormStateContext } from 'react-form-state-context';

interface PropsT {
  className?: string;
}

export const SaveButton: React.FC<PropsT> = (props: PropsT) => {
  const formState = useFormStateContext();
  return (
    <button
      className={classnames(props.className ?? 'button button--wide', 'ml-2')}
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
