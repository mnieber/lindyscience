// @flow

import React from "react";
import { Link } from "@reach/router";
import classnames from "classnames";
import { RegisterForm } from "app/presentation/register_form";

export function RegisterDialog({
  register,
}: {
  register: (email: string, password: string) => any,
}) {
  const [isModal, setIsModel] = React.useState(true);
  function _submitValues(values) {
    const { email, password } = values;
    register(email, password);
  }

  const goToResetDiv = (
    <div>
      Did you
      <Link className="ml-2" to={"/app/sign-in/reset-password/"}>
        forget your password
      </Link>
      ?
    </div>
  );

  return (
    <React.Fragment>
      <div
        id="registerDialog"
        className={classnames("modalWindow", { "modalWindow--open": isModal })}
      >
        <div>
          <RegisterForm onSubmit={_submitValues} values={{}} />
          {goToResetDiv}
        </div>
      </div>
    </React.Fragment>
  );
}
