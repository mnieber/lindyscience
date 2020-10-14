import React from 'react';

import {
  FormStateProvider,
  HandleValidateArgsT,
  HandleSubmitArgsT,
} from 'react-form-state-context';

import { TextField } from 'src/forms/components/TextField';
import { Field } from 'src/forms/components/Field';
import { TagT } from 'src/tags/types';
import { CutPointT } from 'src/video/types';
import {
  ValuePicker,
  strToPickerValue,
} from 'src/utils/value_picker';
import { MoveDescriptionEditor } from 'src/moves/presentation/MoveDescriptionEditor';
import { getContentFromEditor } from 'src/rich_text/presentation/RichTextEditor';

type PropsT = {
  onSubmit: (values: any) => void;
  knownTags: Array<TagT>;
  cutPoint: CutPointT;
  videoController: any;
  autoFocus: boolean;
};

export function CutPointForm(props: PropsT) {
  const editorRef = React.useRef(null);

  const initialValues = {
    name: props.cutPoint.name,
    description: props.cutPoint.description,
    tags: props.cutPoint.tags.map(strToPickerValue),
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
      id: props.cutPoint.id,
      description: getContentFromEditor(editorRef.current, ''),
    });
  };

  const nameField = (
    <Field fieldName="name" label="Name">
      <TextField className="w-full" autoFocus={props.autoFocus} />
    </Field>
  );

  const description = (
    <Field fieldName="description" label="Description">
      <div className="cutPointForm__description mt-4">
        <MoveDescriptionEditor
          editorId={'cutPoint_' + props.cutPoint.id}
          readOnly={false}
          editorRef={editorRef}
          description={initialValues.description}
          videoController={props.videoController}
        />
      </div>
    </Field>
  );

  const tags = (
    <Field fieldName="tags" label="Tags">
      <div className="cutPointForm__tags mt-4">
        <ValuePicker
          zIndex={10}
          isCreatable={true}
          isMulti={true}
          pickableValues={props.knownTags}
          labelFromValue={x => x}
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
      <form className="cutPointForm w-full">
        <div className={'cutPointForm flexcol'}>
          {nameField}
          {description}
          {tags}
        </div>
      </form>
    </FormStateProvider>
  );
}
