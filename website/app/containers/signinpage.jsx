// @flow

import * as React from "react";

import Ctr from "app/containers/index";
import { actSetSignedInEmail } from "app/actions";
import { useHistory } from "utils/react_router_dom_wrapper";
import { urlParam } from "utils/utils";
import { SignInDialog } from "app/presentation/signin_dialog";
import { apiSignIn } from "app/api";

// SignInPage

type SignInPagePropsT = {
  dispatch: Function,
};

function SignInPage(props: SignInPagePropsT) {
  const history = useHistory();

  async function _signIn(email: string, password: string) {
    const errorState = await apiSignIn(email, password);
    if (!errorState) {
      props.dispatch(actSetSignedInEmail(email));
      const next = urlParam("next");
      history.push(next ? next : "/app/lists");
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
SignInPage = Ctr.connect(state => ({}))(SignInPage);

export default SignInPage;
