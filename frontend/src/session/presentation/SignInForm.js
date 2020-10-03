// @flow

import React from 'react';

import { FormStateProvider } from 'src/session/presentation/FormStateProvider';
import { GlobalError } from 'src/session/presentation/form_fields/GlobalError';
import { EmailField } from 'src/session/presentation/form_fields/EmailField';
import { FieldError } from 'src/session/presentation/form_fields/FieldError';
import { PasswordField } from 'src/session/presentation/form_fields/PasswordField';
import { ControlledCheckbox } from 'src/session/presentation/form_fields/ControlledCheckbox';
import { SubmitButton } from 'src/session/presentation/form_fields/SubmitButton';

const getExternalErrors = (errors: Array<string>) => {
  const fieldErrors = {};
  if (errors?.includes('login/invalid_credentials')) {
    fieldErrors['global'] =
      'Login failed, please check your email and password';
  }
  if (errors?.includes('login/failed')) {
    fieldErrors['global'] =
      'Sorry, there seems to be a technical problem. ' +
      'Check your internet connection, or try again later.';
  }
  return fieldErrors;
};

type SignInFormPropsT = {
  signIn: (email: string, password: string, rememberMe: boolean) => any,
  errors: Array<string>,
};

export function SignInForm(props: SignInFormPropsT) {
  return (
    <FormStateProvider
      initialValues={{ rememberMe: true }}
      externalErrors={getExternalErrors(props.errors)}
    >
      <GlobalError />
      <div>
        <EmailField
          className="SignInForm__email"
          fieldName="email"
          label="Email"
        />
        <FieldError fieldName="email" />
      </div>
      <div>
        <PasswordField
          className="SignInForm__password"
          fieldName="password"
          label="Password"
        />
        <FieldError fieldName="password" />
      </div>
      <SubmitButton
        onClick={(formState: any) => {
          props.signIn(
            formState.values.email,
            formState.values.password,
            formState.values.rememberMe
          );
        }}
        label="Sign in"
      />
    </FormStateProvider>
  );
}
