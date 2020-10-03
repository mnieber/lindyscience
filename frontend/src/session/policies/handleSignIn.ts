// $FlowFixMe
import { runInAction } from 'mobx';

import { AuthApiT } from 'src/session/SessionCtr';
import { Authentication } from 'src/session/facets/Authentication';
import { Navigation } from 'src/session/facets/Navigation';
import { urlParam } from 'src/utils/utils';
import { handle } from 'src/npm/facet';

export const handleSignIn = (authApi: AuthApiT) => (ctr: any) => {
  const authentication = Authentication.get(ctr);
  const navigation = Navigation.get(ctr);

  handle(
    authentication,
    'signIn',
    async (email: string, password: string, rememberMe: boolean) => {
      const response = await authApi.signIn(email, password, rememberMe);

      runInAction(() => {
        authentication.errors = response.errors;
        if (!response.errors) {
          authentication.signedInUserId = response.userId;
          const next = urlParam('next');
          navigation.history.push(next ? next : '/home');
        }
      });
    }
  );
};
