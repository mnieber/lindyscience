// @flow

import * as React from "react";
import AppCtr from "app/containers/index";
import { PasswordResetDialog } from "app/presentation/password_reset_dialog";
import { PasswordChangeDialog } from "app/presentation/password_change_dialog";

// PasswordResetPage

function createHandlers() {}

type PasswordResetPagePropsT = {
  uidPrm: ?string,
  tokenPrm: ?string,
};

function PasswordResetPage(props: PasswordResetPagePropsT) {
  const [isPasswordReset, setIsPasswordReset] = React.useState(null);
  const [isPasswordChanged, setIsPasswordChanged] = React.useState(null);

  async function _resetPassword(email: string) {
    const result = await AppCtr.api.resetPassword(email);
    setIsPasswordReset(result);
  }

  async function _changePassword(password: string) {
    const result = await AppCtr.api.changePassword(
      password,
      props.uidPrm,
      props.tokenPrm
    );
    setIsPasswordChanged(result);
  }

  if (props.uidPrm && props.tokenPrm) {
    return (
      <div className="passwordResetPage flexrow">
        <PasswordChangeDialog
          changePassword={_changePassword}
          isPasswordChanged={isPasswordChanged}
        />
      </div>
    );
  } else {
    return (
      <div className="passwordResetPage flexrow">
        <PasswordResetDialog
          isPasswordReset={isPasswordReset}
          resetPassword={_resetPassword}
        />
      </div>
    );
  }
}

// $FlowFixMe
PasswordResetPage = AppCtr.connect(state => ({}), AppCtr.actions)(
  PasswordResetPage
);

export default PasswordResetPage;
