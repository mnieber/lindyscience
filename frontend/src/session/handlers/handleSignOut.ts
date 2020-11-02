import { getCtr } from 'facet';
import { Navigation } from 'src/session/facets/Navigation';
import * as authApi from 'src/session/apis/authApi';

export const handleSignOut = async () => {
  return await authApi.signOut();
};

export function handleGoToSignIn(this: any) {
  const ctr = getCtr(this);
  const navigation = Navigation.get(ctr);
  navigation.history.push('/sign-in/');
}
