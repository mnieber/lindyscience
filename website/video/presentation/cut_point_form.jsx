// @flow

import { withFormik } from "formik";
import React from "react";

import {
  FormField,
  ValuePicker,
  formFieldError,
  getValueFromPicker,
  strToPickerValue,
} from "utils/form_utils";
import { MoveDescriptionEditor } from "moves/presentation/move_description_editor";
import { getContentFromEditor } from "rich_text/presentation/rich_text_editor";
import { isNone, truncDecimals } from "utils/utils";

import type { CutPointT } from "video/types";
import type { TagT } from "tags/types";
import type { UUID } from "kernel/types";

type InnerFormPropsT = {
  tagPickerDefaultValue: Array<any>,
  tagPickerOptions: Array<any>,
  setTagsPickerRef: any => void,
  setDescriptionEditorRef: any => void,
  videoPlayer: any,
  cutPointId: UUID,
};

const InnerForm = (props: InnerFormPropsT) => formProps => {
  const tagsPickerRef = React.useRef(null);
  props.setTagsPickerRef(tagsPickerRef);

  const nameField = (
    <FormField
      classNames="w-full"
      formProps={formProps}
      fieldName="name"
      type="text"
      placeholder="Name"
    />
  );

  const description = (
    <div className="cutPointForm__description mt-4">
      <MoveDescriptionEditor
        placeholder="Description"
        moveId={props.cutPointId}
        readOnly={false}
        setEditorRef={props.setDescriptionEditorRef}
        description={formProps.values.description}
        videoPlayer={props.videoPlayer}
      />
      {formFieldError(formProps, "description", ["formField__error"])}
    </div>
  );

  const tags = (
    <div className="cutPointForm__tags mt-4">
      <ValuePicker
        zIndex={10}
        ref={tagsPickerRef}
        isCreatable={true}
        defaultValue={props.tagPickerDefaultValue}
        fieldName="tags"
        isMulti={true}
        options={props.tagPickerOptions}
        placeholder="Tags"
      />
      {formFieldError(formProps, "tags", ["formField__error"], "error")}
    </div>
  );

  return (
    <form
      onBlur={() => console.log("BLUR")}
      className="cutPointForm w-full"
      onSubmit={formProps.handleSubmit}
    >
      <div className={"cutPointForm flexcol"}>
        {nameField}
        {description}
        {tags}
      </div>
    </form>
  );
};

// CutPointForm

type CutPointFormPropsT = {
  onSubmit: (id: UUID, values: any) => void,
  knownTags: Array<TagT>,
  cutPoint: CutPointT,
  videoPlayer: any,
};

export function CutPointForm(props: CutPointFormPropsT) {
  console.log("RENDERING");
  const refs = {};
  const setTagsPickerRef = x => (refs.tagsPickerRef = x);
  const setDescriptionEditorRef = x => (refs.descriptionEditorRef = x);

  const EnhancedForm = withFormik({
    mapPropsToValues: () => ({
      name: props.cutPoint.name,
      description: props.cutPoint.description,
      tags: props.cutPoint.tags,
    }),

    validate: (values, formProps) => {
      values.description = getContentFromEditor(
        refs.descriptionEditorRef.current,
        ""
      );
      values.tags = getValueFromPicker(refs.tagsPickerRef.current, []);

      let errors = {};
      if (!values.name) {
        errors.name = "This field is required";
      }
      if (!values.tags) {
        errors.tags = "This field is required";
      }
      return errors;
    },

    handleSubmit: (values, { setSubmitting }) => {
      props.onSubmit({ ...values, id: props.cutPoint.id });
    },
    displayName: "BasicForm", // helps with React DevTools
  })(
    InnerForm({
      tagPickerOptions: props.knownTags.map(strToPickerValue),
      tagPickerDefaultValue: props.cutPoint.tags.map(strToPickerValue),
      videoPlayer: props.videoPlayer,
      setTagsPickerRef,
      setDescriptionEditorRef,
      cutPointId: props.cutPoint.id,
    })
  );

  return <EnhancedForm />;
}
