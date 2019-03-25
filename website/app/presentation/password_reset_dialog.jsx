// @flow

import React from "react";
import classnames from "classnames";
import { PasswordResetForm } from "app/presentation/password_reset_form";

type PasswordResetDialogPropsT = {
  isPasswordReset: ?boolean,
  resetPassword: (email: string) => any,
};

export function PasswordResetDialog(props: PasswordResetDialogPropsT) {
  const [isModal, setIsModel] = React.useState(true);
  function _submitValues(values) {
    const { email } = values;
    props.resetPassword(email);
  }

  const confirmationDiv = (
    <div>
      Your password has been reset. Please check your email for further
      instructions.
    </div>
  );

  const explanationDiv = <div>Enter your email to reset your password.</div>;

  return (
    <React.Fragment>
      <div
        id="passwordResetDialog"
        className={classnames("modalWindow", { "modalWindow--open": isModal })}
      >
        <div>
          {props.isPasswordReset && confirmationDiv}
          {!props.isPasswordReset && explanationDiv}
          {!props.isPasswordReset && (
            <PasswordResetForm onSubmit={_submitValues} values={{}} />
          )}
        </div>
      </div>
    </React.Fragment>
  );
}
