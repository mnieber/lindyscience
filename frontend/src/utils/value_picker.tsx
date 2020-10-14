import React from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { isNil } from 'lodash/fp';

import { handleEnterAsTabToNext } from 'src/utils/form_utils';
import { stripQuotes } from 'src/utils/utils';
import { useFormStateContext } from 'react-form-state-context';
import { useFormFieldContext } from 'src/forms/components/FormFieldContext';

export interface PickerValueT {
  value: any;
  label: string;
}

export class NewPickerValue {
  label: string;

  constructor(label: string) {
    this.label = label;
  }
}

type PropsT<ValueT> = {
  isMulti: boolean;
  isCreatable: boolean;
  zIndex?: number;
  submitOnChange?: boolean;
  pickableValues: ValueT[];
  labelFromValue: (value: ValueT) => string;
};

export const ValuePicker = <ValueT,>(props: PropsT<ValueT>): JSX.Element => {
  const toPickerValue = (formValue: ValueT) => {
    return {
      value: formValue,
      label: props.labelFromValue(formValue),
    };
  };

  const formState = useFormStateContext();
  const fieldContext = useFormFieldContext();
  const formValue = formState.values[fieldContext.fieldName];
  const [options] = React.useState(props.pickableValues.map(toPickerValue));

  const toFormValue = (value: PickerValueT) => {
    return isNil(value.value) ? new NewPickerValue(value.label) : value.value;
  };

  const saveChanges = (value: any) => {
    const formValue = props.isMulti
      ? value.map(toFormValue)
      : toFormValue(value);
    formState.setValue(fieldContext.fieldName, formValue);

    if (!!props.submitOnChange) {
      formState.values[fieldContext.fieldName] = formValue;
      formState.submit();
    }
  };

  const pickerProps = {
    isMulti: props.isMulti,
    name: fieldContext.fieldName,
    options,
    placeholder: fieldContext.label,
    value: isNil(formValue)
      ? undefined
      : props.isMulti
      ? formValue.map(toPickerValue)
      : toPickerValue(formValue),
    onChange: saveChanges,
    onKeyDown: (e: any) => {
      handleEnterAsTabToNext(e, false);
    },
  };

  const picker = props.isCreatable ? (
    <CreatableSelect {...pickerProps} />
  ) : (
    <Select {...pickerProps} />
  );

  return <div style={{ zIndex: props.zIndex }}>{picker}</div>;
};

export function strToPickerValue(value: string) {
  return {
    value: stripQuotes(value),
    label: stripQuotes(value),
  };
}
