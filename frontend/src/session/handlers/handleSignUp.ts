import { runInAction } from 'mobx';

import { AuthApiT } from 'src/session/SessionCtr';
import { Authentication } from 'src/session/facets/Authentication';

export const handleSignUp = (ctr: any, authApi: AuthApiT) => {
  return async (email: string, username: string, password: string) => {
    const authentication = Authentication.get(ctr);
    const response = await authApi.signUp(email, username, password);

    runInAction(() => {
      authentication.errors = response.errors;
      if (response.errors) {
        authentication.state = 'SignUp.Failed';
      } else {
        authentication.state = 'SignUp.Succeeded';
      }
    });
  };
};
