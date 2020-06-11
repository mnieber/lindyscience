// @flow

import React from 'react';

import { useFormStateContext } from 'src/session/presentation/FormStateProvider';

export const GlobalError = () => {
  const formState = useFormStateContext();
  const globalError = formState.errors['global'];

  return globalError ? (
    <div className="formField__error">{globalError}</div>
  ) : null;
};
