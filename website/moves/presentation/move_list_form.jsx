// @flow

import React from "react";
import { withFormik } from "formik";
import {
  FormField,
  ValuePicker,
  formFieldError,
  getValueFromPicker,
  FormFieldLabel,
  strToPickerValue,
} from "utils/form_utils";
import {
  RichTextEditor,
  getContentFromEditor,
} from "rich_text/presentation/rich_text_editor";
import { toEditorState } from "rich_text/utils/editor_state";

import type { MoveListT } from "moves/types";
import type { UUID } from "app/types";
import type { TagT } from "profiles/types";

// MoveListForm

type InnerFormPropsT = {
  autoFocus: boolean,
  tagPickerDefaultValue: Array<any>,
  tagPickerOptions: Array<any>,
  onCancel: () => void,
  setDescriptionEditorRef: any => void,
  setTagsPickerRef: any => void,
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

  const description = (
    <div className="moveListForm__description mt-4">
      <FormFieldLabel label="Description" />
      <RichTextEditor
        autoFocus={false}
        readOnly={false}
        setEditorRef={props.setDescriptionEditorRef}
        initialEditorState={toEditorState(formProps.values.description)}
      />
      {formFieldError(formProps, "description", ["formField__error"])}
    </div>
  );

  const isPrivateField = (
    <FormField
      classNames="w-full"
      label="Is private"
      formProps={formProps}
      fieldName="isPrivate"
      type="checkbox"
    />
  );

  const tags = (
    <div className="moveListForm__tags mt-4">
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
    <form className="moveListForm w-full" onSubmit={formProps.handleSubmit}>
      <div className={"moveListForm flexcol"}>
        {nameField}
        {description}
        {!formProps.values.role == "trash" && isPrivateField}
        {tags}
        <div className={"moveListForm__buttonPanel flexrow mt-4"}>
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

type MoveListFormPropsT = {
  onCancel: () => void,
  onSubmit: (id: UUID, values: any) => void,
  knownTags: Array<TagT>,
  moveList: MoveListT,
  autoFocus: boolean,
};

export function MoveListForm(props: MoveListFormPropsT) {
  const refs = {};
  const setTagsPickerRef = x => (refs.tagsPickerRef = x);
  const setDescriptionEditorRef = x => (refs.descriptionEditorRef = x);

  const EnhancedForm = withFormik({
    mapPropsToValues: () => ({
      name: props.moveList.name,
      isPrivate: props.moveList.isPrivate,
      role: props.moveList.role,
      description: props.moveList.description,
      tags: props.moveList.tags,
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
      props.onSubmit(props.moveList.id, values);
    },
    displayName: "BasicForm", // helps with React DevTools
  })(
    InnerForm({
      autoFocus: props.autoFocus,
      tagPickerOptions: props.knownTags.map(strToPickerValue),
      tagPickerDefaultValue: props.moveList.tags.map(strToPickerValue),
      onCancel: props.onCancel,
      setDescriptionEditorRef,
      setTagsPickerRef,
    })
  );

  return <EnhancedForm />;
}
