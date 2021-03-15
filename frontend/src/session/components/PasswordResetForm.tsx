import React from 'react';

import { useAuthStateContext } from 'src/session/AuthStateProvider';
import {
  FormStateProvider,
  HandleSubmitArgsT,
  HandleValidateArgsT,
} from 'react-form-state-context';
import { GlobalError } from 'src/session/components/form_fields/GlobalError';
import { EmailField } from 'src/session/components/form_fields/EmailField';
import { Field } from 'src/forms/components/Field';
import { SubmitButton } from 'src/session/components/form_fields/SubmitButton';

const getExternalErrors = (errors: Array<string>) => {
  const fieldErrors = {};
  return fieldErrors;
};

type PasswordResetFormPropsT = {
  resetPassword: (email: string) => any;
};

export function PasswordResetForm(props: PasswordResetFormPropsT) {
  const authState = useAuthStateContext();
  const handleValidate = ({ values, setError }: HandleValidateArgsT) => {
    if (!values.password) {
      setError('password', 'Please provide a new password');
    }
  };

  const handleSubmit = ({ values }: HandleSubmitArgsT) => {
    props.resetPassword(values.email);
  };

  return (
    <FormStateProvider
      initialValues={{}}
      initialErrors={getExternalErrors(authState.errors)}
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
