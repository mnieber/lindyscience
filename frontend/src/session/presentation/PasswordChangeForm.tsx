import React from 'react';

import { FormStateProvider, IFormState } from 'react-form-state-context';
import { GlobalError } from 'src/session/presentation/form_fields/GlobalError';
import { PasswordField } from 'src/session/presentation/form_fields/PasswordField';
import { Field } from 'src/forms/components/Field';
import { SubmitButton } from 'src/session/presentation/form_fields/SubmitButton';

const getExternalErrors = (errors: Array<string>) => {
  const fieldErrors: { [name: string]: string } = {};
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
  changePassword: (password: string) => any;
  errors: Array<string>;
};

export function PasswordChangeForm(props: PasswordResetFormPropsT) {
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
    props.changePassword(values.password);
  };

  return (
    <FormStateProvider
      initialValues={{}}
      initialErrors={getExternalErrors(props.errors)}
      handleValidate={handleValidate}
      handleSubmit={handleSubmit}
    >
      <GlobalError />
      <Field fieldName="password" label="Password">
        <PasswordField />
      </Field>
      <SubmitButton label="Change password" />
    </FormStateProvider>
  );
}
