// @flow

import React from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
import { RegisterForm } from "app/presentation/register_form";

type RegisterDialogPropsT = {
  register: (email: string, username: string, password: string) => any,
};

export function RegisterDialog(props: RegisterDialogPropsT) {
  const goToSignInDiv = (
    <div className="mt-4">
      If you are registered then you can
      <Link className="ml-2" to={"/app/sign-in/"}>
        sign in
      </Link>
    </div>
  );

  return (
    <React.Fragment>
      <div id="registerDialog" className={classnames("bullsEyeWindow")}>
        <div>
          <RegisterForm register={props.register} />
          {goToSignInDiv}
        </div>
      </div>
    </React.Fragment>
  );
}
