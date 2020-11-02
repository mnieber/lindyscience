import * as authApi from 'src/session/apis/authApi';
import { Navigation } from 'src/session/facets/Navigation';
import { urlParam } from 'src/utils/utils';
import { getCtr } from 'facet';

export const handleSignIn = async (
  email: string,
  password: string,
  rememberMe: boolean
) => {
  return await authApi.signIn(email, password, rememberMe);
};

export function handleGoNext(this: any) {
  const ctr = getCtr(this);
  const navigation = Navigation.get(ctr);
  const next = urlParam('next');
  navigation.history.push(next ? next : '/');
}
