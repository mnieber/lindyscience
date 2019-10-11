// @flow

import * as React from "react";
import Ctr from "app/containers/index";
import { PasswordResetDialog } from "app/presentation/password_reset_dialog";
import { PasswordChangeDialog } from "app/presentation/password_change_dialog";

import { apiResetPassword, apiChangePassword } from "app/api";

// PasswordResetPage

type PasswordResetPagePropsT = {
  uidPrm: ?string,
  tokenPrm: ?string,
};

function PasswordResetPage(props: PasswordResetPagePropsT) {
  async function _resetPassword(email: string) {
    return await apiResetPassword(email);
  }

  async function _changePassword(password: string) {
    return await apiChangePassword(
      password,
      props.uidPrm || "",
      props.tokenPrm || ""
    );
  }

  return props.uidPrm && props.tokenPrm ? (
    <div className="passwordResetPage flexrow">
      <PasswordChangeDialog changePassword={_changePassword} />
    </div>
  ) : (
    <div className="passwordResetPage flexrow">
      <PasswordResetDialog resetPassword={_resetPassword} />
    </div>
  );
}

// $FlowFixMe
PasswordResetPage = Ctr.connect(state => ({}))(PasswordResetPage);

export default PasswordResetPage;
