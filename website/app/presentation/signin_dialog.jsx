// @flow

import React from "react";
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

  return (
    <React.Fragment>
      <div
        id="signInDialog"
        className={classnames("modalWindow", { "modalWindow--open": isModal })}
      >
        <div>
          <SignInForm onSubmit={_submitValues} values={{}} />
        </div>
      </div>
    </React.Fragment>
  );
}
