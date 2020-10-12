import React from 'react';
import {
  FormStateProvider,
  HandleValidateArgsT,
  HandleSubmitArgsT,
} from 'react-form-state-context';

import { SlugField } from 'src/move_lists/presentation/SlugField';
import { TextField } from 'src/forms/components/TextField';
import { TagT } from 'src/tags/types';
import { MoveListT } from 'src/move_lists/types';
import { RichTextEditor } from 'src/rich_text/presentation/RichTextEditor';
import { toEditorState } from 'src/rich_text/utils/EditorState';
import { newMoveListSlug } from 'src/app/utils';
import { ControlledCheckbox } from 'src/session/presentation/form_fields/ControlledCheckbox';
import { ValuePicker, PickerValueT } from 'src/utils/value_picker';
import { strToPickerValue } from 'src/utils/value_picker';
import { Field } from 'src/forms/components/Field';

// MoveListForm

type PropsT = {
  onCancel: () => void;
  onSubmit: (values: any) => void;
  knownTags: Array<TagT>;
  moveList: MoveListT;
  moveListSlugs: Array<string>;
  autoFocus: boolean;
};

export function MoveListForm(props: PropsT) {
  const descriptionEditorRef = React.useRef(null);

  const initialValues = {
    name: props.moveList.name,
    slug: props.moveList.slug,
    isPrivate: props.moveList.isPrivate,
    role: props.moveList.role,
    tagPVs: props.moveList.tags.map(strToPickerValue),
  };

  const initialErrors = {};

  const handleValidate = ({ values, setError }: HandleValidateArgsT) => {
    if (!values.name) {
      setError('name', 'This field is required');
    }
    if (!values.tags) {
      setError('tags', 'This field is required');
    }
    if (props.moveListSlugs.some((x) => x === values.slug)) {
      setError('slug', 'A move list with this slug already exists');
    }
  };

  const handleSubmit = ({ values }: HandleSubmitArgsT) => {
    props.onSubmit({
      ...values,
      id: props.moveList.id,
      tags: values.tagPVs.map((x: PickerValueT) => x.value),
    });
  };

  const SaveButton = () => (
    <button className="button button--wide ml-2" type="submit" disabled={false}>
      save
    </button>
  );

  const CancelButton = () => (
    <button
      className="button button--wide ml-2"
      onClick={(e) => {
        e.preventDefault();
        props.onCancel();
      }}
    >
      cancel
    </button>
  );

  const tagsField = (
    <Field fieldName="tagPVs" label="Tags">
      <div className="moveListForm__tags mt-4">
        <ValuePicker
          zIndex={10}
          isCreatable={true}
          isMulti={true}
          options={props.knownTags.map(strToPickerValue)}
        />
      </div>
    </Field>
  );

  const slugField = (
    <Field label="Slug" fieldName="slug">
      <SlugField />
    </Field>
  );

  const descriptionField = (
    <Field fieldName="description" label="Description">
      <div className="moveListForm__description mt-4">
        <RichTextEditor
          autoFocus={false}
          readOnly={false}
          ref={descriptionEditorRef}
          initialEditorState={toEditorState(props.moveList.description)}
        />
      </div>
    </Field>
  );

  const nameField = (
    <Field fieldName="name" label="Name">
      <TextField classNames="w-full" autoFocus={props.autoFocus} />
    </Field>
  );

  const isPrivateField = (
    <Field label="Is private" fieldName="isPrivate">
      <ControlledCheckbox />
    </Field>
  );

  return (
    <FormStateProvider
      initialValues={initialValues}
      initialErrors={initialErrors}
      handleValidate={handleValidate}
      handleSubmit={handleSubmit}
    >
      <form className="moveListForm w-full">
        <div className={'moveListForm flexcol'}>
          {nameField}
          {initialValues.slug !== newMoveListSlug && slugField}
          {descriptionField}
          {initialValues.role !== 'trash' && isPrivateField}
          {tagsField}
          <div className={'moveListForm__buttonPanel flexrow mt-4'}>
            <SaveButton />
            <CancelButton />
          </div>
        </div>
      </form>
    </FormStateProvider>
  );
}
