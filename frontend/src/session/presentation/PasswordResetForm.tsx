import React from 'react';

import { FormStateProvider, IFormState } from 'react-form-state-context';
import { GlobalError } from 'src/session/presentation/form_fields/GlobalError';
import { EmailField } from 'src/session/presentation/form_fields/EmailField';
import { Field } from 'src/forms/components/Field';
import { SubmitButton } from 'src/session/presentation/form_fields/SubmitButton';

const getExternalErrors = (errors: Array<string>) => {
  const fieldErrors = {};
  return fieldErrors;
};

type PasswordResetFormPropsT = {
  resetPassword: (email: string) => any;
  errors: Array<string>;
};

export function PasswordResetForm(props: PasswordResetFormPropsT) {
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
    props.resetPassword(values.email);
  };

  return (
    <FormStateProvider
      initialValues={{}}
      initialErrors={getExternalErrors(props.errors)}
      handleValidate={handleValidate}
      handleSubmit={handleSubmit}
    >
      <GlobalError />
      <div>
        <Field fieldName="email" label="Email">
          <EmailField />
        </Field>
        Enter your email to reset your password.
      </div>
      <SubmitButton label="Request password reset" />
    </FormStateProvider>
  );
}
