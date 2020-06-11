// @flow

import { FormHelperText } from '@material-ui/core';
import React from 'react';

import { FormStateProvider } from 'src/session/presentation/FormStateProvider';
import { GlobalError } from 'src/session/presentation/form_fields/GlobalError';
import { EmailField } from 'src/session/presentation/form_fields/EmailField';
import { FieldError } from 'src/session/presentation/form_fields/FieldError';
import { SubmitButton } from 'src/session/presentation/form_fields/SubmitButton';

const getExternalErrors = (errors: Array<string>) => {
  const fieldErrors = {};
  return fieldErrors;
};

type PasswordResetFormPropsT = {
  resetPassword: (email: string) => any,
  errors: Array<string>,
};

export function PasswordResetForm(props: PasswordResetFormPropsT) {
  return (
    <FormStateProvider
      initialValues={{}}
      externalErrors={getExternalErrors(props.errors)}
    >
      <GlobalError />
      <div>
        <EmailField fieldName="email" label="Email" />
        <FieldError fieldName="email" />
        <FormHelperText>
          Enter your email to reset your password.
        </FormHelperText>
      </div>
      <SubmitButton
        onClick={(formState: any) => {
          props.resetPassword(formState.values.email);
        }}
        label="Request password reset"
      />
    </FormStateProvider>
  );
}
