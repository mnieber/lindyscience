// @flow

import React from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import { SignInForm } from 'src/app/presentation/signin_form';

type PropsT = {
  signIn: (email: string, password: string) => any,
};

export const SignInDialog: (PropsT) => any = (props: PropsT) => {
  const goToRegisterDiv = (
    <div className="mt-4">
      If you don't have an account yet then you can
      <Link className="ml-2" to={'/app/register/'}>
        register
      </Link>
      .
    </div>
  );

  const goToResetDiv = (
    <div className="mt-4">
      Did you
      <Link className="ml-2" to={'/app/sign-in/reset-password/'}>
        forget your password
      </Link>
      ?
    </div>
  );

  return (
    <React.Fragment>
      <div id="signInDialog" className={classnames('bullsEyeWindow')}>
        <div>
          <SignInForm signIn={props.signIn} />
          {goToResetDiv}
          {goToRegisterDiv}
        </div>
      </div>
    </React.Fragment>
  );
};
