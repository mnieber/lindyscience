import React from 'react';
import {
  FormStateProvider,
  useFormStateContext,
  HandleValidateT,
  HandleSubmitT,
} from 'react-form-state-context';

import { TextField } from 'src/forms/components/TextField';
import { FormFieldError } from 'src/forms/components/FormFieldError';
import { TagT } from 'src/tags/types';
import { MoveListT } from 'src/move_lists/types';
import { ValuePicker, strToPickerValue } from 'src/utils/value_picker';
import { FormFieldLabel } from 'src/utils/form_utils';
import {
  RichTextEditor,
  getContentFromEditor,
} from 'src/rich_text/presentation/RichTextEditor';
import { toEditorState } from 'src/rich_text/utils/EditorState';
import { newMoveListSlug } from 'src/app/utils';
import { slugify } from 'src/utils/utils';
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

  const handleValidate: HandleValidateT = ({ values, setError }) => {
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

  const handleSubmit: HandleSubmitT = ({ values }) => {
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

  const UpdateSlugBtn = () => {
    const formState = useFormStateContext();
    return (
      <div
        key="updateSlugBtn"
        className={'button ml-2 flex-none'}
        onClick={() => {
          const newSlug = slugify(formState.values.name);
          if (newSlug) {
            formState.setValue('slug', newSlug);
          }
        }}
      >
        Update
      </div>
    );
  };

  const slugField = (
    <FormFieldLabel label="Slug" fieldName="slug">
      <TextField
        fieldName="name"
        classNames="flex-1"
        placeholder="Slug"
        disabled={true}
        buttons={[<UpdateSlugBtn />]}
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

  const tags = (
    <div className="moveListForm__tags mt-4">
      <ValuePicker
        zIndex={10}
        isCreatable={true}
        label="Tags"
        fieldName="tags"
        isMulti={true}
        options={props.knownTags.map(strToPickerValue)}
        placeholder="Tags"
        value={tagsPickerValue}
        setValue={setTagsPickerValue}
      />
      <FormFieldError fieldName="tags" extraClass={'formField__error'} />
    </div>
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
          {description}
          {initialValues.role !== 'trash' && isPrivateField}
          {tags}
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
