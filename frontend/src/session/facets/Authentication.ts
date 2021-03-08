import { observable } from 'mobx';
import { data, operation } from 'facility';
import { host, stub } from 'aspiration';
import { Signal } from 'micro-signals';

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
  signal: Signal<any> = new Signal();

  @operation @host loadUserId() {
    return (cbs: Authentication_loadUserId) => {
      cbs
        .loadUserId() //
        .then((response: any) => {
          if (response.errors) {
            this.signal.dispatch({
              topic: 'LoadUserId.Failed',
              details: { errors: response.errors },
            });
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
            this.signal.dispatch({
              topic: 'SignIn.Failed',
              details: { errors: response.errors },
            });
          } else {
            this.signedInUserId = response.userId;
            this.signal.dispatch({ topic: 'SignUp.Success' });
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
            this.signal.dispatch({
              topic: 'SignUp.Failed',
              details: { errors: response.errors },
            });
          } else {
            this.signal.dispatch({ topic: 'SignUp.Success' });
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
            this.signal.dispatch({
              topic: 'ResetPassword.Failed',
              details: {
                errors: response.errors,
              },
            });
          } else {
            this.signal.dispatch({ topic: 'ResetPassword.Success' });
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
            this.signal.dispatch({
              topic: 'ChangePassword.Failed',
              details: {
                errors: response.errors,
              },
            });
          } else {
            this.signal.dispatch({ topic: 'ChangePassword.Success' });
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
            this.signal.dispatch({
              topic: 'ActivateAccount.Failed',
              details: {
                errors: response.errors,
              },
            });
          } else {
            this.signal.dispatch({ topic: 'ActivateAccount.Success' });
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
          this.signal.dispatch({ topic: 'SignOut.Success' });
        });
    };
  }

  static get = (ctr: any): Authentication => ctr.authentication;
}

export function initAuthentication(self: Authentication): Authentication {
  return self;
}
