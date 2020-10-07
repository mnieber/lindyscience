import React from 'react';

import { FormStateProvider, IFormState } from 'react-form-state-context';
import { GlobalError } from 'src/session/presentation/form_fields/GlobalError';
import { EmailField } from 'src/session/presentation/form_fields/EmailField';
import { FieldError } from 'src/session/presentation/form_fields/FieldError';
import { UsernameField } from 'src/session/presentation/form_fields/UsernameField';
import { PasswordField } from 'src/session/presentation/form_fields/PasswordField';
import { SubmitButton } from 'src/session/presentation/form_fields/SubmitButton';

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
        <UsernameField fieldName="username" label="Username" />
        <FieldError fieldName="username" />
      </div>
      <div>
        <PasswordField fieldName="password" label="Password" />
        <FieldError fieldName="password" />
      </div>
      <SubmitButton
        onClick={(formState: any) => {
          props.signUp(
            formState.values.email,
            formState.values.username,
            formState.values.password
          );
        }}
        label="Sign Up"
      />
    </FormStateProvider>
  );
}
