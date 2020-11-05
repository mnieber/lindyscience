import { observable } from 'mobx';
import { data, operation, exec, sendMsg } from 'facet';

export class Authentication {
  @data @observable signedInUserId?: string;

  @operation loadUserId() {
    exec('loadUserId') //
      .then((response: any) => {
        if (response.errors) {
          sendMsg(this, 'LoadUserId.Failed', { errors: response.errors });
        } else {
          this.signedInUserId = response.userId ?? 'anonymous';
        }
      });
  }

  @operation signIn(userId: string, password: string, rememberMe: boolean) {
    exec('signIn') //
      .then((response: any) => {
        if (response.errors) {
          sendMsg(this, 'SignIn.Failed', { errors: response.errors });
        } else {
          this.signedInUserId = response.userId;
          sendMsg(this, 'SignUp.Success');
          exec('goNext');
        }
      });
  }

  @operation signUp(email: string, username: string, password: string) {
    exec('signUp') //
      .then((response: any) => {
        if (response.errors) {
          sendMsg(this, 'SignUp.Failed', { errors: response.errors });
        } else {
          sendMsg(this, 'SignUp.Success');
        }
      });
  }

  @operation resetPassword(email: string) {
    exec('resetPassword') //
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
    exec('changePassword') //
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
    exec('activateAccount') //
      .then((response: any) => {
        if (response.errors) {
          sendMsg(this, 'ActivateAccount.Failed', {
            errors: response.errors,
          });
        } else {
          sendMsg(this, 'ActivateAccount.Success');
          exec('goNext');
        }
      });
  }

  @operation signOut() {
    exec('signOut') //
      .then((response: any) => {
        this.signedInUserId = 'anonymous';
        exec('goNext');
        sendMsg(this, 'SignOut.Success');
      });
  }

  static get = (ctr: any): Authentication => ctr.authentication;
}

export function initAuthentication(self: Authentication): Authentication {
  return self;
}
