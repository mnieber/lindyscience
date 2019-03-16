// @flow

import * as React from "react";
import AppCtr from "app/containers/index";
import { navigate } from "@reach/router";
import { urlParam } from "utils/utils";
import { SignInDialog } from "app/presentation/signin_dialog";
import { getSignInPageBehaviours } from "app/containers/behaviours";

// SignInPage

function createHandlers() {}

type SignInPagePropsT = {
  actSetSignedInEmail: (email: string) => void,
};

function SignInPage(props: SignInPagePropsT) {
  // const {} = getSignInPageBehaviours();
  // const {} = createHandlers();

  async function _signIn(email: string, password: string) {
    if (await AppCtr.api.signIn(email, password)) {
      props.actSetSignedInEmail(email);
      const next = urlParam("next");
      if (next) {
        navigate(next);
      }
    }
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
