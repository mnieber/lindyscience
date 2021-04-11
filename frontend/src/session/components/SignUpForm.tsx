import React from 'react';

import { FormStateProvider, FormState } from 'react-form-state-context';
import { GlobalError } from 'src/session/components/form_fields/GlobalError';
import { EmailField } from 'src/session/components/form_fields/EmailField';
import { UsernameField } from 'src/session/components/form_fields/UsernameField';
import { PasswordField } from 'src/session/components/form_fields/PasswordField';
import { SubmitButton } from 'src/session/components/form_fields/SubmitButton';
import { Field } from 'src/forms/components/Field';

const getExternalErrors = (errors: Array<string>) => {
  const fieldErrors: { [name: string]: string } = {};
  if (errors?.includes('signUp/password_too_short')) {
    fieldErrors['password'] = 'Sorry, that password is too short';
  }
  if (errors?.includes('signUp/password_too_common')) {
    fieldErrors['password'] = 'Sorry, that password is too common';
  }
  if (errors?.includes('signUp/password_too_similar')) {
    fieldErrors['password'] =
      'Sorry, that password is too similar to your email address';
  }
  if (errors?.includes('signUp/email_is_taken')) {
    fieldErrors['email'] = 'Sorry, an account with that email already exists';
  }
  return fieldErrors;
};

type PropsT = {
  signUp: (email: string, username: string, password: string) => any;
  errors: Array<string>;
};

export function SignUpForm(props: PropsT) {
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
    props.signUp(values.email, values.username, values.password);
  };

  return (
    <FormStateProvider
      initialValues={{ rememberMe: true }}
      initialErrors={getExternalErrors(props.errors)}
      handleValidate={handleValidate}
      handleSubmit={handleSubmit}
    >
      <GlobalError />
      <Field fieldName="email" label="Email">
        <EmailField />
      </Field>
      <Field fieldName="username" label="Username">
        <UsernameField />
      </Field>
      <Field fieldName="password" label="Password">
        <PasswordField />
      </Field>
      <SubmitButton label="Sign Up" />
    </FormStateProvider>
  );
}
