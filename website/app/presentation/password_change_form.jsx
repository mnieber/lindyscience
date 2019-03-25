// @flow

import React from "react";
import { withFormik } from "formik";
import * as yup from "yup";
import { FormField, validateTipUrl } from "utils/form_utils";

export function PasswordChangeForm({
  onSubmit,
  values,
}: {
  onSubmit: any => void,
  values: any,
}) {
  function InnerForm(formProps) {
    return (
      <form
        className="passwordChangeForm w-full"
        onSubmit={formProps.handleSubmit}
      >
        <div className={"flex flex-wrap"}>
          <FormField
            classNames="passwordChangeForm__password w-64"
            formProps={formProps}
            fieldName="password"
            type="password"
            placeholder="Password"
          />
          <button
            className="passwordChangeForm__submitButton ml-2"
            type="submit"
            disabled={false}
          >
            Change password
          </button>
        </div>
      </form>
    );
  }

  const EnhancedForm = withFormik({
    mapPropsToValues: () => ({
      password: "",
      ...values,
    }),
    validationSchema: yup.object().shape({
      password: yup.string().required("This field is required"),
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
