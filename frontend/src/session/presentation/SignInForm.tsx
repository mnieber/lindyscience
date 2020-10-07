import React from 'react';

import { FormStateProvider, IFormState } from 'react-form-state-context';
import { GlobalError } from 'src/session/presentation/form_fields/GlobalError';
import { EmailField } from 'src/session/presentation/form_fields/EmailField';
import { FieldError } from 'src/session/presentation/form_fields/FieldError';
import { PasswordField } from 'src/session/presentation/form_fields/PasswordField';
import { SubmitButton } from 'src/session/presentation/form_fields/SubmitButton';

const getExternalErrors = (errors: Array<string>) => {
  const fieldErrors: { [name: string]: string } = {};
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
  signIn: (email: string, password: string, rememberMe: boolean) => any;
  errors: Array<string>;
};

export function SignInForm(props: SignInFormPropsT) {
  const handleValidate = ({
    values,
    setError,
  }: {
    values: IFormState['values'];
    setError: IFormState['setError'];
  }) => {
    if (!values.password) {
      setError('password', 'Please provide a new password');
    }
  };

  const handleSubmit = ({ values }: { values: IFormState['values'] }) => {
    console.log(values);
  };

  return (
    <FormStateProvider
      initialValues={{ rememberMe: true }}
      initialErrors={getExternalErrors(props.errors)}
      handleValidate={handleValidate}
      handleSubmit={handleSubmit}
    >
      <GlobalError />
      <div>
        <EmailField fieldName="email" label="Email" />
        <FieldError fieldName="email" />
      </div>
      <div>
        <PasswordField fieldName="password" label="Password" />
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
