// @flow

import React from "react";
import { withFormik } from "formik";

import { createUUID } from "utils/utils";
import {
  FormField,
  ValuePicker,
  formFieldError,
  getValueFromPicker,
  strToPickerValue,
} from "utils/form_utils";
import {
  RichTextEditor,
  getContentFromEditor,
} from "rich_text/presentation/rich_text_editor";
import { toEditorState } from "rich_text/utils/editor_state";
import type { MovePrivateDataT } from "moves/types";
import type { TagT } from "tags/types";

// MovePrivateDataForm

type InnerFormPropsT = {
  autoFocus: boolean,
  tagPickerDefaultValue: Array<any>,
  tagPickerOptions: Array<any>,
  onCancel: () => void,
  tagsPickerRef: any,
  notesEditorRef: any,
};

const InnerForm = (props: InnerFormPropsT) => formProps => {
  const notesDiv = (
    <div className="movePrivateDataForm__notes mt-4">
      <RichTextEditor
        key={createUUID()}
        autoFocus={true}
        readOnly={false}
        ref={props.notesEditorRef}
        initialEditorState={toEditorState(formProps.values.notes)}
      />
      {formFieldError(formProps, "notes", ["formField__error"])}
    </div>
  );

  const tags = (
    <div className="movePrivateDataForm__tags mt-4">
      <ValuePicker
        zIndex={10}
        ref={props.tagsPickerRef}
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
    <form
      className="movePrivateDataForm w-full"
      onSubmit={formProps.handleSubmit}
    >
      <div className={"flexcol"}>
        {notesDiv}
        {tags}
        <div className={"movePrivateDataForm__buttonPanel flexrow mt-4"}>
          <button
            className="button button--wide ml-2"
            type="submit"
            disabled={formProps.isSubmitting}
          >
            save
          </button>
          <button className="button button--wide ml-2" onClick={props.onCancel}>
            cancel
          </button>
        </div>
      </div>
    </form>
  );
};

type MovePrivateDataFormPropsT = {
  onCancel: () => void,
  onSubmit: (values: any) => void,
  knownTags: Array<TagT>,
  movePrivateData: ?MovePrivateDataT,
  autoFocus: boolean,
};

export function MovePrivateDataForm(props: MovePrivateDataFormPropsT) {
  const tagsPickerRef = React.useRef(null);
  const notesEditorRef = React.useRef(null);

  const notes = props.movePrivateData ? props.movePrivateData.notes || "" : "";
  const tags = props.movePrivateData ? props.movePrivateData.tags || [] : [];

  const EnhancedForm = withFormik({
    mapPropsToValues: () => ({
      notes: notes,
      tags: tags,
    }),

    validate: (values, formProps) => {
      // HACK: add values from non-input fields
      values.notes = getContentFromEditor(notesEditorRef.current, "");
      values.tags = getValueFromPicker(tagsPickerRef.current, []);
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
      tagPickerDefaultValue: tags.map(strToPickerValue),
      onCancel: props.onCancel,
      notesEditorRef,
      tagsPickerRef,
    })
  );

  return <EnhancedForm />;
}
