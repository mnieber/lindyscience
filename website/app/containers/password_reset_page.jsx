// @flow

import * as React from "react";
import Ctr from "app/containers/index";
import { PasswordResetDialog } from "app/presentation/password_reset_dialog";
import { PasswordChangeDialog } from "app/presentation/password_change_dialog";

// PasswordResetPage

function createHandlers() {}

type PasswordResetPagePropsT = {
  uidPrm: ?string,
  tokenPrm: ?string,
};

function PasswordResetPage(props: PasswordResetPagePropsT) {
  async function _resetPassword(email: string) {
    return await Ctr.api.resetPassword(email);
  }

  async function _changePassword(password: string) {
    return await Ctr.api.changePassword(password, props.uidPrm, props.tokenPrm);
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
PasswordResetPage = Ctr.connect(state => ({}), Ctr.actions)(PasswordResetPage);

export default PasswordResetPage;
