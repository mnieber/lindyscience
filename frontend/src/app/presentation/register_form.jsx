// @flow

import React from 'react';
import { withFormik } from 'formik';
import * as yup from 'yup';

import { FormField } from 'src/utils/form_utils';
import {
  emailField,
  passwordField,
  submitButton,
  globalErrorDiv,
  technicalProblemMsg,
} from 'src/app/presentation/signin_form';

type PropsT = {
  register: (email: string, username: string, password: string) => any,
};

function usernameField(formProps: any) {
  return (
    <FormField
      classNames="registerForm__username w-64"
      formProps={formProps}
      fieldName="username"
      type="username"
      placeholder="Username (publicly visible)"
    />
  );
}

export const RegisterForm: (PropsT) => any = (props: PropsT) => {
  const [globalError, setGlobalError] = React.useState('');

  function InnerForm(formProps) {
    return (
      <form className="registerForm w-full" onSubmit={formProps.handleSubmit}>
        {globalErrorDiv(globalError)}
        <div className={'flex flex-wrap'}>
          {emailField(formProps)}
          {usernameField(formProps)}
          {passwordField(formProps)}
          {submitButton('Register')}
        </div>
      </form>
    );
  }

  const EnhancedForm = withFormik({
    mapPropsToValues: () => ({
      email: '',
      username: '',
      password: '',
    }),
    validationSchema: yup.object().shape({
      email: yup.string().required('This field is required'),
      username: yup.string().required('This field is required'),
      password: yup.string().required('This field is required'),
    }),
    handleSubmit: ({ email, username, password }, { setSubmitting }) => {
      const errorState = props.register(email, username, password);
      if (errorState == '') {
      } else if (errorState) {
        setGlobalError(technicalProblemMsg);
      }
    },
    displayName: 'BasicForm', // helps with React DevTools
  })(InnerForm);

  return <EnhancedForm />;
};
