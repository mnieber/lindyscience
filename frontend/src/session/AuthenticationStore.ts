import { action, observable } from 'mobx';
import { data, operation } from 'facility';
import { Signal } from 'micro-signals';
import * as authApi from 'src/session/apis/authApi';

export class AuthenticationStore {
  @data @observable signedInUserId?: string;
  signal: Signal<any> = new Signal();

  @operation loadUserId() {
    authApi
      .loadUserId() //
      .then(
        action((response: any) => {
          if (response.errors) {
            this.signal.dispatch({
              topic: 'LoadUserId.Failed',
              details: { errors: response.errors },
            });
          } else {
            this.signedInUserId = response.userId ?? 'anonymous';
          }
        })
      );
  }

  @operation signIn(userId: string, password: string, rememberMe: boolean) {
    authApi
      .signIn(userId, password, rememberMe) //
      .then(
        action((response: any) => {
          if (response.errors) {
            this.signal.dispatch({
              topic: 'SignIn.Failed',
              details: { errors: response.errors },
            });
          } else {
            this.signedInUserId = response.userId;
            this.signal.dispatch({ topic: 'SignUp.Success' });
            // '/sign-in/'
            console.log('TODO: goSignIn ');
          }
        })
      );
  }

  @operation signUp(email: string, userId: string, password: string) {
    authApi
      .signUp(email, email, password) //
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
  }

  @operation resetPassword(email: string) {
    authApi
      .resetPassword(email) //
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
  }

  @operation changePassword(password: string, token: string) {
    authApi
      .changePassword(password, token) //
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
  }

  @operation activateAccount(token: string) {
    authApi
      .activateAccount(token) //
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
          // '/'
          console.log('TODO: goHome');
        }
      });
  }

  @operation signOut() {
    authApi
      .signOut() //
      .then(
        action((response: any) => {
          this.signedInUserId = 'anonymous';
          // '/sign-in/'
          console.log('TODO: goNext');
          this.signal.dispatch({ topic: 'SignOut.Success' });
        })
      );
  }
}
