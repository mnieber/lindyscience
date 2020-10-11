import React from 'react';

import { UUID } from 'src/kernel/types';
import { VideoController } from 'src/moves/MoveCtr/facets/VideoController';
import { TagT } from 'src/tags/types';
import { MovePrivateDataT } from 'src/moves/types';
import { strToPickerValue } from 'src/utils/value_picker';
import { MoveDescriptionEditor } from 'src/moves/presentation/MoveDescriptionEditor';
import { FormStateProvider, HandleSubmitArgsT } from 'react-form-state-context';
import { getContentFromEditor } from 'src/rich_text/presentation/RichTextEditor';

import { FormFieldContext } from 'src/forms/components/FormFieldContext';
import { FormFieldError } from 'src/forms/components/FormFieldError';
import { FormFieldLabel } from 'src/forms/components/FormFieldLabel';
import { ValuePicker, PickerValueT } from 'src/utils/value_picker';

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
    tagPVs: tags.map(strToPickerValue),
  };

  const initialErrors = {};

  const handleValidate = () => {};

  const handleSubmit = ({ values }: HandleSubmitArgsT) => {
    props.onSubmit({
      values,
      notes: getContentFromEditor(notesEditorRef.current, ''),
      tags: values.tagPVs.map((x: PickerValueT) => x.value),
    });
  };

  const notesDiv = (
    <div className="movePrivateDataForm__notes mt-4">
      <Decorated
        fieldName="notes"
        label="Notes"
        component={
          <MoveDescriptionEditor
            editorId={'privateData_' + props.moveId}
            autoFocus={props.autoFocus}
            readOnly={false}
            editorRef={notesEditorRef}
            description={initialValues.notes}
            videoController={props.videoController}
          />
        }
      />
    </div>
  );

  const tagsField = (
    <Decorated
      component={
        <div className="moveListForm__tags mt-4">
          <ValuePicker
            zIndex={10}
            isCreatable={true}
            isMulti={true}
            options={props.knownTags.map(strToPickerValue)}
          />
        </div>
      }
      fieldName="tagPVs"
      label="Tags"
    />
  );

  const SaveButton = () => (
    <button className="button button--wide ml-2" type="submit">
      save
    </button>
  );

  const CancelButton = () => (
    <button className="button button--wide ml-2" onClick={props.onCancel}>
      cancel
    </button>
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
          {tagsField}
          <div className={'movePrivateDataForm__buttonPanel flexrow mt-4'}>
            <SaveButton />
            <CancelButton />
          </div>
        </div>
      </form>
    </FormStateProvider>
  );
};
