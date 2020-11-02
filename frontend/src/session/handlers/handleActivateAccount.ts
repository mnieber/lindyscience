import { Navigation } from 'src/session/facets/Navigation';
import * as authApi from 'src/session/apis/authApi';
import { getCtr } from 'facet';

export const handleActivateAccount = async (token: string) => {
  return await authApi.activateAccount(token);
};

export function handleGoHome(this: any) {
  const ctr = getCtr(this);
  const navigation = Navigation.get(ctr);
  navigation.history.push('/');
}
