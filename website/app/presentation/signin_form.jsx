// @flow

import React from 'react'
import { withFormik } from 'formik';
import * as yup from 'yup';
import { FormField, validateTipUrl } from 'utils/form_utils'


export function SignInForm({
  onSubmit,
  values,
}: {
  onSubmit: Function,
  values: any,
}) {
  function InnerForm(props) {
    return (
      <form className="signInForm w-full" onSubmit={props.handleSubmit}>
        <div className={"flex flex-wrap"}>
          <FormField
            classNames="signInForm__email w-64"
            formProps={props}
            fieldName='email'
            type='email'
            placeholder="Email"
          />
          <FormField
            classNames="signInForm__password w-64"
            formProps={props}
            fieldName='password'
            type='password'
            placeholder="Password"
          />
          <button
            className="signInForm__submitButton ml-2"
            type="submit"
            disabled={false}
          >
            Sign in
          </button>
        </div>
      </form>
    );
  }

  const EnhancedForm = withFormik({
    mapPropsToValues: () => ({
      email: '',
      password: '',
      ...values
    }),
    validationSchema: yup.object().shape({
      text: yup.string()
        .required('This field is required'),
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

  return <EnhancedForm/>;
}
