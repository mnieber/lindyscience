import React from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react';

import { useAuthStateContext } from 'src/session/AuthStateProvider';
import { useDefaultProps, FC } from 'react-default-props-context';
import { Authentication } from 'src/session/facets/Authentication';
import { RouterLink } from 'src/utils/RouterLink';
import { AuthenticationFrame } from 'src/session/containers/AuthenticationFrame';

type PropsT = {};

type DefaultPropsT = {
  authentication: Authentication;
};

export const ActivateAccountPage: FC<PropsT, DefaultPropsT> = observer(
  (p: PropsT) => {
    const props = useDefaultProps<PropsT, DefaultPropsT>(p);
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
        The activation failed because this account was already activated. You
        may want to{' '}
        <RouterLink to="/request-password-reset/">
          reset your password
        </RouterLink>
        .
      </div>
    );

    React.useEffect(() => {
      // Don't inline, we need to swallow the return value of async
      props.authentication.activateAccount((params as any).token);
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
  }
);
