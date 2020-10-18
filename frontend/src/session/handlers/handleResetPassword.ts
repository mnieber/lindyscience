import { runInAction } from 'mobx';

import { AuthApiT } from 'src/session/SessionCtr';
import { Authentication } from 'src/session/facets/Authentication';
import { sendMsg } from 'facet';

export const handleResetPassword = (ctr: any, authApi: AuthApiT) => {
  return async (email: string) => {
    const authentication = Authentication.get(ctr);
    const response = await authApi.resetPassword(email);

    runInAction(() => {
      if (response.errors) {
        sendMsg(authentication, 'ResetPassword.Failed', {
          errors: response.errors,
        });
      } else {
        sendMsg(authentication, 'ResetPassword.Success');
      }
    });
  };
};
