import { observable } from 'mobx';
import { data, operation, exec, sendMsg } from 'facet';

export class Authentication {
  @data @observable signedInUserId?: string;

  @operation loadUserId() {
    const response = exec('loadUserId');
    if (response.errors) {
      sendMsg(this, 'LoadUserId.Failed', { errors: response.errors });
    } else {
      this.signedInUserId = response.userId ? response.userId : 'anonymous';
    }
  }

  @operation signIn(userId: string, password: string, rememberMe: boolean) {
    const response = exec('signIn');
    if (response.errors) {
      sendMsg(this, 'SignIn.Failed', { errors: response.errors });
    } else {
      this.signedInUserId = response.userId;
      sendMsg(this, 'SignUp.Success');
      exec('goNext');
    }
  }

  @operation signUp(email: string, username: string, password: string) {
    const response = exec('signUp');
    if (response.errors) {
      sendMsg(this, 'SignUp.Failed', { errors: response.errors });
    } else {
      sendMsg(this, 'SignUp.Success');
    }
  }

  @operation resetPassword(email: string) {
    const response = exec('resetPassword');
    if (response.errors) {
      sendMsg(this, 'ResetPassword.Failed', {
        errors: response.errors,
      });
    } else {
      sendMsg(this, 'ResetPassword.Success');
    }
  }

  @operation changePassword(password: string, token: string) {
    const response = exec('changePassword');
    if (response.errors) {
      sendMsg(this, 'ChangePassword.Failed', {
        errors: response.errors,
      });
    } else {
      sendMsg(this, 'ChangePassword.Success');
    }
  }

  @operation activateAccount(token: string) {
    const response = exec('activateAccount');
    if (response.errors) {
      sendMsg(this, 'ActivateAccount.Failed', {
        errors: response.errors,
      });
    } else {
      sendMsg(this, 'ActivateAccount.Success');
      exec('goNext');
    }
  }

  @operation signOut() {
    exec('signOut');
    this.signedInUserId = 'anonymous';
    exec('goNext');
    sendMsg(this, 'SignOut.Success');
  }

  static get = (ctr: any): Authentication => ctr.authentication;
}

export function initAuthentication(self: Authentication): Authentication {
  return self;
}
