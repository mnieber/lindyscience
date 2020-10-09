import { runInAction } from 'mobx';

import { AuthApiT } from 'src/session/SessionCtr';
import { Authentication } from 'src/session/facets/Authentication';
import { handle } from 'facet';

export const handleChangePassword = (authApi: AuthApiT) => (ctr: any) => {
  const authentication = Authentication.get(ctr);

  handle(
    authentication,
    'changePassword',
    async (newPassword: string, token: string) => {
      const response = await authApi.changePassword(newPassword, token);

      runInAction(() => {
        authentication.errors = response.errors;
        if (!response.errors) {
          authentication.state = 'ChangePassword.Succeeded';
        } else {
          authentication.state = 'ChangePassword.Failed';
        }
      });
    }
  );
};
