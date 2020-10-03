// @flow

// $FlowFixMe
import { runInAction } from 'mobx';

import type { AuthApiT } from 'src/session/SessionCtr';
import { Authentication } from 'src/session/facets/Authentication';
import { Navigation } from 'src/session/facets/Navigation';
import { handle } from 'src/npm/facet';

export const handleSignUp = (authApi: AuthApiT) => (ctr: any) => {
  const authentication = Authentication.get(ctr);
  const navigation = Navigation.get(ctr);

  handle(
    authentication,
    'signUp',
    async (email: string, username: string, password: string) => {
      const response = await authApi.signUp(email, username, password);

      runInAction(() => {
        authentication.errors = response.errors;
        if (response.errors) {
          authentication.state = 'SignUp.Failed';
        } else {
          authentication.state = 'SignUp.Succeeded';
        }
      });
    }
  );
};