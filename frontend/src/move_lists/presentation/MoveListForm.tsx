import React from 'react';

import {
  FormStateProvider,
  HandleSubmitArgsT,
  HandleValidateArgsT,
  useFormStateContext,
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
import { ValuePicker } from 'src/utils/value_picker';
import { Field } from 'src/forms/components/Field';

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

  const SaveButton = () => {
    const formState = useFormStateContext();
    return (
      <button
        className="button button--wide ml-2"
        onClick={(e) => {
          e.preventDefault();
          formState.submit();
        }}
        disabled={false}
      >
        save
      </button>
    );
  };

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
    <Field fieldName="tags" label="Tags">
      <div className="moveListForm__tags">
        <ValuePicker
          zIndex={10}
          isCreatable={true}
          isMulti={true}
          pickableValues={props.knownTags}
          labelFromValue={(x) => x}
        />
      </div>
    </Field>
  );

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
