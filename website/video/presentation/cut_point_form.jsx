// @flow

import { Formik } from "formik";
import React from "react";

import { FormField, FormFieldError } from "utils/form_utils";
import { ValuePicker, strToPickerValue } from "utils/value_picker";
import { MoveDescriptionEditor } from "moves/presentation/move_description_editor";
import { getContentFromEditor } from "rich_text/presentation/rich_text_editor";
import { isNone, truncDecimals } from "utils/utils";
import { createUUID } from "utils/utils2";

import type { CutPointT } from "video/types";
import type { TagT } from "tags/types";
import type { UUID } from "kernel/types";

type InnerFormPropsT = {
  tagPickerOptions: Array<any>,
  videoPlayer: any,
  cutPointId: UUID,
  autoFocus: boolean,
  editorRef: any,
  tagsPickerValue: any,
  setTagsPickerValue: Function,
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
        isCreatable={true}
        fieldName="tags"
        isMulti={true}
        options={props.tagPickerOptions}
        placeholder="Tags"
        value={props.tagsPickerValue}
        setValue={props.setTagsPickerValue}
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
  const editorRef = React.useRef(null);
  const [tagsPickerValue, setTagsPickerValue] = React.useState(
    props.cutPoint.tags.map(strToPickerValue)
  );

  return (
    <Formik
      initialValues={{
        name: props.cutPoint.name,
        description: props.cutPoint.description,
        tags: props.cutPoint.tags,
      }}
      validate={(values, formProps) => {
        values.description = getContentFromEditor(editorRef.current, "");
        values.tags = (tagsPickerValue || []).map(x => x.value);

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
        videoPlayer: props.videoPlayer,
        cutPointId: props.cutPoint.id,
        autoFocus: props.autoFocus,
        editorRef,
        tagsPickerValue,
        setTagsPickerValue,
      })}
    />
  );
}
