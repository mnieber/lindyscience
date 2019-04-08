// @flow

import React from "react";
import { withFormik } from "formik";
import * as yup from "yup";
import { FormField } from "utils/form_utils";
import { validateVideoLinkUrl } from "moves/utils";

export function VideoLinkForm({
  onSubmit,
  onCancel,
  values,
}: {
  onSubmit: (values: any) => void,
  onCancel: () => void,
  values: any,
}) {
  function InnerForm(props) {
    return (
      <form className="videoLinkForm w-full" onSubmit={props.handleSubmit}>
        <div className={"videoLinkForm__panel flex flex-wrap"}>
          <FormField
            classNames="videoLinkForm__url w-64"
            formProps={props}
            fieldName="url"
            type="text"
            placeholder="Link"
          />
          <FormField
            classNames="videoLinkForm__title w-64"
            formProps={props}
            fieldName="title"
            type="text"
            placeholder="Title"
          />
          <button
            className="videoLinkForm__submitButton ml-2"
            type="submit"
            disabled={false}
          >
            save
          </button>
          <button
            className="videoLinkForm__cancelButton ml-2"
            onClick={e => {
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
      url: values.url,
      title: values.title,
    }),
    validationSchema: yup.object().shape({
      url: yup.string().required("This field is required"),
      title: yup.string().required("This field is required"),
    }),
    validate: (values, props) => {
      let errors = {};
      const urlError = validateVideoLinkUrl(values.url);
      if (urlError) {
        errors["url"] = urlError;
      }
      return errors;
    },
    handleSubmit: (values, { setSubmitting }) => {
      onSubmit(values);
    },
    displayName: "BasicForm", // helps with React DevTools
  })(InnerForm);

  return <EnhancedForm />;
}
