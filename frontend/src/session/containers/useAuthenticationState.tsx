import { Authentication } from 'src/session/facets/Authentication';
import React from 'react';
import { runInAction } from 'mobx';
import * as _ from 'lodash/fp';

export const useAuthenticationState = (authentication: Authentication) => {
  React.useEffect(() => {
    runInAction(() => {
      authentication.state = '';
      authentication.errors = [];
    });
  }, [authentication]);

  return {
    errors: authentication.errors || [],
    state: authentication.state,
    hasErrors: !_.isEmpty(authentication.errors || []),
  };
};
