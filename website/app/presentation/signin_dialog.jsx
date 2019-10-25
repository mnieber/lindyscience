// @flow

import React from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
import { SignInForm } from "app/presentation/signin_form";

type SignInDialogPropsT = {
  signIn: (email: string, password: string) => any,
};

export function SignInDialog(props: SignInDialogPropsT) {
  const [isModal, setIsModel] = React.useState(true);

  const goToRegisterDiv = (
    <div className="mt-4">
      If you don't have an account yet then you can
      <Link className="ml-2" to={"/app/register/"}>
        register
      </Link>
      .
    </div>
  );

  const goToResetDiv = (
    <div className="mt-4">
      Did you
      <Link className="ml-2" to={"/app/sign-in/reset-password/"}>
        forget your password
      </Link>
      ?
    </div>
  );

  return (
    <React.Fragment>
      <div
        id="signInDialog"
        className={classnames("modalWindow", { "modalWindow--open": isModal })}
      >
        <div>
          <SignInForm signIn={props.signIn} />
          {goToResetDiv}
          {goToRegisterDiv}
        </div>
      </div>
    </React.Fragment>
  );
}
