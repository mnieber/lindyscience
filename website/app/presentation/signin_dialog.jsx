// @flow

import React from 'react'
import classnames from 'classnames';
import { useFlag } from 'utils/hooks'
import { SignInForm } from 'app/presentation/signin_form'


export function SignInDialog({
  signIn,
}: {
  signIn: Function,
}) {
  const isModal = useFlag(true);
  function _submitValues(values) {
    const {email, password} = values;
    signIn(email, password);
  }

  return (
    <React.Fragment>
      <div id="signInDialog" className={classnames("modalWindow", {"modalWindow--open": isModal.flag})}>
        <div>
          <SignInForm
            onSubmit={_submitValues}
            values={{}}
          />
        </div>
      </div>
    </React.Fragment>
  );
}
