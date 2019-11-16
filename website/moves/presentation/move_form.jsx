// @flow

import { withFormik } from "formik";
import React from "react";

import { slugify, truncDecimals } from "utils/utils";
import { VideoController } from "screens/move_container/facets/video_controller";
import { FormField, FormFieldError, FormFieldLabel } from "utils/form_utils";
import { ValuePicker, strToPickerValue } from "utils/value_picker";
import { MoveDescriptionEditor } from "moves/presentation/move_description_editor";
import { getContentFromEditor } from "rich_text/presentation/rich_text_editor";
import { newMoveSlug } from "moves/utils";
import type { MoveT } from "moves/types";
import type { TagT } from "tags/types";
import type { UUID } from "kernel/types";

type InnerFormPropsT = {
  autoFocus: boolean,
  tagPickerOptions: Array<any>,
  tagsPickerValue: any,
  setTagsPickerValue: Function,
  onCancel: () => void,
  editorRef: any,
  videoCtr: VideoController,
  setAltLink: any => any,
  moveId: UUID,
};

const InnerForm = (props: InnerFormPropsT) => formProps => {
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
      key="updateSlugBtn"
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
      onChange={x => props.setAltLink(x.target.value)}
    />
  );

  const updateStartBtn = (
    <div
      key="updateStartBtn"
      className={"button ml-2 flex-none"}
      onClick={() => {
        formProps.setFieldValue(
          "startTime",
          truncDecimals(props.videoCtr.getPlayer().getCurrentTime(), 2)
        );
      }}
    >
      Set
    </div>
  );

  const goToTime = tAsString => {
    try {
      const t = parseFloat(tAsString);
      props.videoCtr.getPlayer().seekTo(t);
    } catch {}
  };

  const gotoStartBtn = (
    <div
      key="gotoStartBtn"
      className={"button ml-2 flex-none"}
      onClick={() => goToTime(formProps.values.startTime)}
    >
      Go
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
      buttons={[updateStartBtn, gotoStartBtn]}
    />
  );

  const updateEndBtn = (
    <div
      key="updateEndBtn"
      className={"button ml-2 flex-none"}
      onClick={() => {
        formProps.setFieldValue(
          "endTime",
          truncDecimals(props.videoCtr.getPlayer().getCurrentTime(), 2)
        );
      }}
    >
      Set
    </div>
  );

  const gotoEndBtn = (
    <div
      key="gotoEndBtn"
      className={"button ml-2 flex-none"}
      onClick={() => goToTime(formProps.values.endTime)}
    >
      Go
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
      buttons={[updateEndBtn, gotoEndBtn]}
    />
  );

  const description = (
    <div className="moveForm__description mt-4">
      <FormFieldLabel label="Description" fieldName="description" />
      <MoveDescriptionEditor
        editorId={"move_" + props.moveId}
        autoFocus={false}
        readOnly={false}
        editorRef={props.editorRef}
        description={formProps.values.description}
        videoCtr={props.videoCtr}
      />
      <FormFieldError
        formProps={formProps}
        fieldName="description"
        classNames={["formField__error"]}
      />
    </div>
  );

  const tags = (
    <div className="moveForm__tags mt-4">
      <ValuePicker
        zIndex={10}
        isCreatable={true}
        label="Tags"
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
  videoCtr: VideoController,
  setAltLink: any => any,
  autoFocus: boolean,
};

export function MoveForm(props: MoveFormPropsT) {
  const [tagsPickerValue, setTagsPickerValue] = React.useState(
    props.move.tags.map(strToPickerValue)
  );
  const editorRef = React.useRef(null);

  const startTime = props.move.startTimeMs
    ? props.move.startTimeMs / 1000.0
    : "";

  const EnhancedForm = withFormik({
    mapPropsToValues: () => ({
      name: props.move.name,
      slug: props.move.slug,
      link: props.move.link || "",
      description: props.move.description,
      tags: props.move.tags,
      startTime: startTime,
      endTime: props.move.endTimeMs ? props.move.endTimeMs / 1000.0 : "",
    }),

    validate: (values, formProps) => {
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
    },

    handleSubmit: (values, { setSubmitting }) => {
      values.startTimeMs = Math.trunc(values.startTime * 1000);
      delete values.startTime;

      values.endTimeMs = Math.trunc(values.endTime * 1000);
      delete values.endTime;

      props.onSubmit({ ...values, id: props.move.id });
    },

    displayName: "BasicForm", // helps with React DevTools
  })(
    InnerForm({
      autoFocus: props.autoFocus,
      tagPickerOptions: props.knownTags.map(strToPickerValue),
      onCancel: props.onCancel,
      videoCtr: props.videoCtr,
      moveId: props.move.id,
      editorRef,
      setAltLink: props.setAltLink,
      tagsPickerValue,
      setTagsPickerValue,
    })
  );

  return <EnhancedForm />;
}
