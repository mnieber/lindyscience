// @flow

import React from 'react';

import { FormStateProvider } from 'src/session/presentation/FormStateProvider';
import { GlobalError } from 'src/session/presentation/form_fields/GlobalError';
import { PasswordField } from 'src/session/presentation/form_fields/PasswordField';
import { FieldError } from 'src/session/presentation/form_fields/FieldError';
import { SubmitButton } from 'src/session/presentation/form_fields/SubmitButton';

const getExternalErrors = (errors: Array<string>) => {
  const fieldErrors = {};
  if (errors?.includes('changePassword/password_too_short')) {
    fieldErrors['password'] = 'Sorry, that password is too short';
  }
  if (errors?.includes('changePassword/password_too_common')) {
    fieldErrors['password'] = 'Sorry, that password is too common';
  }
  if (errors?.includes('changePassword/password_too_similar')) {
    fieldErrors['password'] =
      'Sorry, that password is too similar to your email address';
  }
  return fieldErrors;
};

type PasswordResetFormPropsT = {
  changePassword: (password: string) => any,
  errors: Array<string>,
};

export function PasswordChangeForm(props: PasswordResetFormPropsT) {
  return (
    <FormStateProvider
      initialValues={{}}
      externalErrors={getExternalErrors(props.errors)}
    >
      <GlobalError />
      <div>
        <PasswordField fieldName="password" label="Password" />
        <FieldError fieldName="password" />
      </div>
      <SubmitButton
        onClick={(formState: any) => {
          props.changePassword(formState.values.password);
        }}
        label="Change password"
      />
    </FormStateProvider>
  );
}
