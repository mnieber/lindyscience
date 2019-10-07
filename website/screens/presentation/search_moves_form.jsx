// @flow

import React from "react";
import { withFormik } from "formik";
import { FormField, FormFieldError, FormFieldLabel } from "utils/form_utils";
import {
  ValuePicker,
  getValueFromPicker,
  strToPickerValue,
} from "utils/value_picker";
import { slugify } from "utils/utils";
import { newMoveSlug } from "moves/utils";
import type { MoveT } from "moves/types";
import type { UUID } from "kernel/types";
import type { TagT } from "tags/types";

type InnerFormPropsT = {
  autoFocus: boolean,
  tagPickerDefaultValue: Array<any>,
  tagPickerOptions: Array<any>,
  setTagsPickerRef: any => void,
};

const InnerForm = (props: InnerFormPropsT) => formProps => {
  const tagsPickerRef = React.useRef(null);
  props.setTagsPickerRef(tagsPickerRef);

  const myMoveLists = (
    <FormField
      classNames="w-full"
      label="Search only my move lists"
      formProps={formProps}
      fieldName="myMoveLists"
      type="checkbox"
    />
  );

  const keywordsField = (
    <FormField
      classNames="w-full"
      label="Keywords"
      formProps={formProps}
      fieldName="keywords"
      type="text"
      placeholder="Keywords"
      autoFocus={props.autoFocus}
    />
  );

  const tags = (
    <div className="moveForm__tags mt-4">
      <ValuePicker
        zIndex={10}
        forwardedRef={tagsPickerRef}
        isCreatable={true}
        label="Tags"
        defaultValue={props.tagPickerDefaultValue}
        fieldName="tags"
        isMulti={true}
        options={props.tagPickerOptions}
        placeholder="Tags"
      />
      <FormFieldError
        formProps={formProps}
        fieldName="tags"
        classNames={["formField__error"]}
        key="error"
      />
    </div>
  );

  return (
    <form className="moveForm w-full" onSubmit={formProps.handleSubmit}>
      <div className={"moveForm flexcol"}>
        {myMoveLists}
        {keywordsField}
        {tags}
        <div className={"moveForm__buttonPanel flexrow mt-4"}>
          <button
            className="button button--wide ml-2"
            type="submit"
            disabled={formProps.isSubmitting}
          >
            search
          </button>
        </div>
      </div>
    </form>
  );
};

// SearchMovesForm

type SearchMovesFormPropsT = {
  onSubmit: (values: any) => any,
  knownTags: Array<TagT>,
  autoFocus: boolean,
  latestOptions: any,
};

export function SearchMovesForm(props: SearchMovesFormPropsT) {
  const refs = {};
  const setTagsPickerRef = x => (refs.tagsPickerRef = x);

  const EnhancedForm = withFormik({
    mapPropsToValues: () => ({
      tags: [],
      keywords: [],
      myMoveLists: false,
      ...props.latestOptions,
    }),

    validate: (values, formProps) => {
      values.tags = getValueFromPicker(refs.tagsPickerRef.current, []);

      let errors = {};
      return errors;
    },

    handleSubmit: (values, { setSubmitting }) => {
      props.onSubmit(values);
    },
    displayName: "BasicForm", // helps with React DevTools
  })(
    InnerForm({
      autoFocus: props.autoFocus,
      tagPickerOptions: props.knownTags.map(strToPickerValue),
      tagPickerDefaultValue: (props.latestOptions.tags || []).map(
        strToPickerValue
      ),
      setTagsPickerRef,
    })
  );

  return <EnhancedForm />;
}
