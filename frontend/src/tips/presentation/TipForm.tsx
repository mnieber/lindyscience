import * as React from 'react';
import { withFormik } from 'formik';
import * as yup from 'yup';

import { FormField } from 'src/utils/form_utils';

export function TipForm({
  onSubmit,
  onCancel,
  values,
}: {
  onSubmit: (values: any) => void;
  onCancel: () => void;
  values: any;
}) {
  function InnerForm(props) {
    return (
      <form className="tipForm w-full" onSubmit={props.handleSubmit}>
        <div className={'flex flex-wrap'}>
          <FormField
            classNames="tipForm__text w-64"
            formProps={props}
            fieldName="text"
            type="text"
            placeholder="Text"
          />
          <button
            className="tipForm__submitButton ml-2"
            type="submit"
            disabled={false}
          >
            save
          </button>
          <button
            className="tipForm__cancelButton ml-2"
            onClick={(e) => {
              e.preventDefault();
              onCancel();
            }}
          >
            cancel
          </button>
        </div>
      </form>
    );
  }

  const EnhancedForm = withFormik({
    mapPropsToValues: () => ({
      text: values.text,
    }),
    validationSchema: yup.object().shape({
      text: yup.string().required('This field is required'),
    }),
    validate: (values, props) => {
      let errors = {};
      return errors;
    },
    handleSubmit: (values, { setSubmitting }) => {
      onSubmit(values);
    },
    displayName: 'BasicForm', // helps with React DevTools
  })(InnerForm);

  return <EnhancedForm />;
}
