import { runInAction } from 'mobx';

import { AuthApiT } from 'src/session/SessionCtr';
import { Authentication } from 'src/session/facets/Authentication';
import { Navigation } from 'src/session/facets/Navigation';
import { handle } from 'src/npm/facet';

export const handleActivateAccount = (authApi: AuthApiT) => (ctr: any) => {
  const authentication = Authentication.get(ctr);
  const navigation = Navigation.get(ctr);

  handle(authentication, 'activateAccount', async (token: string) => {
    const response = await authApi.activateAccount(token);

    runInAction(() => {
      authentication.errors = response.errors;
      if (response.errors) {
        authentication.state = 'ActivateAccount.Failed';
      } else {
        authentication.state = 'ActivateAccount.Succeeded';
        navigation.history.push('/home');
      }
    });
  });
};
