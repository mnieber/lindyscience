import React from 'react';

import { UUID } from 'src/kernel/types';
import { VideoController } from 'src/moves/MoveCtr/facets/VideoController';
import { TagT } from 'src/tags/types';
import { MovePrivateDataT } from 'src/moves/types';
import { MoveDescriptionEditor } from 'src/moves/components/MoveDescriptionEditor';
import { FormStateProvider, HandleSubmitArgsT } from 'react-form-state-context';
import { getContentFromEditor } from 'src/richtext/components/RichTextEditor';
import {
  Field,
  CancelButton,
  SaveButton,
  TagsField,
} from 'src/forms/components';

type PropsT = {
  onCancel: () => void;
  onSubmit: (values: any) => void;
  knownTags: Array<TagT>;
  moveId: UUID;
  movePrivateData?: MovePrivateDataT;
  autoFocus: boolean;
  videoController?: VideoController;
};

export const MovePrivateDataForm: React.FC<PropsT> = (props: PropsT) => {
  const notesEditorRef = React.useRef(null);
  const notes = props.movePrivateData ? props.movePrivateData.notes || '' : '';
  const tags = props.movePrivateData ? props.movePrivateData.tags || [] : [];

  const initialValues = {
    notes: notes,
    tags: tags,
  };

  const initialErrors = {};

  const handleValidate = () => {};

  const handleSubmit = ({ values }: HandleSubmitArgsT) => {
    props.onSubmit({
      ...values,
      notes: getContentFromEditor(notesEditorRef.current, ''),
    });
  };

  const notesDiv = (
    <Field fieldName="notes" label="Notes">
      <div className="movePrivateDataForm__notes mt-4">
        <MoveDescriptionEditor
          editorId={'privateData_' + props.moveId}
          autoFocus={props.autoFocus}
          readOnly={false}
          editorRef={notesEditorRef}
          description={initialValues.notes}
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
      <form className="movePrivateDataForm w-full">
        <div className={'flexcol'}>
          {notesDiv}
          <TagsField knownTags={props.knownTags} />
          <div className={'movePrivateDataForm__buttonPanel flexrow mt-4'}>
            <SaveButton />
            <CancelButton onCancel={props.onCancel} />
          </div>
        </div>
      </form>
    </FormStateProvider>
  );
};
