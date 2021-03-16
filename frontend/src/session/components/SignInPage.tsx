import React from 'react';
import { observer } from 'mobx-react';

import { useAuthStateContext } from 'src/session/AuthStateProvider';
import { AuthenticationFrame } from 'src/session/components/AuthenticationFrame';
import { SignInForm } from 'src/session/components/SignInForm';
import { RouterLink } from 'src/utils/components/RouterLink';
import { useStore } from 'src/app/components/StoreProvider';
import { useNextUrl } from 'src/utils/useNextUrl';
import { getNextUrl } from 'src/utils/urlParams';

export const SignInPage: React.FC = observer(() => {
  const { authenticationStore } = useStore();
  const { state, errors } = useAuthStateContext(true);

  // Change the url if sign in was successfull
  useNextUrl(state === 'SignIn.Succeeded' ? getNextUrl('/') : undefined);

  return (
    <AuthenticationFrame header="Sign in">
      <div className="">
        <SignInForm
          signIn={(email, password, rememberMe) => {
            authenticationStore.signIn(email, password, rememberMe);
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
