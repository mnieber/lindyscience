// @flow

import React from 'react'
import { withFormik } from 'formik';
import * as yup from 'yup';
import {
  FormField,
  formFieldError,
  FormFieldLabel,
} from 'utils/form_utils'
import { RichTextEditor, getContentFromEditor } from 'moves/presentation/rich_text_editor'
import { stateToHTML } from 'draft-js-export-html';
import type { MoveT, MovePrivateDataT } from 'moves/types';


// MovePrivateDataForm

type InnerFormPropsT = {
  autoFocus: boolean,
  setNotesEditorRef: Function,
  onCancel: () => void,
};

const InnerForm = (props: InnerFormPropsT) => (formProps) => {
  const notesDiv =
    <div className="movePrivateDataForm__notes mt-4">
      <RichTextEditor
        autoFocus={true}
        setEditorRef={props.setNotesEditorRef}
        content={formProps.values.notes}
      />
      {formFieldError(formProps, 'notes', ['formField__error'])}
    </div>

  return (
    <form className="movePrivateDataForm w-full" onSubmit={formProps.handleSubmit}>
      <div className={"flexcol"}>
        {notesDiv}
        <div className={"movePrivateDataForm__buttonPanel flexrow mt-4"}>
          <button
            className="button button--wide ml-2"
            type="submit"
            disabled={formProps.isSubmitting}
          >
            save
          </button>
          <button
            className="button button--wide ml-2"
            onClick={props.onCancel}
          >
            cancel
          </button>
        </div>
      </div>
    </form>
  )
}

type MovePrivateDataFormPropsT = {
  onCancel: () => void,
  onSubmit: (values: any) => void,
  movePrivateData: ?MovePrivateDataT,
  autoFocus: boolean,
};

export function MovePrivateDataForm(props: MovePrivateDataFormPropsT) {
  const refs = {}
  const setNotesEditorRef = x => refs.notesEditorRef = x;

  const notes = props.movePrivateData
    ? props.movePrivateData.notes || ''
    : '';

  const EnhancedForm = withFormik({
    mapPropsToValues: () => ({
      notes: notes,
    }),

    validate: (values, formProps) => {
      // HACK: add values from non-input fields
      values.notes = getContentFromEditor(refs.notesEditorRef.current, '');
      let errors = {};
      return errors;
    },

    handleSubmit: (values, { setSubmitting }) => {
      props.onSubmit(values);
    },
    displayName: 'BasicForm', // helps with React DevTools
  })(InnerForm({
    autoFocus: props.autoFocus,
    setNotesEditorRef: setNotesEditorRef,
    onCancel: props.onCancel
  }));

  return <EnhancedForm/>;
}
