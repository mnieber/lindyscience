import { runInAction } from 'mobx';

import { AuthApiT } from 'src/session/SessionCtr';
import { Authentication } from 'src/session/facets/Authentication';
import { Navigation } from 'src/session/facets/Navigation';
import { sendMsg } from 'facet';

export const handleActivateAccount = (ctr: any, authApi: AuthApiT) => {
  return async (token: string) => {
    const authentication = Authentication.get(ctr);
    const navigation = Navigation.get(ctr);
    const response = await authApi.activateAccount(token);

    runInAction(() => {
      if (response.errors) {
        sendMsg(authentication, 'ActivateAccount.Failed', {
          errors: response.errors,
        });
      } else {
        navigation.history.push('/');
        sendMsg(authentication, 'ActivateAccount.Success');
      }
    });
  };
};
