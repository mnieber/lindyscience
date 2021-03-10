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
            this.signal.dispatch({
              topic: 'LoadUserId.Succeeded',
              details: { errors: response.errors },
            });
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
            this.signal.dispatch({ topic: 'SignIn.Succeeded' });
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
          this.signal.dispatch({ topic: 'SignUp.Succeeded' });
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
          this.signal.dispatch({ topic: 'ResetPassword.Succeeded' });
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
          this.signal.dispatch({ topic: 'ChangePassword.Succeeded' });
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
          this.signal.dispatch({ topic: 'ActivateAccount.Succeeded' });
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
          this.signal.dispatch({ topic: 'SignOut.Succeeded' });
        })
      );
  }
}
