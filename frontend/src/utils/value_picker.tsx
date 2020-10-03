import React from 'react';
import Select from 'react-select';
import Creatable from 'react-select/lib/Creatable';
import jQuery from 'jquery';

import { FormFieldLabel, handleEnterAsTabToNext } from 'src/utils/form_utils';
import { stripQuotes } from 'src/utils/utils';

type PropsT = {
  isMulti: boolean;
  isCreatable: boolean;
  zIndex?: number;
  onChange?: Function;
  fieldName: string;
  options?: any;
  placeholder?: string;
  label?: string;
  forwardedRef?: any;
  value: any;
  setValue: Function;
};

export function ValuePicker_(props: PropsT) {
  const saveChanges = (value: any) => {
    if (!props.isMulti && jQuery.isArray(value)) {
      props.setValue({ value: null, label: '' });
    } else {
      props.setValue(value);
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
    value: props.value,
    onChange: saveChanges,
    onKeyDown: (e) => {
      handleEnterAsTabToNext(e, false);
    },
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

export const ValuePicker: React.FC<PropsT> = React.forwardRef((props, ref) => {
  return <ValuePicker_ {...props} forwardedRef={ref} />;
});

export function strToPickerValue(value: string) {
  return {
    value: stripQuotes(value),
    label: stripQuotes(value),
  };
}
