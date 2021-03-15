import React from 'react';
import { observer } from 'mobx-react';

import {
  FormStateProvider,
  HandleValidateArgsT,
  HandleSubmitArgsT,
  useFormStateContext,
} from 'react-form-state-context';
import { useMobXState } from 'src/forms/components/MobXFormState';

import { TextField } from 'src/forms/components/TextField';
import { Field } from 'src/forms/components/Field';
import { TagT } from 'src/tags/types';
import { CutPointT } from 'src/video/types';
import { ValuePicker } from 'src/utils/value_picker';
import { MoveDescriptionEditor } from 'src/moves/components/MoveDescriptionEditor';
import { getContentFromEditor } from 'src/richtext/components/RichTextEditor';

type PropsT = {
  onSubmit: (values: any) => void;
  knownTags: Array<TagT>;
  cutPoint: CutPointT;
  videoController: any;
  autoFocus: boolean;
};

export const CutPointForm = observer((props: PropsT) => {
  const editorRef = React.useRef(null);

  const initialValues = {
    id: props.cutPoint.id,
    name: props.cutPoint.name,
    description: props.cutPoint.description,
    tags: props.cutPoint.tags,
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
      description: getContentFromEditor(editorRef.current, ''),
    });
  };

  const formId = `cutPointForm_${props.cutPoint.id}`;

  const FormFields = () => {
    const formState = useFormStateContext();

    const onBlur = (e: React.FocusEvent) => {
      const target = e.relatedTarget as HTMLElement;
      const parentForm = target?.closest('#' + formId);
      if (parentForm === null) {
        formState.submit();
      }
    };

    const NameField = () => {
      return (
        <Field fieldName="name" label="Name">
          <TextField className="w-full" onBlur={onBlur} />
        </Field>
      );
    };

    const DescriptionField = () => {
      return (
        <Field fieldName="description" label="Description">
          <div className="cutPointForm__description mt-4">
            <MoveDescriptionEditor
              editorId={'cutPoint_' + props.cutPoint.id}
              readOnly={false}
              editorRef={editorRef}
              description={initialValues.description}
              videoController={props.videoController}
              onBlur={onBlur}
            />
          </div>
        </Field>
      );
    };

    const TagsField = () => {
      return (
        <Field fieldName="tags" label="Tags">
          <div className="cutPointForm__tags mt-4">
            <ValuePicker
              zIndex={10}
              isCreatable={true}
              isMulti={true}
              pickableValues={props.knownTags}
              labelFromValue={(x) => x}
              onBlur={onBlur}
            />
          </div>
        </Field>
      );
    };

    return (
      <div className={'cutPointForm flexcol'}>
        <NameField />
        <DescriptionField />
        <TagsField />
      </div>
    );
  };

  return (
    <FormStateProvider
      initialValues={initialValues}
      initialErrors={initialErrors}
      handleValidate={handleValidate}
      handleSubmit={handleSubmit}
      createState={useMobXState}
    >
      <form id={formId} className="cutPointForm w-full">
        <FormFields />
      </form>
    </FormStateProvider>
  );
});
