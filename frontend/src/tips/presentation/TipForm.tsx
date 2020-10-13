import * as React from 'react';
import {
  FormStateProvider,
  HandleValidateArgsT,
  HandleSubmitArgsT,
} from 'react-form-state-context';

import { TextField } from 'src/forms/components/TextField';
import { Field } from 'src/forms/components/Field';

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

  const SaveButton = () => (
    <button
      className="tipForm__submitButton ml-2"
      type="submit"
      disabled={false}
    >
      save
    </button>
  );

  const CancelButton = () => (
    <button
      className="tipForm__cancelButton ml-2"
      onClick={(e) => {
        e.preventDefault();
        onCancel();
      }}
    >
      cancel
    </button>
  );

  const textField = (
    <Field fieldName="text" label="Text">
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
          <SaveButton />
          <CancelButton />
        </div>
      </form>
    </FormStateProvider>
  );
}
