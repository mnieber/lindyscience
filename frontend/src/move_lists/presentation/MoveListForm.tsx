import React from 'react';

import {
  FormStateProvider,
  HandleSubmitArgsT,
  HandleValidateArgsT,
} from 'react-form-state-context';
import {
  RichTextEditor,
  getContentFromEditor,
} from 'src/rich_text/presentation/RichTextEditor';
import { SlugField } from 'src/move_lists/presentation/SlugField';
import { TextField } from 'src/forms/components/TextField';
import { TagT } from 'src/tags/types';
import { MoveListT } from 'src/move_lists/types';
import { toEditorState } from 'src/rich_text/utils/EditorState';
import { newMoveListSlug } from 'src/app/utils';
import { ControlledCheckbox } from 'src/session/presentation/form_fields/ControlledCheckbox';
import {
  Field,
  SaveButton,
  CancelButton,
  TagsField,
} from 'src/forms/components';

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
    tags: props.moveList.tags,
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
      description: getContentFromEditor(descriptionEditorRef.current, ''),
    });
  };

  const descriptionField = (
    <Field fieldName="description" label="Description">
      <div className="moveListForm__description">
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
      <TextField className="w-full" autoFocus={props.autoFocus} />
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
          {initialValues.slug !== newMoveListSlug && <SlugField />}
          {descriptionField}
          {initialValues.role !== 'trash' && isPrivateField}
          <TagsField knownTags={props.knownTags} />
          <div className={'moveListForm__buttonPanel flexrow mt-4'}>
            <SaveButton />
            <CancelButton onCancel={props.onCancel} />
          </div>
        </div>
      </form>
    </FormStateProvider>
  );
}
