import React from 'react';

import {
  FormStateProvider,
  HandleValidateArgsT,
  HandleSubmitArgsT,
} from 'react-form-state-context';
import { VideoController } from 'src/moves/MoveCtr/facets/VideoController';
import { TextField } from 'src/forms/components/TextField';
import { TagT } from 'src/tags/types';
import { MoveT } from 'src/moves/types';
import { StartField } from 'src/moves/presentation/StartField';
import { EndField } from 'src/moves/presentation/EndField';
import { MoveDescriptionEditor } from 'src/moves/presentation/MoveDescriptionEditor';
import { newMoveSlug } from 'src/moves/utils';
import { getContentFromEditor } from 'src/rich_text/presentation/RichTextEditor';
import { SlugField } from 'src/move_lists/presentation/SlugField';
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
    });
  };

  const nameField = (
    <Field label="Name" fieldName="name">
      <TextField className="w-full" autoFocus={props.autoFocus} />
    </Field>
  );

  const linkField = (
    <Field label="Link" fieldName="link">
      <TextField
        className="w-full"
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
          {initialValues.slug !== newMoveSlug && <SlugField />}
          {linkField}
          <StartField videoController={props.videoController} />
          <EndField videoController={props.videoController} />
          {description}
          <TagsField knownTags={props.knownTags} />
          <div className={'moveForm__buttonPanel flexrow mt-4'}>
            <SaveButton />
            <CancelButton onCancel={props.onCancel} />
          </div>
        </div>
      </form>
    </FormStateProvider>
  );
};
