// @flow

import { Formik } from "formik";
import React from "react";

import {
  FormField,
  ValuePicker,
  FormFieldError,
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
  videoPlayer: any,
  cutPointId: UUID,
  autoFocus: boolean,
  tagsPickerRef: any,
  editorRef: any,
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
        editorId={"cutPoint_" + props.cutPointId}
        placeholder="Description"
        readOnly={false}
        editorRef={props.editorRef}
        description={formProps.values.description}
        videoPlayer={props.videoPlayer}
      />
      <FormFieldError
        formProps={formProps}
        fieldName="description"
        classNames={["formField__error"]}
      />
    </div>
  );

  const tags = (
    <div className="cutPointForm__tags mt-4">
      <ValuePicker
        zIndex={10}
        forwardedRef={props.tagsPickerRef}
        isCreatable={true}
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
  const tagsPickerRef = React.useRef(null);
  const editorRef = React.useRef(null);

  return (
    <Formik
      initialValues={{
        name: props.cutPoint.name,
        description: props.cutPoint.description,
        tags: props.cutPoint.tags,
      }}
      validate={(values, formProps) => {
        values.description = getContentFromEditor(editorRef.current, "");
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
        cutPointId: props.cutPoint.id,
        autoFocus: props.autoFocus,
        editorRef,
        tagsPickerRef,
      })}
    />
  );
}
