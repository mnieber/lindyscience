import React from 'react';
import Select from 'react-select';
// @ts-ignore
import Creatable from 'react-select';
import jQuery from 'jquery';

import { handleEnterAsTabToNext } from 'src/utils/form_utils';
import { FormFieldLabel } from 'src/forms/components/FormFieldLabel';
import { stripQuotes } from 'src/utils/utils';
import { useFormStateContext } from 'react-form-state-context';
import { useFormFieldContext } from 'src/forms/components/FormFieldContext';

export interface PickerValueT {
  value: any;
  label: string;
}

type PropsT = {
  isMulti: boolean;
  isCreatable: boolean;
  zIndex?: number;
  submitOnChange?: boolean;
  options?: PickerValueT[];
};

export const ValuePicker: React.FC<PropsT> = (props: PropsT) => {
  const formState = useFormStateContext();
  const fieldContext = useFormFieldContext();

  const saveChanges = (value: any) => {
    if (!props.isMulti && jQuery.isArray(value)) {
      formState.setValue(fieldContext.fieldName, null);
    } else {
      formState.setValue(fieldContext.fieldName, value);
    }
    if (!!props.submitOnChange) {
      formState.submit();
    }
  };

  const pickerProps = {
    isMulti: props.isMulti,
    name: fieldContext.fieldName,
    options: props.options,
    placeholder: fieldContext.label,
    value: formState.values[fieldContext.fieldName],
    onChange: saveChanges,
    onKeyDown: (e: any) => {
      handleEnterAsTabToNext(e, false);
    },
  };

  const picker = props.isCreatable ? (
    <Creatable {...pickerProps} />
  ) : (
    <Select {...pickerProps} />
  );

  return (
    <div style={{ zIndex: props.zIndex }}>
      {fieldContext.label && <FormFieldLabel />}
      {picker}
    </div>
  );
};

export function strToPickerValue(value: string) {
  return {
    value: stripQuotes(value),
    label: stripQuotes(value),
  };
}
