// @flow

import { Grid } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import React from 'react';
import { observer } from 'mobx-react';
import { compose } from 'rambda';

import { mergeDefaultProps, withDefaultProps } from 'src/npm/mergeDefaultProps';
import { Authentication } from 'src/session/facets/Authentication';
import { useAuthenticationState } from 'src/session/containers/useAuthenticationState';
import { AuthenticationFrame } from 'src/session/containers/AuthenticationFrame';
import { PasswordResetForm } from 'src/session/presentation/PasswordResetForm';
import { RouterLink } from 'src/utils/RouterLink';

type PropsT = {
  defaultProps: any,
};

type DefaultPropsT = {
  authentication: Authentication,
};

export const PasswordResetPage = compose(
  withDefaultProps,
  observer
)((p: PropsT) => {
  const props: PropsT & DefaultPropsT = mergeDefaultProps(p);
  const params = useParams();

  const { errors, state, hasErrors } = useAuthenticationState(
    props.authentication
  );
  const isNotActivated = errors.includes('passwordReset/not_activated');

  const confirmationDiv = (
    <div>
      Your password has been reset. Please check your email for further
      instructions.
    </div>
  );

  const notActivatedDiv = (
    <div>
      Your password could not be reset because your account has not yet been
      activated. Please check your email, we have sent you a new activation
      message.
    </div>
  );

  const generalErrorDiv = (
    <div>
      Sorry, your password could not be reset. Please try again later or contact
      us by email.
    </div>
  );

  return (
    <AuthenticationFrame header="Reset your password">
      <div id="passwordResetDialog" className="">
        {state == 'ResetPassword.Succeeded' && confirmationDiv}
        {isNotActivated && notActivatedDiv}
        {hasErrors && !isNotActivated && generalErrorDiv}
        {state !== 'ResetPassword.Succeeded' && (
          <PasswordResetForm
            resetPassword={props.authentication.resetPassword}
            errors={props.authentication.errors}
          />
        )}
        <Grid container>
          <Grid item xs>
            <RouterLink to="/sign-in/" variant="body2">
              Sign in
            </RouterLink>
          </Grid>
        </Grid>
      </div>
    </AuthenticationFrame>
  );
});
