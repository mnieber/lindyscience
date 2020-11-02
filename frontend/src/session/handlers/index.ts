import { Navigation } from 'src/session/facets/Navigation';
import * as authApi from 'src/session/apis/authApi';
import { getCtr } from 'facet';
import { urlParam } from 'src/utils/utils';

export { handleNavigateToMoveList } from './handleNavigateToMovelist';

export const handleActivateAccount = async (token: string) => {
  return await authApi.activateAccount(token);
};

export const handleSignUp = async (
  email: string,
  username: string,
  password: string
) => {
  return await authApi.signUp(email, username, password);
};

export const handleSignOut = async () => {
  return await authApi.signOut();
};

export const handleSignIn = async (
  email: string,
  password: string,
  rememberMe: boolean
) => {
  return await authApi.signIn(email, password, rememberMe);
};

export const handleResetPassword = async (email: string) => {
  return await authApi.resetPassword(email);
};

export const handleLoadUserId = async () => {
  return await authApi.loadUserId();
};

export const handleChangePassword = (newPassword: string, token: string) => {
  return authApi.changePassword(newPassword, token);
};

export function handleGoHome(this: any) {
  const ctr = getCtr(this);
  const navigation = Navigation.get(ctr);
  navigation.history.push('/');
}

export function handleGoNext(this: any) {
  const ctr = getCtr(this);
  const navigation = Navigation.get(ctr);
  const next = urlParam('next');
  navigation.history.push(next ? next : '/');
}

export function handleGoToSignIn(this: any) {
  const ctr = getCtr(this);
  const navigation = Navigation.get(ctr);
  navigation.history.push('/sign-in/');
}
