// @flow

// $FlowFixMe
import { runInAction } from 'mobx';

import type { AuthApiT } from 'src/session/SessionCtr';
import { Authentication } from 'src/session/facets/Authentication';
import { handle } from 'src/npm/facet';

export const handleLoadUserId = (authApi: AuthApiT) => (ctr: any) => {
  const authentication = Authentication.get(ctr);

  handle(authentication, 'loadUserId', async () => {
    const response = await authApi.loadUserId();
    if (response.error) {
    } else {
      runInAction(() => {
        const signedInUserId = response.userId ? response.userId : 'anonymous';
        authentication.signedInUserId = signedInUserId;
      });
    }
  });
};
