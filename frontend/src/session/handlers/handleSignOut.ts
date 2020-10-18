import { sendMsg } from 'facet';
import { AuthApiT } from 'src/session/SessionCtr';
import { Authentication } from 'src/session/facets/Authentication';
import { Navigation } from 'src/session/facets/Navigation';

export const handleSignOut = (ctr: any, authApi: AuthApiT) => {
  return async () => {
    const authentication = Authentication.get(ctr);
    const navigation = Navigation.get(ctr);
    await authApi.signOut();
    authentication.signedInUserId = 'anonymous';
    navigation.history.push('/sign-in/');
    sendMsg(authentication, 'SignOut.Success');
  };
};
