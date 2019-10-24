// @flow

import * as React from "react";

import { useHistory, useParams } from "utils/react_router_dom_wrapper";
import Ctr from "app/containers/index";
import { RegisterDialog } from "app/presentation/register_dialog";
import { ActivateAccountDialog } from "app/presentation/activate_account_dialog";
import { apiActivateAccount, apiRegister } from "app/api";

// RegisterPage

type RegisterPagePropsT = {};

function RegisterPage(props: RegisterPagePropsT) {
  const params = useParams();
  const history = useHistory();

  async function _register(email: string, username: string, password: string) {
    const errorState = await apiRegister(email, username, password);
    if (!errorState) {
      history.push("/app/lists");
    }
    return errorState;
  }

  async function _activateAccount(uid: string, token: string) {
    const errorState = await apiActivateAccount(uid, token);
    if (!errorState) {
      history.push("/app/sign-in/");
    }
    return errorState;
  }

  return params.uid && params.token ? (
    <ActivateAccountDialog
      activateAccount={_activateAccount}
      uid={params.uid}
      token={params.token}
    />
  ) : (
    <div className="registerPage flexrow">
      <RegisterDialog register={_register} />
    </div>
  );
}

// $FlowFixMe
RegisterPage = Ctr.connect(state => ({}))(RegisterPage);

export default RegisterPage;
