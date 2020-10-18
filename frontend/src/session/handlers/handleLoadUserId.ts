import { sendMsg } from 'facet';
import { runInAction } from 'mobx';

import { AuthApiT } from 'src/session/SessionCtr';
import { Authentication } from 'src/session/facets/Authentication';

export const handleLoadUserId = (ctr: any, authApi: AuthApiT) => {
  return async () => {
    const authentication = Authentication.get(ctr);
    const response = await authApi.loadUserId();
    if (response.errors) {
      sendMsg(authentication, 'LoadUserId.Failed', { errors: response.errors });
    } else {
      runInAction(() => {
        const signedInUserId = response.userId ? response.userId : 'anonymous';
        authentication.signedInUserId = signedInUserId;
      });
    }
  };
};
