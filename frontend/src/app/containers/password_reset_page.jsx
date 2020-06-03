// @flow

import * as React from 'react';

import { useParams } from 'src/utils/react_router_dom_wrapper';
import { PasswordResetDialog } from 'src/app/presentation/password_reset_dialog';
import { PasswordChangeDialog } from 'src/app/presentation/password_change_dialog';
import { apiResetPassword, apiChangePassword } from 'src/app/api';

type PropsT = {};

export function PasswordResetPage(props: PropsT) {
  const params = useParams();

  async function _resetPassword(email: string) {
    return await apiResetPassword(email);
  }

  async function _changePassword(password: string) {
    return await apiChangePassword(
      password,
      params.uid || '',
      params.token || ''
    );
  }

  return params.uid && params.token ? (
    <div className="passwordResetPage flexrow">
      <PasswordChangeDialog changePassword={_changePassword} />
    </div>
  ) : (
    <div className="passwordResetPage flexrow">
      <PasswordResetDialog resetPassword={_resetPassword} />
    </div>
  );
}
