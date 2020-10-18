import React from 'react';
import { compose } from 'lodash/fp';
import { observer } from 'mobx-react';

import { useAuthStateContext } from 'src/session/AuthStateProvider';
import {
  mergeDefaultProps,
  withDefaultProps,
} from 'react-default-props-context';
import { Authentication } from 'src/session/facets/Authentication';
import { RouterLink } from 'src/utils/RouterLink';
import { AuthenticationFrame } from 'src/session/containers/AuthenticationFrame';
import { SignUpForm } from 'src/session/presentation/SignUpForm';

type PropsT = {
  defaultProps: any;
};

type DefaultPropsT = {
  authentication: Authentication;
};

export const SignUpPage = compose(
  withDefaultProps,
  observer
)((p: PropsT) => {
  const props: PropsT & DefaultPropsT = mergeDefaultProps(p);
  const { errors, state } = useAuthStateContext();

  const confirmationDiv = (
    <div>
      You have been signed up. Please check your email for further instructions.
    </div>
  );

  const goToSignInDiv = (
    <div className="mt-4">
      If you are signed up then you can{' '}
      <RouterLink className="ml-2" to={'/sign-in/'}>
        sign in
      </RouterLink>
    </div>
  );

  return (
    <AuthenticationFrame header="Sign Up">
      <div>
        {state === 'SignUp.Succeeded' && confirmationDiv}
        {state !== 'SignUp.Succeeded' && (
          <React.Fragment>
            <SignUpForm signUp={props.authentication.signUp} errors={errors} />
            {goToSignInDiv}
          </React.Fragment>
        )}
      </div>
    </AuthenticationFrame>
  );
});
