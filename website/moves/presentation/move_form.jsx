// @flow

import React from 'react'
import { withFormik } from 'formik';
import * as yup from 'yup';
import {
  FormField,
  validateMoveUrl,
  ValuePicker,
  formFieldError,
  getValueFromPicker,
  FormFieldLabel,
  strToPickerValue,
  difficulties
} from 'utils/form_utils'
import { RichTextEditor } from 'moves/presentation/rich_text_editor'
import { stateToHTML } from 'draft-js-export-html';
import type { MoveT, TagT, MovePrivateDataT } from 'moves/types';
import type { UserProfileT } from 'app/types';


// MoveForm

type MoveFormPropsT = {
  userProfile: UserProfileT,
  onCancel: Function,
  onSubmit: Function,
  knownTags: Array<TagT>,
  move: MoveT,
  autoFocus: boolean,
};

export function MoveForm(props: MoveFormPropsT) {
  const descriptionEditorRef = React.useRef(null);
  const privateNotesEditorRef = React.useRef(null);
  const difficultyPickerRef = React.useRef(null);
  const tagsPickerRef = React.useRef(null);

  const _onCancel = e => {
    e.preventDefault();
    props.onCancel()
  }

  const InnerForm = _props => {
    const knownTags = props.knownTags.map(strToPickerValue);
    const isOwner = props.move.ownerId == props.userProfile.userId;

    const nameField =
      <FormField
        classNames="w-full"
        label='Name'
        formProps={_props}
        fieldName='name'
        type='text'
        placeholder="Name"
        autoFocus={props.autoFocus}
      />

    const toPickerValue = val => {
      return {
        label: difficulties[val],
        value: val
      }
    }

    const difficultyPicker =
      <div className="moveForm__difficultyPicker z-20 mt-4">
        <ValuePicker
          zIndex={21}
          ref={difficultyPickerRef}
          label='Difficulty'
          defaultValue={toPickerValue(props.move.difficulty)}
          fieldName='difficulty'
          isMulti={false}
          options={[
            toPickerValue('beg'),
            toPickerValue('beg/int'),
            toPickerValue('int'),
            toPickerValue('int/adv'),
            toPickerValue('adv'),
          ]}
          placeholder="Difficulty"
        />
        {formFieldError(_props, 'difficulty', ['formField__error'])}
      </div>

    const description =
      <div className="moveForm__description mt-4">
        <FormFieldLabel label='Description'/>
        <RichTextEditor
          ref={descriptionEditorRef}
          content={props.move.description}
        />
        {formFieldError(_props, 'description', ['formField__error'])}
      </div>

    // $FlowFixMe
    const privateData: MovePrivateDataT = props.move.privateData;

    const privateNotes =
      <div className="moveForm__privateNotes mt-4">
        <FormFieldLabel label='Private notes'/>
        <RichTextEditor
          ref={privateNotesEditorRef}
          content={privateData.notes || ''}
        />
        {formFieldError(_props, 'privateNotes', ['formField__error'])}
      </div>

    const defaultValue = props.move.tags.map(strToPickerValue);

    const tags =
      <div className="moveForm__tags mt-4">
        <ValuePicker
          zIndex={10}
          ref={tagsPickerRef}
          isCreatable={true}
          label='Tags'
          defaultValue={defaultValue}
          fieldName='tags'
          isMulti={true}
          options={knownTags}
          placeholder="Tags"
        />
        {formFieldError(_props, 'tags', ['formField__error'], "error")}
      </div>

    return (
      <form className="moveForm w-full" onSubmit={_props.handleSubmit}>
        <div className={"moveForm flexcol"}>
          {isOwner && nameField}
          {isOwner && difficultyPicker}
          {isOwner && description}
          {privateNotes}
          {isOwner && tags}
          <div className={"moveForm__buttonPanel flexrow mt-4"}>
            <button
              className="button button--wide ml-2"
              type="submit"
              disabled={_props.isSubmitting}
            >
              save
            </button>
            <button
              className="button button--wide ml-2"
              onClick={_onCancel}
            >
              cancel
            </button>
          </div>
        </div>
      </form>
    )
  }

  const EnhancedForm = withFormik({
    mapPropsToValues: () => ({
      name: props.move.name,
      difficulty: props.move.difficulty,
      tags: props.move.tags,
    }),

    validate: (values, _props) => {
      // HACK: add values from non-input fields
      values.description = stateToHTML(
        !!descriptionEditorRef.current &&
        descriptionEditorRef.current.state.editorState.getCurrentContent()
      );
      values.privateNotes = stateToHTML(
        privateNotesEditorRef.current &&
        privateNotesEditorRef.current.state.editorState.getCurrentContent()
      );
      values.difficulty = getValueFromPicker(difficultyPickerRef.current, "");
      values.tags = getValueFromPicker(tagsPickerRef.current, []);

      let errors = {};
      if (!values.name) {
        errors.name = 'This field is required';
      }
      if (!values.difficulty) {
        errors.difficulty = 'This field is required';
      }
      if (!values.tags) {
        errors.tags = 'This field is required';
      }
      return errors;
    },

    handleSubmit: (values, { setSubmitting }) => {
      props.onSubmit(props.move.id, values);
    },
    displayName: 'BasicForm', // helps with React DevTools
  })(InnerForm);

  return <EnhancedForm/>;
}
