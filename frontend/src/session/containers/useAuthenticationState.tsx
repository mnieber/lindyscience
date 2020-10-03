import { Authentication } from 'src/session/facets/Authentication';
import React from 'react';
// $FlowFixMe
import { runInAction } from 'mobx';
import * as R from 'rambda';

export const useAuthenticationState = (authentication: Authentication) => {
  React.useEffect(() => {
    runInAction(() => {
      authentication.state = '';
      authentication.errors = [];
    });
  }, []);

  return {
    errors: authentication.errors || [],
    state: authentication.state,
    hasErrors: !R.isEmpty(authentication.errors || []),
  };
};
