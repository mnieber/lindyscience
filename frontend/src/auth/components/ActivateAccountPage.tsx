import React from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react';

import { useAuthStateContext } from 'src/auth/AuthStateProvider';
import { RouterLink } from 'src/utils/components/RouterLink';
import { AuthenticationFrame } from 'src/auth/components/AuthenticationFrame';
import { useStore } from 'src/app/components/StoreProvider';

export const ActivateAccountPage: React.FC = observer(() => {
  const { authenticationStore } = useStore();

  const params = useParams();
  const { errors, state } = useAuthStateContext(true);

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
    authenticationStore.activateAccount((params as any).token);
  }, [(params as any).token]);

  return (
    <AuthenticationFrame header="Activate your password">
      <div id="passwordResetDialog" className="">
        {state === 'ActivateAccount.Failed' &&
          !isAlreadyActivated &&
          activationFailedDiv}
        {state === 'ActivateAccount.Failed' &&
          isAlreadyActivated &&
          alreadyActivatedDiv}
        {state === 'ActivateAccount.Succeeded' && confirmationDiv}
      </div>
    </AuthenticationFrame>
  );
});
