// @flow

import React from "react";
import { withFormik } from "formik";
import * as yup from "yup";
import {
  emailField,
  passwordField,
  submitButton,
  globalErrorDiv,
  technicalProblemMsg,
} from "app/presentation/signin_form";

type RegisterFormPropsT = {
  register: (email: string, password: string) => any,
};

export function RegisterForm(props: RegisterFormPropsT) {
  const [globalError, setGlobalError] = React.useState("");

  function InnerForm(formProps) {
    return (
      <form className="registerForm w-full" onSubmit={formProps.handleSubmit}>
        {globalErrorDiv(globalError)}
        <div className={"flex flex-wrap"}>
          {emailField(formProps)}
          {passwordField(formProps)}
          {submitButton("Register")}
        </div>
      </form>
    );
  }

  const EnhancedForm = withFormik({
    mapPropsToValues: () => ({
      email: "",
      password: "",
    }),
    validationSchema: yup.object().shape({
      email: yup.string().required("This field is required"),
      password: yup.string().required("This field is required"),
    }),
    handleSubmit: ({ email, password }, { setSubmitting }) => {
      const errorState = props.register(email, password);
      if (errorState == "") {
      } else if (errorState) {
        setGlobalError(technicalProblemMsg);
      }
    },
    displayName: "BasicForm", // helps with React DevTools
  })(InnerForm);

  return <EnhancedForm />;
}
