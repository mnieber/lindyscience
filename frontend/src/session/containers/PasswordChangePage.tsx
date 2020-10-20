import { useParams } from 'react-router-dom';
import React from 'react';
import { compose } from 'lodash/fp';
import { observer } from 'mobx-react';

import { useAuthStateContext } from 'src/session/AuthStateProvider';
import {
  mergeDefaultProps,
  withDefaultProps,
  FC,
} from 'react-default-props-context';
import { Authentication } from 'src/session/facets/Authentication';
import { RouterLink } from 'src/utils/RouterLink';
import { AuthenticationFrame } from 'src/session/containers/AuthenticationFrame';
import { PasswordChangeForm } from 'src/session/presentation/PasswordChangeForm';

type PropsT = {
  defaultProps: any;
};

type DefaultPropsT = {
  authentication: Authentication;
};

export const PasswordChangePage: FC<PropsT, DefaultPropsT> = compose(
  withDefaultProps,
  observer
)((p: PropsT) => {
  const props = mergeDefaultProps<PropsT, DefaultPropsT>(p);
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
