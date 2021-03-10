import React from 'react';
import { observer } from 'mobx-react';

import { useAuthStateContext } from 'src/session/AuthStateProvider';
import { RouterLink } from 'src/utils/RouterLink';
import { AuthenticationFrame } from 'src/session/containers/AuthenticationFrame';
import { SignUpForm } from 'src/session/presentation/SignUpForm';
import { useStore } from 'src/app/components/StoreProvider';

export const SignUpPage: React.FC = observer(() => {
  const { authenticationStore } = useStore();
  const { errors, state } = useAuthStateContext(true);

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
            <SignUpForm signUp={authenticationStore.signUp} errors={errors} />
            {goToSignInDiv}
          </React.Fragment>
        )}
      </div>
    </AuthenticationFrame>
  );
});
