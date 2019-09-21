// @flow

import { withFormik } from "formik";
import React from "react";

import {
  FormField,
  ValuePicker,
  formFieldError,
  getValueFromPicker,
  FormFieldLabel,
  strToPickerValue,
} from "utils/form_utils";
import type { MoveT } from "moves/types";
import {
  RichTextEditor,
  getContentFromEditor,
} from "rich_text/presentation/rich_text_editor";
import type { TagT } from "tags/types";
import type { UUID } from "kernel/types";
import type { VideoBvrT } from "video/types";
import {
  createReadOnlyEditorState,
  toEditorState,
} from "rich_text/utils/editor_state";
import { isNone, slugify, truncDecimals } from "utils/utils";
import { newMoveSlug } from "moves/utils";
import uuidv4 from "uuid/v4";

type InnerFormPropsT = {
  autoFocus: boolean,
  tagPickerDefaultValue: Array<any>,
  tagPickerOptions: Array<any>,
  onCancel: () => void,
  setTagsPickerRef: any => void,
  setDescriptionEditorRef: any => void,
  videoPlayer: any,
};

const InnerForm = (props: InnerFormPropsT) => formProps => {
  const tagsPickerRef = React.useRef(null);
  props.setTagsPickerRef(tagsPickerRef);

  const nameField = (
    <FormField
      classNames="w-full"
      label="Name"
      formProps={formProps}
      fieldName="name"
      type="text"
      placeholder="Name"
      autoFocus={props.autoFocus}
    />
  );

  const updateSlugBtn = (
    <div
      className={"button ml-2 flex-none"}
      onClick={() => {
        const newSlug = slugify(formProps.values.name);
        if (newSlug) {
          formProps.setFieldValue("slug", newSlug);
        }
      }}
    >
      Update
    </div>
  );

  const slugField = (
    <FormField
      classNames="flex-1"
      label="Slug"
      formProps={formProps}
      fieldName="slug"
      type="text"
      placeholder="Slug"
      disabled={true}
      buttons={[updateSlugBtn]}
    />
  );

  const linkField = (
    <FormField
      classNames="w-full"
      label="Link"
      formProps={formProps}
      fieldName="link"
      type="text"
      placeholder="Link"
    />
  );

  const updateStartBtn = (
    <div
      className={"button ml-2 flex-none"}
      onClick={() => {
        formProps.setFieldValue(
          "startTime",
          truncDecimals(props.videoPlayer.getCurrentTime(), 2)
        );
      }}
    >
      Update
    </div>
  );

  const startField = (
    <FormField
      classStarts="w-full"
      label="Start time"
      formProps={formProps}
      fieldName="startTime"
      type="text"
      placeholder="Start time in seconds"
      buttons={[updateStartBtn]}
    />
  );

  const updateEndBtn = (
    <div
      className={"button ml-2 flex-none"}
      onClick={() => {
        formProps.setFieldValue(
          "endTime",
          truncDecimals(props.videoPlayer.getCurrentTime(), 2)
        );
      }}
    >
      Update
    </div>
  );

  const endField = (
    <FormField
      classEnds="w-full"
      label="End time"
      formProps={formProps}
      fieldName="endTime"
      type="text"
      placeholder="End time in seconds"
      buttons={[updateEndBtn]}
    />
  );

  const placeholder =
    "You can add timing information (the move starts with a |rock step|1,2|) and move variations " +
    "(in the ^fancy variation^the follower swivels in place^).";

  const description = (
    <div className="moveForm__description mt-4">
      <FormFieldLabel label="Description" />
      <RichTextEditor
        key={uuidv4()}
        autoFocus={false}
        readOnly={false}
        setEditorRef={props.setDescriptionEditorRef}
        initialEditorState={toEditorState(formProps.values.description)}
        placeholder={placeholder}
      />
      {formFieldError(formProps, "description", ["formField__error"])}
    </div>
  );

  const tags = (
    <div className="moveForm__tags mt-4">
      <ValuePicker
        zIndex={10}
        ref={tagsPickerRef}
        isCreatable={true}
        label="Tags"
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
    <form className="moveForm w-full" onSubmit={formProps.handleSubmit}>
      <div className={"moveForm flexcol"}>
        {nameField}
        {formProps.values.slug != newMoveSlug && slugField}
        {linkField}
        {startField}
        {endField}
        {description}
        {tags}
        <div className={"moveForm__buttonPanel flexrow mt-4"}>
          <button
            className="button button--wide ml-2"
            type="submit"
            disabled={formProps.isSubmitting}
          >
            save
          </button>
          <button
            className="button button--wide ml-2"
            onClick={e => {
              e.preventDefault();
              props.onCancel();
            }}
          >
            cancel
          </button>
        </div>
      </div>
    </form>
  );
};

// MoveForm

type MoveFormPropsT = {
  onCancel: () => void,
  onSubmit: (id: UUID, values: any) => void,
  knownTags: Array<TagT>,
  move: MoveT,
  videoBvr: VideoBvrT,
  autoFocus: boolean,
};

export function MoveForm(props: MoveFormPropsT) {
  const refs = {};
  const setTagsPickerRef = x => (refs.tagsPickerRef = x);
  const setDescriptionEditorRef = x => (refs.descriptionEditorRef = x);

  const startTime = props.move.startTimeMs
    ? props.move.startTimeMs / 1000.0
    : "";

  const EnhancedForm = withFormik({
    mapPropsToValues: () => ({
      name: props.move.name,
      slug: props.move.slug,
      link: props.move.link,
      description: props.move.description,
      tags: props.move.tags,
      startTime: startTime,
      endTime: props.move.endTimeMs ? props.move.endTimeMs / 1000.0 : "",
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
      const {
        state: readOnlyEditorState,
        variationNames,
      } = createReadOnlyEditorState(toEditorState(values.description));

      values.startTimeMs = Math.trunc(values.startTime * 1000);
      delete values.startTime;

      values.endTimeMs = Math.trunc(values.endTime * 1000);
      delete values.endTime;

      props.onSubmit(props.move.id, { ...values, variationNames });
    },
    displayName: "BasicForm", // helps with React DevTools
  })(
    InnerForm({
      autoFocus: props.autoFocus,
      tagPickerOptions: props.knownTags.map(strToPickerValue),
      tagPickerDefaultValue: props.move.tags.map(strToPickerValue),
      onCancel: props.onCancel,
      videoPlayer: props.videoBvr.player,
      setTagsPickerRef,
      setDescriptionEditorRef,
    })
  );

  return <EnhancedForm />;
}
