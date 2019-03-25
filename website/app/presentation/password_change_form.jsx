// @flow

import React from "react";
import { withFormik } from "formik";
import { Link } from "@reach/router";
import * as yup from "yup";
import {
  passwordField,
  submitButton,
  globalErrorDiv,
  technicalProblemMsg,
} from "app/presentation/signin_form";

type PasswordChangeFormPropsT = {
  changePassword: (password: string) => any,
};

export function PasswordChangeForm(props: PasswordChangeFormPropsT) {
  const [globalError: any, setGlobalError: Function] = React.useState("");

  function InnerForm(formProps) {
    return (
      <form
        className="passwordChangeForm w-full"
        onSubmit={formProps.handleSubmit}
      >
        {globalErrorDiv(globalError)}
        <div className={"flex flex-wrap"}>
          {passwordField(formProps)}
          {submitButton("Change password")}
        </div>
      </form>
    );
  }

  const EnhancedForm = withFormik({
    mapPropsToValues: () => ({
      password: "",
    }),
    validationSchema: yup.object().shape({
      password: yup.string().required("This field is required"),
    }),
    handleSubmit: async ({ password }, { setSubmitting }) => {
      const errorState = await props.changePassword(password);
      if (errorState == "invalid_token") {
        const msgDiv = (
          <div>
            The allowed period for changing the password has expired. Please try
            to <Link to="/app/sign-in/reset-password/">reset</Link> it again.
          </div>
        );
        // $FlowFixMe
        setGlobalError(msgDiv);
      } else if (errorState) {
        setGlobalError(technicalProblemMsg);
      }
    },
    displayName: "BasicForm", // helps with React DevTools
  })(InnerForm);

  return <EnhancedForm />;
}
