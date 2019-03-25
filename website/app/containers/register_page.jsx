// @flow

import * as React from "react";
import AppCtr from "app/containers/index";
import { navigate } from "@reach/router";
import { RegisterDialog } from "app/presentation/register_dialog";

// RegisterPage

function createHandlers() {}

type RegisterPagePropsT = {};

function RegisterPage(props: RegisterPagePropsT) {
  const [isRegistered, setIsRegistered] = React.useState(false);

  async function _register(email: string, password: string) {
    if (await AppCtr.api.register(email, password)) {
      navigate("/app/list");
    }
  }

  return (
    <div className="registerPage flexrow">
      <RegisterDialog register={_register} />
    </div>
  );
}

// $FlowFixMe
RegisterPage = AppCtr.connect(state => ({}), AppCtr.actions)(RegisterPage);

export default RegisterPage;
