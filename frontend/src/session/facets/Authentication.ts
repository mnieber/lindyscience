import Cookies from 'js-cookie';
import { observable, runInAction } from 'mobx';

import { data, operation } from 'facet';

export type AuthenticationStateT =
  | ''
  | 'SignUp.Failed'
  | 'SignUp.Succeeded'
  | 'ResetPassword.Succeeded'
  | 'ResetPassword.Failed'
  | 'ChangePassword.Succeeded'
  | 'ChangePassword.Failed'
  | 'ActivateAccount.Succeeded'
  | 'ActivateAccount.Failed';

export class Authentication {
  @data @observable signedInUserId?: string;
  @data @observable acceptsCookies: boolean = false;
  @data @observable errors?: Array<string>;
  @data @observable state?: AuthenticationStateT;

  @operation loadUserId() {}
  @operation signIn(userId: string, password: string, rememberMe: boolean) {}
  @operation signUp(email: string, username: string, password: string) {}
  @operation resetPassword(email: string) {}
  @operation changePassword(password: string, token: string) {}
  @operation activateAccount(token: string) {}
  @operation signOut() {}
  @operation acceptCookies() {}

  static get = (ctr: any): Authentication => ctr.authentication;
}

function _handleAcceptCookies(self: Authentication) {
  Cookies.set('acceptCookies', '1');
  runInAction('acceptCookies', () => {
    self.acceptsCookies = true;
  });
}

export function initAuthentication(self: Authentication): Authentication {
  _handleAcceptCookies(self);
  runInAction('initAuthentication', () => {
    self.acceptsCookies = Cookies.get('acceptCookies') === '1';
  });
  return self;
}
