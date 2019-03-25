// @flow

import React from "react";
import { withFormik } from "formik";
import * as yup from "yup";
import {
  emailField,
  submitButton,
  globalErrorDiv,
  technicalProblemMsg,
} from "app/presentation/signin_form";

type PasswordResetFormPropsT = {
  resetPassword: (email: string) => any,
};

export function PasswordResetForm(props: PasswordResetFormPropsT) {
  const [globalError, setGlobalError] = React.useState("");

  function InnerForm(formProps) {
    console.log(formProps);
    return (
      <form
        className="passwordResetForm w-full"
        onSubmit={formProps.handleSubmit}
      >
        <div className={"flex flex-wrap"}>
          {emailField(formProps)}
          {submitButton("Reset password")}
        </div>
      </form>
    );
  }

  const EnhancedForm = withFormik({
    mapPropsToValues: () => ({
      email: "",
    }),
    validationSchema: yup.object().shape({
      email: yup.string().required("This field is required"),
    }),
    handleSubmit: async ({ email }, { setSubmitting, setErrors }) => {
      const errorState = await props.resetPassword(email);
      if (errorState == "invalid_email") {
        setErrors({ email: "Please enter a valid email address" });
      } else if (errorState) {
        setGlobalError(technicalProblemMsg);
      }
    },
    displayName: "BasicForm", // helps with React DevTools
  })(InnerForm);

  return <EnhancedForm />;
}
