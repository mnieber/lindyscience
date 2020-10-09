import { runInAction } from 'mobx';

import { AuthApiT } from 'src/session/SessionCtr';
import { Authentication } from 'src/session/facets/Authentication';
import { handle } from 'facet';

export const handleResetPassword = (authApi: AuthApiT) => (ctr: any) => {
  const authentication = Authentication.get(ctr);

  handle(authentication, 'resetPassword', async (email: string) => {
    const response = await authApi.resetPassword(email);

    runInAction(() => {
      authentication.errors = response.errors;
      if (response.errors) {
        authentication.state = 'ResetPassword.Failed';
      } else {
        authentication.state = 'ResetPassword.Succeeded';
      }
    });
  });
};
