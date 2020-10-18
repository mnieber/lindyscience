import { runInAction } from 'mobx';
import { sendMsg } from 'facet';

import { AuthApiT } from 'src/session/SessionCtr';
import { Authentication } from 'src/session/facets/Authentication';

export const handleSignUp = (ctr: any, authApi: AuthApiT) => {
  return async (email: string, username: string, password: string) => {
    const authentication = Authentication.get(ctr);
    const response = await authApi.signUp(email, username, password);

    runInAction(() => {
      if (response.errors) {
        sendMsg(authentication, 'SignUp.Failed', { errors: response.errors });
      } else {
        sendMsg(authentication, 'SignUp.Success');
      }
    });
  };
};
