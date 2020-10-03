// @flow

import { values } from 'rambda';
import { Formik } from 'formik';
import React from 'react';

import { VideoController } from 'src/moves/MoveCtr/facets/VideoController';
import type { UUID } from 'src/kernel/types';
import type { TagT } from 'src/tags/types';
import type { CutPointT } from 'src/video/types';
import { ValuePicker, strToPickerValue } from 'src/utils/value_picker';
import { FormField, FormFieldError } from 'src/utils/form_utils';
import { MoveDescriptionEditor } from 'src/moves/presentation/MoveDescriptionEditor';
import { getContentFromEditor } from 'src/rich_text/presentation/RichTextEditor';

type InnerFormPropsT = {
  tagPickerOptions: Array<any>,
  videoController: VideoController,
  cutPointId: UUID,
  autoFocus: boolean,
  editorRef: any,
  tagsPickerValue: any,
  setTagsPickerValue: Function,
};

const InnerForm = (props: InnerFormPropsT) => (formProps) => {
  const nameField = (
    <FormField
      classNames="w-full"
      formProps={formProps}
      fieldName="name"
      type="text"
      placeholder="Name"
      autoFocus={props.autoFocus}
    />
  );

  const description = (
    <div className="cutPointForm__description mt-4">
      <MoveDescriptionEditor
        editorId={'cutPoint_' + props.cutPointId}
        placeholder="Description"
        readOnly={false}
        editorRef={props.editorRef}
        description={formProps.values.description}
        videoController={props.videoController}
      />
      <FormFieldError
        formProps={formProps}
        fieldName="description"
        classNames={['formField__error']}
      />
    </div>
  );

  const tags = (
    <div className="cutPointForm__tags mt-4">
      <ValuePicker
        zIndex={10}
        isCreatable={true}
        fieldName="tags"
        isMulti={true}
        options={props.tagPickerOptions}
        placeholder="Tags"
        value={props.tagsPickerValue}
        setValue={props.setTagsPickerValue}
      />
      <FormFieldError
        formProps={formProps}
        fieldName="tags"
        classNames={['formField__error']}
        key="error"
      />
    </div>
  );

  return (
    <form
      onBlur={() => {
        formProps.submitForm();
      }}
      className="cutPointForm w-full"
      onSubmit={formProps.handleSubmit}
    >
      <div className={'cutPointForm flexcol'}>
        {nameField}
        {description}
        {tags}
      </div>
    </form>
  );
};

// CutPointForm

type PropsT = {
  onSubmit: (values: any) => void,
  knownTags: Array<TagT>,
  cutPoint: CutPointT,
  videoController: any,
  autoFocus: boolean,
};

export function CutPointForm(props: PropsT) {
  const editorRef = React.useRef(null);
  const [tagsPickerValue, setTagsPickerValue] = React.useState(
    props.cutPoint.tags.map(strToPickerValue)
  );

  return (
    <Formik
      initialValues={{
        name: props.cutPoint.name,
        description: props.cutPoint.description,
        tags: props.cutPoint.tags,
      }}
      validate={(values, formProps) => {
        values.description = getContentFromEditor(editorRef.current, '');
        values.tags = (tagsPickerValue || []).map((x) => x.value);

        let errors = {};
        if (!values.name) {
          errors.name = 'This field is required';
        }
        if (!values.tags) {
          errors.tags = 'This field is required';
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        props.onSubmit({ ...values, id: props.cutPoint.id });
      }}
      displayName={'BasicForm'}
      render={InnerForm({
        tagPickerOptions: props.knownTags.map(strToPickerValue),
        videoController: props.videoController,
        cutPointId: props.cutPoint.id,
        autoFocus: props.autoFocus,
        editorRef,
        tagsPickerValue,
        setTagsPickerValue,
      })}
    />
  );
}