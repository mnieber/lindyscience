import { useParams } from 'react-router-dom';
import React from 'react';
import { observer } from 'mobx-react';

import { useAuthStateContext } from 'src/auth/AuthStateProvider';
import { RouterLink } from 'src/utils/components/RouterLink';
import { AuthenticationFrame } from 'src/auth/components/AuthenticationFrame';
import { PasswordChangeForm } from 'src/auth/components/PasswordChangeForm';
import { useStore } from 'src/app/components/StoreProvider';

export const PasswordChangePage: React.FC = observer(() => {
  const { authenticationStore } = useStore();
  const params = useParams();
  const { errors, state } = useAuthStateContext(true);

  const explanationDiv = <div>Please enter your new password.</div>;
  const confirmationDiv = (
    <div>
      Your password has been changed. You can now{' '}
      <RouterLink className="ml-2" to={'/sign-in/'}>
        sign in
      </RouterLink>
    </div>
  );

  const isPasswordChanged = state === 'ChangePassword.Succeeded';

  return (
    <AuthenticationFrame header="Change your password">
      <div id="passwordChangeDialog" className="">
        {isPasswordChanged && confirmationDiv}
        {!isPasswordChanged && explanationDiv}
        {!isPasswordChanged && (
          <PasswordChangeForm
            errors={errors}
            changePassword={(password) =>
              authenticationStore.changePassword(
                password,
                (params as any).token
              )
            }
          />
        )}
      </div>
    </AuthenticationFrame>
  );
});
