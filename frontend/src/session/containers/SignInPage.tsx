import React from 'react';
import { compose } from 'lodash/fp';
import { observer } from 'mobx-react';

import {
  mergeDefaultProps,
  withDefaultProps,
} from 'react-default-props-context';
import { Authentication } from 'src/session/facets/Authentication';
import { useAuthenticationState } from 'src/session/containers/useAuthenticationState';
import { AuthenticationFrame } from 'src/session/containers/AuthenticationFrame';
import { SignInForm } from 'src/session/presentation/SignInForm';
import { RouterLink } from 'src/utils/RouterLink';

type PropsT = {
  defaultProps: any;
};

type DefaultPropsT = {
  authentication: Authentication;
};

export const SignInPage = compose(
  withDefaultProps,
  observer
)((p: PropsT) => {
  const props: PropsT & DefaultPropsT = mergeDefaultProps(p);
  const { errors } = useAuthenticationState(props.authentication);

  return (
    <AuthenticationFrame header="Sign in">
      <div className="">
        <SignInForm
          signIn={(email, password, rememberMe) =>
            props.authentication.signIn(email, password, rememberMe)
          }
          errors={errors}
        />
        <RouterLink to="/request-password-reset/">Forgot password?</RouterLink>
        <RouterLink to="/sign-up/">
          {"Don't have an account? Sign Up"}
        </RouterLink>
      </div>
    </AuthenticationFrame>
  );
});
