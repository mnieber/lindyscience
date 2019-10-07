// @flow

import React from "react";
import { withFormik } from "formik";
import * as yup from "yup";
import { FormField } from "utils/form_utils";

export function emailField(formProps: any) {
  return (
    <FormField
      classNames="signInForm__email w-64"
      formProps={formProps}
      fieldName="email"
      type="email"
      placeholder="Email"
    />
  );
}

export function passwordField(formProps: any) {
  return (
    <FormField
      classNames="signInForm__password w-64"
      formProps={formProps}
      fieldName="password"
      type="password"
      placeholder="Password"
    />
  );
}

export function submitButton(label: string) {
  return (
    <button
      className="signInForm__submitButton ml-2"
      type="submit"
      disabled={false}
    >
      {label}
    </button>
  );
}

export function globalErrorDiv(globalError: string) {
  return globalError ? (
    <div className="formField__error">{globalError}</div>
  ) : (
    undefined
  );
}

export const technicalProblemMsg =
  "Sorry, there seems to be a technical problem. " +
  "Check your internet connection, or try again later.";

type SignInFormPropsT = {
  signIn: (email: string, password: string) => any,
};

export function SignInForm(props: SignInFormPropsT) {
  const [globalError, setGlobalError] = React.useState("");

  function InnerForm(formProps) {
    return (
      <form className="signInForm w-full" onSubmit={formProps.handleSubmit}>
        {globalErrorDiv(globalError)}
        <div className={"flex flex-wrap"}>
          {emailField(formProps)}
          {passwordField(formProps)}
          {submitButton("Sign in")}
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
    handleSubmit: async (
      { email, password },
      { setSubmitting, setFieldError, setStatus }
    ) => {
      const errorState = await props.signIn(email, password);
      if (errorState == "bad_credentials") {
        setFieldError("password", "Oops, that seems to be the wrong password");
      } else if (errorState) {
        setGlobalError(technicalProblemMsg);
      }
    },
    displayName: "BasicForm", // helps with React DevTools
  })(InnerForm);

  return <EnhancedForm />;
}
