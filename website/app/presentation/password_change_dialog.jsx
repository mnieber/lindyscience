// @flow

import React from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
import { PasswordChangeForm } from "app/presentation/password_change_form";

type PasswordChangeDialogPropsT = {
  changePassword: (password: string) => any,
};

export function PasswordChangeDialog(props: PasswordChangeDialogPropsT) {
  const [isModal, setIsModal] = React.useState(true);
  const [isPasswordChanged, setIsPasswordChanged] = React.useState(false);

  const explanationDiv = <div>Please enter your new password.</div>;
  const confirmationDiv = (
    <div>
      Your password has been changed. You can now
      <Link className="ml-2" to={"/app/sign-in/"}>
        sign in
      </Link>
    </div>
  );

  const _changePassword = async (password: string) => {
    const errorState = await props.changePassword(password);
    setIsPasswordChanged(!errorState);
    return errorState;
  };

  return (
    <React.Fragment>
      <div
        id="passwordChangeDialog"
        className={classnames("modalWindow", { "modalWindow--open": isModal })}
      >
        <div>
          {isPasswordChanged && confirmationDiv}
          {!isPasswordChanged && explanationDiv}
          {!isPasswordChanged && (
            <PasswordChangeForm changePassword={_changePassword} />
          )}
        </div>
      </div>
    </React.Fragment>
  );
}
