// @flow

import { values } from 'rambda';
import React from 'react';
import { withFormik } from 'formik';

import { UUID } from 'src/kernel/types';
import { TagT } from 'src/tags/types';
import { MoveListT } from 'src/move_lists/types';
import { ValuePicker, strToPickerValue } from 'src/utils/value_picker';
import {
  FormField,
  FormFieldError,
  FormFieldLabel,
} from 'src/utils/form_utils';
import {
  RichTextEditor,
  getContentFromEditor,
} from 'src/rich_text/presentation/RichTextEditor';
import { toEditorState } from 'src/rich_text/utils/EditorState';
import { newMoveListSlug } from 'src/app/utils';
import { slugify } from 'src/utils/utils';

// MoveListForm

type InnerFormPropsT = {
  autoFocus: boolean;
  tagPickerOptions: Array<any>;
  onCancel: () => void;
  descriptionEditorRef: any;
  tagsPickerValue: any;
  setTagsPickerValue: Function;
};

const InnerForm = (props: InnerFormPropsT) => (formProps) => {
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
      className={'button ml-2 flex-none'}
      onClick={() => {
        const newSlug = slugify(formProps.values.name);
        if (newSlug) {
          formProps.setFieldValue('slug', newSlug);
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

  const description = (
    <div className="moveListForm__description mt-4">
      <FormFieldLabel label="Description" fieldName="description" />
      <RichTextEditor
        autoFocus={false}
        readOnly={false}
        ref={props.descriptionEditorRef}
        initialEditorState={toEditorState(formProps.values.description)}
      />
      <FormFieldError
        formProps={formProps}
        fieldName="description"
        classNames={['formField__error']}
      />
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
        classNames={['formField__error']}
        key={'error'}
      />
    </div>
  );

  return (
    <form className="moveListForm w-full" onSubmit={formProps.handleSubmit}>
      <div className={'moveListForm flexcol'}>
        {nameField}
        {formProps.values.slug != newMoveListSlug && slugField}
        {description}
        {!formProps.values.role == 'trash' && isPrivateField}
        {tags}
        <div className={'moveListForm__buttonPanel flexrow mt-4'}>
          <button
            className="button button--wide ml-2"
            type="submit"
            disabled={formProps.isSubmitting}
          >
            save
          </button>
          <button
            className="button button--wide ml-2"
            onClick={(e) => {
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
  onCancel: () => void;
  onSubmit: (id: UUID, values: any) => void;
  knownTags: Array<TagT>;
  moveList: MoveListT;
  moveListSlugs: Array<string>;
  autoFocus: boolean;
};

export function MoveListForm(props: MoveListFormPropsT) {
  const descriptionEditorRef = React.useRef(null);
  const [tagsPickerValue, setTagsPickerValue] = React.useState(
    props.moveList.tags.map(strToPickerValue)
  );

  const EnhancedForm = withFormik({
    mapPropsToValues: () => ({
      name: props.moveList.name,
      slug: props.moveList.slug,
      isPrivate: props.moveList.isPrivate,
      role: props.moveList.role,
      description: props.moveList.description,
      tags: props.moveList.tags,
      tagsPickerValue,
      setTagsPickerValue,
    }),

    validate: (values, formProps) => {
      values.description = getContentFromEditor(
        descriptionEditorRef.current,
        ''
      );
      values.tags = (tagsPickerValue || []).map((x) => x.value);

      let errors = {};
      if (!values.name) {
        errors.name = 'This field is required';
      }
      if (!values.tags) {
        errors.tags = 'This field is required';
      }
      if (props.moveListSlugs.some((x) => x == values.slug)) {
        errors.slug = 'A move list with this slug already exists';
      }
      return errors;
    },

    handleSubmit: (values, { setSubmitting }) => {
      props.onSubmit({ ...values, id: props.moveList.id });
    },
    displayName: 'BasicForm', // helps with React DevTools
  })(
    InnerForm({
      autoFocus: props.autoFocus,
      tagPickerOptions: props.knownTags.map(strToPickerValue),
      onCancel: props.onCancel,
      descriptionEditorRef,
      tagsPickerValue,
      setTagsPickerValue,
    })
  );

  return <EnhancedForm />;
}
