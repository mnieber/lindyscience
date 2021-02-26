import { observable } from 'mobx';
import { data, operation, sendMsg } from 'facility';
import { host, stub } from 'aspiration';

export class Authentication_loadUserId {
  loadUserId(): Promise<any> {
    return stub();
  }
}

export class Authentication_signIn {
  userId: string = stub();
  password: string = stub();
  rememberMe: boolean = stub();
  signIn(): Promise<any> {
    return stub();
  }
  goNext() {}
}

export class Authentication_signUp {
  email: string = stub();
  userId: string = stub();
  password: string = stub();
  signUp(): Promise<any> {
    return stub();
  }
}

export class Authentication_resetPassword {
  email: string = stub();
  resetPassword(): Promise<any> {
    return stub();
  }
}

export class Authentication_changePassword {
  password: string = stub();
  token: string = stub();
  changePassword(): Promise<any> {
    return stub();
  }
}

export class Authentication_activateAccount {
  token: string = stub();
  activateAccount(): Promise<any> {
    return stub();
  }
  goNext() {}
}

export class Authentication_signOut {
  signOut(): Promise<any> {
    return stub();
  }
  goNext() {}
}

export class Authentication {
  @data @observable signedInUserId?: string;

  @operation @host loadUserId() {
    return (cbs: Authentication_loadUserId) => {
      cbs
        .loadUserId() //
        .then((response: any) => {
          if (response.errors) {
            sendMsg(this, 'LoadUserId.Failed', { errors: response.errors });
          } else {
            this.signedInUserId = response.userId ?? 'anonymous';
          }
        });
    };
  }

  @operation @host signIn(
    userId: string,
    password: string,
    rememberMe: boolean
  ) {
    return (cbs: Authentication_signIn) => {
      cbs
        .signIn() //
        .then((response: any) => {
          if (response.errors) {
            sendMsg(this, 'SignIn.Failed', { errors: response.errors });
          } else {
            this.signedInUserId = response.userId;
            sendMsg(this, 'SignUp.Success');
            cbs.goNext();
          }
        });
    };
  }

  @operation @host signUp(email: string, userId: string, password: string) {
    return (cbs: Authentication_signUp) => {
      cbs
        .signUp() //
        .then((response: any) => {
          if (response.errors) {
            sendMsg(this, 'SignUp.Failed', { errors: response.errors });
          } else {
            sendMsg(this, 'SignUp.Success');
          }
        });
    };
  }

  @operation @host resetPassword(email: string) {
    return (cbs: Authentication_resetPassword) => {
      cbs
        .resetPassword() //
        .then((response: any) => {
          if (response.errors) {
            sendMsg(this, 'ResetPassword.Failed', {
              errors: response.errors,
            });
          } else {
            sendMsg(this, 'ResetPassword.Success');
          }
        });
    };
  }

  @operation @host changePassword(password: string, token: string) {
    return (cbs: Authentication_changePassword) => {
      cbs
        .changePassword() //
        .then((response: any) => {
          if (response.errors) {
            sendMsg(this, 'ChangePassword.Failed', {
              errors: response.errors,
            });
          } else {
            sendMsg(this, 'ChangePassword.Success');
          }
        });
    };
  }

  @operation @host activateAccount(token: string) {
    return (cbs: Authentication_activateAccount) => {
      cbs
        .activateAccount() //
        .then((response: any) => {
          if (response.errors) {
            sendMsg(this, 'ActivateAccount.Failed', {
              errors: response.errors,
            });
          } else {
            sendMsg(this, 'ActivateAccount.Success');
            cbs.goNext();
          }
        });
    };
  }

  @operation @host signOut() {
    return (cbs: Authentication_signOut) => {
      cbs
        .signOut() //
        .then((response: any) => {
          this.signedInUserId = 'anonymous';
          cbs.goNext();
          sendMsg(this, 'SignOut.Success');
        });
    };
  }

  static get = (ctr: any): Authentication => ctr.authentication;
}

export function initAuthentication(self: Authentication): Authentication {
  return self;
}
