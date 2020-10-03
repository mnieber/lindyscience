// @flow

import React from 'react';
import { useParams } from 'react-router-dom';
import { compose } from 'rambda';
import { observer } from 'mobx-react';

import { mergeDefaultProps, withDefaultProps } from 'src/npm/mergeDefaultProps';
import { Authentication } from 'src/session/facets/Authentication';
import { useAuthenticationState } from 'src/session/containers/useAuthenticationState';
import { RouterLink } from 'src/utils/RouterLink';
import { AuthenticationFrame } from 'src/session/containers/AuthenticationFrame';

type PropsT = {
  defaultProps: any,
};

type DefaultPropsT = {
  authentication: Authentication,
};

export const ActivateAccountPage = compose(
  withDefaultProps,
  observer
)((p: PropsT) => {
  const props: PropsT & DefaultPropsT = mergeDefaultProps(p);
  const params = useParams();
  const { errors, state, hasErrors } = useAuthenticationState(
    props.authentication
  );

  const isAlreadyActivated = errors.includes(
    'activateAccount/already_activated'
  );

  const activationFailedDiv = (
    <div>
      There was a problem with activating your account. Please try to{' '}
      <RouterLink to="/sign-up/">sign up</RouterLink> again.
    </div>
  );

  const confirmationDiv = (
    <div>
      Your account was activated. You can now{' '}
      <RouterLink to="/sign-in/">sign in</RouterLink>.
    </div>
  );

  const alreadyActivatedDiv = (
    <div>
      The activation failed because this account was already activated. You may
      want to{' '}
      <RouterLink to="/request-password-reset/">reset your password</RouterLink>
      .
    </div>
  );

  React.useEffect(() => {
    // Don't inline, we need to swallow the return value of async
    props.authentication.activateAccount((params.token: any));
  }, [params.token]);

  return (
    <AuthenticationFrame header="Activate your password">
      <div id="passwordResetDialog" className="">
        {state == 'ActivateAccount.Failed' &&
          !isAlreadyActivated &&
          activationFailedDiv}
        {state == 'ActivateAccount.Failed' &&
          isAlreadyActivated &&
          alreadyActivatedDiv}
        {state == 'ActivateAccount.Succeeded' && confirmationDiv}
      </div>
    </AuthenticationFrame>
  );
});
