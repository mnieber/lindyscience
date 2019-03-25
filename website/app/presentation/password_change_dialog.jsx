// @flow

import React from "react";
import { Link } from "@reach/router";
import classnames from "classnames";
import { PasswordChangeForm } from "app/presentation/password_change_form";

type PasswordChangeDialogPropsT = {
  isPasswordChanged: ?boolean,
  changePassword: (email: string) => any,
};

export function PasswordChangeDialog(props: PasswordChangeDialogPropsT) {
  const [isModal, setIsModel] = React.useState(true);
  function _submitValues(values) {
    const { password } = values;
    props.changePassword(password);
  }

  const explanationDiv = <div>Please enter your new password.</div>;
  const confirmationDiv = (
    <div>
      Your password has been changed. You can now
      <Link className="ml-2" to={"/app/sign-in/"}>
        sign in
      </Link>
    </div>
  );
  const failedDiv = (
    <div>
      Oops, there was a problem with resetting your password. Please try
      <Link className="ml-2" to={"/app/reset-password/"}>
        resetting it again
      </Link>
      .
    </div>
  );

  return (
    <React.Fragment>
      <div
        id="passwordChangeDialog"
        className={classnames("modalWindow", { "modalWindow--open": isModal })}
      >
        <div>
          {props.isPasswordChanged == null && explanationDiv}
          {props.isPasswordChanged == false && failedDiv}
          {props.isPasswordChanged == true && confirmationDiv}
          {props.isPasswordChanged == null && (
            <PasswordChangeForm onSubmit={_submitValues} values={{}} />
          )}
        </div>
      </div>
    </React.Fragment>
  );
}
