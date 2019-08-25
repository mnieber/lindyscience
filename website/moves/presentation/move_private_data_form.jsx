// @flow

import React from "react";
// $FlowFixMe
import uuidv4 from "uuid/v4";
import { withFormik } from "formik";
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
  setNotesEditorRef: any => void,
  onCancel: () => void,
  setTagsPickerRef: any => void,
};

const InnerForm = (props: InnerFormPropsT) => formProps => {
  const tagsPickerRef = React.useRef(null);
  props.setTagsPickerRef(tagsPickerRef);

  const notesDiv = (
    <div className="movePrivateDataForm__notes mt-4">
      <RichTextEditor
        key={uuidv4()}
        autoFocus={true}
        readOnly={false}
        setEditorRef={props.setNotesEditorRef}
        initialEditorState={toEditorState(formProps.values.notes)}
      />
      {formFieldError(formProps, "notes", ["formField__error"])}
    </div>
  );

  const tags = (
    <div className="movePrivateDataForm__tags mt-4">
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
  const refs = {};
  const setTagsPickerRef = x => (refs.tagsPickerRef = x);
  const setNotesEditorRef = x => (refs.notesEditorRef = x);

  const notes = props.movePrivateData ? props.movePrivateData.notes || "" : "";
  const tags = props.movePrivateData ? props.movePrivateData.tags || [] : [];

  const EnhancedForm = withFormik({
    mapPropsToValues: () => ({
      notes: notes,
      tags: tags,
    }),

    validate: (values, formProps) => {
      // HACK: add values from non-input fields
      values.notes = getContentFromEditor(refs.notesEditorRef.current, "");
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
      tagPickerDefaultValue: tags.map(strToPickerValue),
      setNotesEditorRef: setNotesEditorRef,
      onCancel: props.onCancel,
      setTagsPickerRef,
    })
  );

  return <EnhancedForm />;
}
