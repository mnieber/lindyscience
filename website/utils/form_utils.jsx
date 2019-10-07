// @flow

import React from "react";
import classnames from "classnames";
import { isNone, stripQuotes } from "utils/utils";
// $FlowFixMe
import Select from "react-select";
// $FlowFixMe
import jquery from "jquery";
// $FlowFixMe
import Creatable from "react-select/lib/Creatable";

type FormFieldLabelPropsT = {
  classNames?: any,
  fieldName: string,
  label: string,
  buttons?: any,
};

export function FormFieldLabel(props: FormFieldLabelPropsT) {
  return (
    <div className="flex flex-row">
      <label
        className={classnames("mt-2 font-bold", props.classNames)}
        htmlFor={props.fieldName}
      >
        {props.label}
      </label>
      {props.buttons}
    </div>
  );
}

export type FormFieldErrorPropsT = {
  formProps: any,
  fieldName: string,
  classNames?: any,
  key?: any,
};

export function FormFieldError(props: FormFieldErrorPropsT) {
  if (
    props.formProps.errors &&
    props.formProps.errors[props.fieldName] &&
    props.formProps.touched[props.fieldName]
  ) {
    return (
      <div key={props.key} className={classnames(props.classNames || "")}>
        {props.formProps.errors[props.fieldName]}
      </div>
    );
  }
  return <React.Fragment />;
}

type FormFieldPropsT = {
  type?: string,
  fieldType?: string,
  fieldName: string,
  formProps: any,
  buttons?: any,
  classNames?: any,
  label?: string,
  placeholder?: string,
  autoFocus?: boolean,
  disabled?: boolean,
};

export function FormField(props: FormFieldPropsT) {
  const htmlElement = React.useRef(null);

  const selectAllOnFocus = event => {
    event.target.select();
  };

  const valueField = props.fieldType == "checkbox" ? "checked" : "value";

  const formFieldProps = {
    id: props.fieldName,
    [valueField]: props.formProps.values[props.fieldName],
    onChange: props.formProps.handleChange,
    onBlur: props.formProps.handleBlur,
    className: classnames("formField__field", {
      error:
        props.formProps.errors &&
        props.formProps.errors[props.fieldName] &&
        props.formProps.touched[props.fieldName],
    }),
  };

  const textField =
    (props.type || "").toLowerCase() == "textarea" ? (
      <textarea
        ref={htmlElement}
        placeholder={props.placeholder}
        disabled={props.disabled}
        autoFocus={props.autoFocus}
        {...formFieldProps}
      />
    ) : (
      <input
        // $FlowFixMe
        ref={htmlElement}
        type={props.type}
        placeholder={props.placeholder}
        disabled={props.disabled}
        onFocus={selectAllOnFocus}
        autoFocus={props.autoFocus}
        {...formFieldProps}
      />
    );

  const formFieldLabel = (
    <FormFieldLabel
      fieldName={props.fieldName}
      label={props.label || ""}
      buttons={props.buttons}
      classNames={["formField__label"]}
    />
  );

  return (
    <div className={classnames("my-2", props.classNames)}>
      {props.label && formFieldLabel}
      {textField}
      <FormFieldError
        formProps={props.formProps}
        fieldName={props.fieldName}
        classNames={["formField__error"]}
      />
    </div>
  );
}

export function handleEnterAsTabToNext(event: any, isPreventDefault: boolean) {
  const form = event.target.form;
  if (form && event.keyCode === 13) {
    const index = Array.prototype.indexOf.call(form, event.target);
    form.elements[index + 1].focus();
    if (isPreventDefault) {
      event.preventDefault();
    }
  }
}

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
    if (!props.isMulti && jquery.isArray(value)) {
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
    ? jquery.isArray(value)
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
