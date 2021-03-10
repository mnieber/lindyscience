import React from 'react';
import { observer } from 'mobx-react';

import { useAuthStateContext } from 'src/session/AuthStateProvider';
import { AuthenticationFrame } from 'src/session/containers/AuthenticationFrame';
import { SignInForm } from 'src/session/presentation/SignInForm';
import { RouterLink } from 'src/utils/RouterLink';
import { useStore } from 'src/app/components/StoreProvider';

export const SignInPage: React.FC = observer(() => {
  const { authenticationStore } = useStore();
  const { errors } = useAuthStateContext(true);

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
