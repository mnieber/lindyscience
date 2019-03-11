// @flow

import React from 'react'
import { withFormik } from 'formik';
import * as yup from 'yup';
import {
  FormField,
  ValuePicker,
  formFieldError,
  getValueFromPicker,
  FormFieldLabel,
  strToPickerValue,
  difficulties
} from 'utils/form_utils'
import { RichTextEditor, getContentFromEditor } from 'moves/presentation/rich_text_editor'
import type { MoveT } from 'moves/types';
import type { UUID, UserProfileT, TagT } from 'app/types';


type InnerFormPropsT = {
  autoFocus: boolean,
  difficultyPickerDefaultValue: any,
  difficultyPickerOptions: Array<any>,
  tagPickerDefaultValue: Array<any>,
  tagPickerOptions: Array<any>,
  onCancel: () => void,
  setDifficultyPickerRef: (any) => void,
  setTagsPickerRef: (any) => void,
  setDescriptionEditorRef: (any) => void,
};

const InnerForm = (props: InnerFormPropsT) => (formProps) => {
  const difficultyPickerRef = React.useRef(null);
  props.setDifficultyPickerRef(difficultyPickerRef);

  const tagsPickerRef = React.useRef(null);
  props.setTagsPickerRef(tagsPickerRef);

  const nameField =
    <FormField
      classNames="w-full"
      label='Name'
      formProps={formProps}
      fieldName='name'
      type='text'
      placeholder="Name"
      autoFocus={props.autoFocus}
    />

  const difficultyPicker =
    <div className="moveForm__difficultyPicker z-20 mt-4">
      <ValuePicker
        zIndex={21}
        ref={difficultyPickerRef}
        label='Difficulty'
        defaultValue={props.difficultyPickerDefaultValue}
        fieldName='difficulty'
        isMulti={false}
        options={props.difficultyPickerOptions}
        placeholder="Difficulty"
      />
      {formFieldError(formProps, 'difficulty', ['formField__error'])}
    </div>

  const description =
    <div className="moveForm__description mt-4">
      <FormFieldLabel label='Description'/>
      <RichTextEditor
        autoFocus={false}
        setEditorRef={props.setDescriptionEditorRef}
        content={formProps.values.description}
      />
      {formFieldError(formProps, 'description', ['formField__error'])}
    </div>

  const tags =
    <div className="moveForm__tags mt-4">
      <ValuePicker
        zIndex={10}
        ref={tagsPickerRef}
        isCreatable={true}
        label='Tags'
        defaultValue={props.tagPickerDefaultValue}
        fieldName='tags'
        isMulti={true}
        options={props.tagPickerOptions}
        placeholder="Tags"
      />
      {formFieldError(formProps, 'tags', ['formField__error'], "error")}
    </div>

  return (
    <form className="moveForm w-full" onSubmit={formProps.handleSubmit}>
      <div className={"moveForm flexcol"}>
        {nameField}
        {difficultyPicker}
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
              props.onCancel()
            }}
          >
            cancel
          </button>
        </div>
      </div>
    </form>
  )
}


// MoveForm

type MoveFormPropsT = {
  onCancel: () => void,
  onSubmit: (id: UUID, values: any) => void,
  knownTags: Array<TagT>,
  move: MoveT,
  autoFocus: boolean,
};

export function MoveForm(props: MoveFormPropsT) {
  const refs = {};
  const setTagsPickerRef = x => refs.tagsPickerRef = x;
  const setDifficultyPickerRef = x => refs.difficultyPickerRef = x;
  const setDescriptionEditorRef = x => refs.descriptionEditorRef = x;

  const toPickerValue = val => {
    return {
      label: difficulties[val],
      value: val
    }
  }

  const EnhancedForm = withFormik({
    mapPropsToValues: () => ({
      name: props.move.name,
      description: props.move.description,
      difficulty: props.move.difficulty,
      tags: props.move.tags,
    }),

    validate: (values, formProps) => {
      values.description = getContentFromEditor(refs.descriptionEditorRef.current, '');
      values.difficulty = getValueFromPicker(refs.difficultyPickerRef.current, '');
      values.tags = getValueFromPicker(refs.tagsPickerRef.current, []);

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
  })(InnerForm({
    autoFocus: props.autoFocus,
    difficultyPickerDefaultValue: toPickerValue(props.move.difficulty),
    difficultyPickerOptions: [
      toPickerValue('beg'),
      toPickerValue('beg/int'),
      toPickerValue('int'),
      toPickerValue('int/adv'),
      toPickerValue('adv'),
    ],
    tagPickerOptions: props.knownTags.map(strToPickerValue),
    tagPickerDefaultValue: props.move.tags.map(strToPickerValue),
    onCancel: props.onCancel,
    setTagsPickerRef,
    setDifficultyPickerRef,
    setDescriptionEditorRef,
  }));

  return <EnhancedForm/>;
}
