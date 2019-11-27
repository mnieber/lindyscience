// @flow

import * as React from "react";
import { compose } from "redux";
import { observer } from "mobx-react";

import { createErrorHandler } from "app/utils";
import { mergeDefaultProps, withDefaultProps } from "facet/default_props";
import { Profiling } from "screens/session_container/facets/profiling";
import Ctr from "app/containers/index";
import { SignInDialog } from "app/presentation/signin_dialog";

// SignInPage

type SignInPagePropsT = {} & {
  // default props
  profiling: Profiling,
};

function SignInPage(p: SignInPagePropsT) {
  const props = mergeDefaultProps(p);

  return (
    <div className="signInPage flexrow">
      <SignInDialog
        signIn={(email, password) =>
          props.profiling
            .signIn(email, password)
            .catch(createErrorHandler("Could not sign in"))
        }
      />
    </div>
  );
}

// $FlowFixMe
SignInPage = compose(
  Ctr.connect(state => ({})),
  withDefaultProps,
  observer
)(SignInPage);

export default SignInPage;
