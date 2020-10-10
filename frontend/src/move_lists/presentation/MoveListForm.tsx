import React from 'react';
import {
  FormStateProvider,
  HandleValidateArgsT,
  HandleSubmitArgsT,
} from 'react-form-state-context';

import { strToPickerValue } from 'src/utils/value_picker';
import { SlugField } from 'src/move_lists/presentation/SlugField';
import { TagsField } from 'src/move_lists/presentation/TagsField';
import { TextField } from 'src/forms/components/TextField';
import { FormFieldError } from 'src/forms/components/FormFieldError';
import { TagT } from 'src/tags/types';
import { MoveListT } from 'src/move_lists/types';
import { FormFieldLabel } from 'src/utils/form_utils';
import {
  RichTextEditor,
  getContentFromEditor,
} from 'src/rich_text/presentation/RichTextEditor';
import { toEditorState } from 'src/rich_text/utils/EditorState';
import { newMoveListSlug } from 'src/app/utils';
import { ControlledCheckbox } from 'src/session/presentation/form_fields/ControlledCheckbox';

// MoveListForm

type MoveListFormPropsT = {
  onCancel: () => void;
  onSubmit: (values: any) => void;
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

  const initialValues = {
    name: props.moveList.name,
    slug: props.moveList.slug,
    isPrivate: props.moveList.isPrivate,
    role: props.moveList.role,
    tags: props.moveList.tags,
    tagsPickerValue,
    setTagsPickerValue,
  };

  const initialErrors = {};

  const handleValidate = ({ values, setError }: HandleValidateArgsT) => {
    values.description = getContentFromEditor(descriptionEditorRef.current, '');
    values.tags = (tagsPickerValue || []).map((x) => x.value);

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
      description: getContentFromEditor(descriptionEditorRef.current, ''),
      tags: tagsPickerValue,
      id: props.moveList.id,
    });
  };

  const nameField = (
    <FormFieldLabel label="Name" fieldName="name">
      <TextField
        fieldName="name"
        classNames="w-full"
        placeholder="Name"
        autoFocus={props.autoFocus}
      />
    </FormFieldLabel>
  );

  const description = (
    <div className="moveListForm__description mt-4">
      <FormFieldLabel label="Description" fieldName="description" />
      <RichTextEditor
        autoFocus={false}
        readOnly={false}
        ref={descriptionEditorRef}
        initialEditorState={toEditorState(props.moveList.description)}
      />
      <FormFieldError fieldName="description" extraClass={'formField__error'} />
    </div>
  );

  const isPrivateField = (
    <FormFieldLabel label="Is private" fieldName="isPrivate">
      <ControlledCheckbox fieldName="isPrivate" />
    </FormFieldLabel>
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
          {initialValues.slug !== newMoveListSlug && <SlugField />}
          {description}
          {initialValues.role !== 'trash' && isPrivateField}
          <TagsField
            value={tagsPickerValue}
            setValue={setTagsPickerValue}
            knownTags={props.knownTags.map(strToPickerValue)}
          />
          <div className={'moveListForm__buttonPanel flexrow mt-4'}>
            <button
              className="button button--wide ml-2"
              type="submit"
              disabled={false}
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
    </FormStateProvider>
  );
}
