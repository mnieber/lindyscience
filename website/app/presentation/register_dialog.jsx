// @flow

import React from "react";
import { Link } from "@reach/router";
import classnames from "classnames";
import { RegisterForm } from "app/presentation/register_form";

type RegisterDialogPropsT = {
  register: (email: string, password: string) => any,
};

export function RegisterDialog(props: RegisterDialogPropsT) {
  const [isModal, setIsModal] = React.useState(true);

  const goToSignInDiv = (
    <div>
      If you are registered then you can
      <Link className="ml-2" to={"/app/sign-in/"}>
        sign in
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
          <RegisterForm register={props.register} />
          {goToSignInDiv}
        </div>
      </div>
    </React.Fragment>
  );
}
