// @flow

import React from "react";
import { Link } from "@reach/router";
import classnames from "classnames";
import { SignInForm } from "app/presentation/signin_form";

export function SignInDialog({
  signIn,
}: {
  signIn: (email: string, password: string) => any,
}) {
  const [isModal, setIsModel] = React.useState(true);
  function _submitValues(values) {
    const { email, password } = values;
    signIn(email, password);
  }

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
          <SignInForm onSubmit={_submitValues} values={{}} />
          {goToResetDiv}
        </div>
      </div>
    </React.Fragment>
  );
}
