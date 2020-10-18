import { runInAction } from 'mobx';
import { sendMsg } from 'facet';

import { AuthApiT } from 'src/session/SessionCtr';
import { Authentication } from 'src/session/facets/Authentication';
import { Navigation } from 'src/session/facets/Navigation';
import { urlParam } from 'src/utils/utils';

export const handleSignIn = (ctr: any, authApi: AuthApiT) => {
  const authentication = Authentication.get(ctr);
  const navigation = Navigation.get(ctr);

  return async (email: string, password: string, rememberMe: boolean) => {
    const response = await authApi.signIn(email, password, rememberMe);

    runInAction(() => {
      if (response.errors) {
        sendMsg(authentication, 'SignIn.Failed', { errors: response.errors });
      } else {
        authentication.signedInUserId = response.userId;
        const next = urlParam('next');
        navigation.history.push(next ? next : '/');
        sendMsg(authentication, 'SignUp.Success');
      }
    });
  };
};
