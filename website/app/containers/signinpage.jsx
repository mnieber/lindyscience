// @flow

import * as React from 'react'
import * as appActions from 'app/actions'
import * as fromAppStore from 'app/reducers'
import * as api from 'app/api'
import { navigate } from "@reach/router"
import { urlParam } from 'utils/utils'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'
import { SignInDialog } from 'app/presentation/signin_dialog';
import { getSignInPageBehaviours } from 'app/containers/behaviours'

// SignInPage

function createHandlers(
) {
}

type SignInPagePropsT = {
  actSetSignedInUsername: Function
};

function SignInPage(props: SignInPagePropsT) {
  // const {} = getSignInPageBehaviours();
  // const {} = createHandlers();

  async function _signIn(username, password) {
    if (await api.signIn(username, password)) {
      props.actSetSignedInUsername(username);
      const next = urlParam('next')
      if (next) {
        navigate(next);
      }
    }
  }

  return (
    <div
      className="signInPage flexrow"
    >
      <SignInDialog
        signIn={_signIn}
      />
    </div>
  );
}

// $FlowFixMe
SignInPage = connect(
  (state) => ({
  }),
  appActions
)(SignInPage)

export default SignInPage;
