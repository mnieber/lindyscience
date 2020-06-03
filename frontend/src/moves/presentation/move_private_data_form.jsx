// @flow

import { values } from 'rambda';
import React from 'react';
import { withFormik } from 'formik';

import { FormFieldError } from 'src/utils/form_utils';
import { VideoController } from 'src/screens/move_container/facets/video_controller';
import { MoveDescriptionEditor } from 'src/moves/presentation/move_description_editor';
import { ValuePicker, strToPickerValue } from 'src/utils/value_picker';
import { getContentFromEditor } from 'src/rich_text/presentation/rich_text_editor';
import type { UUID } from 'src/kernel/types';
import type { MovePrivateDataT } from 'src/moves/types';
import type { TagT } from 'src/tags/types';

// MovePrivateDataForm

type InnerFormPropsT = {
  autoFocus: boolean,
  tagPickerOptions: Array<any>,
  onCancel: () => void,
  notesEditorRef: any,
  moveId: UUID,
  videoController?: VideoController,
  tagsPickerValue: any,
  setTagsPickerValue: Function,
};

const InnerForm = (props: InnerFormPropsT) => (formProps) => {
  const notesDiv = (
    <div className="movePrivateDataForm__notes mt-4">
      <MoveDescriptionEditor
        editorId={'privateData_' + props.moveId}
        autoFocus={true}
        readOnly={false}
        editorRef={props.notesEditorRef}
        description={formProps.values.notes}
        videoController={props.videoController}
      />
      <FormFieldError
        formProps={formProps}
        fieldName="notes"
        classNames={['formField__error']}
      />
    </div>
  );

  const tags = (
    <div className="movePrivateDataForm__tags mt-4">
      <ValuePicker
        zIndex={10}
        isCreatable={true}
        label="Tags"
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
      className="movePrivateDataForm w-full"
      onSubmit={formProps.handleSubmit}
    >
      <div className={'flexcol'}>
        {notesDiv}
        {tags}
        <div className={'movePrivateDataForm__buttonPanel flexrow mt-4'}>
          <button
            className="button button--wide ml-2"
            type="submit"
            disabled={formProps.isSubmitting}
          >
            save
          </button>
          <button className="button button--wide ml-2" onClick={props.onCancel}>
            cancel
          </button>
        </div>
      </div>
    </form>
  );
};

type PropsT = {
  onCancel: () => void,
  onSubmit: (values: any) => void,
  knownTags: Array<TagT>,
  moveId: UUID,
  movePrivateData: ?MovePrivateDataT,
  autoFocus: boolean,
  videoController?: VideoController,
};

export function MovePrivateDataForm(props: PropsT) {
  const notesEditorRef = React.useRef(null);
  const notes = props.movePrivateData ? props.movePrivateData.notes || '' : '';
  const tags = props.movePrivateData ? props.movePrivateData.tags || [] : [];
  const [tagsPickerValue, setTagsPickerValue] = React.useState(
    tags.map(strToPickerValue)
  );

  const EnhancedForm = withFormik({
    mapPropsToValues: () => ({
      notes: notes,
      tags: tags,
    }),

    validate: (values, formProps) => {
      // HACK: add values from non-input fields
      values.notes = getContentFromEditor(notesEditorRef.current, '');
      values.tags = (tagsPickerValue || []).map((x) => x.value);
      let errors = {};
      return errors;
    },

    handleSubmit: (values, { setSubmitting }) => {
      props.onSubmit(values);
    },
    displayName: 'BasicForm', // helps with React DevTools
  })(
    InnerForm({
      autoFocus: props.autoFocus,
      tagPickerOptions: props.knownTags.map(strToPickerValue),
      onCancel: props.onCancel,
      notesEditorRef,
      moveId: props.moveId,
      videoController: props.videoController,
      tagsPickerValue,
      setTagsPickerValue,
    })
  );

  return <EnhancedForm />;
}
