// @flow

import * as React from 'react'
import * as appActions from 'app/actions'
import * as fromAppStore from 'app/reducers'
import * as api from 'app/api'
import { browserHistory } from 'react-router'
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
  actSetUserProfile: Function
};

function SignInPage(props: SignInPagePropsT) {
  // const {} = getSignInPageBehaviours();
  // const {} = createHandlers();

  async function _signIn(username, password) {
    const profile = await api.signIn(username, password);
    if (profile) {
      props.actSetUserProfile(profile);
      const next = urlParam('next')
      if (next) {
        browserHistory.push(next);
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
