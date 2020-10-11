import React from 'react';

import {
  FormStateProvider,
  HandleValidateArgsT,
  HandleSubmitArgsT,
} from 'react-form-state-context';
import { VideoController } from 'src/moves/MoveCtr/facets/VideoController';
import { TextField } from 'src/forms/components/TextField';
import { FormFieldError } from 'src/forms/components/FormFieldError';
import { TagT } from 'src/tags/types';
import { MoveT } from 'src/moves/types';
import { StartField } from 'src/moves/presentation/StartField';
import { EndField } from 'src/moves/presentation/EndField';
import { strToPickerValue } from 'src/utils/value_picker';
import { FormFieldLabel } from 'src/forms/components/FormFieldLabel';
import { MoveDescriptionEditor } from 'src/moves/presentation/MoveDescriptionEditor';
import { newMoveSlug } from 'src/moves/utils';
import { getContentFromEditor } from 'src/rich_text/presentation/RichTextEditor';
import { SlugField } from 'src/move_lists/presentation/SlugField';
import { FormFieldContext } from 'src/forms/components/FormFieldContext';
import { ValuePicker, PickerValueT } from 'src/utils/value_picker';

// MoveForm

interface FieldT {
  fieldName: string;
  label: string;
}

const Field: React.FC<FieldT> = ({ fieldName, label, children }) => {
  return (
    <FormFieldContext fieldName={fieldName} label={label}>
      <div className="flex flex-col">
        <FormFieldLabel />
        {children}
        <FormFieldError />
      </div>
    </FormFieldContext>
  );
};

type PropsT = {
  onCancel: () => void;
  onSubmit: (values: any) => void;
  knownTags: Array<TagT>;
  move: MoveT;
  videoController: VideoController;
  setAltLink: (link: string) => any;
  autoFocus: boolean;
};

export const MoveForm: React.FC<PropsT> = (props: PropsT) => {
  const editorRef = React.useRef(null);

  const startTime = props.move.startTimeMs
    ? props.move.startTimeMs / 1000.0
    : '';

  const initialValues = {
    name: props.move.name,
    slug: props.move.slug,
    link: props.move.link || '',
    description: props.move.description,
    tags: props.move.tags,
    startTime: startTime,
    endTime: props.move.endTimeMs ? props.move.endTimeMs / 1000.0 : '',
    tagPVs: props.move.tags.map(strToPickerValue),
  };

  const initialErrors = {};

  const handleValidate = ({ values, setError }: HandleValidateArgsT) => {
    if (!values.name) {
      setError('name', 'This field is required');
    }
    if (!values.tags) {
      setError('tags', 'This field is required');
    }
  };

  const handleSubmit = ({ values }: HandleSubmitArgsT) => {
    props.onSubmit({
      ...values,
      id: props.move.id,
      startTimeMs: Math.trunc((values.startTime as number) * 1000),
      endTimeMs: Math.trunc((values.endTime as number) * 1000),
      startTime: undefined,
      endTime: undefined,
      description: getContentFromEditor(editorRef.current, ''),
      tags: values.tagPVs.map((x: PickerValueT) => x.value),
    });
  };

  const nameField = (
    <Field label="Name" fieldName="name">
      <TextField classNames="w-full" autoFocus={props.autoFocus} />
    </Field>
  );

  const linkField = (
    <Field label="Link" fieldName="link">
      <TextField
        classNames="w-full"
        type="text"
        onChange={(x: any) => props.setAltLink(x.target.value)}
      />
    </Field>
  );

  const description = (
    <Field label="Description" fieldName="description">
      <div className="moveForm__description mt-4">
        <MoveDescriptionEditor
          editorId={'move_' + props.move.id}
          autoFocus={false}
          readOnly={false}
          editorRef={editorRef}
          description={initialValues.description}
          videoController={props.videoController}
        />
      </div>
    </Field>
  );

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
    <Field label="Tags" fieldName="tagPVs">
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

  return (
    <FormStateProvider
      initialValues={initialValues}
      initialErrors={initialErrors}
      handleValidate={handleValidate}
      handleSubmit={handleSubmit}
    >
      <form className="moveForm w-full">
        <div className={'moveForm flexcol'}>
          {nameField}
          {initialValues.slug !== newMoveSlug && slugField}
          {linkField}
          <StartField videoController={props.videoController} />
          <EndField videoController={props.videoController} />
          {description}
          {tagsField}
          <div className={'moveForm__buttonPanel flexrow mt-4'}>
            <SaveButton />
            <CancelButton />
          </div>
        </div>
      </form>
    </FormStateProvider>
  );
};
