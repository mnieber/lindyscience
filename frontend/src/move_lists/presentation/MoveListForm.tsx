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
import { FormFieldContext } from 'src/forms/components/FormFieldContext';
import { FormFieldError } from 'src/forms/components/FormFieldError';
import { FormFieldLabel } from 'src/forms/components/FormFieldLabel';
import { TagT } from 'src/tags/types';
import { MoveListT } from 'src/move_lists/types';
import {
  RichTextEditor,
  getContentFromEditor,
} from 'src/rich_text/presentation/RichTextEditor';
import { toEditorState } from 'src/rich_text/utils/EditorState';
import { newMoveListSlug } from 'src/app/utils';
import { ControlledCheckbox } from 'src/session/presentation/form_fields/ControlledCheckbox';

// MoveListForm

const Decorated = ({
  component,
  fieldName,
  label,
}: {
  component: any;
  fieldName: string;
  label: string;
}) => {
  return (
    <FormFieldContext fieldName={fieldName} label={label}>
      <div className="flex flex-col">
        <FormFieldLabel />
        {component}
        <FormFieldError />
      </div>
    </FormFieldContext>
  );
};

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
  const [tagsPickerValue, setTagsPickerValue] = React.useState(
    props.moveList.tags.map(strToPickerValue)
  );

  const initialValues = {
    name: props.moveList.name,
    slug: props.moveList.slug,
    isPrivate: props.moveList.isPrivate,
    role: props.moveList.role,
    tags: props.moveList.tags,
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
    <Decorated
      component={
        <TagsField
          value={tagsPickerValue}
          setValue={setTagsPickerValue}
          knownTags={props.knownTags.map(strToPickerValue)}
        />
      }
      fieldName="tags"
      label="Tags"
    />
  );

  const slugField = (
    <Decorated component={<SlugField />} label="Slug" fieldName="slug" />
  );

  const descriptionField = (
    <Decorated
      component={
        <div className="moveListForm__description mt-4">
          <RichTextEditor
            autoFocus={false}
            readOnly={false}
            ref={descriptionEditorRef}
            initialEditorState={toEditorState(props.moveList.description)}
          />
        </div>
      }
      fieldName="description"
      label="Description"
    />
  );

  const nameField = (
    <Decorated
      component={<TextField classNames="w-full" autoFocus={props.autoFocus} />}
      fieldName="name"
      label="Name"
    />
  );

  const isPrivateField = (
    <Decorated
      component={<ControlledCheckbox />}
      label="Is private"
      fieldName="isPrivate"
    />
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
