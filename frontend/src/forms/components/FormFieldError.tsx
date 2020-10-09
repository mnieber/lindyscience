import classNames from 'classnames';
import React from 'react';

import { useFormStateContext } from 'react-form-state-context';

interface IProps {
  fieldName: string;
  extraClass?: string;
  extraClassOnError?: string;
}

// Generic component that shows the error in fieldName for the current
// form state.
export const FormFieldError: React.FC<IProps> = ({
  fieldName,
  extraClass,
  extraClassOnError,
}) => {
  const formState = useFormStateContext();
  const error = formState.getError(fieldName);

  return (
    <p
      className={classNames(
        'text-sm text-error',
        extraClass,
        extraClassOnError
          ? {
              extraClassOnError: !!error,
            }
          : {}
      )}
    >
      {error}
    </p>
  );
};
