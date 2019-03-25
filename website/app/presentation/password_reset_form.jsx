// @flow

import React from "react";
import { withFormik } from "formik";
import * as yup from "yup";
import { FormField } from "utils/form_utils";

export function PasswordResetForm({
  onSubmit,
  values,
}: {
  onSubmit: any => void,
  values: any,
}) {
  function InnerForm(formProps) {
    return (
      <form
        className="passwordResetForm w-full"
        onSubmit={formProps.handleSubmit}
      >
        <div className={"flex flex-wrap"}>
          <FormField
            classNames="passwordResetForm__email w-64"
            formProps={formProps}
            fieldName="email"
            type="email"
            placeholder="Email"
          />
          <button
            className="passwordResetForm__submitButton ml-2"
            type="submit"
            disabled={false}
          >
            Reset password
          </button>
        </div>
      </form>
    );
  }

  const EnhancedForm = withFormik({
    mapPropsToValues: () => ({
      email: "",
      ...values,
    }),
    validationSchema: yup.object().shape({
      email: yup.string().required("This field is required"),
    }),
    validate: (values, formProps) => {
      let errors = {};
      return errors;
    },
    handleSubmit: (values, { setSubmitting }) => {
      onSubmit(values);
    },
    displayName: "BasicForm", // helps with React DevTools
  })(InnerForm);

  return <EnhancedForm />;
}
