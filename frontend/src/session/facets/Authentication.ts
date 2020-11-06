import { observable } from 'mobx';
import { data, operation, getCallbacks, sendMsg } from 'facet';

export class Authentication {
  @data @observable signedInUserId?: string;

  @operation loadUserId() {
    const cb = getCallbacks();
    cb.exec('loadUserId') //
      .then((response: any) => {
        if (response.errors) {
          sendMsg(this, 'LoadUserId.Failed', { errors: response.errors });
        } else {
          this.signedInUserId = response.userId ?? 'anonymous';
        }
      });
  }

  @operation signIn(userId: string, password: string, rememberMe: boolean) {
    const cb = getCallbacks();
    cb.exec('signIn') //
      .then((response: any) => {
        if (response.errors) {
          sendMsg(this, 'SignIn.Failed', { errors: response.errors });
        } else {
          this.signedInUserId = response.userId;
          sendMsg(this, 'SignUp.Success');
          cb.exec('goNext');
        }
      });
  }

  @operation signUp(email: string, username: string, password: string) {
    const cb = getCallbacks();
    cb.exec('signUp') //
      .then((response: any) => {
        if (response.errors) {
          sendMsg(this, 'SignUp.Failed', { errors: response.errors });
        } else {
          sendMsg(this, 'SignUp.Success');
        }
      });
  }

  @operation resetPassword(email: string) {
    const cb = getCallbacks();
    cb.exec('resetPassword') //
      .then((response: any) => {
        if (response.errors) {
          sendMsg(this, 'ResetPassword.Failed', {
            errors: response.errors,
          });
        } else {
          sendMsg(this, 'ResetPassword.Success');
        }
      });
  }

  @operation changePassword(password: string, token: string) {
    const cb = getCallbacks();
    cb.exec('changePassword') //
      .then((response: any) => {
        if (response.errors) {
          sendMsg(this, 'ChangePassword.Failed', {
            errors: response.errors,
          });
        } else {
          sendMsg(this, 'ChangePassword.Success');
        }
      });
  }

  @operation activateAccount(token: string) {
    const cb = getCallbacks();
    cb.exec('activateAccount') //
      .then((response: any) => {
        if (response.errors) {
          sendMsg(this, 'ActivateAccount.Failed', {
            errors: response.errors,
          });
        } else {
          sendMsg(this, 'ActivateAccount.Success');
          cb.exec('goNext');
        }
      });
  }

  @operation signOut() {
    const cb = getCallbacks();
    cb.exec('signOut') //
      .then((response: any) => {
        this.signedInUserId = 'anonymous';
        cb.exec('goNext');
        sendMsg(this, 'SignOut.Success');
      });
  }

  static get = (ctr: any): Authentication => ctr.authentication;
}

export function initAuthentication(self: Authentication): Authentication {
  return self;
}
