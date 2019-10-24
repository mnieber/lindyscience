// @flow

import * as React from "react";

import { useParams } from "utils/react_router_dom_wrapper";
import Ctr from "app/containers/index";
import { PasswordResetDialog } from "app/presentation/password_reset_dialog";
import { PasswordChangeDialog } from "app/presentation/password_change_dialog";
import { apiResetPassword, apiChangePassword } from "app/api";

// PasswordResetPage

type PasswordResetPagePropsT = {};

function PasswordResetPage(props: PasswordResetPagePropsT) {
  const params = useParams();

  async function _resetPassword(email: string) {
    return await apiResetPassword(email);
  }

  async function _changePassword(password: string) {
    return await apiChangePassword(
      password,
      params.uid || "",
      params.token || ""
    );
  }

  return params.uid && params.token ? (
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
