import { useParams } from 'react-router-dom';
import React from 'react';
import { compose } from 'lodash/fp';
import { observer } from 'mobx-react';

import { mergeDefaultProps, withDefaultProps } from 'src/npm/mergeDefaultProps';
import { Authentication } from 'src/session/facets/Authentication';
import { useAuthenticationState } from 'src/session/containers/useAuthenticationState';
import { RouterLink } from 'src/utils/RouterLink';
import { AuthenticationFrame } from 'src/session/containers/AuthenticationFrame';
import { PasswordChangeForm } from 'src/session/presentation/PasswordChangeForm';

type PropsT = {
  defaultProps: any;
};

type DefaultPropsT = {
  authentication: Authentication;
};

export const PasswordChangePage = compose(
  withDefaultProps,
  observer
)((p: PropsT) => {
  const props: PropsT & DefaultPropsT = mergeDefaultProps(p);
  const params = useParams();
  const { errors, state } = useAuthenticationState(props.authentication);

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
              props.authentication.changePassword(
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
