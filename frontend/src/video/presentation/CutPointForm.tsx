import React from 'react';

import {
  FormStateProvider,
  HandleValidateArgsT,
  HandleSubmitArgsT,
} from 'react-form-state-context';

import { TextField } from 'src/forms/components/TextField';
import { FormFieldContext } from 'src/forms/components/FormFieldContext';
import { FormFieldError } from 'src/forms/components/FormFieldError';
import { FormFieldLabel } from 'src/forms/components/FormFieldLabel';
import { TagT } from 'src/tags/types';
import { CutPointT } from 'src/video/types';
import {
  ValuePicker,
  strToPickerValue,
  PickerValueT,
} from 'src/utils/value_picker';
import { MoveDescriptionEditor } from 'src/moves/presentation/MoveDescriptionEditor';
import { getContentFromEditor } from 'src/rich_text/presentation/RichTextEditor';

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
    tagPVs: props.cutPoint.tags.map(strToPickerValue),
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
      tags: values.tagPVs.map((x: PickerValueT) => x.value),
    });
  };

  const nameField = (
    <Field fieldName="name" label="Name">
      <TextField classNames="w-full" autoFocus={props.autoFocus} />
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
    <Field fieldName="tagPVs" label="Tags">
      <div className="cutPointForm__tags mt-4">
        <ValuePicker
          zIndex={10}
          isCreatable={true}
          isMulti={true}
          options={props.knownTags.map(strToPickerValue)}
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
