import { Navigation } from 'src/session/facets/Navigation';
import * as authApi from 'src/session/apis/authApi';
import { getCtr } from 'facet';
import { urlParam } from 'src/utils/utils';

export { handleNavigateToMoveList } from './handleNavigateToMovelist';
export { handleNavigateToMove } from './handleNavigateToMove';
export { handleAddMoveTags } from './handleAddMoveTags';
export { handleAddMoveListTags } from './handleAddMoveListTags';

export function handleActivateAccount(token: string) {
  return authApi.activateAccount(token);
}

export function handleSignUp(
  email: string,
  username: string,
  password: string
) {
  return authApi.signUp(email, username, password);
}

export function handleSignOut() {
  return authApi.signOut();
}

export function handleSignIn(
  email: string,
  password: string,
  rememberMe: boolean
) {
  return authApi.signIn(email, password, rememberMe);
}

export function handleResetPassword(email: string) {
  return authApi.resetPassword(email);
}

export function handleLoadUserId() {
  return authApi.loadUserId();
}

export function handleChangePassword(newPassword: string, token: string) {
  return authApi.changePassword(newPassword, token);
}

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
