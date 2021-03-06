import React from 'react';

import { FormStateProvider, FormState } from 'react-form-state-context';
import { GlobalError } from 'src/auth/components/form_fields/GlobalError';
import { EmailField } from 'src/auth/components/form_fields/EmailField';
import { PasswordField } from 'src/auth/components/form_fields/PasswordField';
import { SubmitButton } from 'src/auth/components/form_fields/SubmitButton';
import { Field } from 'src/forms/components/Field';

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
    values: FormState['values'];
    setError: FormState['setError'];
  }) => {
    if (!values.password) {
      setError('password', 'Please provide a new password');
    }
  };

  const handleSubmit = ({ values }: { values: FormState['values'] }) => {
    props.signIn(values.email, values.password, values.rememberMe);
  };

  return (
    <FormStateProvider
      initialValues={{
        rememberMe: true,
        email: null,
        password: null,
      }}
      initialErrors={getExternalErrors(props.errors)}
      handleValidate={handleValidate}
      handleSubmit={handleSubmit}
    >
      <GlobalError />
      <Field fieldName="email" label="Email">
        <EmailField />
      </Field>
      <Field fieldName="password" label="Password">
        <PasswordField />
      </Field>
      <SubmitButton label="Sign in" />
    </FormStateProvider>
  );
}
