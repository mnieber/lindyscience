import * as React from 'react';

import {
  FormStateProvider,
  HandleValidateArgsT,
  HandleSubmitArgsT,
} from 'react-form-state-context';
import { TextField } from 'src/forms/components/TextField';
import { Field, CancelButton, SaveButton } from 'src/forms/components';

import './TipForm.scss';

export function TipForm({
  onSubmit,
  onCancel,
  values,
}: {
  onSubmit: (values: any) => void;
  onCancel: () => void;
  values: any;
}) {
  const initialValues = {
    text: values.text,
  };

  const initialErrors = {};

  const handleValidate = ({ values, setError }: HandleValidateArgsT) => {
    if (values.text === undefined) {
      setError('text', 'This field is required');
    }
  };

  const handleSubmit = ({ values }: HandleSubmitArgsT) => {
    onSubmit(values);
  };

  const textField = (
    <Field fieldName="text" label="">
      <TextField className="tipForm__text w-64" />
    </Field>
  );

  return (
    <FormStateProvider
      initialValues={initialValues}
      initialErrors={initialErrors}
      handleValidate={handleValidate}
      handleSubmit={handleSubmit}
    >
      <form className="tipForm w-full">
        <div className={'flex flex-wrap'}>
          {textField}
          <SaveButton className="tipForm__submitButton" />
          <CancelButton className="tipForm__cancelButton" onCancel={onCancel} />
        </div>
      </form>
    </FormStateProvider>
  );
}
