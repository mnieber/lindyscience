// @flow

import React from "react";
import { Link } from "@reach/router";
import classnames from "classnames";
import { SignInForm } from "app/presentation/signin_form";

type SignInDialogPropsT = {
  signIn: (email: string, password: string) => any,
};

export function SignInDialog(props: SignInDialogPropsT) {
  const [isModal, setIsModel] = React.useState(true);

  const goToResetDiv = (
    <div>
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
        </div>
      </div>
    </React.Fragment>
  );
}
