// @flow

import { Formik } from "formik";
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
import { createUUID } from "utils/utils2";

import type { CutPointT } from "video/types";
import type { TagT } from "tags/types";
import type { UUID } from "kernel/types";

type InnerFormPropsT = {
  tagPickerDefaultValue: Array<any>,
  tagPickerOptions: Array<any>,
  setDescriptionEditorRef: any => void,
  videoPlayer: any,
  cutPointId: UUID,
  autoFocus: boolean,
  tagsPickerRef: any,
};

const InnerForm = (props: InnerFormPropsT) => formProps => {
  const nameField = (
    <FormField
      classNames="w-full"
      formProps={formProps}
      fieldName="name"
      type="text"
      placeholder="Name"
      autoFocus={props.autoFocus}
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
        ref={props.tagsPickerRef}
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
      onBlur={() => {
        formProps.submitForm();
      }}
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
  onSubmit: (values: any) => void,
  knownTags: Array<TagT>,
  cutPoint: CutPointT,
  videoPlayer: any,
  autoFocus: boolean,
};

export function CutPointForm(props: CutPointFormPropsT) {
  const refs = {};
  const setDescriptionEditorRef = x => (refs.descriptionEditorRef = x);
  const tagsPickerRef = React.useRef(null);

  return (
    <Formik
      initialValues={{
        name: props.cutPoint.name,
        description: props.cutPoint.description,
        tags: props.cutPoint.tags,
      }}
      validate={(values, formProps) => {
        values.description = getContentFromEditor(
          refs.descriptionEditorRef.current,
          ""
        );
        values.tags = getValueFromPicker(tagsPickerRef.current, []);

        let errors = {};
        if (!values.name) {
          errors.name = "This field is required";
        }
        if (!values.tags) {
          errors.tags = "This field is required";
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        props.onSubmit({ ...values, id: props.cutPoint.id });
      }}
      displayName={"BasicForm"}
      render={InnerForm({
        tagPickerOptions: props.knownTags.map(strToPickerValue),
        tagPickerDefaultValue: props.cutPoint.tags.map(strToPickerValue),
        videoPlayer: props.videoPlayer,
        setDescriptionEditorRef,
        cutPointId: props.cutPoint.id,
        autoFocus: props.autoFocus,
        tagsPickerRef,
      })}
    />
  );
}
