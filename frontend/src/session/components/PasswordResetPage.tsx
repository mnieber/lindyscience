import React from 'react';
import { observer } from 'mobx-react';

import { useAuthStateContext } from 'src/session/AuthStateProvider';
import { AuthenticationFrame } from 'src/session/components/AuthenticationFrame';
import { PasswordResetForm } from 'src/session/components/PasswordResetForm';
import { RouterLink } from 'src/utils/components/RouterLink';
import { useStore } from 'src/app/components/StoreProvider';

export const PasswordResetPage: React.FC = observer(() => {
  const { authenticationStore } = useStore();

  const { errors, state, hasErrors } = useAuthStateContext(true);
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
        {state === 'ResetPassword.Succeeded' && confirmationDiv}
        {isNotActivated && notActivatedDiv}
        {hasErrors && !isNotActivated && generalErrorDiv}
        {state !== 'ResetPassword.Succeeded' && (
          <PasswordResetForm
            resetPassword={authenticationStore.resetPassword}
          />
        )}
        <RouterLink to="/sign-in/">Sign in</RouterLink>
      </div>
    </AuthenticationFrame>
  );
});
