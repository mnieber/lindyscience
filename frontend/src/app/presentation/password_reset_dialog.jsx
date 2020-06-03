// @flow

import React from 'react';
import classnames from 'classnames';

import { PasswordResetForm } from 'src/app/presentation/password_reset_form';

type PropsT = {
  resetPassword: (email: string) => any,
};

export const PasswordResetDialog: (PropsT) => any = (props: PropsT) => {
  const [isPasswordReset, setIsPasswordReset] = React.useState(false);

  const confirmationDiv = (
    <div>
      Your password has been reset. Please check your email for further
      instructions.
    </div>
  );

  const explanationDiv = <div>Enter your email to reset your password.</div>;

  const _resetPassword = async (email: string) => {
    const errorState = await props.resetPassword(email);
    setIsPasswordReset(!errorState);
    return errorState;
  };

  return (
    <React.Fragment>
      <div id="passwordResetDialog" className={classnames('bullsEyeWindow')}>
        <div>
          {isPasswordReset && confirmationDiv}
          {!isPasswordReset && explanationDiv}
          {!isPasswordReset && (
            <PasswordResetForm resetPassword={_resetPassword} />
          )}
        </div>
      </div>
    </React.Fragment>
  );
};
