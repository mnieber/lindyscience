// @flow

import * as React from "react";
import AppCtr from "app/containers/index";
import { navigate } from "@reach/router";
import { urlParam } from "utils/utils";
import { SignInDialog } from "app/presentation/signin_dialog";

// SignInPage

function createHandlers() {}

type SignInPagePropsT = {
  actSetSignedInEmail: (email: string) => void,
};

function SignInPage(props: SignInPagePropsT) {
  async function _signIn(email: string, password: string) {
    const errorState = await AppCtr.api.signIn(email, password);
    if (!errorState) {
      props.actSetSignedInEmail(email);
      const next = urlParam("next");
      navigate(next ? next : "/app/lists");
    }
    return errorState;
  }

  return (
    <div className="signInPage flexrow">
      <SignInDialog signIn={_signIn} />
    </div>
  );
}

// $FlowFixMe
SignInPage = AppCtr.connect(state => ({}), AppCtr.actions)(SignInPage);

export default SignInPage;
