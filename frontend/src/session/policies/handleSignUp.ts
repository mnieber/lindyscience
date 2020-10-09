import { runInAction } from 'mobx';

import { AuthApiT } from 'src/session/SessionCtr';
import { Authentication } from 'src/session/facets/Authentication';
import { handle } from 'facet';

export const handleSignUp = (authApi: AuthApiT) => (ctr: any) => {
  const authentication = Authentication.get(ctr);

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
