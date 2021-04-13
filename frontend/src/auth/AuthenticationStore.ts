import { makeObservable, action, observable } from 'mobx';
import { Signal } from 'micro-signals';
import * as authApi from 'src/auth/apis/authApi';

export class AuthenticationStore {
  @observable signedInUserId?: string;
  signal: Signal<any> = new Signal();

  constructor() {
    makeObservable(this);
  }

  loadUserId() {
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

  signIn(userId: string, password: string, rememberMe: boolean) {
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

  signUp(email: string, userId: string, password: string) {
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

  resetPassword(email: string) {
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

  changePassword(password: string, token: string) {
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

  activateAccount(token: string) {
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

  signOut() {
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
