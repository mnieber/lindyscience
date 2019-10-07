// @flow

import React from "react";
// $FlowFixMe
import Select from "react-select";
// $FlowFixMe
import Creatable from "react-select/lib/Creatable";
// $FlowFixMe
import jQuery from "jquery";

import { FormFieldLabel, handleEnterAsTabToNext } from "utils/form_utils";
import { isNone, stripQuotes } from "utils/utils";

type ValuePickerPropsT = {
  isMulti: boolean,
  isCreatable: boolean,
  zIndex?: number,
  defaultValue: ?any,
  onChange?: Function,
  fieldName: string,
  options?: any,
  placeholder?: string,
  label?: string,
  forwardedRef?: any,
};

export function ValuePicker_(props: ValuePickerPropsT) {
  const [value, setValue] = React.useState(props.defaultValue);

  const saveChanges = (value: any) => {
    if (!props.isMulti && jQuery.isArray(value)) {
      setValue({ value: null, label: "" });
    } else {
      setValue(value);
    }
    if (props.onChange) {
      props.onChange(value);
    }
  };

  const pickerProps = {
    isMulti: props.isMulti,
    name: props.fieldName,
    options: props.options,
    placeholder: props.placeholder,
    value: value,
    onChange: saveChanges,
    onKeyDown: e => {
      handleEnterAsTabToNext(e, false);
    },
    defaultValue: props.defaultValue,
    ref: props.forwardedRef,
  };

  const picker = props.isCreatable ? (
    <Creatable {...pickerProps} />
  ) : (
    <Select {...pickerProps} />
  );

  return (
    <div style={{ zIndex: props.zIndex }}>
      {props.label && (
        <FormFieldLabel fieldName={props.fieldName} label={props.label} />
      )}
      {picker}
    </div>
  );
}

// $FlowFixMe
export const ValuePicker = React.forwardRef((props, ref) => {
  return <ValuePicker_ {...props} forwardedRef={ref} />;
});

export function getValueFromPicker(picker: any, defaultValue: any) {
  const value = picker.state.value;
  return value
    ? jQuery.isArray(value)
      ? value.map(x => x.value)
      : value.value
    : defaultValue;
}

export function strToPickerValue(value: string) {
  return {
    value: stripQuotes(value),
    label: stripQuotes(value),
  };
}
