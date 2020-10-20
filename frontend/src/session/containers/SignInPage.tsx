import React from 'react';
import { observer } from 'mobx-react';

import { useAuthStateContext } from 'src/session/AuthStateProvider';
import { useDefaultProps, FC } from 'react-default-props-context';
import { Authentication } from 'src/session/facets/Authentication';
import { AuthenticationFrame } from 'src/session/containers/AuthenticationFrame';
import { SignInForm } from 'src/session/presentation/SignInForm';
import { RouterLink } from 'src/utils/RouterLink';

type PropsT = {};

type DefaultPropsT = {
  authentication: Authentication;
};

export const SignInPage: FC<PropsT, DefaultPropsT> = observer((p: PropsT) => {
  const props = useDefaultProps<PropsT, DefaultPropsT>(p);
  const { errors } = useAuthStateContext(true);

  return (
    <AuthenticationFrame header="Sign in">
      <div className="">
        <SignInForm
          signIn={(email, password, rememberMe) => {
            props.authentication.signIn(email, password, rememberMe);
          }}
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
