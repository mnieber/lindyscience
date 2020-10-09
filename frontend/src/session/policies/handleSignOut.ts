import { AuthApiT } from 'src/session/SessionCtr';
import { Authentication } from 'src/session/facets/Authentication';
import { Navigation } from 'src/session/facets/Navigation';
import { handle } from 'facet';

export const handleSignOut = (authApi: AuthApiT) => (ctr: any) => {
  const authentication = Authentication.get(ctr);
  const navigation = Navigation.get(ctr);

  handle(authentication, 'signOut', async () => {
    await authApi.signOut();
    authentication.signedInUserId = 'anonymous';
    navigation.history.push('/sign-in/');
  });
};
