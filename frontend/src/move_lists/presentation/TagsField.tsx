import React from 'react';
import { ValuePicker } from 'src/utils/value_picker';
import { FormFieldError } from 'src/forms/components/FormFieldError';

interface PickerValueT {
  value: string;
  label: string;
}

interface PropsT {
  value: PickerValueT[];
  setValue: (tags: PickerValueT[]) => void;
  knownTags: PickerValueT[];
}

export const TagsField: React.FC<PropsT> = (props: PropsT) => {
  return (
    <FormFieldContext name="tags" label="Tags">
      <div className="moveListForm__tags mt-4">
        <ValuePicker
          zIndex={10}
          isCreatable={true}
          isMulti={true}
          options={props.knownTags}
          value={props.value}
          setValue={props.setValue}
        />
        <FormFieldError fieldName="tags" extraClass={'formField__error'} />
      </div>
    </FormFieldContext>
  );
};
