import React from 'react';

import { useFormStateContext } from 'react-form-state-context';

export const GlobalError = () => {
  const formState = useFormStateContext();
  const globalError = formState.errors['global'];

  return globalError ? (
    <div className="formField__error">{globalError}</div>
  ) : null;
};
