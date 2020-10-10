import React from 'react';
import { ValuePicker } from 'src/utils/value_picker';
import { useFormFieldContext } from 'src/forms/components/FormFieldContext';

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
  const fieldContext = useFormFieldContext();

  return (
    <div className="moveListForm__tags mt-4">
      <ValuePicker
        fieldName={fieldContext.fieldName}
        zIndex={10}
        isCreatable={true}
        isMulti={true}
        options={props.knownTags}
        value={props.value}
        setValue={props.setValue}
      />
    </div>
  );
};
