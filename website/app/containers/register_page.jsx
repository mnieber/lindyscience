// @flow

import * as React from "react";
import AppCtr from "app/containers/index";
import { navigate } from "@reach/router";
import { RegisterDialog } from "app/presentation/register_dialog";
import { ActivateAccountDialog } from "app/presentation/activate_account_dialog";

// RegisterPage

function createHandlers() {}

type RegisterPagePropsT = {
  uidPrm: ?string,
  tokenPrm: ?string,
};

function RegisterPage(props: RegisterPagePropsT) {
  async function _register(email: string, password: string) {
    const errorState = await AppCtr.api.register(email, password);
    if (!errorState) {
      navigate("/app/lists");
    }
    return errorState;
  }

  async function _activateAccount(uid: string, token: string) {
    const errorState = await AppCtr.api.activateAccount(uid, token);
    if (!errorState) {
      navigate("/app/sign-in/");
    }
    return errorState;
  }

  return props.uidPrm && props.tokenPrm ? (
    <ActivateAccountDialog
      activateAccount={_activateAccount}
      uid={props.uidPrm}
      token={props.tokenPrm}
    />
  ) : (
    <div className="registerPage flexrow">
      <RegisterDialog register={_register} />
    </div>
  );
}

// $FlowFixMe
RegisterPage = AppCtr.connect(state => ({}), AppCtr.actions)(RegisterPage);

export default RegisterPage;
