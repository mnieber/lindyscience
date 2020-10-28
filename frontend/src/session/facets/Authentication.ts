import { observable } from 'mobx';
import { installHandlers } from 'facet-mobx';
import { data, operation } from 'facet';

export class Authentication {
  @data @observable signedInUserId?: string;

  @operation loadUserId() {}
  @operation signIn(userId: string, password: string, rememberMe: boolean) {}
  @operation signUp(email: string, username: string, password: string) {}
  @operation resetPassword(email: string) {}
  @operation changePassword(password: string, token: string) {}
  @operation activateAccount(token: string) {}
  @operation signOut() {}

  static get = (ctr: any): Authentication => ctr.authentication;
}

interface PropsT {
  signIn: Authentication['signIn'];
  signOut: Authentication['signOut'];
  signUp: Authentication['signUp'];
  loadUserId: Authentication['loadUserId'];
  resetPassword: Authentication['resetPassword'];
  changePassword: Authentication['changePassword'];
  activateAccount: Authentication['activateAccount'];
}

export function initAuthentication(
  self: Authentication,
  props: PropsT
): Authentication {
  installHandlers(
    {
      signIn: props.signIn,
      signOut: props.signOut,
      signUp: props.signUp,
      loadUserId: props.loadUserId,
      resetPassword: props.resetPassword,
      changePassword: props.changePassword,
      activateAccount: props.activateAccount,
    },
    self
  );

  return self;
}
