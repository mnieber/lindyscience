import React from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { isNil } from 'lodash/fp';
import { observer } from 'mobx-react';

import { handleEnterAsTabToNext } from 'src/utils/form_utils';
import { stripQuotes } from 'src/utils/utils';
import { useFormStateContext } from 'react-form-state-context';
import { useFormFieldContext } from 'src/forms/components/FormFieldContext';
import { useScheduledCall } from 'src/utils/useScheduledCall';

export interface PickerValueT {
  value: any;
  label: string;
  __isNew__?: boolean;
}

type CustomizationsT = {
  filterOption?: any;
  noOptionsMessage?: any;
  onInputChange?: any;
  tabOnEnter?: boolean;
  onKeyDown?: Function;
  onMenuOpen?: Function;
  onMenuClose?: Function;
  inputValue?: string;
  onBlur?: (e: React.FocusEvent) => void;
};

type PropsT<ValueT> = {
  isMulti: boolean;
  isCreatable: boolean;
  zIndex?: number;
  submitOnChange?: boolean;
  pickableValues: ValueT[];
  labelFromValue: (value: ValueT) => string;
} & CustomizationsT;

export const ValuePicker = observer(
  <ValueT,>(props: PropsT<ValueT>): JSX.Element => {
    const toPickerValue = (formValue: any) => {
      return formValue.__isNew__
        ? formValue
        : {
            value: formValue,
            label: props.labelFromValue(formValue),
          };
    };

    const formState = useFormStateContext();
    const fieldContext = useFormFieldContext();
    const formValue = formState.values[fieldContext.fieldName];
    const options = props.pickableValues.map(toPickerValue);
    const scheduleSubmit = useScheduledCall(formState.submit);

    const saveChanges = (value: any, { action }: any) => {
      const toFormValue = (value: PickerValueT) => {
        return value.__isNew__ ? value : value.value;
      };

      const formValue = props.isMulti
        ? (value || []).map(toFormValue)
        : toFormValue(value);

      formState.setValue(fieldContext.fieldName, formValue);
      if (!!props.submitOnChange) {
        scheduleSubmit();
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
      onBlur: props.onBlur,
      onKeyDown: (e: any) => {
        if (props.tabOnEnter ?? true) {
          handleEnterAsTabToNext(e, false);
        }
        if (props.onKeyDown) {
          props.onKeyDown(e);
        }
      },
      filterOption: props.filterOption,
      noOptionsMessage: props.noOptionsMessage,
      onInputChange: props.onInputChange,
      onMenuOpen: () => {
        if (props.onMenuOpen) props.onMenuOpen();
      },
      onMenuClose: () => {
        if (props.onMenuClose) props.onMenuClose();
      },
      ...(props.inputValue ? { inputValue: props.inputValue } : {}),
    };

    const picker = props.isCreatable ? (
      <CreatableSelect {...pickerProps} />
    ) : (
      <Select {...pickerProps} />
    );

    return <div style={{ zIndex: props.zIndex }}>{picker}</div>;
  }
);

export function strToPickerValue(value: string) {
  return {
    value: stripQuotes(value),
    label: stripQuotes(value),
  };
}
